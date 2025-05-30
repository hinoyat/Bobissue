package com.c108.springproject.item.dto.response;

import com.c108.springproject.item.domain.Item;
import com.c108.springproject.seller.domain.Company;
import lombok.*;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemUpdateResDto {
    private int itemNo;
    private ItemCategoryResDto category;
    private List<ImageDto> images;
    private Company companyNo;
    private String name;
    private int price;
    private int salePrice;
    private String createdAt;
    private String createdUser;
    private String updatedAt;
    private String updatedUser;
    private String expiredAt;
    private String description;
    private int stock;
    private String delYn;

    public static ItemUpdateResDto toDto(Item item) {
        return ItemUpdateResDto.builder()
                .itemNo(item.getItemNo())
                .category(ItemCategoryResDto.builder()
                        .categoryNo(item.getCategory().getCategoryNo())
                        .name(item.getCategory().getName())
                        .parentNo(item.getCategory().getParent() != null ?
                                item.getCategory().getParent().getCategoryNo() : null)
                        .parentName(item.getCategory().getParent() != null ?
                                item.getCategory().getParent().getName() : null)
                        .createdAt(item.getCategory().getCreatedAt())
                        .updatedAt(item.getCategory().getUpdatedAt())
                        .build())
                .images(item.getImages().stream()
                        .map(image -> ImageDto.toDto(image))
                        .collect(Collectors.toList()))
                .companyNo(item.getCompany())
                .name(item.getName())
                .price(item.getPrice())
                .salePrice(item.getSalePrice())
                .createdAt(item.getCreatedAt())
                .createdUser(item.getCreatedUser())
                .updatedAt(item.getUpdatedAt())
                .updatedUser(item.getUpdatedUser())
                .expiredAt(item.getExpiredAt())
                .description(item.getDescription())
                .stock(item.getStock())
                .delYn(item.getDelYn())
                .build();
    }
}