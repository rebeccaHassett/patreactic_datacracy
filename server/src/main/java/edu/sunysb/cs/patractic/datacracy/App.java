package edu.sunysb.cs.patractic.datacracy;

import edu.stonybrook.politech.annealing.models.concrete.State;
import edu.sunysb.cs.patractic.datacracy.hibernate_util.HibernateUtil;
import org.hibernate.Session;

public class App {
    public static void main(String[] args) {
        StateDao stateDao = new StateDao();

        //By using cascade=all option the address need not be saved explicitly when the
        // student object is persisted the address will be automatically saved.

        //session.save(address);
        Session session = HibernateUtil.getSessionFactory().openSession();
        //State state = new State("Rhode Island", null, "");
        //stateDao.saveState(state);
    }
}