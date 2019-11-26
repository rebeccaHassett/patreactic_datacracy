package edu.sunysb.cs.patractic.datacracy.domain;

import edu.stonybrook.politech.annealing.algorithm.MyAlgorithm;
import edu.stonybrook.politech.annealing.measures.DefaultMeasures;
import edu.stonybrook.politech.annealing.models.concrete.State;
import edu.sunysb.cs.patractic.datacracy.domain.models.ElectionId;
import edu.sunysb.cs.patractic.datacracy.domain.models.Properties;
import edu.sunysb.cs.patractic.datacracy.domain.models.VotingBlockDTO;

import java.util.List;

public class Algorithm extends MyAlgorithm {
    public Algorithm(State state, DefaultMeasures measures, ElectionId electionId) {
        super(state, measures, electionId);
    }

    public static List<VotingBlockDTO> runPhase0(State state, Properties config) {
        return state.getEligibleDemographicVotingBlocs(config);
    }
}
