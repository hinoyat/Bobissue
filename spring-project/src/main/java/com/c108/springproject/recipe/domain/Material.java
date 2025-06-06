package com.c108.springproject.recipe.domain;

import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.item.domain.Item;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor; // 데이터베이스 테이블에 매핑
import lombok.Builder;
import lombok.Getter; // 모든 필드에 getter 메서드 생성
import lombok.NoArgsConstructor; // 기본 생성자 생성

import java.math.BigInteger;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int materialNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_no", nullable = false)
    @JsonIgnore
    private Recipe recipe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_no", nullable = false)
    @JsonIgnore
    private Item item;

    @Column(nullable = false)
    private int cnt;

    public void update(Item item, int cnt) {
        this.item = item;
        this.cnt = cnt;
    }
}
