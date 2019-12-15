package edu.sunysb.cs.patractic.datacracy.domain.models;

import java.util.List;

public class MajMinDistrictDto {
    public final String districtId;
    public final Long minorityPopulation;
    public final Long totalPopulation;

    public MajMinDistrictDto(String districtId, Long minorityPopulation, Long totalPopulation) {
        this.districtId = districtId;
        this.minorityPopulation = minorityPopulation;
        this.totalPopulation = totalPopulation;
    }
}
