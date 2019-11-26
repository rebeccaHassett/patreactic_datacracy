package edu.sunysb.cs.patractic.datacracy.domain.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import edu.stonybrook.politech.annealing.algorithm.Measure;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Constraint;
import edu.sunysb.cs.patractic.datacracy.domain.enums.ElectionType;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Year;

import java.util.HashMap;
import java.util.Map;

public class Properties {
    public final Map<Constraint, Threshold> thresholds;
    public final Map<Measure, Double> weights;
    public final boolean incremental;
    public final boolean realtime;
    public final int numDistricts;
    public final int numMajMinDistricts;
    public final boolean[] selectedMinorities;
    public final ElectionId electionId;


    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    public Properties(@JsonProperty("thresholds") Map<String, Threshold> thresholds,
                      @JsonProperty("weights") Map<Measure, Double> weights,
                      @JsonProperty("incremental") boolean incremental,
                      @JsonProperty("realtime") boolean realtime,
                      @JsonProperty("numDistricts") int numDistricts,
                      @JsonProperty("numMajMinDistricts") int numMajMinDistricts,
                      @JsonProperty("selectedMinorities") boolean[] selectedMinorities,
                      @JsonProperty("year") int year,
                      @JsonProperty("type") String type) {
        this.thresholds = new HashMap<>();
        thresholds.forEach((constraint, thresh) -> this.thresholds.put(Constraint.valueOf(constraint), thresh));
        this.weights = weights;
        this.incremental = incremental;
        this.realtime = realtime;
        this.numDistricts = numDistricts;
        this.numMajMinDistricts = numMajMinDistricts;
        this.selectedMinorities = selectedMinorities;
        Year y;
        if (year == 2018) {
            y = Year.Y2018;
        } else if (year == 2016) {
            y = Year.Y2016;
        } else {
            throw new IllegalArgumentException("Year must be 2016 or 2018.");
        }
        ElectionType t;
        if (type.equals("Congressional")) {
            t = ElectionType.CONGRESSIONAL;
        } else if (type.equals("Presidential")) {
            t = ElectionType.PRESIDENTIAL;
        } else {
            throw new IllegalArgumentException("Type must be \"Congressional\" or \"Presidential\".");
        }
        this.electionId = new ElectionId(y, t);
    }
}