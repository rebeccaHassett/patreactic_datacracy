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
    public int countyJoinability;

    public Edge(District d1, District d2) {
        this.d1 = d1;
        this.d2 = d2;
        if(((Precinct)d1.getPrecincts().toArray()[0]).getCounty().equals(((Precinct)d2.getPrecincts().toArray()[0]).getCounty())) {
            this.countyJoinability = 1;
        }
        else {
            this.countyJoinability = 0;
        }
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
        double combinedScore = getCombinedMMScore(config);
        return combinedScore >= avgScore;
    }

    public double getCombinedMMScore(Properties config) {
        return Algorithm.getMajMinScore(
                config.selectedMinorities.stream().mapToLong(dg -> d1.getPopulation(dg) + d2.getPopulation(dg)).sum(),
                d1.getPopulation(null) + d1.getPopulation(null),
                config.thresholds.get(Constraint.MINORITY_PERCENTAGE));
    }

    public District peekCombined() {
        District combined = new District(d1.getDistrictId(), d1.getState());
        combined.setCountyJoinability(this.countyJoinability);
        Set<Precinct> precincts = d1.getPrecincts().stream().map(Precinct::clone).collect(Collectors.toSet());
        precincts.addAll(d2.getPrecincts().stream().map(Precinct::clone).collect(Collectors.toSet()));
        precincts.forEach(combined::addPrecinct);
        return combined;
    }

    public long combinedPopulation() {
        return d1.getPopulation(null) + d2.getPopulation(null);
    }

    public void replaceDistrict(District toReplace, District replacement) {
        if (d1.equals(toReplace)) {
            d1 = replacement;
        } else if (d2.equals(toReplace)) {
            d2 = replacement;
        }
    }

    @Override
    public String toString() {
        return String.format("(%s, %s)", d1.getDistrictId(), d2.getDistrictId());
    }

    public int getCountyJoinability() {
        return this.countyJoinability;
    }

    public void setCountyJoinability(int countyJoinability) {
        this.countyJoinability = countyJoinability;
    }
}
