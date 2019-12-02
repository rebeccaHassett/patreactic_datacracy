package edu.stonybrook.politech.annealing.models.concrete;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import edu.stonybrook.politech.annealing.measures.DistrictInterface;
import edu.sunysb.cs.patractic.datacracy.domain.enums.DemographicGroup;
import edu.sunysb.cs.patractic.datacracy.domain.enums.ElectionType;
import edu.sunysb.cs.patractic.datacracy.domain.enums.PoliticalParty;
import edu.sunysb.cs.patractic.datacracy.domain.enums.Year;
import edu.sunysb.cs.patractic.datacracy.domain.interfaces.IJurisdiction;
import edu.sunysb.cs.patractic.datacracy.domain.models.Properties;
import edu.sunysb.cs.patractic.datacracy.domain.models.*;
import org.locationtech.jts.algorithm.MinimumBoundingCircle;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.MultiPolygon;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.io.geojson.GeoJsonWriter;

import java.util.*;
import java.util.stream.Collectors;

public class District
        implements DistrictInterface<Precinct>, IJurisdiction {

    private String districtId;

    private State state;

    private int internalEdges = 0;
    private int externalEdges = 0;

    private HashMap<String, Precinct> precincts;

    private Set<Edge> edges;

    private Set<Precinct> borderPrecincts;

    private MultiPolygon multiPolygon;

    private Geometry boundingCircle;
    private Geometry convexHull;

    private boolean boundingCircleUpdated = false;
    private boolean multiPolygonUpdated = false;
    private boolean convexHullUpdated = false;

    public District(String districtId, State state) {
        this.districtId = districtId;
        precincts = new HashMap<>();
        borderPrecincts = new HashSet<>();
        this.state = state;
        edges = new HashSet<>();
    }

    public District() {
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public String getDistrictId() {
        return districtId;
    }

    public int getPopulation() {
        return (int) getPopulation(null);
    }

    public int getGOPVote(ElectionId electionId) {
        return (int) getElectionData(electionId).getVotes(PoliticalParty.REPUBLICAN);
    }

    public int getDEMVote(ElectionId electionId) {
        return (int) getElectionData(electionId).getVotes(PoliticalParty.DEMOCRAT);
    }

    public int getInternalEdges() {
        return internalEdges;
    }

    public int getExternalEdges() {
        return externalEdges;
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

    public Set<Precinct> getPrecincts() {
        return new HashSet<>(precincts.values());
    }

    public Set<Precinct> getBorderPrecincts() {
        return new HashSet<>(borderPrecincts);
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

    public MultiPolygon getMulti() {
        if (this.multiPolygonUpdated && this.multiPolygon != null)
            return this.multiPolygon;
        return computeMulti();
    }

    public Geometry getConvexHull() {
        if (convexHullUpdated && convexHull != null) {
            return convexHull;
        }
        if (!multiPolygonUpdated || multiPolygon == null) {
            computeMulti();
        }
        convexHull = multiPolygon.convexHull();
        this.convexHullUpdated = true;
        return convexHull;
    }

    public String getBorders() {
        return new GeoJsonWriter().write(getConvexHull());
    }

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

    private Set<IJurisdiction> getPrecinctsAsJurisdictions() {
        return getPrecincts().stream().map(p -> (IJurisdiction) p).collect(Collectors.toSet());
    }

    @Override
    public long getPopulation(DemographicGroup demographic) {
        return getPrecincts().stream().map(p -> p.getPopulation(demographic)).reduce(0L, Long::sum);
    }

    public Set<Edge> getEdges() {
        return new HashSet<>(edges);
    }

    public Edge getEdge(String districtId) {
        return edges.stream().filter(e -> e.hasDistrict(districtId)).findFirst().orElse(null);
    }

    public void initEdges() {
        Set<District> neighbors = new HashSet<>();
        this.borderPrecincts.forEach(p ->
                neighbors.addAll(getState().getPrecinctSet().stream()
                        .filter(pre -> p.getNeighborIDs().contains(pre.getPrecinctId()))
                        .map(Precinct::getDistrict)
                        .collect(Collectors.toSet())
                ));
        neighbors.forEach(d -> {
            Edge edge = new Edge(this, d);
            edges.add(edge);
            d.edges.add(edge);
        });
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
        electionIds.forEach(eId -> builder.put(eId, this.getElectionData(eId)));
        return new JurisdictionDataDto(this.districtId, new ArrayList<>(this.precincts.keySet()), popMap, builder.build());
    }

    public Set<Edge> getMMEdges(Properties config) {
        return edges.stream()
                .filter(e -> e.wouldImproveMM(config))
                .collect(Collectors.toSet());
    }
}
