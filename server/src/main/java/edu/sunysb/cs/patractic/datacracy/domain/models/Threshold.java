package edu.sunysb.cs.patractic.datacracy.domain.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Threshold {
    public final double lower;
    public final double upper;

    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    public Threshold(@JsonProperty("lower") double lower, @JsonProperty("upper") double upper) {
        this.lower = lower;
        this.upper = upper;
    }

    public boolean isWithin(double value, boolean inclusive) {
        return inclusive
                ? value <= upper && value >= lower
                : value < upper && value > lower;
    }
}
