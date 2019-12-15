package edu.sunysb.cs.patractic.datacracy.controller;

import edu.stonybrook.politech.annealing.models.concrete.District;
import edu.stonybrook.politech.annealing.models.concrete.State;
import edu.sunysb.cs.patractic.datacracy.domain.Algorithm;
import edu.sunysb.cs.patractic.datacracy.domain.models.JurisdictionDataDto;
import edu.sunysb.cs.patractic.datacracy.domain.models.MajMinDistrictDto;
import edu.sunysb.cs.patractic.datacracy.domain.models.Phase1UpdateDto;
import edu.sunysb.cs.patractic.datacracy.domain.models.RunPhase1Dto;
import edu.sunysb.cs.patractic.datacracy.domain.persistence.StateDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class Phase1Controller extends HttpServlet {
    private final StateDao stateDao;

    @Autowired
    public Phase1Controller(StateDao stateDao) {
        this.stateDao = stateDao;
    }

    @PostMapping(path = "/phase1/start")
    public Phase1UpdateDto startPhase1(HttpServletRequest request, HttpServletResponse response, @RequestBody RunPhase1Dto runPhase1Dto) {
        State copy = stateDao.getBaseState(runPhase1Dto.stateName).clone();
        String myAlgId = Algorithm.createInstance(copy, runPhase1Dto.config);
        HttpSession httpSession = request.getSession();
        httpSession.setAttribute("sessionId", myAlgId);
        System.out.println((String) httpSession.getAttribute("sessionId"));
        Algorithm myAlg = Algorithm.getInstance(myAlgId);
        List<String> oldDistricts = stateDao.getBaseState(runPhase1Dto.stateName).getDistricts()
                .stream()
                .map(District::getDistrictId)
                .collect(Collectors.toList());
        List<JurisdictionDataDto> newDistricts;
        if (runPhase1Dto.config.incremental) {
            newDistricts = myAlg.start();
        } else {
            newDistricts = myAlg.startAsync();
        }
        System.out.println(myAlg.getConfig().selectedMinorities);
        List<MajMinDistrictDto> majMinDistrictDtos = myAlg.getMajMinDistricts(myAlg.getConfig());
        System.out.println(majMinDistrictDtos);
        return new Phase1UpdateDto(newDistricts, oldDistricts, majMinDistrictDtos);
    }

    @GetMapping(path = "/phase1/poll")
    public ResponseEntity<Phase1UpdateDto> pollPhase1(HttpServletRequest request, HttpServletResponse response) {
        HttpSession httpSession = request.getSession(false);
        String id = (String) httpSession.getAttribute("sessionId");
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        Algorithm myAlg = Algorithm.getInstance(id);
        if (myAlg.getConfig().incremental) {
            myAlg.runStep();
        }
        return ResponseEntity.ok(myAlg.getPhase1Update());
    }
}
