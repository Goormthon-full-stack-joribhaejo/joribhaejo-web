package com.example.joribhaejospring.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByReceiverIdOrderByCreatedAtDesc(Integer userId);

    List<Message> findBySenderIdOrderByCreatedAtDesc(Integer userId);
}
