package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.sunysb.cs.patractic.datacracy.domain.enums.ElectionType;
import edu.sunysb.cs.patractic.datacracy.domain.enums.PoliticalParty;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Year;
import edu.sunysb.cs.patractic.datacracy.domain.interfaces.IJurisdiction;

import javax.persistence.*;
import java.util.Set;

/**
 * Contains the election data for a jurisdiction
 */
@Entity
public class ElectionData {

    @ManyToOne
    @JoinColumn(table = "votesByParty", name = "dataId")
    private final long[] votesByParty;
    @Id
    private int id;
    @ManyToOne
    private String precinctId;
    @Column
    @MapKey
    private ElectionId electionId;

    public ElectionData(Year year, ElectionType type, long[] votesByParty) {
        this.electionId = new ElectionId(year, type);
        this.votesByParty = votesByParty;
    }

    public static ElectionData aggregateFromJurisdictions(Set<IJurisdiction> jurisdictions, ElectionId electionId) {
        if (jurisdictions == null || jurisdictions.size() == 0) {
            return null;
        }
        long[] votes = new long[PoliticalParty.values().length];
        jurisdictions.stream().forEach(j -> {
            ElectionData data = j.getElectionData(electionId);
            for (PoliticalParty party : PoliticalParty.values()) {
                votes[party.ordinal()] = data.getVotes(party);
            }
        });
        return new ElectionData(electionId.year, electionId.electionType, votes);
    }

    public Year getYear() {
        return electionId.year;
    }

    public ElectionType getType() {
        return electionId.electionType;
    }

    public PoliticalParty getWinningParty() {
        PoliticalParty highest = PoliticalParty.DEMOCRAT;
        for (PoliticalParty party : PoliticalParty.values()) {
            if (votesByParty[party.ordinal()] > votesByParty[highest.ordinal()]) {
                highest = party;
            }
        }
        return highest;
    }

    public long getVotes(PoliticalParty party) {
        if (party == null) {
            long sum = 0;
            for (PoliticalParty p : PoliticalParty.values()) {
                sum += votesByParty[p.ordinal()];
            }
            return sum;
        }
        return votesByParty[party.ordinal()];
    }
}
