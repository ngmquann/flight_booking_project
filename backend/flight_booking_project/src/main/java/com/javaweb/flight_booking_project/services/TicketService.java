package com.javaweb.flight_booking_project.services;

import com.javaweb.flight_booking_project.dto.response.TicketBookedInfo;
import com.javaweb.flight_booking_project.dto.response.TicketBookedInfoAdmin;

import java.util.List;

public interface TicketService {
    List<TicketBookedInfo>  getBookedTicketInfo(Long id) throws  Exception;
    TicketBookedInfoAdmin getTicketBookedById(Long id);
    TicketBookedInfo getDetailTicketById(Long id);
}
