import React, { useState } from "react";
import {
  StyledFlex,
  WrapperCategories,
  CatButton,
  WrapperEvents,
} from "./style";
import HeaderComponent from "../../../components/HeaderComponent/HeaderComponent";
import CardComponent from "../../../components/CardComponent/CardComponent";
import { Flex, WrapItem } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";
import { useCategories } from "../../../hooks/useCategory";

const SearchPage = () => {
  const {
    data: categories,
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
    error: errorCategory,
  } = useCategories();

  return (
    <div
      style={{
        paddingTop: "80px",
        background:
          "linear-gradient(0deg, #ffffff 93%, var(--token-9316698b-f2ef-4a1e-8616-6a3a01368917, rgb(191, 236, 255)) 100%)",
      }}
    >
      <HeaderComponent />
      <Flex
        className="content-wrap"
        flexDirection="column"
        gap={10}
        py="7.5em"
        paddingInline="max(1em, 10vw)"
      >
        <div className="search-title">
          <StyledFlex justifyContent="flex-start">
            <p>Trang chủ</p>
            <LuChevronRight />
            <p>Tìm kiếm</p>
            <LuChevronRight />
          </StyledFlex>
          <div>
            <p style={{ fontSize: "32px", fontWeight: "600" }}>
              Kết quả tìm kiếm:
              <span style={{ color: "#009FDA", marginLeft: "20px" }}>
                Anh trai
              </span>
            </p>
          </div>
        </div>

        {/* <Wrap gap="30px" justify="center">
          {Array.from({ length: 5 }).map((_, index) => (
            <WrapItem key={index}>
              <Center w="180px" h="80px" bg="red.muted">
                Box {index + 1}
              </Center>
            </WrapItem>
          ))}
        </Wrap> */}

        <Flex className="categories-btn" justifyContent="center">
          <Flex className="categories-btn" justifyContent="center">
            <WrapperCategories>
              {[{ maDanhMuc: "all", tenDanhMuc: "Tất cả" }, ...categories].map(
                (item) => (
                  <WrapItem key={item.maDanhMuc}>
                    <CatButton
                      onClick={() => handleToggleCategory(item.maDanhMuc)}
                      selected={selectedCategories.includes(item.maDanhMuc)}
                    >
                      <p>{item.tenDanhMuc}</p>
                      {selectedCategories.includes(item.maDanhMuc) && (
                        <span>
                          <LuX />
                        </span>
                      )}
                    </CatButton>
                  </WrapItem>
                )
              )}
            </WrapperCategories>
          </Flex>
        </Flex>

        <WrapperEvents className="events-list">
          {/* {events?.data?.map((event) => {
            return (
              <WrapItem>
                <CardComponent
                  key={event._id}
                  image={event.image}
                  name={event.name}
                  price={event.price}
                  address={event.address}
                  category={event.category}
                  date={event.date}
                  time={event.time}
                />
              </WrapItem>
            );
          })} */}
          <WrapItem style={{ width: "30%" }}>
            <CardComponent />
          </WrapItem>
          <WrapItem style={{ width: "30%" }}>
            <CardComponent />
          </WrapItem>
          <WrapItem style={{ width: "30%" }}>
            <CardComponent />
          </WrapItem>
          <WrapItem style={{ width: "30%" }}>
            <CardComponent />
          </WrapItem>
          <WrapItem style={{ width: "30%" }}>
            <CardComponent />
          </WrapItem>
          <WrapItem style={{ width: "30%" }}>
            <CardComponent />
          </WrapItem>
          <WrapItem style={{ width: "30%" }}>
            <CardComponent />
          </WrapItem>
          <WrapItem style={{ width: "30%" }}>
            <CardComponent />
          </WrapItem>
          <WrapItem style={{ width: "30%" }}>
            <CardComponent />
          </WrapItem>
        </WrapperEvents>
      </Flex>
    </div>
  );
};

export default SearchPage;
