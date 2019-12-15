package edu.sunysb.cs.patractic.datacracy.domain.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class RunPhase2Dto {

    public final Map<String, Double> weights;

    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    public RunPhase2Dto(@JsonProperty("weights") Map<String, Double> weights) {
        this.weights = weights;
    }
}
