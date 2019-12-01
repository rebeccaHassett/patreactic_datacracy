package edu.stonybrook.politech.annealing.algorithm;

import edu.stonybrook.politech.annealing.models.concrete.District;
import edu.stonybrook.politech.annealing.models.concrete.Precinct;
import edu.stonybrook.politech.annealing.models.concrete.State;
import edu.sunysb.cs.patractic.datacracy.domain.models.ElectionId;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.MultiPolygon;

public enum Measure implements MeasureFunction<Precinct, District> {
    PARTISAN_FAIRNESS {
        /**
         * Partisan fairness:
         * 100% - underrepresented party's winning margin
         * OR
         * underrepresented party's losing margin
         * (We want our underrepresented party to either win by a little or lose by a lot - fewer wasted votes)
         */
        @Override
        public double calculateMeasure(District d, ElectionId electionId) {
            // Temporary section
            int totalVote = 0;
            int totalGOPvote = 0;
            int totalDistricts = 0;
            int totalGOPDistricts = 0;
            State state = d.getState();
            for (District sd : state.getDistricts()) {
                totalVote += sd.getGOPVote(electionId);
                totalVote += sd.getDEMVote(electionId);
                totalGOPvote += sd.getGOPVote(electionId);
                totalDistricts += 1;
                if (sd.getGOPVote(electionId) > sd.getDEMVote(electionId)) {
                    totalGOPDistricts += 1;
                }
            }
            int idealDistrictChange = ((int) Math.round(totalDistricts * ((1.0 * totalGOPvote) / totalVote))) - totalGOPDistricts;
            // End temporary section
            if (idealDistrictChange == 0) {
                return 1.0;
            }
            int gv = d.getGOPVote(electionId);
            int dv = d.getDEMVote(electionId);
            int tv = gv + dv;
            int margin = gv - dv;
            if (tv == 0) {
                return 1.0;
            }
            int win_v = Math.max(gv, dv);
            int loss_v = Math.min(gv, dv);
            int inefficient_V;
            if (idealDistrictChange * margin > 0) {
                inefficient_V = win_v - loss_v;
            } else {
                inefficient_V = loss_v;
            }
            return 1.0 - ((inefficient_V * 1.0) / tv);
        }
    },
    REOCK_COMPACTNESS {
        @Override
        public double calculateMeasure(District district, ElectionId electionId) {
            MultiPolygon shape = district.getMulti();
            Geometry boundingCircle = district.getBoundingCircle();
            return shape.getArea() / boundingCircle.getArea();
        }
    },
    CONVEX_HULL_COMPACTNESS {
        @Override
        public double calculateMeasure(District district, ElectionId electionId) {
            MultiPolygon shape = district.getMulti();
            Geometry convexHull = district.getConvexHull();
            return shape.getArea() / convexHull.getArea();
        }
    },
    EDGE_COMPACTNESS {
        /*
            Compactness:
            perimeter / (circle perimeter for same area)
        */
        @Override
        public double calculateMeasure(District d, ElectionId electionId) {
            double internalEdges = d.getInternalEdges();
            double totalEdges = internalEdges + d.getExternalEdges();
            return internalEdges / totalEdges;
        }
    },
    EFFICIENCY_GAP {
        /**
         * Wasted votes:
         * Statewide: abs(Winning party margin - losing party votes)
         */
        @Override
        public double calculateMeasure(District d, ElectionId electionId) {
            int iv_g = 0;
            int iv_d = 0;
            int tv = 0;
            State state = d.getState();
            for (District sd : state.getDistricts()) {
                int gv = sd.getGOPVote(electionId);
                int dv = sd.getDEMVote(electionId);
                if (gv > dv) {
                    iv_d += dv;
                    iv_g += (gv - dv);
                } else if (dv > gv) {
                    iv_g += gv;
                    iv_d += (dv - gv);
                }
                tv += gv;
                tv += dv;
            }
            return 1.0 - ((Math.abs(iv_g - iv_d) * 1.0) / tv);
        }

        /**
         * Wasted votes:
         * abs(Winning party margin - losing party votes)
         */
        public double rateEfficiencyGap(District d, ElectionId electionId) {//TODO what is this
            int gv = d.getGOPVote(electionId);
            int dv = d.getDEMVote(electionId);
            int tv = gv + dv;
            if (tv == 0) {
                return 1.0;
            }
            int win_v = Math.max(gv, dv);
            int loss_v = Math.min(gv, dv);
            int inefficient_V = Math.abs(loss_v - (win_v - loss_v));
            return 1.0 - ((inefficient_V * 1.0) / tv);
        }

    },
    POPULATION_EQUALITY {
        @Override
        public double calculateMeasure(District d, ElectionId electionId) {
            //we will square before we return--this gives lower measure values
            // for greater error
            State state = d.getState();
            int idealPopulation = state.getPopulation() / state.getDistricts().size();
            int truePopulation = d.getPopulation();
            if (idealPopulation >= truePopulation) {
                return 1 - Math.pow(
                        Math.abs(idealPopulation - (double) truePopulation) / idealPopulation, 1.25);
            }
            return 1 - Math.pow(
                    Math.abs(truePopulation - (double) idealPopulation)
                            / idealPopulation, 1.25);
        }

    },
    COMPETITIVENESS {
        /**
         * COMPETITIVENESS:
         * 1.0 - margin of victory
         */
        @Override
        public double calculateMeasure(District d, ElectionId electionId) {
            int gv = d.getGOPVote(electionId);
            int dv = d.getDEMVote(electionId);
            return 1.0 - (((double) Math.abs(gv - dv)) / (gv + dv));
        }
    },
    GERRYMANDER_REPUBLICAN {
        /**
         * GERRYMANDER_REPUBLICAN:
         * Partisan fairness, but always working in the GOP's favor
         */
        @Override
        public double calculateMeasure(District d, ElectionId electionId) {
            int gv = d.getGOPVote(electionId);
            int dv = d.getDEMVote(electionId);
            int tv = gv + dv;
            int margin = gv - dv;
            if (tv == 0) {
                return 1.0;
            }
            int win_v = Math.max(gv, dv);
            int loss_v = Math.min(gv, dv);
            int inefficient_V;
            if (margin > 0) {
                inefficient_V = win_v - loss_v;
            } else {
                inefficient_V = loss_v;
            }
            return 1.0 - ((inefficient_V * 1.0) / tv);
        }

    },
    POPULATION_HOMOGENEITY {
        /**
         * calculate square error of population, normalized to 0,1
         */
        @Override
        public double calculateMeasure(District district, ElectionId electionId) {
            if (district.getPrecincts().size() == 0)
                return 0;
            double sum = district.getPrecincts().stream().mapToDouble(Precinct::getPopulationDensity).sum();
            final double mean = sum / district.getPrecincts().size();
            double sqError = district.getPrecincts()
                    .stream().mapToDouble(
                            (precinct) -> (Math.pow(precinct.getPopulationDensity() - mean, 2))
                    ).sum();
            sqError /= (district.getPrecincts().size());
            //avg population density in km^2
            double averagePopulationDensity = 3000;


            return 1.0 - Math.tanh(Math.sqrt(sqError / mean) / (mean));
        }
    },
    GERRYMANDER_DEMOCRAT {
        /**
         * GERRYMANDER_DEMOCRAT:
         * Partisan fairness, but always working in the DNC's favor
         */
        @Override
        public double calculateMeasure(District d, ElectionId electionId) {
            int gv = d.getGOPVote(electionId);
            int dv = d.getDEMVote(electionId);
            int tv = gv + dv;
            int margin = dv - gv;
            if (tv == 0) {
                return 1.0;
            }
            int win_v = Math.max(gv, dv);
            int loss_v = Math.min(gv, dv);
            int inefficient_V;
            if (margin > 0) {
                inefficient_V = win_v - loss_v;
            } else {
                inefficient_V = loss_v;
            }
            return 1.0 - ((inefficient_V * 1.0) / tv);
        }
    },
    MAJ_MIN_POP {
        @Override
        public double calculateMeasure(District district, ElectionId electionId) {
            return 0;
        }
    };

    public abstract double calculateMeasure(District district, ElectionId electionId);
}