package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.sunysb.cs.patractic.datacracy.domain.enums.ElectionType;
import edu.sunysb.cs.patractic.datacracy.domain.enums.PoliticalParty;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Year;
import edu.sunysb.cs.patractic.datacracy.domain.interfaces.IJurisdiction;
import org.apache.commons.lang3.NotImplementedException;

import java.util.List;

/**
 * Contains the election data for a jurisdiction
 */
public class ElectionData {
    private final Year year;
    private final ElectionType type;
    private final long[] votesByParty;

    public ElectionData(Year year, ElectionType type, long[] votesByParty) {
        this.year = year;
        this.type = type;
        this.votesByParty = votesByParty;
    }

    public ElectionData aggregateFromJurisdictions(List<IJurisdiction> jurisdictions) {
        throw new NotImplementedException("ElectionData::aggregateFromJurisdictions");
    }

    public Year getYear() {
        return year;
    }

    public ElectionType getType() {
        return type;
    }

    public PoliticalParty getWinningParty() {
        PoliticalParty highest = PoliticalParty.DEMOCRAT;
        for (PoliticalParty party: PoliticalParty.values()) {
            if (votesByParty[party.ordinal()] > votesByParty[highest.ordinal()]) {
                highest = party;
            }
        }
        return highest;
    }

    public long getVotes(PoliticalParty party) {
        if (party == null) {
            long sum = 0;
            for (PoliticalParty p: PoliticalParty.values()) {
                sum += votesByParty[p.ordinal()];
            }
            return sum;
        }
        return votesByParty[party.ordinal()];
    }
}
