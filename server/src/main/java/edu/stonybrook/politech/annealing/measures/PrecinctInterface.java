package edu.stonybrook.politech.annealing.measures;

import edu.sunysb.cs.patractic.datacracy.domain.models.ElectionId;

import java.util.Set;

public interface PrecinctInterface {
    String getPrecinctId();

    //Object getGeometry();

    String getOriginalDistrictID();

    Set<String> getNeighborIDs();

    int getPopulation();

    long getGOPVote(ElectionId electionId);

    long getDEMVote(ElectionId electionId);
}
