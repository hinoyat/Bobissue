package com.c108.springproject.event.domain;

import com.c108.springproject.global.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "eventimage")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventImage extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long imageNo;

    @ManyToOne(fetch = FetchType.LAZY) // 이거 OneToOne 이랑 OneToMany 연결되어서 빨간 줄
    @JoinColumn(name = "event_no")
    @JsonIgnore
    private Event event;

    @Column(nullable = false, length = 255)
    private String originalName;

    @Column(nullable = false, length = 255)
    private String imageUrl;

}
