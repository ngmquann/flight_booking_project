package com.javaweb.flight_booking_project.configuration;

import com.javaweb.flight_booking_project.enums.RoleType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class CustomFilterSecurity {
    @Autowired
    private CustomJWTFilter customJWTFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests( auth->{
                    auth
                            .requestMatchers("/api/auth/**", "/api/payment/booking").permitAll()
                            .requestMatchers("/api/home").permitAll()
                            //.hasAuthority(RoleType.ADMIN.name())
                            .requestMatchers(HttpMethod.GET,"/api/airport").permitAll()
                            .requestMatchers(HttpMethod.POST,"/api/airport/create").hasAuthority(RoleType.ADMIN.name())
                            .requestMatchers(HttpMethod.GET,"/api/airport/detail/**").permitAll()
                            .requestMatchers(HttpMethod.DELETE,"/api/airport/delete/**").hasAuthority(RoleType.ADMIN.name())
                            // plane
                            .requestMatchers(HttpMethod.GET,"/api/admin/plane").hasAuthority(RoleType.ADMIN.name())
                            .requestMatchers(HttpMethod.DELETE,"/api/admin/plane/**").hasAuthority(RoleType.ADMIN.name())
                            //airline
                            .requestMatchers(HttpMethod.GET,"/api/admin/airline").hasAuthority(RoleType.ADMIN.name())
                            //booking
                            .requestMatchers("/api/ticket/by-user").hasAnyAuthority(RoleType.USER.name())
                            .requestMatchers("/api/ticket/**").hasAnyAuthority(RoleType.USER.name())
                            .requestMatchers("/api/ticket/detail/**").hasAnyAuthority(RoleType.ADMIN.name())
                            .requestMatchers("/api/payment/create_payment_vnpay").hasAnyAuthority(RoleType.USER.name(), RoleType.ADMIN.name())
                            //flight
                            .requestMatchers("/api/flight/get-info-flight/**").hasAnyAuthority(RoleType.USER.name(), RoleType.ADMIN.name())
                            .requestMatchers("/api/flight/by-admin").hasAuthority(RoleType.ADMIN.name())
                            .requestMatchers("/api/flight/by-user").permitAll()
                            .requestMatchers("/api/flight/status/**").hasAuthority(RoleType.ADMIN.name())
                            .requestMatchers("/api/flight/detail/**").permitAll()
                            .requestMatchers(HttpMethod.GET,"/api/flight/search").hasAuthority(RoleType.ADMIN.name())
                            .requestMatchers("/api/flight/search").permitAll()
                            .requestMatchers(HttpMethod.POST,"/api/flight/create").hasAuthority(RoleType.ADMIN.name())
                            .requestMatchers("/api/admin/**").hasAuthority(RoleType.ADMIN.name())
                            .requestMatchers("/api/user/**").hasAnyAuthority(RoleType.USER.name())
                            //revenue
                            .requestMatchers("/api/admin/revenue/today").hasAnyAuthority(RoleType.ADMIN.name())
                            .requestMatchers("/api/admin/revenue/yearly/**").hasAnyAuthority(RoleType.ADMIN.name())
                            .requestMatchers("/api/admin/revenue/dashboard").hasAnyAuthority(RoleType.ADMIN.name())
                            .anyRequest().authenticated();
                })
                .sessionManagement(session  -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(customJWTFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
