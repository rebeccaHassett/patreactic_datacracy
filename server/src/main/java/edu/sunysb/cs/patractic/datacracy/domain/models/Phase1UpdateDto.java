package edu.sunysb.cs.patractic.datacracy.domain.models;

import java.util.List;

public class Phase1UpdateDto {
    public final List<JurisdictionDataDto> districtUpdates;
    public final List<String> districtsToRemove;
    public final List<MajMinDistrictDto> majMinDistrictDtos;

    public Phase1UpdateDto(List<JurisdictionDataDto> districtUpdates, List<String> districtsToRemove, List<MajMinDistrictDto> majMinDistrictDtos) {
        this.districtUpdates = districtUpdates;
        this.districtsToRemove = districtsToRemove;
        this.majMinDistrictDtos = majMinDistrictDtos;
    }
}