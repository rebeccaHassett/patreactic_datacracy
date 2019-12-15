package edu.sunysb.cs.patractic.datacracy.controller;

import edu.sunysb.cs.patractic.datacracy.domain.Algorithm;
import edu.sunysb.cs.patractic.datacracy.domain.models.Phase2UpdateDto;
import edu.sunysb.cs.patractic.datacracy.domain.models.Properties;
import edu.sunysb.cs.patractic.datacracy.domain.models.RunPhase2Dto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
public class Phase2Controller extends HttpServlet {

    @Autowired
    public Phase2Controller() {
    }

    @PostMapping(path = "/phase2/start")
    public ResponseEntity<Void> startPhase2(HttpServletRequest request, @RequestBody RunPhase2Dto runPhase2Dto) {
        HttpSession httpSession = request.getSession(false);
        String id = (String) httpSession.getAttribute("sessionId");
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        Algorithm myAlg = Algorithm.getInstance(id);
        myAlg.setConfig(new Properties(myAlg.getConfig(), runPhase2Dto.weights));

        boolean res = myAlg.startPhase2();

        return res ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @GetMapping(path = "/phase2/poll")
    public ResponseEntity<Phase2UpdateDto> pollPhase2(HttpServletRequest request) {
        HttpSession httpSession = request.getSession(false);
        String id = (String) httpSession.getAttribute("sessionId");
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        Algorithm myAlg = Algorithm.getInstance(id);
        Phase2UpdateDto result = myAlg.getPhase2Update();

        return result == null ? ResponseEntity.badRequest().build() : ResponseEntity.ok(result);
    }

    @GetMapping(path = "/phase2/stop")
    public ResponseEntity<Phase2UpdateDto> stopPhase2(HttpServletRequest request) {
        HttpSession httpSession = request.getSession(false);
        String id = (String) httpSession.getAttribute("sessionId");
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        Algorithm myAlg = Algorithm.getInstance(id);

        myAlg.stopPhase2();
        Phase2UpdateDto result = myAlg.getPhase2Update();
        return result == null ? ResponseEntity.badRequest().build() : ResponseEntity.ok(result);
    }
}
