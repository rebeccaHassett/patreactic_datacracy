package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.stonybrook.politech.annealing.models.concrete.District;

public class MergeResult {
    public final District district;
    public final String removedId;

    public MergeResult(District district, String removedId) {
        this.district = district;
        this.removedId = removedId;
    }
}
