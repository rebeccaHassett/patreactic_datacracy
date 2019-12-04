package edu.sunysb.cs.patractic.datacracy.domain;

import edu.stonybrook.politech.annealing.models.concrete.District;
import edu.sunysb.cs.patractic.datacracy.domain.models.Edge;

import java.util.Comparator;

public class Phase1EdgeComparator implements Comparator<Edge> {
    private final Algorithm algorithm;
    private final double MM_WEIGHT;
    private final double OBJ_FUNC_WEIGHT;

    public Phase1EdgeComparator(Algorithm algorithm) {
        this.algorithm = algorithm;
        this.MM_WEIGHT = algorithm.getConfig().majMinWeight;
        this.OBJ_FUNC_WEIGHT = 1.0 - MM_WEIGHT;
    }

    @Override
    public int compare(Edge e1, Edge e2) {
        District e1Combined = e1.peekCombined();
        District e2Combined = e2.peekCombined();

        double res = (OBJ_FUNC_WEIGHT * algorithm.rateDistrict(e1Combined) + MM_WEIGHT * e1.getCombinedMMScore(algorithm.getConfig())) - (OBJ_FUNC_WEIGHT * algorithm.rateDistrict(e2Combined) + MM_WEIGHT * e2.getCombinedMMScore(algorithm.getConfig()));

        if (res > 0) {
            return 1;
        } else if (res < 0) {
            return -1;
        } else {
            return 0;
        }
    }
}
