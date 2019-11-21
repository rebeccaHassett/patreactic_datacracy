package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.sunysb.cs.patractic.datacracy.domain.enums.DemographicGroup;
import edu.sunysb.cs.patractic.datacracy.domain.enums.PoliticalParty;
import edu.sunysb.cs.patractic.datacracy.domain.interfaces.IJurisdiction;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.Map;
import java.util.Objects;

public class Precinct implements IJurisdiction {
    @Id
    public final String precinctId;

    @ManyToOne
    @Column(name = "stateName")
    private final String stateName;

    @Column
    public final String borders;

    @ManyToOne
    @JoinColumn(name = "precinctId")
    private Map<ElectionId, ElectionData> electionData;

    public Precinct(String precinctId, String stateName, String borders, Map<ElectionId, ElectionData> electionData) {
        this.precinctId = precinctId;
        this.stateName = stateName;
        this.borders = borders;
        this.electionData = electionData;
    }

    @Override
    public ElectionData getElectionData(ElectionId electionId) {
        return electionData.get(electionId);
    }

    @Override
    public long getPopulation(DemographicGroup demographic) {
        return 0;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Precinct precinct = (Precinct) o;
        return precinctId.equals(precinct.precinctId) &&
                stateName.equals(precinct.stateName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(precinctId, stateName);
    }

    public boolean isDemographicBloc(DemographicGroup demographic, Threshold blocPopPercentThresh) {
        return blocPopPercentThresh.isWithin(((getPopulation(demographic) * 1.0)/(1.0 * getPopulation(null))), true);
    }

    public VotingBlockDTO getVotingBloc(DemographicGroup demographic, Threshold blocVotingPercentThresh, ElectionId electionId) {
        ElectionData data = getElectionData(electionId);
        PoliticalParty winningParty = data.getWinningParty();
        long totalVotes = data.getVotes(null);
        long votesByDemo = data.getVotes(winningParty);
        double fractionVotedForWinner = (1.0 * votesByDemo) / totalVotes;

        if (blocVotingPercentThresh.isWithin(fractionVotedForWinner, true)) {
            return new VotingBlockDTO(precinctId, totalVotes, votesByDemo, winningParty);
        } else {
            return null;
        }
    }
}