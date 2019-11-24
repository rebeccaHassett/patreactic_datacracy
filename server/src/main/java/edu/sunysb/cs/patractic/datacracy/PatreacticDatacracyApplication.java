package edu.sunysb.cs.patractic.datacracy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(WebConfig.class)
public class PatreacticDatacracyApplication {

    public static void main(String[] args) {
        SpringApplication.run(PatreacticDatacracyApplication.class, args);
    }

}
