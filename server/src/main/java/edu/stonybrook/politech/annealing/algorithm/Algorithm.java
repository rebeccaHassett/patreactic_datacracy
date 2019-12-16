package edu.stonybrook.politech.annealing.algorithm;

import edu.stonybrook.politech.annealing.Move;
import edu.stonybrook.politech.annealing.measures.DistrictInterface;
import edu.stonybrook.politech.annealing.models.concrete.District;
import edu.stonybrook.politech.annealing.models.concrete.Precinct;
import edu.stonybrook.politech.annealing.models.concrete.State;
import edu.sunysb.cs.patractic.datacracy.domain.models.ElectionId;

import java.util.*;
import java.util.Map.Entry;

public class Algorithm {
    protected State state;
    protected ElectionId electionId;
    private HashMap<String, String> precinctDistrictMap; //precinctID --> districtID
    //calculates an aggregate measure score (double) for a given district
    private MeasureFunction<Precinct, District> districtScoreFunction;
    private HashMap<District, Double> currentScores;
    private District currentDistrict = null;

    public Algorithm(State state,
                     MeasureFunction<Precinct, District> districtScoreFunction,
                     ElectionId electionId) {
        this.state = state;
        this.electionId = electionId;
        this.precinctDistrictMap = new HashMap<String, String>();
        this.districtScoreFunction = districtScoreFunction;
        allocatePrecincts(state);
        updateScores();
    }

    public MeasureFunction<Precinct, District> getDistrictScoreFunction() {
        return districtScoreFunction;
    }

    public void setDistrictScoreFunction(MeasureFunction<Precinct, District> districtScoreFunction) {
        this.districtScoreFunction = districtScoreFunction;
    }

    // Determine the initial districts of precincts using a bfs
    // Very fast, but not ideal for compactness
    // Experimental - use a modified breadth first search
    public void allocatePrecinctsExp(State state) {
        HashSet<Precinct> unallocatedPrecincts = new HashSet<Precinct>();
        // Populate unallocated precincts
        for (District d : state.getDistricts()) {
            for (Precinct p : d.getPrecincts()) {
                unallocatedPrecincts.add(p);
            }
        }
        // Hash districts to numbers
        HashMap<Integer, DistrictInterface> myDistricts = new HashMap<>();
        int num_districts = 0;
        for (District d : state.getDistricts()) {
            myDistricts.put(num_districts, d);
            num_districts += 1;
        }
        // Strip out all precincts from each district
        for (District d : state.getDistricts()) {
            for (Precinct p : d.getPrecincts()) {
                d.removePrecinct(p);
            }
        }
        // Go through precincts in a BFS and just add them to the district corresponding to
        // (total_population / current_population) * num_districts
        // Whenever we run out, just grab a new district from the set.
        ArrayList<Precinct> ptp = new ArrayList<Precinct>();
        int curPop = 0;
        DistrictInterface prevDist = myDistricts.get(0);
        while (!unallocatedPrecincts.isEmpty()) {
            Precinct nextPrec = unallocatedPrecincts.iterator().next();
            unallocatedPrecincts.remove(nextPrec);
            ptp.add(nextPrec);
            while (!ptp.isEmpty()) {
                Precinct curPrec = ptp.get(0);
                curPop += curPrec.getPopulation();
                DistrictInterface curDist =
                        myDistricts.get((int) Math.ceil((curPop * 1.0) / state.getPopulation() * num_districts) - 1);
                // Add the current precinct to the current district
                System.out.println(ptp.size() + " " + unallocatedPrecincts.size());
                precinctDistrictMap.put(curPrec.getPrecinctId(), curDist.getDistrictId());

                ptp.remove(0);
                unallocatedPrecincts.remove(curPrec);
                curDist.addPrecinct(curPrec);
                // If we've moved on to a new district, discard our current queue
                if (prevDist != curDist) {
                    ptp = new ArrayList<Precinct>();
                    prevDist = curDist;
                }
                // Add any new connections
                for (String s : curPrec.getNeighborIDs()) {
                    Precinct n = state.getPrecinct(s);
                    if (unallocatedPrecincts.contains(n) && !ptp.contains(n)) {
                        ptp.add(n);
                    }
                }
            }
        }
    }

