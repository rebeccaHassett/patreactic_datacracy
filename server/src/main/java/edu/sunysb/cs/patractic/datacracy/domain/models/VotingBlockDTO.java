package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.sunysb.cs.patractic.datacracy.domain.enums.PoliticalParty;

public class VotingBlockDTO {
    public final long precinctId;
    public final long totalVotes;
    public final long winningVotes;
    public final PoliticalParty winningParty;

    public VotingBlockDTO(long precinctId, long totalVotes, long winningVotes, PoliticalParty winningParty) {
        this.precinctId = precinctId;
        this.totalVotes = totalVotes;
        this.winningVotes = winningVotes;
        this.winningParty = winningParty;
    }
}
