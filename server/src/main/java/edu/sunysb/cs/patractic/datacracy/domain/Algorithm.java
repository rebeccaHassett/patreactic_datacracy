package edu.sunysb.cs.patractic.datacracy.domain;

import edu.sunysb.cs.patractic.datacracy.domain.enums.DemographicGroup;
import edu.sunysb.cs.patractic.datacracy.domain.models.Properties;
import edu.sunysb.cs.patractic.datacracy.domain.models.State;
import edu.sunysb.cs.patractic.datacracy.domain.models.VotingBlockDTO;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class Algorithm {
    public Set<VotingBlockDTO> runPhase0(State state, DemographicGroup demographic, Properties config) {
        return state.getEligibleDemographicVotingBlocs(demographic, config);
    }
}
