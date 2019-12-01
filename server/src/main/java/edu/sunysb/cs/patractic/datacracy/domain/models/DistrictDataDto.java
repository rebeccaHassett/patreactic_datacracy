package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.sunysb.cs.patractic.datacracy.domain.enums.PoliticalParty;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DistrictDataDto {
    public final String districtId;
    public final List<String> precinctIds;
    public final Map<String, Long> populations;
    public final Map<String, Long> votes;

    public DistrictDataDto(String districtId, List<String> precinctIds, Map<String, Long> populations, Map<PoliticalParty, Long> votes) {
        this.districtId = districtId;
        this.precinctIds = precinctIds;
        this.populations = populations;
        this.votes = new HashMap<>();
        votes.keySet().forEach(p -> this.votes.put(p.toString(), votes.get(p)));
    }
}
