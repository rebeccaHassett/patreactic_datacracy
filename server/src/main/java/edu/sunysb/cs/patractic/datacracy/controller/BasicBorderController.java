package edu.sunysb.cs.patractic.datacracy.controller;

import org.apache.commons.io.IOUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileInputStream;
import java.nio.charset.StandardCharsets;


@RestController
public class BasicBorderController {
    @RequestMapping("/")
    public String home() {
        return "Spring boot is working!";
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping("/State_Borders")
    public String State_Borders(@RequestParam String name) {
        String fileName;
        if (name.equals("Rhode_Island")) {
            fileName = "src/main/resources/data/state_geographical_boundaries_data/Rhode_Island_State_Borders.json";
        } else if (name.equals("North_Carolina")) {
            fileName = "src/main/resources/data/state_geographical_boundaries_data/North_Carolina_State_Borders.json";
        } else {
            fileName = "src/main/resources/data/state_geographical_boundaries_data/Michigan_State_Borders.json";
        }
        try {
            FileInputStream fis = new FileInputStream(fileName);
            String data = IOUtils.toString(fis, StandardCharsets.UTF_8);
            return data;
        } catch (Exception exception) {
            System.out.println("Reading JSON file Exception: " + exception.getMessage());
        }
        return "";
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping("/District_Borders")
    public String District_Borders(@RequestParam String name) {
        String fileName;
        if (name.equals("Rhode_Island")) {
            fileName = "src/main/resources/data/district_geographical_data/Rhode_Island/Rhode_Island_U.S_Congressional_Districts_Geography.json";
        } else if (name.equals("Michigan")) {
            fileName = "src/main/resources/data/district_geographical_data/Michigan/Michigan_U.S._Congressional_Districts_v17a.geojson";
        } else {
            fileName = "src/main/resources/data/district_geographical_data/North_Carolina/North_Carolina_U.S_Congressional_Districts_Geography.json";
        }
        try {
            FileInputStream fis = new FileInputStream(fileName);
            String data = IOUtils.toString(fis, StandardCharsets.UTF_8);
            return data;
        } catch (Exception exception) {
            System.out.println("Reading JSON file Exception: " + exception.getMessage());
        }
        return "";
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping("/Precinct_Borders")
    public String Precinct_Borders(@RequestParam String name) {
        String fileName;
        if (name.equals("Rhode_Island")) {
            fileName = "src/main/resources/data/precinct_geographical_data/Rhode_Island/RI_Precincts.geojson";
        } else if (name.equals("Michigan")) {
            fileName = "src/main/resources/data/precinct_geographical_data/Michigan/MI_precincts.geojson";
        } else {
            fileName = "src/main/resources/data/precinct_geographical_data/North_Carolina/NC_VTD.geojson";
        }
        try {
            FileInputStream fis = new FileInputStream(fileName);
            String data = IOUtils.toString(fis, StandardCharsets.UTF_8);
            return data;
        } catch (Exception exception) {
            System.out.println("Reading JSON file Exception: " + exception.getMessage());
        }
        return "";
    }
}
