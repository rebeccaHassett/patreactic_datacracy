package edu.sunysb.cs.patractic.datacracy;

import edu.stonybrook.politech.annealing.models.concrete.State;
import edu.sunysb.cs.patractic.datacracy.domain.persistence.HibernateUtil;
import edu.sunysb.cs.patractic.datacracy.domain.persistence.StateDao;
import org.hibernate.Session;

public class App {
    public static void main(String[] args) {
        //StateDao stateDao = new StateDao();

        //By using cascade=all option the address need not be saved explicitly when the
        // student object is persisted the address will be automatically saved.

        Session session = HibernateUtil.getSessionFactory().openSession();

        //session.save(address);
        //State ri = stateDao.getBaseState("RhodeIsland");
        //System.out.println("RI laws: " + ri.getLaws());
        //stateDao.saveState(state);
    }
}