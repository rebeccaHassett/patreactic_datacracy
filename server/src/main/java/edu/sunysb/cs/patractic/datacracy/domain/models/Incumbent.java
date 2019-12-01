package edu.sunysb.cs.patractic.datacracy.domain.models;

import javax.persistence.*;

@Entity
@Table(name = "Incumbent", uniqueConstraints = {@UniqueConstraint(columnNames = {"stateName", "districtId"})})
public class Incumbent {
    private String party;
    private String stateName;
    private String districtId;
    private String incumbent;
    private int id;

    public Incumbent() {
    }

    @Id
    @GeneratedValue
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Column(name = "stateName", columnDefinition = "varchar(256)")
    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }

    @Column(name = "party", columnDefinition = "varchar(256)")
    public String getParty() {
        return party;
    }

    public void setParty(String party) {
        this.party = party;
    }


    @Column(name = "districtId", columnDefinition = "varchar(256)")
    public String getDistrictId() {
        return districtId;
    }

    public void setDistrictId(String districtId) {
        this.districtId = districtId;
    }

    @Column
    public String getIncumbent() {
        return incumbent;
    }

    public void setIncumbent(String incumbent) {
        this.incumbent = incumbent;
    }


}
