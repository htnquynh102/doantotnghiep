import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  NavBar,
  NavButton,
  SortButton,
  StatusWrapper,
  PopUp,
  PopupContent,
  TitleWrapper,
} from "../style";
import { Flex, Box, Icon, Button, ButtonGroup } from "@chakra-ui/react";
import { InputGroup } from "../../../components/ui/input-group";
import { GenericTable } from "../../../components/ui/generic-table";
import { ComboBox } from "../../../components/ui/combobox";
import { CustomDateRangePicker } from "../../../components/ui/react_datepicker";
import {
  LuSearch,
  LuChevronLeft,
  LuChevronRight,
  LuListFilter,
  LuTrash2,
  LuClipboardPen,
} from "react-icons/lu";

import no_img from "../../../assets/images/no_img.png";
import { useAccounts, useUpdateAccountStatus } from "../../../hooks/useAccount";

const AccountManage = () => {
  const navigate = useNavigate();
  const { data: rawAccounts = [] } = useAccounts();
  const accounts = rawAccounts.filter((acc) => acc.trangThai !== -1);
  const { mutateAsync: updateStatus } = useUpdateAccountStatus();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [searchText, setSearchText] = useState(
    searchParams.get("search") || ""
  );
  const [dateRange, setDateRange] = useState([null, null]);
  const roleOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Người dùng", value: "VT000004" },
    { label: "Tổ chức sự kiện", value: "VT000003" },
    { label: "Nhân viên", value: "VT000002" },
  ];
  const statusOptions = [
    { label: "Tất cả trạng thái", value: "all" },
    { label: "Chưa kích hoạt", value: "0" },
    { label: "Đang hoạt động", value: "1" },
  ];
  const sortOptions = [
    { label: "Cũ nhất → Mới nhất", value: "date_asc" },
    { label: "Mới nhất → Cũ nhất", value: "date_desc" },
  ];
  const initialRoleValue = searchParams.get("role") || "all";
  const initialRoleObj = roleOptions.find(
    (item) => item.value === initialRoleValue
  );
  const initialStatusValue = searchParams.get("status") || "all";
  const initialStatusObj = statusOptions.find(
    (item) => item.value === initialStatusValue
  );
  const [selectedRole, setSelectedRole] = useState(initialRoleObj);
  const [selectedStatus, setSelectedStatus] = useState(initialStatusObj);
  const [selectedSort, setSelectedSort] = useState("date_desc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const handleStatusComboBoxChange = (selectedItem) => {
    setSelectedStatus(selectedItem);
  };

  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const params = {};
    if (searchText) params.search = searchText;
    if (selectedStatus?.value) params.status = selectedStatus.value;
    if (selectedRole?.value) params.role = selectedRole.value;

    setSearchParams(params);
    setCurrentPage(1);
  }, [selectedRole, searchText, selectedStatus]);

  const filteredData = useMemo(() => {
    const removeDiacritics = (str) =>
      str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
    const selectedRoleValue = selectedRole?.value ?? "all";
    const selectedStatusValue = selectedStatus?.value ?? "all";

    return accounts
      .filter((account) => {
        const matchRole =
          selectedRoleValue === "all"
            ? true
            : String(account.maVaiTro) === selectedRoleValue;

        const matchStatus =
          selectedStatusValue === "all"
            ? true
            : String(account.trangThai) === selectedStatusValue;

        const matchSearch = searchText
          ? [
              account.ten,
              account.email,
              account.maTaiKhoan,
              account.soDienThoai,
            ].some((field) =>
              removeDiacritics(field)
                .toLowerCase()
                .includes(removeDiacritics(searchText.toLowerCase()))
            )
          : true;
        return matchRole && matchSearch && matchStatus;
      })
      .sort((a, b) => {
        if (selectedSort === "date_asc")
          return new Date(a.ngayTao) - new Date(b.ngayTao);
        if (selectedSort === "date_desc")
          return new Date(b.ngayTao) - new Date(a.ngayTao);
        return 0;
      });
  }, [accounts, selectedRole, searchText, selectedStatus, selectedSort]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  const getVisiblePages = (currentPage, totalPages, maxVisible = 5) => {
    const pages = [];

    if (currentPage > 3) {
      pages.push(1);
      if (currentPage > 4) pages.push("...");
    }

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const handleEditClick = (account) => {
    if (account.maVaiTro === "VT000004") {
      navigate(`/admin/account-manage/user/${account.maTaiKhoan}`);
    } else if (account.maVaiTro === "VT000003") {
      navigate(`/admin/account-manage/org/${account.maTaiKhoan}`);
    } else if (account.maVaiTro === "VT000002") {
      navigate(`/admin/account-manage/staff/${account.maTaiKhoan}`);
    }
  };

  const columns = [
    { header: "Mã tài khoản", accessor: "maTaiKhoan" },
    { header: "Email", accessor: "email" },
    {
      header: "Tên người dùng/ tổ chức",
      accessor: (row) => (
        <Flex alignItems="center" gap={2}>
          <img
            src={row.anhDaiDien ? row.anhDaiDien : no_img}
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
          <p style={{ margin: 0 }}>{row.ten}</p>
        </Flex>
      ),
    },
    { header: "Số điện thoại", accessor: "soDienThoai" },
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
          0: { label: "Chưa kích hoạt", color: "#ffbb54" },
          1: { label: "Đang hoạt động", color: "#43a047" },
        };
        const status = statusMap[row?.trangThai];

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
      header: "Thao tác",
      accessor: (row) => (
        <Flex gap={1}>
          <Button
            onClick={() => handleEditClick(row)}
            type="button"
            className="blue-outline-btn"
            p={1}
          >
            <LuClipboardPen style={{ height: "16px" }} />
          </Button>

          <Button
            onClick={(e) => {
              e.preventDefault();
              setShowConfirm(true);
              setSelectedAccount(row.maTaiKhoan);
            }}
            type="button"
            className="red-btn"
            p={1}
          >
            <LuTrash2 style={{ height: "16px" }} />
          </Button>
        </Flex>
      ),
    },
  ];

  console.log("selected id", selectedAccount);

  return (
    <div>
      <Flex flexDirection="column">
        <TitleWrapper mb={8}>
          <p className="title">Quản lý tài khoản</p>

          <Button
            className="blue-btn"
            onClick={() => navigate(`/admin/account-manage/create`)}
          >
            Tạo tài khoản
          </Button>
        </TitleWrapper>

        <Flex className="content" flexDirection="column" gap={6}>
          <Flex justifyContent="space-between">
            <NavBar>
              {roleOptions.map((role) => (
                <NavButton
                  key={role.value}
                  onClick={() => setSelectedRole(role)}
                  isActive={selectedRole?.value === role.value}
                >
                  {role.label}
                </NavButton>
              ))}
            </NavBar>

            <Flex
              align="center"
              gap={2}
              color="#b62c41"
              cursor="pointer"
              onClick={() => navigate(`/admin/account-manage/deleted`)}
            >
              <LuTrash2 />
              <p>Tài khoản đã xóa</p>
            </Flex>
          </Flex>

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
                items={statusOptions}
                value={selectedStatus}
                onChange={handleStatusComboBoxChange}
              />

              <CustomDateRangePicker
                height="36px"
                borderRadius="12px"
                dateRange={dateRange}
                setDateRange={setDateRange}
              />

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
            <GenericTable columns={columns} data={paginatedData} />
          </Box>

          <Flex justifyContent="center" mt={4} gap={2}>
            <Button
              isDisabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              variant="outline"
            >
              <LuChevronLeft />
            </Button>

            <ButtonGroup isAttached variant="outline">
              {getVisiblePages(currentPage, totalPages).map((page, index) =>
                typeof page === "number" ? (
                  <Button
                    key={index}
                    onClick={() => setCurrentPage(page)}
                    variant={currentPage === page ? "solid" : "outline"}
                    bg={currentPage === page ? "#009fda" : "#fff"}
                  >
                    {page}
                  </Button>
                ) : (
                  <Button key={index} isDisabled>
                    ...
                  </Button>
                )
              )}
            </ButtonGroup>

            <Button
              isDisabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              variant="outline"
            >
              <LuChevronRight />
            </Button>
          </Flex>
        </Flex>

        {showConfirm && (
          <PopUp>
            <PopupContent>
              {!deleteSuccess ? (
                <>
                  <p>Bạn có chắc chắn muốn xóa tài khoản này?</p>
                  <Flex gap="10px" mt="20px" justifyContent="center">
                    <Button
                      onClick={async () => {
                        await updateStatus({ id: selectedAccount, status: -1 });
                        setDeleteSuccess(true);
                        setTimeout(() => {
                          setShowConfirm(false);
                          setDeleteSuccess(false);
                        }, 2000);
                      }}
                      className="blue-btn"
                    >
                      Xác nhận
                    </Button>
                    <Button
                      onClick={() => setShowConfirm(false)}
                      className="red-btn"
                    >
                      Huỷ
                    </Button>
                  </Flex>
                </>
              ) : (
                <p>Đã xóa tài khoản {selectedAccount}!</p>
              )}
            </PopupContent>
          </PopUp>
        )}
      </Flex>
    </div>
  );
};

export default AccountManage;
