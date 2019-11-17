package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.sunysb.cs.patractic.datacracy.domain.enums.DemographicGroup;

import javax.persistence.*;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "States")
public class State {
    @Id
    public final String name;

    @Column(name = "boundaries")
    public final String stateBoundaries;

    @OneToMany
    @JoinColumn(name = "stateName")
    private Set<Cluster> clusters;

    @OneToMany
    @JoinColumn(name = "stateName")
    private Set<Precinct> precincts;

    public State(String stateBoundaries, String name) {
        this.stateBoundaries = stateBoundaries;
        this.name = name;
    }

    public Set<VotingBlockDTO> getEligibleDemographicVotingBlocs(DemographicGroup demographic, Properties config) {
        return null;
    }

    @Override
    public int hashCode() {
        return name.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof State) {
            return name.equals(((State) obj).name);
        }
        return false;
    }
}
