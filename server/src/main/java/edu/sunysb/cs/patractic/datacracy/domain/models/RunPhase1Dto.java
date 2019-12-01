package edu.sunysb.cs.patractic.datacracy.domain.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class RunPhase1Dto {
    public final Properties config;
    public final String stateName;
    public final Boolean incremental;

    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    public RunPhase1Dto(@JsonProperty("config") Properties config,
                        @JsonProperty("stateName") String stateName,
                        @JsonProperty("incremental") Boolean incremental) {
        this.config = config;
        this.stateName = stateName;
        this.incremental = incremental;
    }
}
