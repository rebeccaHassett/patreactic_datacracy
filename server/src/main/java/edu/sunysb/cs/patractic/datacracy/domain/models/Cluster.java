package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.sunysb.cs.patractic.datacracy.domain.interfaces.IJurisdiction;

import java.util.List;
import java.util.Set;

public class Cluster {
    private List<Precinct> precincts;
    private Set<Cluster> neighbors;
    private Set<Edge> edges;
}
