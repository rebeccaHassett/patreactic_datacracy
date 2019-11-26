package edu.stonybrook.politech.annealing.models.concrete;


import edu.stonybrook.politech.annealing.measures.StateInterface;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Constraints;
import edu.sunysb.cs.patractic.datacracy.domain.enums.DemographicGroup;
import edu.sunysb.cs.patractic.datacracy.domain.models.Properties;
import edu.sunysb.cs.patractic.datacracy.domain.models.VotingBlockDTO;

import javax.persistence.*;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;


@NamedQueries({
        @NamedQuery(name = "Student_findByName",
                query = "from State where name = :NAME")
})

@Entity
@Table(name = "States")
public class State
        implements StateInterface<Precinct, District> {

    private int population;
    private final Map<DemographicGroup, Long> populationMap;
    private String name;//name is saved for later storage into the database
    private HashMap<String, District> districts;
    private HashMap<String, Precinct> precincts;
    private String stateBoundaries;
    private String laws;
    private Map<String, String> incumbents;

    public State(String name, Set<Precinct> inPrecincts, String boundaries, String laws, Map<String, String> incumbents) {
        this.name = name;
        this.stateBoundaries = boundaries;
        this.laws = laws;
        this.populationMap = new HashMap<>();
        this.districts = new HashMap<>();
        this.precincts = new HashMap<>();
        if(inPrecincts != null) {
            for (Precinct p : inPrecincts) {
                String districtID = p.getOriginalDistrictID();
                District d = this.districts.get(districtID);
                if (d == null) {
                    d = new District(districtID, this);
                    this.districts.put(districtID, d);
                }
                d.addPrecinct(p);
                this.precincts.put(p.getPrecinctId(), p);
            }
        }
        this.incumbents = incumbents;
        this.population = this.districts.values().stream().mapToInt(District::getPopulation).sum();
        for (DemographicGroup dg: DemographicGroup.values()) {
            this.populationMap.put(dg, precincts.values().stream().map(p -> p.getPopulation(dg)).reduce(0L, Long::sum));
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

    @Column(name = "boundaries")
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

    @OneToMany(mappedBy = "stateName", targetEntity = Precinct.class)
    @MapKeyColumn(name = "precinctId")
    protected Map<String, Precinct> getPrecincts() {
        return precincts;
    }
    public void setPrecincts(HashMap<String, Precinct> precincts) {
        this.precincts = precincts;
    }

    @Transient
    public Set<District> getDistricts() {
        return new HashSet<>(districts.values());
    }

    public District getDistrict(String distID) {
        return districts.get(distID);
    }

    public Precinct getPrecinct(String precinctId) {
        return precincts.get(precinctId);
    }

    public Set<VotingBlockDTO> getEligibleDemographicVotingBlocs(DemographicGroup demographic, Properties config) {
        Set<VotingBlockDTO> ret = new HashSet<>();
        for (Precinct p: precincts.values()) {
            if (p.isDemographicBloc(demographic, config.thresholds[Constraints.BLOC_POP_PERCENTAGE.ordinal()])) {
                VotingBlockDTO vbdto = p.getVotingBloc(demographic, config.thresholds[Constraints.BLOC_VOTING_PERCENTAGE.ordinal()], config.electionId);
                if (vbdto != null) {
                    ret.add(vbdto);
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
        return populationMap.get(demographicGroup);
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
    @Column(name = "laws")
    public String getLaws() {
        return laws;
    }
    public void setLaws(String laws) {
        this.laws = laws;
    }

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "Incumbents", joinColumns = {@JoinColumn(name = "stateName")})
    @MapKeyColumn(name="districtId")
    public Map<String, String> getIncumbents() {
        return incumbents;
    }
    public void setIncumbents(Map<String, String> incumbents) {
        this.incumbents = incumbents;
    }
}