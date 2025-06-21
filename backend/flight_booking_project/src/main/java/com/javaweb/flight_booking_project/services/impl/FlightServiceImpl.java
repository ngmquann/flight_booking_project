package com.javaweb.flight_booking_project.services.impl;

import com.javaweb.flight_booking_project.converter.FlightConverter;
import com.javaweb.flight_booking_project.dto.AirportDto;
import com.javaweb.flight_booking_project.dto.FlightDto;
import com.javaweb.flight_booking_project.dto.request.FlightRequest;
import com.javaweb.flight_booking_project.dto.response.*;
import com.javaweb.flight_booking_project.models.*;
import com.javaweb.flight_booking_project.repositories.*;
import com.javaweb.flight_booking_project.services.AirportService;
import com.javaweb.flight_booking_project.services.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

@Service
public class FlightServiceImpl implements FlightService {
    @Autowired
    private PlaneRepository planeRepository;
    @Autowired
    private FlightRepository flightRepository;
    @Autowired
    private FlightConverter flightConverter;
    @Autowired
    private AirportRepository airportRepository;
    @Autowired
    private SeatRepository seatRepository;
    @Autowired
    private LuggageRepository luggageRepository;
    @Override
    public void createFlight(FlightDto flightDto) throws Exception {
        PlaneEntity planeEntity = planeRepository.findById(flightDto.getPlaneId())
                .orElseThrow(() -> new RuntimeException("Plane not found"));

        List<AirportEntity> airportEntityList = new ArrayList<>();
        List<AirportDto> airportDtoList = flightDto.getAirportDtoList();

        if (airportDtoList != null) {
            for (AirportDto airportDto : airportDtoList) {
                AirportEntity airportEntity = airportRepository.findById(airportDto.getId()).orElseThrow(() -> new RuntimeException("Airport not found"));
                airportEntityList.add(airportEntity);
            }
        }

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
        try {
            Date departureTime = formatter.parse(flightDto.getDepartureTime());
            Date arrivalTime = formatter.parse(flightDto.getArrivalTime());

            FlightEntity flightEntity = FlightEntity.builder()
                    .id(flightDto.getId())
                    .departureTime(departureTime)
                    .arrivalTime(arrivalTime)
                    .code(flightDto.getCode())
                    .departureId(flightDto.getDepartureId())
                    .arrivalId(flightDto.getArrivalId())
                    .planeEntity(planeEntity)
                    .busPrice(flightDto.getBusPrice())
                    .ecoPrice(flightDto.getEcoPrice())
                    .airportEntityList(airportEntityList)
                    .status(true)
                    .build();
            flightRepository.save(flightEntity);

            int ecoClass = flightEntity.getPlaneEntity().getEcoClass();
            int busClass = flightEntity.getPlaneEntity().getBusClass();

            int seatCounter = 0;
            for (int i = 0; seatCounter < busClass; i++) {
                for (char c = 'A'; c <= 'C'; c++) {
                    if (seatCounter >= busClass) break;
                    SeatEntity seatEntity = new SeatEntity();
                    seatEntity.setSeatClass("Business Class");
                    seatEntity.setSeatNumber(c + String.valueOf(i + 1));
                    seatEntity.setFlightEntity(flightEntity);
                    seatRepository.save(seatEntity);
                    seatCounter++;
                }
            }

            seatCounter = 0;
            for (int i = 0; seatCounter < ecoClass; i++) {
                for (char c = 'A'; c <= 'I'; c++) {
                    if (seatCounter >= ecoClass) break;
                    SeatEntity seatEntity = new SeatEntity();
                    seatEntity.setSeatClass("Economy Class");
                    seatEntity.setSeatNumber(c + String.valueOf(i + 1));
                    seatEntity.setFlightEntity(flightEntity);
                    seatRepository.save(seatEntity);
                    seatCounter++;
                }
            }


        } catch (ParseException e) {
            throw new RuntimeException("Error parsing date: " + e.getMessage());
        }
    }

    @Override
    public FlightResponse getDetailFlight(Long id) throws Exception {
        FlightEntity flightEntity = flightRepository.findById(id).orElseThrow(() -> new Exception("Flight not found !"));
        FlightResponse  flightResponse = flightConverter.toFlightResponse(flightEntity,true);
        return flightResponse;
    }


