package edu.sunysb.cs.patractic.datacracy.domain.models;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import java.util.Objects;

@Entity
public class Edge {
    @ManyToMany
    @JoinColumn(name = "c1Id")
    public Cluster c1;

    @ManyToMany
    @JoinColumn(name = "c2Id")
    public Cluster c2;

    public Edge(Cluster c1, Cluster c2) {
        this.c1 = c1;
        this.c2 = c2;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Edge edge = (Edge) o;
        return c1.equals(edge.c1) &&
                c2.equals(edge.c2);
    }

    @Override
    public int hashCode() {
        return Objects.hash(c1, c2);
    }
}
