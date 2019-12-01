package edu.sunysb.cs.patractic.datacracy.controller;

import edu.stonybrook.politech.annealing.models.concrete.District;
import edu.stonybrook.politech.annealing.models.concrete.State;
import edu.sunysb.cs.patractic.datacracy.domain.Algorithm;
import edu.sunysb.cs.patractic.datacracy.domain.models.DistrictDataDto;
import edu.sunysb.cs.patractic.datacracy.domain.models.Phase1UpdateDto;
import edu.sunysb.cs.patractic.datacracy.domain.models.RunPhase1Dto;
import edu.sunysb.cs.patractic.datacracy.domain.persistence.StateDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class Phase1Controller {
    private final StateDao stateDao;

    @Autowired
    public Phase1Controller(StateDao stateDao) {
        this.stateDao = stateDao;
    }

    @PostMapping(path = "/phase1/start")
    public Phase1UpdateDto startPhase1(@Autowired HttpSession httpSession, @RequestBody RunPhase1Dto runPhase1Dto) {
        State copy = stateDao.getBaseState(runPhase1Dto.stateName).clone();
        String myAlgId = Algorithm.createInstance(copy, runPhase1Dto.config);
        httpSession.setAttribute("sessionId", myAlgId);
        Algorithm myAlg = Algorithm.getInstance(myAlgId);
        myAlg.startIncremental();
        List<String> oldDistricts = stateDao.getBaseState(runPhase1Dto.stateName).getDistricts()
                .stream()
                .map(District::getDistrictId)
                .collect(Collectors.toList());
        List<DistrictDataDto> newDistricts = copy.getDistricts().stream()
                .map(d -> d.dto(runPhase1Dto.config.electionId))
                .collect(Collectors.toList());
        return new Phase1UpdateDto(newDistricts, oldDistricts);
    }
}
