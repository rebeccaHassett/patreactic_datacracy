package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.sunysb.cs.patractic.datacracy.domain.enums.ElectionType;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Year;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class ElectionId {
    @Column
    public final Year year;
    @Column
    public final ElectionType electionType;

    public ElectionId(Year year, ElectionType electionType) {
        this.year = year;
        this.electionType = electionType;
    }
}
