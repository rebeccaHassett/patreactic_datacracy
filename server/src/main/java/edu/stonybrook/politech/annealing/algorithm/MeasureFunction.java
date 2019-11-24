package edu.stonybrook.politech.annealing.algorithm;

import edu.stonybrook.politech.annealing.measures.DistrictInterface;
import edu.stonybrook.politech.annealing.measures.PrecinctInterface;
import edu.sunysb.cs.patractic.datacracy.domain.models.ElectionId;

import java.util.HashSet;
import java.util.Set;

public interface MeasureFunction<Precinct extends PrecinctInterface, District extends DistrictInterface<Precinct>> {
    double calculateMeasure(District district, ElectionId electionId);

    default Set<MeasureFunction<Precinct, District>> subMeasures() {
        return new HashSet<>();
    }
}
