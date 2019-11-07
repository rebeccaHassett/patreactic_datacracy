package edu.sunysb.cs.patractic.datacracy.domain.interfaces;

import edu.sunysb.cs.patractic.datacracy.domain.enums.DemographicGroup;
import edu.sunysb.cs.patractic.datacracy.domain.models.ElectionData;

public interface IJurisdiction {
    /**
     * Gets the populated ElectionData object for this jurisdiction.
     * @return populated ElectionData object.
     */
    ElectionData getElectionData();

    /**
     * Gets the number of people in a given demographic or the total number of people.
     * @param demographic The demographic to return the population for, or null for total.
     * @return number of people of the given demographic in this jurisdiction.
     */
    long getPopulation(DemographicGroup demographic);
}
