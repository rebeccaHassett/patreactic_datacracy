package edu.stonybrook.politech.annealing.models.concrete;


import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import edu.stonybrook.politech.annealing.algorithm.Measure;
import edu.stonybrook.politech.annealing.measures.StateInterface;
import edu.sunysb.cs.patractic.datacracy.domain.Algorithm;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Constraint;
import edu.sunysb.cs.patractic.datacracy.domain.enums.DemographicGroup;
import edu.sunysb.cs.patractic.datacracy.domain.enums.ElectionType;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Year;
import edu.sunysb.cs.patractic.datacracy.domain.interfaces.IJurisdiction;
import edu.sunysb.cs.patractic.datacracy.domain.models.Properties;
import edu.sunysb.cs.patractic.datacracy.domain.models.*;

import javax.persistence.*;
import java.util.*;
import java.util.stream.Collectors;


@NamedQueries({
        @NamedQuery(name = "State_findByName",
                query = "from State where name = :NAME")
})

@Entity
@Table(name = "State")
public class State
        implements StateInterface<Precinct, District> {

    private final Map<DemographicGroup, Long> populationMap;
    private int population;
    private String name;//name is saved for later storage into the database
    private Map<String, District> districts;
    private Map<String, Precinct> precincts;
    private String stateBoundaries;
    private String laws;
    private Map<String, Incumbent> incumbents;
    private Map<String, String> originalDistrictBordersMap;

    public State(String name, Set<Precinct> inPrecincts, String boundaries, String laws, Map<String, Incumbent> incumbents) {
        this.name = name;
        this.stateBoundaries = boundaries;
        this.laws = laws;
        this.populationMap = new HashMap<>();
        this.districts = new HashMap<>();
        this.precincts = new HashMap<>();
        this.incumbents = incumbents;
        inPrecincts.forEach(p -> precincts.put(p.getPrecinctId(), p));
        initialize();
    }

    public State() {
        this.populationMap = new HashMap<>();
        this.districts = new HashMap<>();
        this.precincts = new HashMap<>();
        this.incumbents = new HashMap<>();
    }

    @PostLoad
    public void initialize() {
        if (precincts != null) {
            for (Precinct p : precincts.values()) {
                String districtID = p.getOriginalDistrictID();
                District d = this.districts.get(districtID);
                if (d == null) {
                    d = new District(districtID, this);
                    this.districts.put(districtID, d);
                }
                d.addPrecinct(p);
            }
            this.population = this.districts.values().stream().mapToInt(District::getPopulation).sum();
            for (DemographicGroup dg : DemographicGroup.values()) {
                this.populationMap.put(dg, precincts.values().stream().map(p -> p.getPopulation(dg)).reduce(0L, Long::sum));
            }
        }
    }

    @Id
    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Column(name = "boundaries", columnDefinition = "longtext")
    public String getStateBoundaries() {
        return stateBoundaries;
    }

    public void setStateBoundaries(String stateBoundaries) {
        this.stateBoundaries = stateBoundaries;
    }

    @Transient
    public Set<Precinct> getPrecinctSet() {
        return new HashSet<>(precincts.values());
    }

    @OneToMany(mappedBy = "stateName", targetEntity = Precinct.class, fetch = FetchType.EAGER)
    @MapKeyColumn(name = "precinctId")
    protected Map<String, Precinct> getPrecincts() {
        return precincts;
    }

    public void setPrecincts(Map<String, Precinct> precincts) {
        this.precincts = precincts;
    }

    @Transient
    public Set<District> getDistricts() {
        return new HashSet<>(districts.values());
    }

    public int numDistricts() {
        return districts.size();
    }

    public District getDistrict(String distID) {
        return districts.get(distID);
    }

    public Precinct getPrecinct(String precinctId) {
        return precincts.get(precinctId);
    }

    public List<VotingBlockDTO> getEligibleDemographicVotingBlocs(Properties config) {
        List<VotingBlockDTO> ret = new ArrayList<>();
        for (Precinct p : precincts.values()) {
            for (DemographicGroup dg : DemographicGroup.values()) {
                if (p.isDemographicBloc(dg, config.thresholds.get(Constraint.BLOC_POP_PERCENTAGE))) {
                    VotingBlockDTO vbdto = p.getVotingBloc(dg, config.thresholds.get(Constraint.BLOC_VOTING_PERCENTAGE), config.electionId);
                    if (vbdto != null) {
                        ret.add(vbdto);
                    }
                }
            }
        }
        return ret;
    }

    @Override
    @Transient
    public int getPopulation() {
        return population;
    }

    public long getPopulation(DemographicGroup demographicGroup) {
        if (demographicGroup == null) {
            return getPopulation();
        }
        return populationMap.getOrDefault(demographicGroup, 0L);
    }

    @Override
    public int hashCode() {
        return name.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof State) {
            return name.equals(((State) obj).name);
        }
        return false;
    }

    public State clone() {
        State clone = new State(name, precincts.values().stream().map(Precinct::clone).collect(Collectors.toSet()), stateBoundaries, laws, incumbents);
        clone.getPrecinctSet().forEach(p -> p.setState(clone));
        return clone;
    }

    @Column(name = "laws", columnDefinition = "text")
    public String getLaws() {
        return laws;
    }

    public void setLaws(String laws) {
        this.laws = laws;
    }

    @OneToMany(mappedBy = "stateName", targetEntity = Incumbent.class, fetch = FetchType.EAGER)
    @MapKeyColumn(name = "districtId")
    public Map<String, Incumbent> getIncumbents() {
        return incumbents;
    }

    public void setIncumbents(Map<String, Incumbent> incumbents) {
        this.incumbents = incumbents;
    }

    public void initPhase1() {
        districts.clear();
        int counter = 0;
        for (Precinct p : precincts.values()) {
            District newDistrict = new District(String.valueOf(counter++), this);
            newDistrict.addPrecinct(p);
            districts.put(newDistrict.getDistrictId(), newDistrict);
        }
        districts.values().forEach(District::initEdges);
    }

    public JurisdictionDataDto dto() {
        Map<DemographicGroup, Long> popMap = new HashMap<>();
        for (DemographicGroup dg : DemographicGroup.values()) {
            popMap.put(dg, getPopulation(dg));
        }
        List<ElectionId> electionIds = ImmutableList.of(
                new ElectionId(Year.Y2016, ElectionType.PRESIDENTIAL),
                new ElectionId(Year.Y2016, ElectionType.CONGRESSIONAL),
                new ElectionId(Year.Y2018, ElectionType.CONGRESSIONAL)
        );
        ImmutableMap.Builder<ElectionId, ElectionData> builder = new ImmutableMap.Builder<>();
        electionIds.forEach(eId -> builder.put(eId, ElectionData.aggregateFromJurisdictions(this.getPrecinctSet().stream().map(p -> (IJurisdiction) p).collect(Collectors.toSet()), eId)));

        ImmutableMap.Builder<String, Map<String, Double>> objFuncResultsMapBuilder = new ImmutableMap.Builder<>();
        for (Measure m : Measure.values()) {
            ImmutableMap.Builder<String, Double> currentMeasureMapBuilder = new ImmutableMap.Builder<>();
            for (ElectionId election : electionIds) {
                Double res = districts.values().parallelStream().mapToDouble(d -> m.calculateMeasure(d, election)).average().orElse(0);
                currentMeasureMapBuilder.put(election.toString(), res);
            }
            objFuncResultsMapBuilder.put(m.toString(), currentMeasureMapBuilder.build());
        }

        return new JurisdictionDataDto(this.name, new ArrayList<>(this.precincts.keySet()), popMap, builder.build(), objFuncResultsMapBuilder.build());
    }

    public Set<Edge> getMMEdges(Properties config) {
        Set<Edge> mmEdges = new HashSet<>();
        if (districts.values().stream().filter(d -> Algorithm.isMajMin(d, config)).count() < config.numMajMinDistricts) {
            for (District d : districts.values()) {
                mmEdges.addAll(d.getMMEdges(config));
            }
        }
        if (mmEdges.isEmpty()) {
            for (District d : districts.values()) {
                mmEdges.addAll(d.getEdges());
            }
        }
        return mmEdges;
    }

    public void removeDistrict(District other, District replacement) {
        districts.remove(other.getDistrictId());
        districts.forEach((id, d) -> d.replaceDistrictInEdges(other, replacement));
    }

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "OriginalDistrictBorders", joinColumns = {@JoinColumn(name = "stateName", columnDefinition = "varchar(50)")})
    @MapKeyColumn(name = "districtId", columnDefinition = "varchar(50)")
    @Column(name = "borders", columnDefinition = "longtext")
    public Map<String, String> getOriginalDistrictBordersMap() {
        return originalDistrictBordersMap;
    }

    public void setOriginalDistrictBordersMap(Map<String, String> originalDistrictBordersMap) {
        this.originalDistrictBordersMap = originalDistrictBordersMap;
    }

    public String getOriginalDistrictBorders(String districtId) {
        return originalDistrictBordersMap.get(districtId);
    }
}