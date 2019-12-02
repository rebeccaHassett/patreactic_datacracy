package edu.sunysb.cs.patractic.datacracy.domain;

import edu.stonybrook.politech.annealing.models.concrete.District;
import edu.sunysb.cs.patractic.datacracy.domain.models.Edge;

import java.util.Comparator;

public class ObjectiveFunctionComparator implements Comparator<Edge> {
    private final Algorithm algorithm;

    public ObjectiveFunctionComparator(Algorithm algorithm) {
        this.algorithm = algorithm;
    }

    @Override
    public int compare(Edge e1, Edge e2) {
        District e1Combined = e1.peekCombined();
        District e2Combined = e2.peekCombined();

        double res = algorithm.rateDistrict(e1Combined) - algorithm.rateDistrict(e2Combined);

        if (res > 0) {
            return 1;
        } else if (res < 0) {
            return -1;
        } else {
            return 0;
        }
    }
}
