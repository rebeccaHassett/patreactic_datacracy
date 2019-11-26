package edu.sunysb.cs.patractic.datacracy;

import edu.stonybrook.politech.annealing.models.concrete.State;
import edu.sunysb.cs.patractic.datacracy.hibernate_util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class StateDao {
    private Map<String, State> states;
    private Map<String, State> sessions;
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

    public State getBaseState(String stateName) {
        if (!states.containsKey(stateName)) {
            states.put(stateName, loadState(stateName));
        }
        return states.get(stateName);
    }
}