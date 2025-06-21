package com.javaweb.flight_booking_project.repositories;

import com.javaweb.flight_booking_project.dto.response.MonthlyRevenueResponse;
import com.javaweb.flight_booking_project.models.RevenueEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RevenueRepository extends JpaRepository<RevenueEntity,Long> {
    List<RevenueEntity> findAllByDate(LocalDate date);
    Optional<RevenueEntity> findByDate(LocalDate date);
    @Query("SELECT r FROM RevenueEntity r WHERE YEAR(r.date) = :year ORDER BY r.date ASC")
    List<RevenueEntity> findAllByYear(@Param("year") int year);

    // Lấy tổng doanh thu theo tháng trong năm
    @Query("SELECT new com.javaweb.flight_booking_project.dto.response.MonthlyRevenueResponse(" +
            "MONTH(r.date), " +
            "SUM(r.totalRevenue)) " +
            "FROM RevenueEntity r " +
            "WHERE YEAR(r.date) = :year " +
            "GROUP BY MONTH(r.date) " +
            "ORDER BY MONTH(r.date)")
    List<MonthlyRevenueResponse> getMonthlyRevenueByYear(@Param("year") int year);
}