    // Determine the initial districts of precincts
    public void allocatePrecincts(State state) {
        for (Precinct p : state.getPrecinctSet()) {
            precinctDistrictMap.put(p.getPrecinctId(), p.getDistrict().getDistrictId());
        }
    }

    public String getPrecinctDistrictID(Precinct p) {
        return precinctDistrictMap.get(p.getPrecinctId());
    }

    public Move<Precinct, District> makeMove() {
        if (currentDistrict == null) {
            currentDistrict = getWorstDistrict();
        }
        District startDistrict = currentDistrict;
        Move m = getMoveFromDistrict(startDistrict);
        if (m == null) {
            return makeMove_secondary();
        }
        return m;
    }

    public Move getMoveFromDistrict(District startDistrict) {
        Set<Precinct> precincts = startDistrict.getBorderPrecincts();
        //Set<Precinct> precincts = startDistrict.getPrecincts();
        for (Precinct p : precincts) {
            Set<String> neighborIDs = p.getNeighborIDs();
            for (String n : neighborIDs) {
                if (startDistrict.getPrecinct(n) == null) {
                    District neighborDistrict = state.getDistrict(precinctDistrictMap.get(n));
                    //System.out.println("Start district: " + startDistrict.getID() + ", Neighbor District: " + neighborDistrict.getID() + ", Precinct: " + p.getID());
                    Move move = testMove(neighborDistrict, startDistrict, p);
                    if (move != null) {
                        System.out.println("Moving p to neighborDistrict(neighborID = " + n + ")");
                        currentDistrict = startDistrict;
                        return move;
                    }
                    move = testMove(startDistrict, neighborDistrict, neighborDistrict.getPrecinct(n));
                    if (move != null) {
                        System.out.println("Moving n to Start district: " + startDistrict.getDistrictId());
                        currentDistrict = startDistrict;
                        return move;
                    }
                }
            }
        }
        System.out.println("Move not found for district " + startDistrict.getDistrictId());
        return null;
    }

    // Returns the confirmed move if successful, otherwise returns null.
    private Move testMove(District to, District from, Precinct p) {
        Move m = new Move<>(to, from, p);
        double initial_score = currentScores.get(to) + currentScores.get(from);
        m.execute();
        if (!checkContiguity(p, from)) {
            m.undo();
            return null;
        }
        double to_score = rateDistrict(to);
        double from_score = rateDistrict(from);
        double final_score = (to_score + from_score);
        double change = final_score - initial_score;
        if (change <= 0) {
            m.undo();
            return null;
        }
        currentScores.put(to, to_score);
        currentScores.put(from, from_score);
        precinctDistrictMap.put(p.getPrecinctId(), to.getDistrictId());
        return m;
    }

    // Manually force a move. Return true if both parameters are valid.
    public Move<Precinct, District> manualMove(String precinct, String district) {
        District from = state.getDistrict(precinctDistrictMap.get(precinct));
        if (from == null) {
            return null;
        }
        Precinct p = from.getPrecinct(precinct);
        District to = state.getDistrict(district);
        if (to == null) {
            return null;
        }
        if (p == null) {
            return null;
        }
        Move<Precinct, District> m = new Move<>(to, from, p);
        double initial_score = currentScores.get(to) + currentScores.get(from);
        m.execute();
        double to_score = rateDistrict(to);
        double from_score = rateDistrict(from);
        currentScores.put(to, to_score);
        currentScores.put(from, from_score);
        precinctDistrictMap.put(p.getPrecinctId(), to.getDistrictId());
        return m;
    }

    public District getWorstDistrict() {
        District worstDistrict = null;
        double minScore = Double.POSITIVE_INFINITY;
        for (District d : state.getDistricts()) {
            double score = currentScores.get(d);
            if (score < minScore) {
                worstDistrict = d;
                minScore = score;
            }
        }
        return worstDistrict;
    }

    public Move<Precinct, District> makeMove_secondary() {
        List<District> districts = getWorstDistricts();
        //districts.remove(0);
        while (districts.size() > 0) {
            District startDistrict = districts.get(0);
            Move m = getMoveFromDistrict(startDistrict);
            if (m != null) {
                return m;
            }
            districts.remove(0);
        }
        return null;
    }

