package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.sunysb.cs.patractic.datacracy.domain.enums.PoliticalParty;

import java.util.Objects;

public class VotingBlockDTO {
    public final String precinctId;
    public final long totalVotes;
    public final long winningVotes;
    public final PoliticalParty winningParty;

    public VotingBlockDTO(String precinctId, long totalVotes, long winningVotes, PoliticalParty winningParty) {
        this.precinctId = precinctId;
        this.totalVotes = totalVotes;
        this.winningVotes = winningVotes;
        this.winningParty = winningParty;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VotingBlockDTO that = (VotingBlockDTO) o;
        return totalVotes == that.totalVotes &&
                winningVotes == that.winningVotes &&
                precinctId.equals(that.precinctId) &&
                winningParty == that.winningParty;
    }

    @Override
    public int hashCode() {
        return Objects.hash(precinctId, totalVotes, winningVotes, winningParty);
    }
}
