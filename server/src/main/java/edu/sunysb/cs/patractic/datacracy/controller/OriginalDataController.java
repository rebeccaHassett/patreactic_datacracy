package edu.sunysb.cs.patractic.datacracy.controller;

import edu.stonybrook.politech.annealing.models.concrete.District;
import edu.sunysb.cs.patractic.datacracy.domain.models.JurisdictionDataDto;
import edu.sunysb.cs.patractic.datacracy.domain.persistence.StateDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class OriginalDataController {
    private final StateDao stateDao;

    @Autowired
    public OriginalDataController(StateDao stateDao) {
        this.stateDao = stateDao;
    }

    @GetMapping(path = "/district/original/{state}/{district}")
    public JurisdictionDataDto getOriginalDistrictData(@PathVariable("state") String stateName,
                                                       @PathVariable("district") String districtId) {
        return stateDao.getBaseState(stateName).getDistrict(districtId).dto(true);
    }

    @GetMapping(path = "/district/original/{state}")
    public List<String> getDistrictList(@PathVariable("state") String stateName) {
        return stateDao.getBaseState(stateName).getDistricts().stream()
                .map(District::getDistrictId)
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/state/original/{state}")
    public JurisdictionDataDto getOriginalStateData(@PathVariable("state") String stateName) {
        return stateDao.getBaseState(stateName).dto();
    }
}
