package edu.sunysb.cs.patractic.datacracy.domain.models;

import java.util.List;
import java.util.Map;

public class Phase2UpdateDto {
    public final List<JurisdictionDataDto> districtUpdates;
    public final List<MoveDto> moves;
    public final boolean phase2Complete;
    public final Map<String, Double> objFuncResults;

    public Phase2UpdateDto(List<JurisdictionDataDto> districtUpdates, List<MoveDto> moves, boolean phase2Complete, Map<String, Double> objFuncResults) {
        this.districtUpdates = districtUpdates;
        this.moves = moves;
        this.phase2Complete = phase2Complete;
        this.objFuncResults = objFuncResults;

    }
}
