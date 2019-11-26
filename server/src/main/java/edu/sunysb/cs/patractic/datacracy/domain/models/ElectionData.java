package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.stonybrook.politech.annealing.models.concrete.Precinct;
import edu.sunysb.cs.patractic.datacracy.domain.enums.ElectionType;
import edu.sunysb.cs.patractic.datacracy.domain.enums.PoliticalParty;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Year;
import edu.sunysb.cs.patractic.datacracy.domain.interfaces.IJurisdiction;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Contains the election data for a jurisdiction
 */
@Entity
@Table(name = "ElectionData")
public class ElectionData {

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "VotesByParty", joinColumns = {@JoinColumn(name = "electionDataId")})
    @MapKeyClass(PoliticalParty.class)
    private Map<PoliticalParty, Long> votesByParty;
    @Id
    private int id;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "precinctId")
    private Precinct precinct;
    @Column(name = "precinctId", insertable = false, updatable = false)
    private String precinctId;
    @Embedded
    @MapKey
    private ElectionId electionId;

    public ElectionData() {
    }

    public ElectionData(Year year, ElectionType type, Map<PoliticalParty, Long> votesByParty) {
        this.electionId = new ElectionId(year, type);
        this.votesByParty = votesByParty;
    }

    public static ElectionData aggregateFromJurisdictions(Set<IJurisdiction> jurisdictions, ElectionId electionId) {
        if (jurisdictions == null || jurisdictions.size() == 0) {
            return null;
        }
        Map<PoliticalParty, Long> votes = new HashMap<>();
        jurisdictions.forEach(j -> {
            ElectionData data = j.getElectionData(electionId);
            for (PoliticalParty party : PoliticalParty.values()) {
                votes.put(party, data.getVotes(party));
            }
        });
        return new ElectionData(electionId.year, electionId.electionType, votes);
    }

    public Year getYear() {
        return electionId.year;
    }

    public String getPrecinctId() {
        return precinctId;
    }

    public void setPrecinctId(String precinctId) {
        this.precinctId = precinctId;
    }

    public ElectionType getType() {
        return electionId.electionType;
    }

    public PoliticalParty getWinningParty() {
        PoliticalParty highest = PoliticalParty.DEMOCRAT;
        for (PoliticalParty party : PoliticalParty.values()) {
            if (votesByParty.get(party) > votesByParty.get(highest)) {
                highest = party;
            }
        }
        return highest;
    }

    public Precinct getPrecinct() {
        return precinct;
    }

    public void setPrecinct(Precinct precinct) {
        this.precinct = precinct;
    }

    public long getVotes(PoliticalParty party) {
        if (party == null) {
            return votesByParty.values().stream().mapToLong(Long::longValue).sum();
        }
        return votesByParty.get(party);
    }
}
