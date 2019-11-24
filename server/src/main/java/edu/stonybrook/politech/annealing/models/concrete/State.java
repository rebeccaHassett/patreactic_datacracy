package edu.stonybrook.politech.annealing.models.concrete;


import edu.stonybrook.politech.annealing.measures.StateInterface;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Constraints;
import edu.sunysb.cs.patractic.datacracy.domain.enums.DemographicGroup;
import edu.sunysb.cs.patractic.datacracy.domain.models.Properties;
import edu.sunysb.cs.patractic.datacracy.domain.models.VotingBlockDTO;
import org.apache.commons.lang3.NotImplementedException;

import javax.persistence.*;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "States")
public class State
        implements StateInterface<Precinct, District> {

    private final int population;
    private final Map<DemographicGroup, Long> populationMap;
    @Id
    private String name;//name is saved for later storage into the database

    @OneToMany(mappedBy = "stateName", cascade = CascadeType.ALL)
    @MapKeyColumn(name = "districtId")
    private HashMap<String, District> districts;

    @OneToMany(mappedBy = "stateName")
    @MapKeyColumn(name = "precinctId")
    private HashMap<String, Precinct> precincts;

    @Column(name = "boundaries")
    private String stateBoundaries;

    public State(String name, Set<Precinct> inPrecincts, String boundaries) {
        this.name = name;
        this.stateBoundaries = boundaries;
        this.populationMap = new HashMap<>();
        this.districts = new HashMap<>();
        this.precincts = new HashMap<>();
        for (Precinct p : inPrecincts) {
            String districtID = p.getOriginalDistrictID();
            District d = districts.get(districtID);
            if (d == null) {
                d = new District(districtID, this);
                districts.put(districtID, d);
            }
            d.addPrecinct(p);
            this.precincts.put(p.getPrecinctId(), p);
        }
        this.population = districts.values().stream().mapToInt(District::getPopulation).sum();
        for (DemographicGroup dg: DemographicGroup.values()) {
            this.populationMap.put(dg, precincts.values().stream().map(p -> p.getPopulation(dg)).reduce(0L, Long::sum));
        }
    }

    public Set<Precinct> getPrecincts() {
        return new HashSet<>(precincts.values());
    }

    public Set<District> getDistricts() {
        return new HashSet<>(districts.values());
    }

    public District getDistrict(String distID) {
        return districts.get(distID);
    }

    public Precinct getPrecinct(String precID) {
        return precincts.get(precID);
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
        State clone = new State(name, precincts.values().stream().map(Precinct::clone).collect(Collectors.toSet()), stateBoundaries);
        clone.getPrecincts().forEach(p -> p.setState(clone));
        return clone;
    }
}