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

public class Algorithm extends MyAlgorithm {

    private static Logger logger = LoggerFactory.getLogger(Algorithm.class);

    private static Map<String, Algorithm> sessions = new HashMap<>();
    // PHASE 1
    private final Object lock = new Object();
    private Properties config;
    private Map<String, JurisdictionDataDto> currentUpdates;
    private Set<String> currentDistrictsToRemove;

    private Algorithm(State state, Properties config) {
        super(state, DefaultMeasures.defaultMeasuresWithWeights(config.weights), config.electionId);
        this.config = config;
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
    public void startIncremental() {
        state.initPhase1();
        this.currentDistrictsToRemove = new HashSet<>();
        this.currentUpdates = new HashMap<>();
    }

    /**
     * Updates the current list of changes to send to the client.
     *
     * @param updated         the district that absorbed the other.
     * @param districtRemoved the id of the district that was absorbed.
     */
    private void updatePhase1(District updated, String districtRemoved) {
        synchronized (lock) {
            currentUpdates.remove(districtRemoved);
            currentDistrictsToRemove.add(districtRemoved);
            currentUpdates.put(updated.getDistrictId(), updated.dto());
        }
        lock.notify();
    }

    public Phase1UpdateDto getPhase1Update() {
        Phase1UpdateDto ret = null;
        while (ret == null) {
            synchronized (lock) {
                if (!currentUpdates.isEmpty()) {
                    ret = new Phase1UpdateDto(new ArrayList<>(this.currentUpdates.values()), new ArrayList<>(currentDistrictsToRemove));
                    this.currentUpdates.clear();
                    this.currentDistrictsToRemove.clear();
                }
            }
            if (ret == null) {
                try {
                    lock.wait(500);
                } catch (InterruptedException ignored) {

                }
            }
        }
        return ret;
    }

    public void runStep() {
        // Get edges that would improve overall majority-minority scores
        Set<Edge> mmEdges = this.state.getMMEdges(config);

        StringBuilder edgeList = new StringBuilder();
        mmEdges.stream().map(Edge::toString).forEach(s -> edgeList.append(s).append(","));
        logger.info("Got MM Edges: [{}]", edgeList);

        // Sort using objective function
        List<Edge> sortedEdges = new ArrayList<>(mmEdges);
        sortedEdges.sort(new ObjectiveFunctionComparator(this));

        // Remove edges that duplicate districts
        Set<District> districtsIncluded = new HashSet<>();
        for (Edge e : sortedEdges) {
            if (districtsIncluded.contains(e.d1) || districtsIncluded.contains(e.d2)) {
                sortedEdges.remove(e);
            } else {
                districtsIncluded.add(e.d1);
                districtsIncluded.add(e.d2);
            }
        }

    }

    public Properties getConfig() {
        return config;
    }

    public void setConfig(Properties config) {
        this.config = config;
    }
}
