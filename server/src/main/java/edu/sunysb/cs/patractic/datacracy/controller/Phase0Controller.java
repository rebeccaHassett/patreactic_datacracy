package edu.sunysb.cs.patractic.datacracy.controller;

import edu.sunysb.cs.patractic.datacracy.StateDao;
import edu.sunysb.cs.patractic.datacracy.domain.Algorithm;
import edu.sunysb.cs.patractic.datacracy.domain.models.RunPhase0Dto;
import edu.sunysb.cs.patractic.datacracy.domain.models.VotingBlockDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Set;

@Controller
public class Phase0Controller {

    private StateDao stateDao;

    @Autowired
    public Phase0Controller(StateDao stateDao) {
        this.stateDao = stateDao;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping(path = "/runPhase0")
    public Set<VotingBlockDTO> runPhase0(@RequestBody RunPhase0Dto phase0Dto) {
        return Algorithm.runPhase0(stateDao.getBaseState(phase0Dto.state), phase0Dto.demographic, phase0Dto.config);
    }
}
