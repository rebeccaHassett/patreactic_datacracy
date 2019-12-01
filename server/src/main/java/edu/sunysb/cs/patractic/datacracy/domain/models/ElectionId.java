package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.sunysb.cs.patractic.datacracy.domain.enums.ElectionType;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Year;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.util.Objects;

@Embeddable
public class ElectionId {
    public Year year;
    public ElectionType electionType;

    public ElectionId(Year year, ElectionType electionType) {
        this.year = year;
        this.electionType = electionType;
    }

    public ElectionId(int year, String type) {
        Year y;
        if (year == 2018) {
            y = Year.Y2018;
        } else if (year == 2016) {
            y = Year.Y2016;
        } else {
            throw new IllegalArgumentException("Year must be 2016 or 2018.");
        }
        ElectionType t;
        if (type.equals("Congressional")) {
            t = ElectionType.CONGRESSIONAL;
        } else if (type.equals("Presidential")) {
            t = ElectionType.PRESIDENTIAL;
        } else {
            throw new IllegalArgumentException("Type must be \"Congressional\" or \"Presidential\".");
        }
    }

    public ElectionId() {
    }

    @Column
    public Year getYear() {
        return year;
    }

    public void setYear(Year year) {
        this.year = year;
    }

    @Column
    public ElectionType getElectionType() {
        return electionType;
    }

    public void setElectionType(ElectionType electionType) {
        this.electionType = electionType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ElectionId that = (ElectionId) o;
        return year == that.year &&
                electionType == that.electionType;
    }

    @Override
    public int hashCode() {
        return Objects.hash(year, electionType);
    }
}
