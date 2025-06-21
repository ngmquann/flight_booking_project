package com.javaweb.flight_booking_project.services;

import com.javaweb.flight_booking_project.dto.request.ProfileRequest;
import com.javaweb.flight_booking_project.dto.request.SignUpRequest;
import com.javaweb.flight_booking_project.dto.response.JwtAuthenticationResponse;
import com.javaweb.flight_booking_project.dto.response.UserResponse;
import com.javaweb.flight_booking_project.models.UserEntity;

public interface AuthService {
    boolean checkLogin(String email, String password)throws Exception;
    void signup(SignUpRequest signUpRequest) throws Exception;
    JwtAuthenticationResponse login(String email );
    UserResponse getProfile();
    boolean updateProfile(ProfileRequest profileRequest);
    boolean updatePassword(String oldPassword, String newPassword);
}
