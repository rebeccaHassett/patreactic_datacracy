package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.sunysb.cs.patractic.datacracy.domain.enums.DemographicGroup;

import java.util.Set;

public class State {
    public final String stateBoundaries;
    public final String name;
    private Set<Cluster> clusters;

    public State(String stateBoundaries, String name) {
        this.stateBoundaries = stateBoundaries;
        this.name = name;
    }

    public Set<VotingBlockDTO> getEligibleDemographicVotingBlocs(DemographicGroup demographic, Properties config) {
        return null;
    }
}
