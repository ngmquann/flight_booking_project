package com.javaweb.flight_booking_project;

import com.javaweb.flight_booking_project.configuration.JWTHelper;
import io.jsonwebtoken.security.Keys;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.crypto.SecretKey;
import java.util.Base64;

@SpringBootApplication
public class FlightBookingProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlightBookingProjectApplication.class, args);
    }

}
