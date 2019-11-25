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
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "Precincts")
public class Precinct
        implements PrecinctInterface, IJurisdiction {
    private final String precinctId;

    private State state;
    private final String stateName;
    private final Geometry geometry;
    private final String geometryJSON;
    private final String originalDistrictID;
    private District district;
    private final Map<ElectionId, ElectionData> electionDataMap;
    private final Map<DemographicGroup, Long> populationMap;
    private final Set<String> neighborIDs;

    public Precinct(
            String precinctId,
            State state, String stateName,
            String geometryJSON,
            String districtID,
            District district, Map<ElectionId, ElectionData> electionDataMap, Map<DemographicGroup, Long> populationMap, Set<String> neighborIDs) {
        this.precinctId = precinctId;
        this.state = state;
        this.stateName = stateName;
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

    public void setState(State state) {
        this.state = state;
    }

    @Override
    @Id
    public String getPrecinctId() {
        return precinctId;
    }

    @Column(name = "geojson")
    public String getGeometryJSON() {
        return geometryJSON;
    }

    public Geometry getGeometry() {
        return geometry;
    }

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

    @ManyToOne
    @JoinColumn(name = "districtId")
    public District getDistrict() {
        return district;
    }

    public void setDistrict(District district) {
        this.district = district;
    }

    @Override
    @ElementCollection(targetClass=String.class)
    @JoinColumn(table = "PrecinctNeighbors", name = "precinctId")
    public Set<String> getNeighborIDs() {
        return neighborIDs;
    }

    @Override
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
    @OneToMany(mappedBy = "precinctId")
    public ElectionData getElectionData(ElectionId electionId) {
        return electionDataMap.get(electionId);
    }

    @Override
    @OneToMany
    @JoinColumn(name = "precinctId", table = "population")
    @MapKeyColumn(name = "demographic")
    public long getPopulation(DemographicGroup demographic) {
        if (demographic == null) {
            return populationMap.values().stream().reduce(0L, Long::sum);
        } else {
            return populationMap.get(demographic);
        }
    }

    @Column(name = "stateName")
    public String getStateName() {
        return stateName;
    }

    @ManyToOne
    public State getState() {
        return state;
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
        return Objects.hash(precinctId, stateName, district.getDistrictId());
    }

    // PHASE 0
    public boolean isDemographicBloc(DemographicGroup demographic, Threshold blocPopPercentThresh) {
        return blocPopPercentThresh.isWithin(((getPopulation(demographic) * 1.0)/(1.0 * getPopulation(null))), true);
    }

    public VotingBlockDTO getVotingBloc(DemographicGroup demographic, Threshold blocVotingPercentThresh, ElectionId electionId) {
        ElectionData data = getElectionData(electionId);
        PoliticalParty winningParty = data.getWinningParty();
        long totalVotes = data.getVotes(null);
        long votesByDemo = data.getVotes(winningParty);
        double fractionVotedForWinner = (1.0 * votesByDemo) / totalVotes;

        if (blocVotingPercentThresh.isWithin(fractionVotedForWinner, true)) {
            return new VotingBlockDTO(precinctId, totalVotes, votesByDemo, winningParty);
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