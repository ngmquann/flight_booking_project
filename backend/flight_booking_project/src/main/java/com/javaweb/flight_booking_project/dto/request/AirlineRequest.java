package com.javaweb.flight_booking_project.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class AirlineRequest {
    private Long id;
    @NotEmpty(message = "Name cannot empty")
    private String airlineName;

    private String logo;
}