    @Override
    public List<FlightResponse> searchFlights(FlightRequest flightRequest) throws Exception {
        try{
            if(flightRequest.getArrivalAirport().equals(flightRequest.getDepartureAirport())){
                throw new Exception("Departure airport and arrival airport cannot be the same");
            }
            List<FlightResponse> flightResponseList = new ArrayList<>();

            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
            Date departureTime = formatter.parse(flightRequest.getDepartureTime());

            List<FlightEntity> flightEntityList = flightRepository.searchFlight(flightRequest.getDepartureAirport(), flightRequest.getArrivalAirport(), departureTime, flightRequest.getSeatClass());
            flightEntityList.forEach((flightEntity) -> {
                FlightResponse flightResponse = flightConverter.toFlightResponse(flightEntity,true);
                flightResponseList.add(flightResponse);
            });
            return flightResponseList;
        } catch (ParseException e) {
            throw new RuntimeException("Error parsing date: " + e.getMessage());
        } catch (Exception ex){
            throw new RuntimeException("Error searching flights: " + ex.getMessage());
        }
    }

    @Override
    public List<FlightResponse> getAllFlightsByUser() throws Exception {
        List<FlightResponse> flightResponseList = new ArrayList<>();
        List<FlightEntity> flightEntityList = flightRepository.findAllByStatus(true);
        flightEntityList.forEach((flightEntity) -> {
            FlightResponse flightResponse = flightConverter.toFlightResponse(flightEntity,false);
            flightResponseList.add(flightResponse);
        });
        return flightResponseList;
    }

    @Override
    public List<FlightResponse> getAllFlightsByAdmin() throws Exception {
        List<FlightResponse> flightResponseList = new ArrayList<>();
        List<FlightEntity> flightEntityList = flightRepository.findAll();
        flightEntityList.forEach((flightEntity) -> {
            FlightResponse flightResponse = flightConverter.toFlightResponse(flightEntity,false);
            flightResponseList.add(flightResponse);
        });
        return flightResponseList;
    }

    @Override
    public void setStatusFlight(Long id) throws Exception {
        FlightEntity flightEntity = flightRepository.findById(id).orElseThrow(() -> new Exception("Flight not found !"));
        flightEntity.setStatus(!flightEntity.getStatus());
        flightRepository.save(flightEntity);
    }

    @Override
    public List<FlightResponse> getAllFlightByCode(String code) {
        List<FlightResponse> flightResponseList = new ArrayList<>();
        List<FlightEntity> flightEntityList = flightRepository.findByCodeContainingIgnoreCase(code);
        flightEntityList.forEach((flightEntity) -> {
            FlightResponse flightResponse = flightConverter.toFlightResponse(flightEntity,false);
            flightResponseList.add(flightResponse);
        });
        return flightResponseList;
    }

    @Override
    public InfoBookingResponse getInfoFlight(String flightId, String seatClass) {
        List<SeatEntity> seatEntities = seatRepository.findByFlightId(Long.parseLong(flightId), seatClass);
        List<LuggageEntity> luggageEntities = luggageRepository.findAll();

        List<SeatResponse> seatResponses = new ArrayList<>();
        for (SeatEntity seatEntity : seatEntities) {
            SeatResponse seatResponse = new SeatResponse();
            seatResponse.setId(seatEntity.getId());
            seatResponse.setSeatNumber(seatEntity.getSeatNumber());
            seatResponse.setSeatClass(seatEntity.getSeatClass());
            seatResponse.setPrice(seatClass.equals("Business Class") ? seatEntity.getFlightEntity().getBusPrice() : seatEntity.getFlightEntity().getEcoPrice());
            seatResponse.setAvailable(seatEntity.isAvailable());
            seatResponses.add(seatResponse);
        }

        List<LuggageResponse> luggageResponses = new ArrayList<>();
        for (LuggageEntity luggageEntity : luggageEntities) {
            LuggageResponse luggageResponse = new LuggageResponse();
            luggageResponse.setId(luggageEntity.getId());
            luggageResponse.setLuggageType(luggageEntity.getLuggageType());
            luggageResponse.setWeight(luggageEntity.getWeight());
            luggageResponse.setPrice(luggageEntity.getPrice());
            luggageResponses.add(luggageResponse);
        }
        InfoBookingResponse infoBookingResponse = new InfoBookingResponse();
        infoBookingResponse.setSeatList(seatResponses);
        infoBookingResponse.setLuggageList(luggageResponses);
        return infoBookingResponse;
    }

}