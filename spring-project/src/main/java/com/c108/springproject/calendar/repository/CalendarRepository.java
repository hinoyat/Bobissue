package com.c108.springproject.calendar.repository;

import com.c108.springproject.calendar.domain.Calendar;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Integer> {
    @Query("SELECT c FROM Calendar c WHERE c.user.userNo = :userNo AND c.delYn='N' AND SUBSTRING(c.eatDate, 1, 6) = :eatDate")
    List<Calendar> findMealsByMonth(@Param("userNo") int userNo,
                                    @Param("eatDate") String eatDate);

    @Query("SELECT c FROM Calendar c WHERE c.user.userNo = :userNo AND SUBSTRING(c.eatDate, 1, 8) = :eatDate AND c.delYn = 'N'")
    List<Calendar> findMealsByDay(@Param("userNo") int userNo, @Param("eatDate") String eatDate);

    Optional<Calendar> findByCalendarNo(long calendarNo);
}
