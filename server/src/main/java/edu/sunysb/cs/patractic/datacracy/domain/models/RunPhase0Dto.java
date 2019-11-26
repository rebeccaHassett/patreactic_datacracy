package edu.sunysb.cs.patractic.datacracy.domain.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class RunPhase0Dto {
    public final Properties config;
    public final String state;

    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    public RunPhase0Dto(@JsonProperty("config") Properties config,
                        @JsonProperty("state") String state) {
        this.config = config;
        this.state = state;
    }
}
