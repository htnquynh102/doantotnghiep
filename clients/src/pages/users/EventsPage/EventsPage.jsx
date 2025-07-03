import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  StyledFlex,
  WrapperCategories,
  CatButton,
  WrapperEvents,
} from "./style";
import HeaderComponent from "../../../components/HeaderComponent/HeaderComponent";
import FooterComponent from "../../../components/FooterComponent/FooterComponent";
import CardComponent from "../../../components/CardComponent/CardComponent";
import { InputGroup } from "../../../components/ui/input-group";
import { Flex, WrapItem, Icon } from "@chakra-ui/react";
import { LuChevronRight, LuX, LuRotateCcw, LuSearch } from "react-icons/lu";
import { useCategories } from "../../../hooks/useCategory";
import { useEvents } from "../../../hooks/useEvent";
import { CustomDateRangePicker } from "../../../components/ui/react_datepicker";

const EventsPage = () => {
  const {
    data: categories,
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
    error: errorCategory,
  } = useCategories();

  const {
    data: events,
    isLoading: isLoadingEvent,
    isError: isErrorEvent,
    error: errorEvent,
  } = useEvents(null, true);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const selectedCategories = searchParams.getAll("cate") || ["all"];
  const [dateRange, setDateRange] = useState([
    searchParams.get("from") || null,
    searchParams.get("to") || null,
  ]);

  useEffect(() => {
    document.title =
      "DanangEvent - Nền tảng bán vé sự kiện chính thức tại Đà Nẵng";
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }

    if (dateRange[0]) {
      params.set("from", new Date(dateRange[0]).toISOString().split("T")[0]);
    } else {
      params.delete("from");
    }

    if (dateRange[1]) {
      params.set("to", new Date(dateRange[1]).toISOString().split("T")[0]);
    } else {
      params.delete("to");
    }

    navigate(`?${params.toString()}`);
  }, [query, dateRange]);

  const filteredEvents = events
    ? events.filter((event) => {
        const eventDate = new Date(event.thoiGianBatDau);

        const matchCategory =
          selectedCategories.includes("all") ||
          selectedCategories.includes(event.maDanhMuc);

        const matchDate =
          (!dateRange[0] || eventDate >= new Date(dateRange[0])) &&
          (!dateRange[1] || eventDate <= new Date(dateRange[1]));

        const normalizeText = (str) =>
          (str || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "")
            .toLowerCase();

        const normalizedQuery = normalizeText(query);
        const matchQuery = !query
          ? true
          : [event.tenSuKien, event.diaDiemToChuc].some((field) =>
              normalizeText(field).includes(normalizedQuery)
            );

        return matchCategory && matchDate && matchQuery;
      })
    : [];

  const handleToggleCategory = (categoryId) => {
    let newSelected;

    if (categoryId === "all") {
      newSelected = ["all"];
    } else {
      newSelected = selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories.filter((id) => id !== "all"), categoryId];
    }

    if (newSelected.length === 0) {
      newSelected = ["all"];
    }

    const params = new URLSearchParams();
    newSelected.forEach((id) => params.append("cate", id));

    if (dateRange[0])
      params.set("from", new Date(dateRange[0]).toISOString().split("T")[0]);
    if (dateRange[1])
      params.set("to", new Date(dateRange[1]).toISOString().split("T")[0]);

    navigate(`?${params.toString()}`);
  };

  if (isLoadingCategory || isLoadingEvent) return <p>Đang tải...</p>;
  if (isErrorCategory) return <p>Lỗi: {errorCategory.message}</p>;
  if (isErrorEvent) return <p>Lỗi: {errorEvent.message}</p>;

  return (
    <div
      style={{
        paddingTop: "80px",
        background:
          "linear-gradient(0deg, #ffffff 10%, rgb(191, 236, 255) 100%)",
        backgroundSize: `100% 200px`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <HeaderComponent />
      <Flex
        className="content-wrap"
        flexDirection="column"
        gap={10}
        py="5.5em"
        paddingInline="max(1em, 10vw)"
      >
        <div className="search-title">
          <StyledFlex justifyContent="flex-start">
            <p>Trang chủ</p>
            <LuChevronRight />
            <p>Sự kiện</p>
            <LuChevronRight />
          </StyledFlex>
        </div>

        <Flex justifyContent="center">
          <InputGroup
            style={{ width: "40%" }}
            startElement={
              <Icon
                as={LuSearch}
                style={{ fontSize: "16px", color: "#009fda" }}
              />
            }
          >
            <input
              id="search-input"
              type="text"
              placeholder="Tìm kiếm..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
        </Flex>

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

        <Flex gap={2}>
          <CustomDateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          <button onClick={() => setDateRange([null, null])}>
            <LuRotateCcw />
          </button>
        </Flex>

        <WrapperEvents className="events-list">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <WrapItem key={event.maSuKien}>
                <CardComponent {...event} />
              </WrapItem>
            ))
          ) : (
            <p>Không tìm thấy sự kiện nào phù hợp.</p>
          )}
        </WrapperEvents>
      </Flex>
      <FooterComponent />
    </div>
  );
};

export default EventsPage;
