package edu.sunysb.cs.patractic.datacracy;

import edu.sunysb.cs.patractic.datacracy.domain.models.State;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class StateDao {
    private Map<String, State> states;
    private Map<String, State> sessions;
    // TODO
    private State loadState(String stateName) {
        return null;
    }

    public State getBaseState(String stateName) {
        if (!states.containsKey(stateName)) {
            states.put(stateName, loadState(stateName));
        }

        return states.get(stateName).clone();
    }

    public State getSession(String sessionId) {
        return sessions.getOrDefault(sessionId, null);
    }

    public void setSession(String sessionId, State state) {
        sessions.put(sessionId, state);
    }

}
