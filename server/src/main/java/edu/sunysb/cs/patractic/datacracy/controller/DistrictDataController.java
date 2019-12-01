package edu.sunysb.cs.patractic.datacracy.controller;

import edu.sunysb.cs.patractic.datacracy.domain.models.DistrictDataDto;
import edu.sunysb.cs.patractic.datacracy.domain.models.ElectionId;
import edu.sunysb.cs.patractic.datacracy.domain.persistence.StateDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class DistrictDataController {
    private final StateDao stateDao;

    @Autowired
    public DistrictDataController(StateDao stateDao) {
        this.stateDao = stateDao;
    }

    @GetMapping(path = "/district/original/{state}/{district}")
    public DistrictDataDto getOriginalDistrictData(@PathVariable("state") String stateName,
                                                   @PathVariable("district") String districtId,
                                                   @RequestParam("year") int year,
                                                   @RequestParam("type") String type) {
        return stateDao.getBaseState(stateName).getDistrict(districtId).dto(new ElectionId(year, type));
    }


}
