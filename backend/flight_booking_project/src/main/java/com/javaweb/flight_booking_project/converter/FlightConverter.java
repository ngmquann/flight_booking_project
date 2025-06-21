package com.javaweb.flight_booking_project.converter;


import com.javaweb.flight_booking_project.dto.response.FlightResponse;
import com.javaweb.flight_booking_project.dto.response.LuggageResponse;
import com.javaweb.flight_booking_project.dto.response.PlaneResponse;
import com.javaweb.flight_booking_project.dto.response.SeatResponse;
import com.javaweb.flight_booking_project.models.AirportEntity;
import com.javaweb.flight_booking_project.models.FlightEntity;
import com.javaweb.flight_booking_project.models.LuggageEntity;
import com.javaweb.flight_booking_project.models.SeatEntity;
import com.javaweb.flight_booking_project.repositories.LuggageRepository;
import com.javaweb.flight_booking_project.repositories.SeatRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class FlightConverter {
    @Autowired
    private PlaneConverter planeConverter;
    @Autowired
    private SeatConverter seatConverter;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private LuggageRepository luggageRepository;
    public FlightResponse toFlightResponse(FlightEntity flightEntity,boolean check) {
        FlightResponse flightResponse = modelMapper.map(flightEntity, FlightResponse.class);
        List<AirportEntity> airportEntityList = flightEntity.getAirportEntityList();
        for (AirportEntity airportEntity : airportEntityList) {
            if(airportEntity.getId() == flightEntity.getArrivalId()){
                flightResponse.setArrivalAirport(airportEntity.getName());
                flightResponse.setArrivalLocation(airportEntity.getLocation());
                flightResponse.setCodeArriAirport(airportEntity.getCode());
            }else{
                flightResponse.setDepartureAirport(airportEntity.getName());
                flightResponse.setDepartureLocation(airportEntity.getLocation());
                flightResponse.setCodeDepartAirport(airportEntity.getCode());
            }
        }
        PlaneResponse planeResponse = planeConverter.toPlaneResponse(flightEntity.getPlaneEntity());
        flightResponse.setPlane(planeResponse);
        if(check){
            List<SeatEntity> seatEntityList = flightEntity.getSeatEntityList();
            List<SeatResponse> seatResponseList = seatConverter.toSeatResponse(seatEntityList,flightEntity);
            flightResponse.setSeats(seatResponseList);
            int availableBus = 0;
            int availableEco = 0;
            for (SeatResponse seat : flightResponse.getSeats()) {
                if (seat.isAvailable()) {
                    if ("Business Class".equals(seat.getSeatClass())) {
                        availableBus++;
                    } else {
                        availableEco++;
                    }
                }
            }
            flightResponse.setAvailableBus(availableBus);
            flightResponse.setAvailableEco(availableEco);
            List<LuggageEntity> luggageEntities = luggageRepository.findAll();
            List<LuggageResponse> luggageResponses = new ArrayList<>();
            for (LuggageEntity luggageEntity : luggageEntities) {
                LuggageResponse luggageResponse = new LuggageResponse();
                luggageResponse.setId(luggageEntity.getId());
                luggageResponse.setLuggageType(luggageEntity.getLuggageType());
                luggageResponse.setWeight(luggageEntity.getWeight());
                luggageResponse.setPrice(luggageEntity.getPrice());
                luggageResponses.add(luggageResponse);
            }
            flightResponse.setLuggages(luggageResponses);
        }
        flightResponse.setTicketId(flightResponse.getTicketId());
        flightResponse.setAirline(flightEntity.getPlaneEntity().getAirlineEntity().getName());
        flightResponse.setStatus(flightEntity.getStatus());
        flightResponse.setLogoAirline(flightEntity.getPlaneEntity().getAirlineEntity().getLogo());
        return flightResponse;
    }
}
