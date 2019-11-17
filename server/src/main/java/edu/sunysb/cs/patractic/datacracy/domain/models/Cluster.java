package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.sunysb.cs.patractic.datacracy.domain.enums.DemographicGroup;
import edu.sunysb.cs.patractic.datacracy.domain.interfaces.IJurisdiction;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
public class Cluster implements IJurisdiction {
    @ManyToOne
    @JoinColumn(name = "districtId")
    private Set<Precinct> precincts;

    @ManyToOne
    @JoinColumn(table = "clusterNeighbors", name = "c1Id")
    private Set<Cluster> neighbors;

    @ManyToMany
    @JoinColumn(name = "c1Id")
    @JoinColumn(name = "c2Id")
    private Set<Edge> edges;

    @Override
    public ElectionData getElectionData(ElectionId electionId) {
        return ElectionData.aggregateFromJurisdictions(getJurisdictions(), electionId);
    }

    @Override
    public long getPopulation(DemographicGroup demographic) {
        return 0;
    }

    private Set<IJurisdiction> getJurisdictions() {
        return precincts.parallelStream().map(precinct -> (IJurisdiction) precinct).collect(Collectors.toSet());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Cluster cluster = (Cluster) o;
        return precincts.equals(cluster.precincts) &&
                neighbors.equals(cluster.neighbors) &&
                edges.equals(cluster.edges);
    }

    @Override
    public int hashCode() {
        return Objects.hash(precincts, neighbors, edges);
    }
}
