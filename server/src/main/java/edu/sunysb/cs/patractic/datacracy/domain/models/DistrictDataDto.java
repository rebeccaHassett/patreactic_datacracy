package edu.sunysb.cs.patractic.datacracy.domain.models;

import com.google.common.collect.ImmutableMap;
import edu.sunysb.cs.patractic.datacracy.domain.enums.DemographicGroup;
import edu.sunysb.cs.patractic.datacracy.domain.enums.ElectionType;
import edu.sunysb.cs.patractic.datacracy.domain.enums.PoliticalParty;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Year;

import java.util.List;
import java.util.Map;

public class DistrictDataDto {
    public final String PRENAME; // district id, named this way for compatibility with precinct-level data in geojson
    public final Long PRES16D;
    public final Long PRES16R;
    public final Map<Character, Long> HOUSE_ELECTION_16;
    public final Map<Character, Long> HOUSE_ELECTION_18;
    public final Long VAP;
    public final Long HVAP;
    public final Long WVAP;
    public final Long BVAP;
    public final Long AMINVAP;
    public final Long ASIANVAP;
    public final List<String> precinctIds;

    public DistrictDataDto(String districtId, List<String> precinctIds, Map<DemographicGroup, Long> populations, Map<ElectionId, ElectionData> electionDataMap) {
        this.PRENAME = districtId;
        this.precinctIds = precinctIds;
        PRES16D = electionDataMap.get(new ElectionId(Year.Y2016, ElectionType.PRESIDENTIAL)).getVotes(PoliticalParty.DEMOCRAT);
        PRES16R = electionDataMap.get(new ElectionId(Year.Y2016, ElectionType.PRESIDENTIAL)).getVotes(PoliticalParty.REPUBLICAN);
        HOUSE_ELECTION_16 = ImmutableMap.of(
                'D', electionDataMap.get(new ElectionId(Year.Y2016, ElectionType.CONGRESSIONAL)).getVotes(PoliticalParty.DEMOCRAT),
                'R', electionDataMap.get(new ElectionId(Year.Y2016, ElectionType.CONGRESSIONAL)).getVotes(PoliticalParty.REPUBLICAN)
        );
        HOUSE_ELECTION_18 = ImmutableMap.of(
                'D', electionDataMap.get(new ElectionId(Year.Y2018, ElectionType.CONGRESSIONAL)).getVotes(PoliticalParty.DEMOCRAT),
                'R', electionDataMap.get(new ElectionId(Year.Y2018, ElectionType.CONGRESSIONAL)).getVotes(PoliticalParty.REPUBLICAN)
        );
        VAP = populations.values().stream().mapToLong(Long::longValue).sum();
        HVAP = populations.getOrDefault(DemographicGroup.HISPANIC, 0L);
        WVAP = populations.getOrDefault(DemographicGroup.WHITE, 0L);
        BVAP = populations.getOrDefault(DemographicGroup.BLACK, 0L);
        AMINVAP = populations.getOrDefault(DemographicGroup.NATIVE_AMERICAN, 0L);
        ASIANVAP = populations.getOrDefault(DemographicGroup.ASIAN, 0L);
    }
}
