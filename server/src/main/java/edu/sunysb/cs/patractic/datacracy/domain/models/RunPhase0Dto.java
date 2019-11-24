package edu.sunysb.cs.patractic.datacracy.domain.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import edu.sunysb.cs.patractic.datacracy.domain.enums.DemographicGroup;

public class RunPhase0Dto {
    public final Properties config;
    public final String state;
    public final DemographicGroup demographic;

    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    public RunPhase0Dto(@JsonProperty("config") Properties config,
                        @JsonProperty("state") String state,
                        @JsonProperty("demographic") String demographic) {
        this.config = config;
        this.state = state;
        this.demographic = DemographicGroup.valueOf(demographic);
    }
}
