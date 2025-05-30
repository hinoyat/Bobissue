package com.c108.springproject.user.repository;

import com.c108.springproject.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    List<User> findByDelYn(String delYn);

    Optional<String> findStatusByUserNo(int userNo);

    Optional<User> findByEmailAndDelYnAndStatus(String email, String delYn, String status);

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.status = CASE WHEN u.status = 'Y' THEN 'N' ELSE 'Y' END WHERE u.userNo = :userNo")
    void changeUserStatus(int userNo);

    @Query("SELECT s.status FROM User s WHERE s.userNo = :userNo")
    String findUserStatus(int userNo);

}