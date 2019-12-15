package edu.sunysb.cs.patractic.datacracy.domain;

import edu.stonybrook.politech.annealing.algorithm.MyAlgorithm;
import edu.stonybrook.politech.annealing.measures.DefaultMeasures;
import edu.stonybrook.politech.annealing.models.concrete.District;
import edu.stonybrook.politech.annealing.models.concrete.State;
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
    private Map<String, JurisdictionDataDto> currentUpdates;
    private Set<String> currentDistrictsToRemove;
    private Thread thread;
    private boolean phase1Complete;
    private boolean phase1Started;

    private Algorithm(State state, Properties config) {
        super(state, DefaultMeasures.defaultMeasuresWithWeights(config.weights), config.electionId);
        this.config = config;
        this.phase1Complete = false;
        this.phase1Started = false;
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

    // PHASE 0
    public static List<VotingBlockDTO> runPhase0(State state, Properties config) {
        return state.getEligibleDemographicVotingBlocs(config);
    }

    // PHASE 1
    public List<JurisdictionDataDto> start() {
        state.initPhase1();
        this.currentDistrictsToRemove = new HashSet<>();
        this.currentUpdates = new HashMap<>();
        this.phase1Started = true;
        return state.getDistricts().stream()
                .map(District::dto)
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
        currentUpdates.remove(districtRemoved);
        currentDistrictsToRemove.add(districtRemoved);
        currentUpdates.put(updated.getDistrictId(), updated.dto());
    }

    public Phase1UpdateDto getPhase1Update() {
        Phase1UpdateDto ret = null;
        while (ret == null) {
            synchronized (lock) {
                if (!currentUpdates.isEmpty() || phase1Complete) {
                    ret = new Phase1UpdateDto(new ArrayList<>(this.currentUpdates.values()), new ArrayList<>(currentDistrictsToRemove));
                    this.currentUpdates.clear();
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
                logger.info("Got MM Edges: [{}]", edgeList);

                // Sort using objective function, descending
                List<Edge> sortedEdges = new ArrayList<>(mmEdges);
                sortedEdges.sort(new Phase1EdgeComparator(this).reversed());

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

    public Properties getConfig() {
        return config;
    }

    public void setConfig(Properties config) {
        this.config = config;
    }
}
