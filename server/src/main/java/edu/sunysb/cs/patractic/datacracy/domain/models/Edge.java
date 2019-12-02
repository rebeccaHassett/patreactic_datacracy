package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.stonybrook.politech.annealing.models.concrete.District;
import edu.stonybrook.politech.annealing.models.concrete.Precinct;
import edu.sunysb.cs.patractic.datacracy.domain.Algorithm;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Constraint;

import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

public class Edge {
    public District d1;
    public District d2;

    public Edge(District d1, District d2) {
        this.d1 = d1;
        this.d2 = d2;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Edge edge = (Edge) o;
        return (d1.equals(edge.d1) && d2.equals(edge.d2)) || (d1.equals(edge.d2) && d2.equals(edge.d1));
    }

    @Override
    public int hashCode() {
        return Objects.hash(d1, d2) + Objects.hash(d2, d1);
    }

    public boolean hasDistrict(String districtId) {
        return d1.getDistrictId().equals(districtId) || d2.getDistrictId().equals(districtId);
    }

    public boolean wouldImproveMM(Properties config) {
        double d1Score = Algorithm.getMajMinScore(
                config.selectedMinorities.stream().mapToLong(d1::getPopulation).sum(),
                d1.getPopulation(null),
                config.thresholds.get(Constraint.MINORITY_PERCENTAGE));
        double d2Score = Algorithm.getMajMinScore(
                config.selectedMinorities.stream().mapToLong(d2::getPopulation).sum(),
                d2.getPopulation(null),
                config.thresholds.get(Constraint.MINORITY_PERCENTAGE));
        double avgScore = (d1Score + d2Score) / 2.0;
        double combinedScore = Algorithm.getMajMinScore(
                config.selectedMinorities.stream().mapToLong(dg -> d1.getPopulation(dg) + d2.getPopulation(dg)).sum(),
                d1.getPopulation(null) + d1.getPopulation(null),
                config.thresholds.get(Constraint.MINORITY_PERCENTAGE));
        return combinedScore >= avgScore;
    }

    public District peekCombined() {
        District combined = new District(d1.getDistrictId(), d1.getState());
        Set<Precinct> precincts = d1.getPrecincts().stream().map(Precinct::clone).collect(Collectors.toSet());
        precincts.addAll(d2.getPrecincts().stream().map(Precinct::clone).collect(Collectors.toSet()));
        precincts.forEach(combined::addPrecinct);
        return combined;
    }

    @Override
    public String toString() {
        return String.format("(%s, %s)", d1.getDistrictId(), d2.getDistrictId());
    }
}