    // Returns a list of districts sorted from worst to best
    public List<District> getWorstDistricts() {
        List<Entry<District, Double>> list = new LinkedList<>(currentScores.entrySet());
        Collections.sort(list, new Comparator<Entry<District, Double>>() {
            @Override
            public int compare(Entry<District, Double> o1, Entry<District, Double> o2) {
                return o1.getValue().compareTo(o2.getValue());
            }
        });
        List<District> to_return = new ArrayList<District>();
        for (Entry<District, Double> entry : list)
            to_return.add(entry.getKey());
        return to_return;
    }

    public double calculateObjectiveFunction() {
        double score = 0;
        for (District d : state.getDistricts()) {
            score += currentScores.get(d);
        }
        return score;
    }

    public double rateDistrict(District d) {
        return districtScoreFunction.calculateMeasure(d, this.electionId);
    }

    public void updateScores() {
        currentScores = new HashMap<District, Double>();
        for (District d : state.getDistricts()) {
            // TODO = resovlve districtRating
            currentScores.put(d, rateDistrict(d));
        }
    }

    /**
     * Check contiguity for moving Precinct p out of District d
     *
     * @param p precinct to move
     * @param d district to move p out of
     * @return true if contiguous
     */
    private boolean checkContiguity(Precinct p, District d) {
        HashSet<Precinct> precinctsToCheck = new HashSet<Precinct>();
        HashSet<Precinct> neighborsToExplore = new HashSet<Precinct>(); // Potential sources of exploration
        HashSet<Precinct> exploredNeighbors = new HashSet<Precinct>(); // Neighbors already explored
        exploredNeighbors.add(p); // Add the precinct being moved, to ensure it won't be used.
        // If a neighbor is in the district that's losing a precinct, we need to make sure they're still contiguous
        for (String p_id : p.getNeighborIDs()) {
            // If neighbor is in the district we're moving p out of
            if ((precinctDistrictMap.get(p_id) != null) &&
                    (precinctDistrictMap.get(p_id)).equals(d.getDistrictId())) {
                Precinct neighbor = d.getPrecinct(p_id);
                precinctsToCheck.add(neighbor);
            }
        }
        // If there are no same - district neighbors for the node, return false.
        if (precinctsToCheck.size() == 0) {
            return false;
        }
        // Add an arbitrary same - district neighbor to the sources of exploration
        Precinct initialPrecinctToCheck = precinctsToCheck.iterator().next();
        neighborsToExplore.add(initialPrecinctToCheck);
        //we can remove the initial precinct to check since we're assuming it to be in our search tree
        precinctsToCheck.remove(initialPrecinctToCheck);
        // While we still need IDs and still have neighbors to explore
        while (neighborsToExplore.size() != 0) {
            // Take an arbitrary precinct from the sources of exploration
            Precinct precinctToExplore = neighborsToExplore.iterator().next();
            for (String p_id : precinctToExplore.getNeighborIDs()) {
                // We only care about neighbors in our district, d.
                if (precinctDistrictMap.get(p_id).equals(d.getDistrictId())) {
                    Precinct neighbor = d.getPrecinct(p_id);
                    // If we've hit one of our needed precincts, check it off.
                    if (precinctsToCheck.contains(neighbor)) {
                        precinctsToCheck.remove(neighbor);
                        if (precinctsToCheck.size() == 0) {
                            return true;
                        }
                    }
                    // Add any neighbors in same district to neighborsToExplore if not in exploredNeighbors
                    if (!exploredNeighbors.contains(neighbor)) {
                        //if its a border precinct we need to check it otherwise we DONT
                        //EXCEPT -- we didn't actually execute the move at this point
                        if (d.getBorderPrecincts().contains(neighbor)) {
                            neighborsToExplore.add(neighbor);
                        } else {
                            exploredNeighbors.add(neighbor);
                        }
                    }
                }
            }
            // Check this precinct off
            exploredNeighbors.add(precinctToExplore);
            neighborsToExplore.remove(precinctToExplore);
        }
        return (precinctsToCheck.size() == 0);
    }


}