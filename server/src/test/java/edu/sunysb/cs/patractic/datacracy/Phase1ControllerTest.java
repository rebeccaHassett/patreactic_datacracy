package edu.sunysb.cs.patractic.datacracy;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import edu.sunysb.cs.patractic.datacracy.controller.Phase1Controller;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc //need this in Spring Boot test

public class Phase1ControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private MockMvc mvc;

    @Test
    public void greetingShouldReturnDefaultMessage() throws Exception {

        mvc.perform(MockMvcRequestBuilders.get("http://127.0.0.1:8080/phase1/poll")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

}
