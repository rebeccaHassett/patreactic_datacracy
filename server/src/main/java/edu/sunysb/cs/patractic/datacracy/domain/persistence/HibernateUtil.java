package edu.sunysb.cs.patractic.datacracy.domain.persistence;


import edu.stonybrook.politech.annealing.models.concrete.Precinct;
import edu.stonybrook.politech.annealing.models.concrete.State;
import edu.sunysb.cs.patractic.datacracy.domain.models.ElectionData;
import edu.sunysb.cs.patractic.datacracy.domain.models.ElectionId;
import edu.sunysb.cs.patractic.datacracy.domain.models.Incumbent;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.cfg.Environment;
import org.hibernate.service.ServiceRegistry;

import java.util.Properties;

public class HibernateUtil {
    private static SessionFactory sessionFactory;

    public static SessionFactory getSessionFactory() {
        if (sessionFactory == null) {
            try {
                Configuration configuration = new Configuration();
                // Hibernate settings equivalent to hibernate.cfg.xml's properties
                Properties settings = new Properties();
                settings.put(Environment.DRIVER, "com.mysql.cj.jdbc.Driver");
                settings.put(Environment.URL, "jdbc:mysql://mysql4.cs.stonybrook.edu:3306/patreactic_datacracy");
                settings.put(Environment.USER, "patreactic_datacracy");
                settings.put(Environment.PASS, "changeit");
                settings.put(Environment.DIALECT, "org.hibernate.dialect.MySQL5Dialect");
                settings.put(Environment.SHOW_SQL, "false");
                settings.put(Environment.LOG_JDBC_WARNINGS, "true");
                settings.put(Environment.CURRENT_SESSION_CONTEXT_CLASS, "thread");


                // Configure how the schema should be created
                settings.put(Environment.HBM2DDL_AUTO, "none");

                configuration.setProperties(settings);
                configuration.setProperty("hibernate.temp.use_jdbc_metadata_defaults", "false");

                configuration.addAnnotatedClass(ElectionId.class);
                configuration.addAnnotatedClass(ElectionData.class);
                configuration.addAnnotatedClass(Precinct.class);
                configuration.addAnnotatedClass(Incumbent.class);
                configuration.addAnnotatedClass(State.class);
                ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                        .applySettings(configuration.getProperties()).build();
                sessionFactory = configuration.buildSessionFactory(serviceRegistry);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return sessionFactory;
    }
}