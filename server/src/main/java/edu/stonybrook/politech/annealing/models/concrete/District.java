package edu.stonybrook.politech.annealing.models.concrete;

import com.sun.istack.NotNull;
import edu.stonybrook.politech.annealing.measures.DistrictInterface;
import edu.sunysb.cs.patractic.datacracy.domain.enums.DemographicGroup;
import edu.sunysb.cs.patractic.datacracy.domain.enums.PoliticalParty;
import edu.sunysb.cs.patractic.datacracy.domain.interfaces.IJurisdiction;
import edu.sunysb.cs.patractic.datacracy.domain.models.ElectionData;
import edu.sunysb.cs.patractic.datacracy.domain.models.ElectionId;
import org.locationtech.jts.algorithm.MinimumBoundingCircle;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.MultiPolygon;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.io.geojson.GeoJsonWriter;

import javax.persistence.*;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "Districts")
public class District
        implements DistrictInterface<Precinct>, IJurisdiction {

    private String districtId;

    private String origIncumbent;

    private State state;

    private int internalEdges = 0;
    private int externalEdges = 0;

    private HashMap<String, Precinct> precincts;


    private Set<Precinct> borderPrecincts;
    private Set<Precinct> precinctsAsJurisdictions;

    private MultiPolygon multiPolygon;

    private Geometry boundingCircle;
    private Geometry convexHull;

    private String borders;
    private long population;

    private boolean boundingCircleUpdated = false;
    private boolean multiPolygonUpdated = false;
    private boolean convexHullUpdated = false;

    public District(String districtId, State state) {
        this.districtId = districtId;
        precincts = new HashMap<>();
        borderPrecincts = new HashSet<>();
        this.state = state;
    }

    //@ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn (name="stateName",referencedColumnName="name",nullable=false,unique=true)
    @ManyToOne(targetEntity = State.class, fetch=FetchType.EAGER, cascade={CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @JoinColumn(name = "stateName", referencedColumnName = "name")
    @NotNull
    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    @Id
    public String getDistrictId() {
        return districtId;
    }

    public void setDistrictId(String districtId) {
        this.districtId = districtId;
    }


    public int getPopulation() {
        return (int)getPopulation(null);
    }

    public int getGOPVote(ElectionId electionId) {
        return (int)getElectionData(electionId).getVotes(PoliticalParty.REPUBLICAN);
    }

    public int getDEMVote(ElectionId electionId) {
        return (int)getElectionData(electionId).getVotes(PoliticalParty.DEMOCRAT);
    }

    public int getInternalEdges() {
        return internalEdges;
    }
    public void setInternalEdges(int internalEdges) {
        this.internalEdges = internalEdges;
    }

    public int getExternalEdges() {
        return externalEdges;
    }
    public void setExternalEdges(int externalEdges) {
        this.externalEdges = externalEdges;
    }


    private Set<Precinct> getInternalNeighbors(Precinct p) {
        Set<Precinct> neighborsInternal = new HashSet<>();
        for (String nid : p.getNeighborIDs()) {
            if (precincts.containsKey(nid)) {
                Precinct neighbor = precincts.get(nid);
                neighborsInternal.add(neighbor);
            }
        }
        return neighborsInternal;
    }

    @ElementCollection(targetClass=Precinct.class)
    public Set<Precinct> getPrecincts() {
        return new HashSet<>(precincts.values());
    }
    public void setPrecincts(HashMap<String, Precinct> precincts) {
        this.precincts = precincts;
    }


    @ElementCollection(targetClass=Precinct.class)
    public Set<Precinct> getBorderPrecincts() {
        return new HashSet<>(borderPrecincts);
    }
    public void setBorderPrecincts(Set<Precinct> borderPrecincts) {
        this.borderPrecincts = borderPrecincts;
    }

    public boolean isBorderPrecinct(Precinct precinct) {
        for (String neighborID : precinct.getNeighborIDs()) {
            //if the neighbor's neighbor is not in the district, then it is outer
            if (!precincts.containsKey(neighborID)) {
                return true;
            }
        }
        return false;
    }

    public Precinct getPrecinct(String precinctID) {
        return precincts.get(precinctID);
    }

    public void addPrecinct(Precinct p) {
        precincts.put(p.getPrecinctId(), p);
        borderPrecincts.add(p);
        Set<Precinct> newInternalNeighbors = getInternalNeighbors(p);
        int newInternalEdges = newInternalNeighbors.size();
        internalEdges += newInternalEdges;
        externalEdges -= newInternalEdges;
        externalEdges += (p.getNeighborIDs().size() - newInternalEdges);
        newInternalNeighbors.removeIf(
                this::isBorderPrecinct
        );
        borderPrecincts.removeAll(newInternalNeighbors);

        p.setDistrict(this);

        this.multiPolygonUpdated = false;
        this.convexHullUpdated = false;
        this.boundingCircleUpdated = false;
    }

    public void removePrecinct(Precinct p) {
        precincts.remove(p.getPrecinctId());
        Set<Precinct> lostInternalNeighbors = getInternalNeighbors(p);
        int lostInternalEdges = lostInternalNeighbors.size();
        internalEdges -= lostInternalEdges;
        externalEdges += lostInternalEdges;
        externalEdges -= (p.getNeighborIDs().size() - lostInternalEdges);
        borderPrecincts.remove(p);
        borderPrecincts.addAll(lostInternalNeighbors);

        p.setDistrict(null);

        this.multiPolygonUpdated = false;
        this.convexHullUpdated = false;
        this.boundingCircleUpdated = false;
    }


    public MultiPolygon computeMulti() {
        Polygon[] polygons = new Polygon[getPrecincts().size()];

        Iterator<Precinct> piter = getPrecincts().iterator();
        for (int i = 0; i < polygons.length; i++) {
            Geometry poly = piter.next().getGeometry();
            if (poly instanceof Polygon)
                polygons[i] = (Polygon) poly;
            else
                polygons[i] = (Polygon) poly.convexHull();
        }
        MultiPolygon mp = new MultiPolygon(polygons, new GeometryFactory());
        this.multiPolygon = mp;
        this.multiPolygonUpdated = true;
        return mp;
    }

    @Transient
    public MultiPolygon getMulti() {
        if (this.multiPolygonUpdated && this.multiPolygon != null)
            return this.multiPolygon;
        return computeMulti();
    }

    @Transient
    public Geometry getConvexHull() {
        if (convexHullUpdated && convexHull != null)
            return convexHull;
        convexHull = multiPolygon.convexHull();
        this.convexHullUpdated = true;
        return convexHull;
    }

    public String getBorders() {
        return new GeoJsonWriter().write(getConvexHull());
    }
    public void setBorders(String borders) {
        this.borders = borders;
    }

    @Transient
    public Geometry getBoundingCircle() {
        if (boundingCircleUpdated && boundingCircle != null)
            return boundingCircle;
        boundingCircle = new MinimumBoundingCircle(getMulti()).getCircle();
        this.boundingCircleUpdated = true;
        return boundingCircle;
    }

    @Override
    public ElectionData getElectionData(ElectionId electionId) {
        return ElectionData.aggregateFromJurisdictions(getPrecinctsAsJurisdictions(), electionId);
    }

    @ElementCollection(targetClass=Precinct.class)
    private Set<IJurisdiction> getPrecinctsAsJurisdictions() {
        return getPrecincts().stream().map(p -> (IJurisdiction)p).collect(Collectors.toSet());
    }
    private void setPrecinctsAsJurisdictions(Set<Precinct> precinctsAsJurisdictions) {
        this.precinctsAsJurisdictions = precinctsAsJurisdictions;
    }

    @Override
    public long getPopulation(DemographicGroup demographic) {
        return getPrecincts().stream().map(p -> p.getPopulation(demographic)).reduce(0L, Long::sum);
    }
    public void setPopulation(long population) {
        this.population = population;
    }

    @Column(name = "incumbent")
    public String getOrigIncumbent() {
        return origIncumbent;
    }

    public void setOrigIncumbent(String origIncumbent) {
        this.origIncumbent = origIncumbent;
    }
}
