package edu.sunysb.cs.patractic.datacracy.domain.enums;

/**
 * Defines the different types of constraint used in this project.
 */
public enum Constraint {
    /**
     * Graph compactness.
     */
    G_COMPACT,
    /**
     * Polsby-Popper compactness.
     */
    P_COMPACT,
    /**
     * Schwartzberg compactness.
     */
    S_COMPACT,
    /**
     * Political fairness: Efficiency gap.
     */
    EFF_GAP,
    /**
     * Political fairness: Lopsided margins.
     */
    LOP_MARG,
    /**
     * Political fairness: Mean-median difference.
     */
    MM_DIFF,
    /**
     * Percent difference in population between the most populous and least populous districts.
     */
    EQ_POP,
    /**
     * Percentage of a population that is of a specified demographic.
     */
    BLOC_POP_PERCENTAGE,
    /**
     * Percentage of votes in a bloc for the winning candidate.
     */
    BLOC_VOTING_PERCENTAGE,
    /**
     * Percentage of a population that is of a specified demographic.
     */
    MINORITY_PERCENTAGE

}
