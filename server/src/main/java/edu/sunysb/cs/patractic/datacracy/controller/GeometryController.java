package edu.sunysb.cs.patractic.datacracy.controller;

import edu.sunysb.cs.patractic.datacracy.domain.persistence.StateDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class GeometryController {

    private final StateDao stateDao;

    @Autowired
    public GeometryController(StateDao stateDao) {
        this.stateDao = stateDao;
    }

    @RequestMapping("/borders/state/{state}")
    public String stateBorders(@PathVariable("state") String stateName) {
        return stateDao.getBaseState(stateName).getStateBoundaries();
    }

    @RequestMapping("/borders/district/{state}/{district}")
    public String districtBorders(@PathVariable("state") String stateName, @PathVariable("district") String districtId) {
        return stateDao.getBaseState(stateName).getOriginalDistrictBorders(districtId);
    }

    @RequestMapping("/borders/precinct/{state}/{precinct}")
    public String precinctBorders(@PathVariable("state") String stateName, @PathVariable("precinct") String precinctId) {
        return stateDao.getBaseState(stateName).getPrecinct(precinctId).getGeometryJSON();
    }
}
