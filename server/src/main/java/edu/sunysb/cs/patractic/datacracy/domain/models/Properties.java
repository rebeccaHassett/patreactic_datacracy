package edu.sunysb.cs.patractic.datacracy.domain.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import edu.stonybrook.politech.annealing.algorithm.Measure;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Constraint;
import edu.sunysb.cs.patractic.datacracy.domain.enums.DemographicGroup;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class Properties {
    public final Map<Constraint, Threshold> thresholds;
    public final Map<Measure, Double> weights;
    public final boolean incremental;
    public final boolean realtime;
    public final int numDistricts;
    public final int numMajMinDistricts;
    public final Set<DemographicGroup> selectedMinorities;
    public final ElectionId electionId;


    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    public Properties(@JsonProperty("thresholds") Map<String, Threshold> thresholds,
                      @JsonProperty("weights") Map<Measure, Double> weights,
                      @JsonProperty("incremental") boolean incremental,
                      @JsonProperty("realtime") boolean realtime,
                      @JsonProperty("numDistricts") int numDistricts,
                      @JsonProperty("numMajMinDistricts") int numMajMinDistricts,
                      @JsonProperty("selectedMinorities") List<String> selectedMinorities,
                      @JsonProperty("year") int year,
                      @JsonProperty("type") String type) {
        this.thresholds = new HashMap<>();
        thresholds.forEach((constraint, thresh) -> this.thresholds.put(Constraint.valueOf(constraint), thresh));
        this.weights = weights;
        this.incremental = incremental;
        this.realtime = realtime;
        this.numDistricts = numDistricts;
        this.numMajMinDistricts = numMajMinDistricts;
        this.selectedMinorities = selectedMinorities.stream().map(DemographicGroup::valueOf).collect(Collectors.toUnmodifiableSet());
        this.electionId = new ElectionId(year, type);
    }
}