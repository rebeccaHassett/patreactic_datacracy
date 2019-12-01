package edu.sunysb.cs.patractic.datacracy.domain.models;

import java.util.List;

public class Phase1UpdateDto {
    public final List<DistrictDataDto> districtUpdates;
    public final List<String> districtsToRemove;

    public Phase1UpdateDto(List<DistrictDataDto> districtUpdates, List<String> districtsToRemove) {
        this.districtUpdates = districtUpdates;
        this.districtsToRemove = districtsToRemove;
    }
}
