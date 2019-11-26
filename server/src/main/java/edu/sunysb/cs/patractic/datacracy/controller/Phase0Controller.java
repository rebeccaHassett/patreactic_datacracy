package edu.sunysb.cs.patractic.datacracy.controller;

import edu.sunysb.cs.patractic.datacracy.domain.Algorithm;
import edu.sunysb.cs.patractic.datacracy.domain.models.Incumbent;
import edu.sunysb.cs.patractic.datacracy.domain.models.RunPhase0Dto;
import edu.sunysb.cs.patractic.datacracy.domain.models.VotingBlockDTO;
import edu.sunysb.cs.patractic.datacracy.domain.persistence.StateDao;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

@RestController
public class Phase0Controller {

    private StateDao stateDao;

    @Autowired
    public Phase0Controller(StateDao stateDao) {
        this.stateDao = stateDao;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping(path = "/runPhase0", produces = "application/json")
    public List<VotingBlockDTO> runPhase0(@RequestBody RunPhase0Dto phase0Dto) {
        return Algorithm.runPhase0(stateDao.getBaseState(phase0Dto.state), phase0Dto.config);
    }

    @GetMapping(path = "/laws/{state}", produces = "application/json")
    public JSONObject getLaws(@PathVariable("state") String stateName) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("laws", stateDao.getBaseState(stateName).getLaws());
        return jsonObject;
    }

    @GetMapping(path = "/incumbent/{state}", produces = "application/json")
    public Collection<Incumbent> getIncumbents(@PathVariable("state") String stateName) {
        return stateDao.getBaseState(stateName).getIncumbents().values();
    }
}
