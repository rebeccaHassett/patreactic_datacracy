package edu.sunysb.cs.patractic.datacracy.domain.persistence;

import edu.stonybrook.politech.annealing.models.concrete.State;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Service
@Scope(scopeName = "singleton")
public class StateDao {
    private Map<String, State> states;

    public StateDao() {
        states = new HashMap<>();
    }


    // TODO

    public void saveState(State state) {
        Transaction transaction = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            // start a transaction
            transaction = session.beginTransaction();
            // save the student object
            session.saveOrUpdate(state);
            // commit transaction
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }


    private State loadState(String stateName) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            return session.createNamedQuery("State_findByName",
                    State.class).setParameter("NAME", stateName).getResultList().get(0);
        }
    }

    public synchronized State getBaseState(String stateName) {
        if (!states.containsKey(stateName)) {
            states.put(stateName, loadState(stateName));
        }
        return states.get(stateName);
    }

    @PostConstruct
    public void preloadStates() {
        getBaseState("RhodeIsland");
//        getBaseState("Michigan");
//        getBaseState("NorthCarolina");
    }
}