import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  StyledFlex,
  StatusBar,
  StatusButton,
  StatusWrapper,
  SortButton,
} from "../style";
import { ButtonGroup } from "@chakra-ui/react";
import { Flex, Box, Icon, Button } from "@chakra-ui/react";
import { InputGroup } from "../../../components/ui/input-group";
import { GenericTable } from "../../../components/ui/generic-table";
import view from "../../../assets/images/icon/view.png";
import no_img from "../../../assets/images/no_img.png";
import {
  LuSearch,
  LuChevronLeft,
  LuChevronRight,
  LuListFilter,
} from "react-icons/lu";
import { useOrganizers } from "../../../hooks/useOrganizer";

const ListOrganizer = () => {
  const { data = [], isLoading, isError } = useOrganizers();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("search") || ""
  );
  const statusOptions = [
    { label: "Tất cả", value: "4" },
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
  const initialStatusValue = searchParams.get("status") || "4";
  const initialStatusObj = statusOptions.find(
    (item) => item.value === initialStatusValue
  );
  const [selectedStatus, setSelectedStatus] = useState(initialStatusObj);
  const [selectedSort, setSelectedSort] = useState("date_desc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleViewClick = (maTaiKhoan) => {
    navigate(`/staff/list-organizer/${maTaiKhoan}`);
  };

  useEffect(() => {
    const params = {};
    if (searchText) params.search = searchText;
    if (selectedStatus?.value) params.status = selectedStatus.value;
    setSearchParams(params);
  }, [searchText, selectedStatus]);

  const filteredData = useMemo(() => {
    const removeDiacritics = (str) =>
      str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

    const selectedStatusValue = selectedStatus?.value ?? "4";

    return data
      .filter((org) => {
        const matchStatus =
          selectedStatusValue === "4"
            ? true
            : String(org.trangThaiDuyet) === selectedStatusValue;
        const matchSearch = searchText
          ? [
              org.tenCongTy,
              org.tenPhuongXa,
              org.tenQuanHuyen,
              org.tenTinhThanh,
            ].some((field) =>
              removeDiacritics(field)
                .toLowerCase()
                .includes(removeDiacritics(searchText.toLowerCase()))
            )
          : true;
        return matchStatus && matchSearch;
      })
      .sort((a, b) => {
        if (selectedSort === "name_asc")
          return a.tenCongTy.localeCompare(b.tenCongTy);
        if (selectedSort === "name_desc")
          return b.tenCongTy.localeCompare(a.tenCongTy);
        if (selectedSort === "date_asc")
          return new Date(a.ngayTao) - new Date(b.ngayTao);
        if (selectedSort === "date_desc")
          return new Date(b.ngayTao) - new Date(a.ngayTao);
        return 0;
      });
  }, [data, selectedStatus, searchText, selectedSort]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  const columns = [
    {
      header: "Tên công ty",
      accessor: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src={row.anhDaiDien ? row.anhDaiDien : no_img}
            alt={row.tenCongTy}
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <p style={{ margin: 0 }}>{row.tenCongTy}</p>
        </div>
      ),
    },
    {
      header: "Địa chỉ",
      accessor: (row) =>
        `${row.diaChiCongTy}, ${row.tenPhuongXa}, ${row.tenQuanHuyen}, ${row.tenTinhThanh}`,
    },
    { header: "Số điện thoại", accessor: "soDienThoai" },
    { header: "Email", accessor: "email" },
    {
      header: "Ngày tạo",
      accessor: (row) => {
        const date = new Date(row.ngayTao);
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
      header: "Trạng thái",
      accessor: (row) => {
        const statusMap = {
          0: { label: "Chờ duyệt", color: "#ffbb54" },
          1: { label: "Đã duyệt", color: "#43a047" },
          2: { label: "Không duyệt", color: "#626461" },
        };
        const status = statusMap[row.trangThaiDuyet] || {
          label: "Không xác định",
          color: "#000000",
        };
        return (
          <StatusWrapper
            style={{
              color: status.color,
              fontWeight: "600",
            }}
            className="org-status"
          >
            {status.label}
          </StatusWrapper>
        );
      },
    },
    {
      header: "Thao tác",
      accessor: (row) => (
        <Button
          onClick={() => handleViewClick(row.maTaiKhoan)}
          type="button"
          className="img-btn"
        >
          <img src={view} alt="view" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <StyledFlex gap={8}>
        <Flex className="title">
          <p>Duyệt thông tin công ty sự kiện</p>
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

          <Box
            style={{ border: "1px solid #ccc", borderRadius: "10px" }}
            p="12px"
          >
            <GenericTable columns={columns} data={paginatedData} />
          </Box>

          <Flex justifyContent="center" mt={4} gap={2}>
            <Button
              isDisabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <LuChevronLeft />
            </Button>

            <ButtonGroup isAttached variant="outline">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  variant={currentPage === i + 1 ? "solid" : "outline"}
                >
                  {i + 1}
                </Button>
              ))}
            </ButtonGroup>

            <Button
              isDisabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <LuChevronRight />
            </Button>
          </Flex>
        </Flex>
      </StyledFlex>
    </div>
  );
};

export default ListOrganizer;
