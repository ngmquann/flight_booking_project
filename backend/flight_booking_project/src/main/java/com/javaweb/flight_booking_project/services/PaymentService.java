package com.javaweb.flight_booking_project.services;

import com.javaweb.flight_booking_project.dto.request.TicketBookingRequest;
import com.javaweb.flight_booking_project.dto.request.TicketRequest;
import com.javaweb.flight_booking_project.dto.response.InfoBookingResponse;

public interface PaymentService {
    String createPayment(TicketRequest ticketRequest) throws Exception;
    void bookTicket(TicketBookingRequest ticketRequest, Long id, Float vnp_Amount) throws  Exception;
}
