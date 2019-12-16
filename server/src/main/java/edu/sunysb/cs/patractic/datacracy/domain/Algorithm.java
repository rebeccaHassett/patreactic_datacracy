package edu.sunysb.cs.patractic.datacracy.domain;

import edu.stonybrook.politech.annealing.Move;
import edu.stonybrook.politech.annealing.algorithm.Measure;
import edu.stonybrook.politech.annealing.algorithm.MyAlgorithm;
import edu.stonybrook.politech.annealing.measures.DefaultMeasures;
import edu.stonybrook.politech.annealing.models.concrete.District;
import edu.stonybrook.politech.annealing.models.concrete.Precinct;
import edu.stonybrook.politech.annealing.models.concrete.State;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Constraint;
import edu.sunysb.cs.patractic.datacracy.domain.models.Properties;
import edu.sunysb.cs.patractic.datacracy.domain.models.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

public class Algorithm extends MyAlgorithm {

    private static Logger logger = LoggerFactory.getLogger(Algorithm.class);

    private static Map<String, Algorithm> sessions = new HashMap<>();
    // PHASE 1
    private final Object lock = new Object();
    private Properties config;
    private Map<String, JurisdictionDataDto> currentDistrictUpdates;
    private Set<String> currentDistrictsToRemove;
    private List<Move<Precinct, District>> moves;
    private Thread thread;
    private boolean phase1Complete;
    private boolean phase1Started;
    private boolean phase2Running;
    private boolean phase2Completed;

    private Algorithm(State state, Properties config) {
        super(state, DefaultMeasures.defaultMeasuresWithWeights(config.weights), config.electionId);
        this.config = config;
        this.phase1Complete = false;
        this.phase1Started = false;
        this.moves = new ArrayList<>();
    }

    public static Algorithm getInstance(String sessionId) {
        return sessions.get(sessionId);
    }

    public static String createInstance(State state, Properties config) {
        String sessionId = UUID.randomUUID().toString();
        Algorithm newSession = new Algorithm(state, config);
        sessions.put(sessionId, newSession);
        return sessionId;
    }

    // UTILITY
    public static double getMajMinScore(Long minPop, Long totalPop, Threshold majMinThresh) {
        double percent = (double) minPop / (double) totalPop;
        if (majMinThresh.isWithin(percent, true)) {
            return 1;
        } else if (percent > majMinThresh.upper) {
            return 1 - (percent - majMinThresh.upper);
        } else {
            return 1 - (majMinThresh.lower - percent);
        }
    }

    public static boolean isMajMin(District d, Properties config) {
        return getMajMinScore(config.selectedMinorities.stream().mapToLong(d::getPopulation).sum(),
                d.getPopulation(null),
                config.thresholds.get(Constraint.MINORITY_PERCENTAGE)) == 1;
    }

    // PHASE 0
    public static List<VotingBlockDTO> runPhase0(State state, Properties config) {
        return state.getEligibleDemographicVotingBlocs(config);
    }

    // PHASE 1
    public List<JurisdictionDataDto> start() {
        state.initPhase1();
        this.currentDistrictsToRemove = new HashSet<>();
        this.currentDistrictUpdates = new HashMap<>();
        this.phase1Started = true;
        return state.getDistricts().stream()
                .map(d -> d.dto(false))
                .collect(Collectors.toList());
    }

    public List<JurisdictionDataDto> startAsync() {
        if (phase1Started && !phase1Complete) {
            return null;
        }
        List<JurisdictionDataDto> ret = start();
        thread = new Thread(() -> {
            while (!phase1Complete) {
                runStep();
            }
        });
        thread.start();
        return ret;
    }

    /**
     * Updates the current list of changes to send to the client.
     *
     * @param updated         the district that absorbed the other.
     * @param districtRemoved the id of the district that was absorbed.
     */
    private void updatePhase1(District updated, String districtRemoved) {
        currentDistrictUpdates.remove(districtRemoved);
        currentDistrictsToRemove.add(districtRemoved);
        currentDistrictUpdates.put(updated.getDistrictId(), updated.dto(false));
    }

    public Phase1UpdateDto getPhase1Update() {
        Phase1UpdateDto ret = null;
        while (ret == null) {
            synchronized (lock) {
                if (!currentDistrictUpdates.isEmpty() || phase1Complete) {
                    List<MajMinDistrictDto> majMinDistrictDtos = getMajMinDistricts(this.getConfig());
                    ret = new Phase1UpdateDto(new ArrayList<>(this.currentDistrictUpdates.values()), new ArrayList<>(currentDistrictsToRemove), majMinDistrictDtos, null);
                    this.currentDistrictUpdates.clear();
                    this.currentDistrictsToRemove.clear();
                }
            }
            if (ret == null) {
                try {
                    lock.wait(500);
                } catch (InterruptedException | IllegalMonitorStateException ignored) {

                }
            }
        }
        return ret;
    }

