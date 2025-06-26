import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  StyledFlex,
  StatusBar,
  StatusButton,
  StatusWrapper,
  SortButton,
} from "./style";
import { Flex, Box, Icon, Button } from "@chakra-ui/react";
import { InputGroup } from "../../../components/ui/input-group";
import { GenericTable } from "../../../components/ui/generic-table";
import { ComboBox } from "../../../components/ui/combobox";
import { CustomDateRangePicker } from "../../../components/ui/react_datepicker";
import { LuSearch, LuListFilter, LuClipboardPen, LuView } from "react-icons/lu";
import no_img from "../../../assets/images/no_img.png";
import { useAuth } from "../../../hooks/useAccount";
import { useEvents } from "../../../hooks/useEvent";
import { useCategoriesForSelect } from "../../../hooks/useCategory";

const OrganizerEvents = () => {
  const { accountId } = useAuth();
  const {
    data: companyEvents,
    isLoading: isLoadingEvent,
    isError: isErrorEvent,
    error: errorEvent,
  } = useEvents(accountId);
  const {
    data: rawCategories = [],
    isLoading: isLoadingCat,
    isError: isErrorCat,
    error: errorCat,
  } = useCategoriesForSelect();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("search") || ""
  );
  const categoryOptions = [
    { value: "all", label: "Tất cả danh mục" },
    ...rawCategories,
  ];
  const statusOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Chờ duyệt", value: "0" },
    { label: "Đã duyệt", value: "1" },
    { label: "Không duyệt", value: "2" },
  ];
  const sortOptions = [
    { label: "Tên A → Z", value: "name_asc" },
    { label: "Tên Z → A", value: "name_desc" },
    { label: "Cũ nhất → Mới nhất", value: "date_asc" },
    { label: "Mới nhất → Cũ nhất", value: "date_desc" },
  ];
  const initialStatusValue = searchParams.get("status") || "all";
  const initialStatusObj = statusOptions.find(
    (item) => item.value === initialStatusValue
  );
  const initialCategoryValue = searchParams.get("category") || "all";
  const initialCategoryObj = categoryOptions.find(
    (item) => item.value === initialCategoryValue
  );
  const [selectedStatus, setSelectedStatus] = useState(initialStatusObj);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryObj);
  const [selectedSort, setSelectedSort] = useState("date_desc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleComboBoxChange = (selectedItem) => {
    setSelectedCategory(selectedItem);
  };

  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const params = {};
    if (searchText) params.search = searchText;
    if (selectedStatus?.value) params.status = selectedStatus.value;
    if (selectedCategory?.value) params.category = selectedCategory.value;

    setSearchParams(params);
  }, [searchText, selectedStatus, selectedCategory]);

  const filteredData = useMemo(() => {
    const removeDiacritics = (str) =>
      str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

    const selectedStatusValue = selectedStatus?.value ?? "all";
    const selectedCategoryValue = selectedCategory?.value ?? "all";

    return companyEvents
      .filter((event) => {
        const matchStatus =
          selectedStatusValue === "all"
            ? true
            : String(event.trangThaiDuyet) === selectedStatusValue;

        const matchSearch = searchText
          ? [
              event.tenSuKien,
              event.diaDiemToChuc,
              event.tenCongTy,
              event.tenPhuongXa,
              event.tenQuanHuyen,
              event.tenTinhThanh,
            ].some((field) =>
              removeDiacritics(field)
                .toLowerCase()
                .includes(removeDiacritics(searchText.toLowerCase()))
            )
          : true;

        const matchCategory =
          selectedCategoryValue === "all"
            ? true
            : String(event.maDanhMuc) === selectedCategoryValue;
        return matchStatus && matchSearch && matchCategory;
      })
      .sort((a, b) => {
        if (selectedSort === "name_asc")
          return a.tenSuKien.localeCompare(b.tenSuKien);
        if (selectedSort === "name_desc")
          return b.tenSuKien.localeCompare(a.tenSuKien);
        if (selectedSort === "date_asc")
          return new Date(a.thoiGianBatDau) - new Date(b.thoiGianBatDau);
        if (selectedSort === "date_desc")
          return new Date(b.thoiGianBatDau) - new Date(a.thoiGianBatDau);
        return 0;
      });
  }, [
    companyEvents,
    selectedStatus,
    selectedCategory,
    searchText,
    selectedSort,
  ]);

  const columns = [
    {
      header: "Tên sự kiện",
      accessor: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src={row.anhBia ? row.anhBia : no_img}
            alt={row.tenSuKien}
            style={{
              width: "60px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <p style={{ margin: 0 }}>{row.tenSuKien}</p>
        </div>
      ),
    },
    {
      header: "Trạng thái duyệt",
      accessor: (row) => {
        const statusMap = {
          0: { label: "Chưa duyệt", color: "#ffbb54" },
          1: { label: "Đã duyệt", color: "#43a047" },
          2: { label: "Không duyệt", color: "#626461" },
        };
        const status = statusMap[row.trangThaiDuyet];

        return (
          <StatusWrapper
            style={{
              color: status.color,
              fontWeight: "600",
            }}
          >
            {status.label}
          </StatusWrapper>
        );
      },
    },
    {
      header: "Địa điểm",
      accessor: (row) => (
        <p>
          {row.diaDiemToChuc}, {row.soNhaDuong}, {row.tenPhuongXa},{" "}
          {row.tenQuanHuyen}, {row.tenTinhThanh}
        </p>
      ),
    },
    {
      header: "Thời gian tổ chức",
      accessor: (row) => {
        const date = new Date(row.thoiGianBatDau);
        return date.toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      header: "Thao tác",
      accessor: (row) => (
        <Flex gap={1}>
          <Button
            onClick={() =>
              navigate(`/organizer/my-events/${row.maSuKien}/edit`)
            }
            type="button"
            className="blue-outline-btn"
          >
            <LuClipboardPen style={{ height: "16px" }} />
          </Button>
          <Button
            onClick={() =>
              navigate(`/organizer/my-events/${row.maSuKien}/view`)
            }
            type="button"
            className="blue-outline-btn"
          >
            <LuView style={{ height: "16px" }} />
          </Button>
        </Flex>
      ),
    },
  ];

  if (isLoadingEvent || isLoadingCat) return <p>Đang tải...</p>;
  if (isErrorCat) return <p>Lỗi: {errorCat.message}</p>;
  if (isErrorEvent) return <p>Lỗi: {errorEvent.message}</p>;

  return (
    <div>
      <StyledFlex gap={8}>
        <Flex className="title">
          <p>Sự kiện của tôi</p>
        </Flex>

        <Flex className="content" flexDirection="column" gap={6}>
          <StatusBar>
            {statusOptions.map((status) => (
              <StatusButton
                key={status.value}
                onClick={() => setSelectedStatus(status)}
                isActive={selectedStatus?.value === status.value}
              >
                {status.label}
              </StatusButton>
            ))}
          </StatusBar>

          <Flex justifyContent="space-between">
            <InputGroup
              height="36px"
              borderRadius="12px"
              startElement={<Icon as={LuSearch} style={{ fontSize: "16px" }} />}
            >
              <input
                id="search-input"
                type="text"
                placeholder="Tìm kiếm..."
                value={searchText}
                onChange={handleSearchInputChange}
              />
            </InputGroup>

            <Flex gap={4}>
              <ComboBox
                width="200px"
                height="36px"
                borderRadius="12px"
                placeholder="Tất cả"
                items={categoryOptions}
                value={selectedCategory}
                onChange={handleComboBoxChange}
              />

              <CustomDateRangePicker height="36px" borderRadius="12px" />

              <SortButton position="relative">
                <button
                  className="sort-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <LuListFilter />
                </button>
                {isDropdownOpen && (
                  <Box className="sort-options" shadow="md">
                    {sortOptions.map((option) => (
                      <Flex key={option.value} w="100%" className="option">
                        <Button
                          onClick={() => {
                            setSelectedSort(option.value);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {option.label}
                        </Button>
                      </Flex>
                    ))}
                  </Box>
                )}
              </SortButton>
            </Flex>
          </Flex>

          <Box
            style={{ border: "1px solid #ccc", borderRadius: "10px" }}
            p="12px"
          >
            <GenericTable columns={columns} data={filteredData} />
          </Box>
        </Flex>
      </StyledFlex>
    </div>
  );
};

export default OrganizerEvents;
