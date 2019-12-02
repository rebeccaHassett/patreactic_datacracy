package edu.sunysb.cs.patractic.datacracy.domain.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class RunPhase1Dto {
    public final Properties config;
    public final String stateName;

    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    public RunPhase1Dto(@JsonProperty("config") Properties config,
                        @JsonProperty("stateName") String stateName) {
        this.config = config;
        this.stateName = stateName;
    }
}