    public void runStep() {
        synchronized (lock) {
            logger.info("Starting step...");
            if (state.numDistricts() > config.numDistricts + 1) {
                // Get edges that would improve overall majority-minority scores
                Set<Edge> mmEdges = this.state.getMMEdges(config);

                StringBuilder edgeList = new StringBuilder();
                mmEdges.stream().map(Edge::toString).forEach(s -> edgeList.append(s).append(","));
                logger.info("Got [{}] MM Edges: [{}]", mmEdges.size(), edgeList);

                // Sort using objective function, descending
                PriorityQueue<Edge> sortedEdges = new PriorityQueue<>(new Phase1EdgeComparator(this).reversed());
                sortedEdges.addAll(mmEdges);

                // Remove edges that duplicate districts
                Set<District> districtsIncluded = new HashSet<>();
                List<Edge> dedupedEdges = new ArrayList<>();
                for (Edge e : sortedEdges) {
                    if (!(districtsIncluded.contains(e.d1) || districtsIncluded.contains(e.d2))) {
                        districtsIncluded.add(e.d1);
                        districtsIncluded.add(e.d2);
                        dedupedEdges.add(e);
                    }
                }

                // Merge candidate pairs
                while (!dedupedEdges.isEmpty() && state.numDistricts() != (config.numDistricts + 1)) {
                    Edge e = dedupedEdges.remove(0);
                    MergeResult result = merge(e);
                    this.updatePhase1(result.district, result.removedId);
                    dedupedEdges.removeIf(edge -> edge.hasDistrict(result.removedId));
                }
            } else { // Final iteration
                // Get all edges
                Set<Edge> edgeSet = state.getDistricts().stream()
                        .map(District::getEdges)
                        .reduce(new HashSet<>(), (all, current) -> {
                            all.addAll(current);
                            return all;
                        });
                // Sort based on population, ascending
                List<Edge> sortedEdges = new ArrayList<>(edgeSet);
                sortedEdges.sort((e1, e2) -> (int) (e1.combinedPopulation() - e2.combinedPopulation()));
                // merge the edge with the smallest combined population
                Edge smallestPop = sortedEdges.get(0);
                MergeResult result = merge(smallestPop);
                this.updatePhase1(result.district, result.removedId);
                phase1Complete = true;
            }
            lock.notify();
        }
        logger.info("Step finished.");
    }

    private MergeResult merge(Edge e) {
        if (e.d1.numPrecincts() > e.d2.numPrecincts()) {
            return e.d1.merge(e.d2, e.countyJoinability);
        } else {
            return e.d2.merge(e.d1, e.countyJoinability);
        }
    }

    public Phase1UpdateDto completePhase1() {
        if (!phase1Started || phase2Running) {
            return null;
        }
        Phase1UpdateDto result = null;
        while (result == null) {
            synchronized (lock) {
                if (phase1Complete && !thread.isAlive()) {
                    result = getPhase1Update();
                }
            }
            if (result == null) {
                try {
                    lock.wait(500);
                } catch (InterruptedException | IllegalMonitorStateException ignored) {
                }
            }
        }
        return result;
    }

    // PHASE 2
    public boolean startPhase2() {
        synchronized (lock) {
            if (!phase1Complete || phase2Running || phase2Completed) {
                return false;
            }
            phase2Running = true;
            updateScores();
            thread = new Thread(() -> {
                boolean keepGoing = true;
                while (keepGoing) {
                    // do work
                    synchronized (lock) {
                        Move<Precinct, District> move = makeMove();
                        // store results and check if we continue
                        if (move == null) {
                            phase2Running = false;
                            phase2Completed = true;
                        } else {
                            moves.add(move);
                            currentDistrictUpdates.put(move.getFrom().getDistrictId(), move.getFrom().dto(false));
                            currentDistrictUpdates.put(move.getTo().getDistrictId(), move.getTo().dto(false));
                            logger.info("Made P2 move: {}", move.toString());
                        }
                        keepGoing = phase2Running;
                        lock.notify();
                    }
                    logger.info("Made move");
                }
            });
            thread.start();
        }
        return true;
    }

    public void stopPhase2() {
        synchronized (lock) {
            phase2Running = false;
        }
        while (thread.isAlive()) {
            try {
                lock.wait(200);
            } catch (InterruptedException | IllegalMonitorStateException ignored) {
            }
        }
    }

    public Phase2UpdateDto getPhase2Update() {
        synchronized (lock) {
            if (moves.isEmpty() && !phase2Running && !phase2Completed) {
                return null;
            }
        }

        Phase2UpdateDto update = null;
        while (update == null) {
            synchronized (lock) {
                if (!moves.isEmpty() || (!phase2Running && !thread.isAlive())) {
                    Map<String, Double> results = new HashMap<>();
                    for (Measure m : Measure.values()) {
                        results.put(m.toString(), state.getDistricts().stream().mapToDouble(d -> m.calculateMeasure(d, config.electionId)).average().orElse(0));
                    }

                    update = new Phase2UpdateDto(
                            new ArrayList<>(this.currentDistrictUpdates.values()),
                            moves.stream().map(MoveDto::from).collect(Collectors.toList()),
                            phase2Completed,
                            results,
                            getMajMinDistricts(config));
                    moves.clear();
                    currentDistrictUpdates.clear();
                }
            }
            if (update == null) {
                try {
                    lock.wait(500);
                } catch (InterruptedException | IllegalMonitorStateException ignored) {
                }
            }
        }
        return update;
    }

    public List<MajMinDistrictDto> getMajMinDistricts(Properties config) {
        List<MajMinDistrictDto> majMinDistrictDtos = new ArrayList<>();
        state.getDistricts().forEach(district -> {
            //Long minorityPopulation = config.selectedMinorities.stream().mapToLong(district::getPopulation).sum();
            Long minorityPopulation = config.selectedMinorities.stream().mapToLong(district::getPopulation).sum();
            Long totalPopulation = district.getPopulation(null);
            double majMinScore = Algorithm.getMajMinScore(
                    minorityPopulation,
                    totalPopulation,
                    config.thresholds.get(Constraint.MINORITY_PERCENTAGE));
            if(majMinScore == 1) {
                MajMinDistrictDto majMinDistrictDto = new MajMinDistrictDto(district.getDistrictId(), minorityPopulation, totalPopulation);
                majMinDistrictDtos.add(majMinDistrictDto);
            }
        });
        return majMinDistrictDtos;
    }

    public Properties getConfig() {
        return config;
    }

    public void setConfig(Properties config) {
        this.config = config;
    }
}
