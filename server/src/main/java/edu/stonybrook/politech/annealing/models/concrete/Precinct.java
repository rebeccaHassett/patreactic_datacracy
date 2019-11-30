package edu.stonybrook.politech.annealing.models.concrete;

import edu.stonybrook.politech.annealing.measures.PrecinctInterface;
import edu.sunysb.cs.patractic.datacracy.domain.enums.DemographicGroup;
import edu.sunysb.cs.patractic.datacracy.domain.enums.PoliticalParty;
import edu.sunysb.cs.patractic.datacracy.domain.interfaces.IJurisdiction;
import edu.sunysb.cs.patractic.datacracy.domain.models.ElectionData;
import edu.sunysb.cs.patractic.datacracy.domain.models.ElectionId;
import edu.sunysb.cs.patractic.datacracy.domain.models.Threshold;
import edu.sunysb.cs.patractic.datacracy.domain.models.VotingBlockDTO;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.geojson.GeoJsonReader;

import javax.persistence.*;
import java.util.*;

@Entity
@Table(name = "Precinct")
public class Precinct
        implements PrecinctInterface, IJurisdiction {
    private String precinctId;

    private State state;

    private String stateName;
    private Geometry geometry;
    private String geometryJSON;
    private String originalDistrictID;
    private District district;
    private Map<ElectionId, ElectionData> electionDataMap;
    private Map<DemographicGroup, Long> populationMap;
    private Set<String> neighborIDs;

    public Precinct() {
    }

    public Precinct(
            String precinctId,
            State state, String stateName,
            String geometryJSON,
            String districtID,
            District district, Map<ElectionId, ElectionData> electionDataMap, Map<DemographicGroup, Long> populationMap, Set<String> neighborIDs) {
        this.precinctId = precinctId;
        this.state = state;
        this.geometryJSON = geometryJSON;
        this.district = district;
        this.electionDataMap = electionDataMap;
        this.populationMap = populationMap;
        try {
            this.geometry = new GeoJsonReader().read(geometryJSON);
        } catch (ParseException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        this.originalDistrictID = districtID;
        this.neighborIDs = neighborIDs;
    }

    @PostLoad
    public void postLoad() {
//        try {
//            this.geometry = new GeoJsonReader().read(geometryJSON);
//        } catch (ParseException e) {
//            e.printStackTrace();
//            throw new RuntimeException(e);
//        }
    }

    @Override
    @Id
    @MapKey
    public String getPrecinctId() {
        return precinctId;
    }

    public void setPrecinctId(String precinctId) {
        this.precinctId = precinctId;
    }

    @Column(name = "stateName", insertable = false, updatable = false)
    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }

    @Column(name = "geojson", columnDefinition = "longtext")
    public String getGeometryJSON() {
        return geometryJSON;
    }

    public void setGeometryJSON(String geometryJSON) {
        this.geometryJSON = geometryJSON;
    }

    @Transient
    public Geometry getGeometry() {
        return geometry;
    }

    @Transient
    public double getPopulationDensity() {
        if (geometry != null && geometry.getArea() != 0)
            return getPopulation() / geometry.getArea();
        return -1;
    }

    @Override
    @Column(name = "districtId")
    public String getOriginalDistrictID() {
        return originalDistrictID;
    }

    public void setOriginalDistrictID(String originalDistrictID) {
        this.originalDistrictID = originalDistrictID;
    }

    @Transient
    public District getDistrict() {
        return district;
    }

    public void setDistrict(District district) {
        this.district = district;
    }

    @Override

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "PrecinctNeighbors", joinColumns = {@JoinColumn(name = "precinctId")})
    public Set<String> getNeighborIDs() {
        return neighborIDs;
    }

    public void setNeighborIDs(Set<String> neighborIDs) {
        this.neighborIDs = neighborIDs;
    }

    @Override
    @Transient
    public int getPopulation() {
        return (int) getPopulation(null);
    }

    @Override
    public long getGOPVote(ElectionId electionId) {
        return getElectionData(electionId).getVotes(PoliticalParty.REPUBLICAN);
    }

    @Override
    public long getDEMVote(ElectionId electionId) {
        return getElectionData(electionId).getVotes(PoliticalParty.DEMOCRAT);
    }

    @Override
    public ElectionData getElectionData(ElectionId electionId) {
        return electionDataMap.get(electionId);
    }

    @OneToMany(mappedBy = "precinctId", targetEntity = ElectionData.class, fetch = FetchType.EAGER)
    @MapKeyClass(value = ElectionId.class)
    protected Map<ElectionId, ElectionData> getElectionDataMap() {
        return electionDataMap;
    }

    protected void setElectionDataMap(Map<ElectionId, ElectionData> electionDataMap) {
        this.electionDataMap = electionDataMap;
    }

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "PrecinctPopulations", joinColumns = {@JoinColumn(name = "precinctId")})
    @MapKeyClass(DemographicGroup.class)
    protected Map<DemographicGroup, Long> getPopulationMap() {
        return populationMap;
    }

    protected void setPopulationMap(Map<DemographicGroup, Long> map) {
        this.populationMap = map;
    }

    @Override
    public long getPopulation(DemographicGroup demographic) {
        if (demographic == null) {
            return populationMap.values().stream().reduce(0L, Long::sum);
        } else {
            return populationMap.getOrDefault(demographic, 0L);
        }
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stateName", referencedColumnName = "name")
    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Precinct precinct = (Precinct) o;
        return precinctId.equals(precinct.precinctId) &&
                stateName.equals(precinct.stateName) &&
                district.getDistrictId().equals(precinct.district.getDistrictId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(precinctId, stateName);
    }

    // PHASE 0
    public boolean isDemographicBloc(DemographicGroup demographic, Threshold blocPopPercentThresh) {
        return blocPopPercentThresh.isWithin(((getPopulation(demographic) * 1.0) / (1.0 * getPopulation(null))), true);
    }

    public VotingBlockDTO getVotingBloc(DemographicGroup demographic, Threshold blocVotingPercentThresh, ElectionId electionId) {
        ElectionData data = getElectionData(electionId);
        PoliticalParty winningParty = data.getWinningParty();
        long totalVotes = data.getVotes(null);
        long votesByDemo = data.getVotes(winningParty);
        double fractionVotedForWinner = (1.0 * votesByDemo) / totalVotes;

        if (blocVotingPercentThresh.isWithin(fractionVotedForWinner, true)) {
            return new VotingBlockDTO(precinctId, totalVotes, votesByDemo, winningParty, demographic);
        } else {
            return null;
        }
    }

    public Precinct clone() {
        return new Precinct(
                precinctId,
                null,
                stateName,
                geometryJSON,
                originalDistrictID,
                null,
                electionDataMap,
                populationMap,
                new HashSet<>(neighborIDs));
    }
}