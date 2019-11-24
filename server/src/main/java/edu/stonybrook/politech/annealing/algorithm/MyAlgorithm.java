package edu.stonybrook.politech.annealing.algorithm;

import edu.stonybrook.politech.annealing.measures.DefaultMeasures;
import edu.stonybrook.politech.annealing.models.concrete.District;
import edu.stonybrook.politech.annealing.models.concrete.State;
import edu.sunysb.cs.patractic.datacracy.domain.models.ElectionId;

import java.util.Map;
import java.util.Set;

public class MyAlgorithm extends Algorithm {

    public MyAlgorithm(State state, DefaultMeasures measures, ElectionId electionId) {
        super(state, measures, electionId);
    }

    public String describeDistrict(District d, ElectionId electionId) {
        boolean first = true;
        Set<Measure> measures = (Set) getDistrictScoreFunction().subMeasures();
        StringBuilder toReturn = new StringBuilder("{ \"ID\": \"" + d.getDistrictId() + "\", \"MEASURES\": [");
        for (Measure m : measures) {
            try {
                if (first) {
                    first = false;
                } else {
                    toReturn.append(", ");
                }
                double rating = m.calculateMeasure(d, electionId);
                toReturn.append("{ \"MEASURE\": \"").append(m.name()).append("\", ");
                toReturn.append("\"SCORE\": ").append(rating * 100).append(" }");
            } catch (Exception e) {
                System.out.println(m.name() + " - " + e.getClass().getCanonicalName() + " - Message:");
                System.out.println(e.getMessage());
                return "ERROR";
            }
        }
        return toReturn.append("] }").toString();
    }

    public void setWeights(Map<Measure, Double> weights) {
        // TODO -- this should NOT be typecasted !! ! !. We know people will only use this with default measures, but its still a meh casting
        System.out.println(weights);
        ((DefaultMeasures) getDistrictScoreFunction()).updateConstantWeights(weights);
        updateScores();
    }
}
