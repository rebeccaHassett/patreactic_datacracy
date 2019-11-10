package edu.sunysb.cs.patractic.datacracy.domain.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Properties {
    public final Threshold[] thresholds;
    public final double[] weights;
    public final boolean incremental;
    public final boolean realtime;
    public final int numDistricts;
    public final int numMajMinDistricts;
    public final boolean[] selectedMinorities;

    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    public Properties(@JsonProperty("thresholds") Threshold[] thresholds,
                      @JsonProperty("weights") double[] weights,
                      @JsonProperty("incremental") boolean incremental,
                      @JsonProperty("realtime") boolean realtime,
                      @JsonProperty("numDistricts") int numDistricts,
                      @JsonProperty("numMajMinDistricts") int numMajMinDistricts,
                      @JsonProperty("selectedMinorities") boolean[] selectedMinorities) {
        this.thresholds = thresholds;
        this.weights = weights;
        this.incremental = incremental;
        this.realtime = realtime;
        this.numDistricts = numDistricts;
        this.numMajMinDistricts = numMajMinDistricts;
        this.selectedMinorities = selectedMinorities;
    }
}
