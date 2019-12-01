package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.stonybrook.politech.annealing.models.concrete.District;

import java.util.Objects;

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
}
