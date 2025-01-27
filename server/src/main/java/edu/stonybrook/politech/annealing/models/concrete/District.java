package edu.stonybrook.politech.annealing.models.concrete;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import edu.stonybrook.politech.annealing.algorithm.Measure;
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

    private Map<ElectionId, ElectionData> electionDataMap = new HashMap<>();
    private Map<DemographicGroup, Long> populationMap = new HashMap<>();

    private boolean boundingCircleUpdated = false;
    private boolean multiPolygonUpdated = false;
    private boolean convexHullUpdated = false;

    private int countyJoinability = 0;

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
        newInternalNeighbors.removeIf(this::isBorderPrecinct);
        borderPrecincts.removeAll(newInternalNeighbors);

        p.setDistrict(this);

        electionDataMap.clear();
        for (DemographicGroup dg : DemographicGroup.values()) {
            populationMap.put(dg, populationMap.getOrDefault(dg, 0L) + p.getPopulation(dg));
        }

        this.multiPolygonUpdated = false;
        this.convexHullUpdated = false;
        this.boundingCircleUpdated = false;
        this.edges.forEach(Edge::invalidateScoreCache);
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

        electionDataMap.clear();
        for (DemographicGroup dg : DemographicGroup.values()) {
            populationMap.put(dg, populationMap.getOrDefault(dg, 0L) - p.getPopulation(dg));
        }

        this.multiPolygonUpdated = false;
        this.convexHullUpdated = false;
        this.boundingCircleUpdated = false;

        this.edges.forEach(Edge::invalidateScoreCache);
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

    public Geometry getBoundingCircle() {
        if (boundingCircleUpdated && boundingCircle != null)
            return boundingCircle;
        boundingCircle = new MinimumBoundingCircle(getMulti()).getCircle();
        this.boundingCircleUpdated = true;
        return boundingCircle;
    }

    @Override
    public ElectionData getElectionData(ElectionId electionId) {
        if (!electionDataMap.containsKey(electionId)) {
            electionDataMap.put(electionId, ElectionData.aggregateFromJurisdictions(getPrecinctsAsJurisdictions(), electionId));
        }
        return electionDataMap.get(electionId);
    }

    private Set<IJurisdiction> getPrecinctsAsJurisdictions() {
        return getPrecincts().stream().map(p -> (IJurisdiction) p).collect(Collectors.toSet());
    }

    @Override
    public long getPopulation(DemographicGroup demographic) {
        if (demographic == null) {
            return populationMap.values().stream().reduce(0L, Long::sum);
        }
        return populationMap.getOrDefault(demographic, 0L);
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
                        .filter(other -> !other.equals(this))
                        .collect(Collectors.toSet())
                ));
        neighbors.forEach(d -> {
            Edge edge = new Edge(this, d);
            edges.add(edge);
            d.edges.add(edge);
        });
    }

    public JurisdictionDataDto dto(boolean includeObjFuncScores) {
        Map<DemographicGroup, Long> popMap = new HashMap<>();
        for (DemographicGroup dg : DemographicGroup.values()) {
            popMap.put(dg, getPopulation(dg));
        }
        List<ElectionId> electionIds = ImmutableList.of(
                new ElectionId(Year.Y2016, ElectionType.PRESIDENTIAL),
                new ElectionId(Year.Y2016, ElectionType.CONGRESSIONAL),
                new ElectionId(Year.Y2018, ElectionType.CONGRESSIONAL)
        );
        ImmutableMap.Builder<ElectionId, ElectionData> electionDataMapBuilder = new ImmutableMap.Builder<>();
        electionIds.forEach(eId -> electionDataMapBuilder.put(eId, this.getElectionData(eId)));

        if (includeObjFuncScores) {
            ImmutableMap.Builder<String, Map<String, Double>> objFuncResultsMapBuilder = new ImmutableMap.Builder<>();
            for (Measure m : Measure.values()) {
                ImmutableMap.Builder<String, Double> currentMeasureMapBuilder = new ImmutableMap.Builder<>();
                for (ElectionId election : electionIds) {
                    currentMeasureMapBuilder.put(election.toString(), m.calculateMeasure(this, election));
                }
                objFuncResultsMapBuilder.put(m.toString(), currentMeasureMapBuilder.build());
            }
            return new JurisdictionDataDto(this.districtId, new ArrayList<>(this.precincts.keySet()), popMap, electionDataMapBuilder.build(), objFuncResultsMapBuilder.build());
        }
        return new JurisdictionDataDto(this.districtId, new ArrayList<>(this.precincts.keySet()), popMap, electionDataMapBuilder.build(), null);

    }

    public Set<Edge> getMMEdges(Properties config) {
        return edges
                .stream()
                .filter(e -> e.wouldImproveMM(config))
                .collect(Collectors.toSet());
    }

    /**
     * This method does the following:
     * - add all precincts from other to this district.
     * - remove the edge between the districts from this district.
     * - replace the other district with this one in all of its edges
     * - add other's edges to this district
     * - remove the other district from the state
     * - set all edges county joinability to 0 if merged districts have a county joinability of 0
     *
     * @param other the district to absorb
     */
    public MergeResult merge(District other, int countyJoinability) {
        other.getPrecincts().forEach(this::addPrecinct);
        this.edges.remove(getEdge(other.getDistrictId()));
        for (Edge e : other.getEdges()) {
            e.replaceDistrict(other, this);
            if (e.d1 != e.d2) {
                this.edges.add(e);
            }
        }
        getState().removeDistrict(other, this);

        if (countyJoinability == 0) {
            this.getEdges().forEach(edge -> {
                edge.setCountyJoinability(0);
            });
        }

        return new MergeResult(this, other.getDistrictId());
    }

    public int numPrecincts() {
        return precincts.size();
    }

    public District clone() {
        return new District(this.districtId, this.state);
    }

    public void replaceDistrictInEdges(District other, District replacement) {
        edges.forEach(e -> e.replaceDistrict(other, replacement));
        edges.removeIf(e -> e.d1.equals(e.d2));
        edges.forEach(Edge::invalidateScoreCache);
    }

    public int getCountyJoinability() {
        return this.countyJoinability;
    }

    public void setCountyJoinability(int countyJoinability) {
        this.countyJoinability = countyJoinability;
    }
}
