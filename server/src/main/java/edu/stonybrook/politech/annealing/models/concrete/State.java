package edu.stonybrook.politech.annealing.models.concrete;


import edu.stonybrook.politech.annealing.measures.StateInterface;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Constraint;
import edu.sunysb.cs.patractic.datacracy.domain.enums.DemographicGroup;
import edu.sunysb.cs.patractic.datacracy.domain.models.Incumbent;
import edu.sunysb.cs.patractic.datacracy.domain.models.Properties;
import edu.sunysb.cs.patractic.datacracy.domain.models.VotingBlockDTO;

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

            districts.values().forEach(District::initEdges);
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
}