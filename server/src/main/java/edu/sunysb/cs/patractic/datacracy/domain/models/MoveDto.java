package edu.sunysb.cs.patractic.datacracy.domain.models;

import edu.stonybrook.politech.annealing.Move;
import edu.stonybrook.politech.annealing.models.concrete.District;
import edu.stonybrook.politech.annealing.models.concrete.Precinct;

public class MoveDto {
    public final String toDistrict;
    public final String fromDistrict;
    public final String precinct;

    public MoveDto(String toDistrict, String fromDistrict, String precinct) {
        this.toDistrict = toDistrict;
        this.fromDistrict = fromDistrict;
        this.precinct = precinct;
    }

    public static MoveDto from(Move<Precinct, District> move) {
        return new MoveDto(move.getTo().getDistrictId(), move.getFrom().getDistrictId(), move.getPrecinct().getPrecinctId());
    }
}
