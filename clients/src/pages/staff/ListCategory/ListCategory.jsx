import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  StyledFlex,
  CategoryForm,
  StatusBar,
  StatusButton,
  StatusWrapper,
} from "../style";
import { Flex, Box, Icon, Button, ButtonGroup } from "@chakra-ui/react";
import { InputGroup } from "../../../components/ui/input-group";
import { GenericTable } from "../../../components/ui/generic-table";
import {
  LuSearch,
  LuBan,
  LuChevronLeft,
  LuChevronRight,
  LuClipboardPen,
} from "react-icons/lu";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useUpdateCategoryStatus,
} from "../../../hooks/useCategory";

const ListCategory = () => {
  const { data = [], isLoading, isError } = useCategories();
  const { mutateAsync: createCategory } = useCreateCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const { mutateAsync: updateStatusCategory } = useUpdateCategoryStatus();
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isVerifyFormVisible, setIsVerifyFormVisible] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("search") || ""
  );
  const statusOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Chờ duyệt", value: "0" },
    { label: "Đã duyệt", value: "1" },
    { label: "Không duyệt", value: "2" },
  ];
  const initialStatusValue = searchParams.get("status") || "all";
  const initialStatusObj = statusOptions.find(
    (item) => item.value === initialStatusValue
  );
  const [selectedStatus, setSelectedStatus] = useState(initialStatusObj);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [formData, setFormData] = useState({
    maDanhMuc: "",
    tenDanhMuc: "",
    moTa: "",
    trangThai: "1",
    maCTySuKien: "",
  });

  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
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

    const selectedStatusValue = selectedStatus?.value ?? "all";

    return data.filter((cat) => {
      const matchStatus =
        selectedStatusValue === "all"
          ? true
          : String(cat.trangThai) === selectedStatusValue;

      const matchSearch = searchText
        ? [cat.tenDanhMuc, cat.moTa].some((field) =>
            removeDiacritics(field)
              .toLowerCase()
              .includes(removeDiacritics(searchText.toLowerCase()))
          )
        : true;
      return matchStatus && matchSearch;
    });
  }, [data, selectedStatus, searchText]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateFormClick = () => {
    setIsEditFormVisible(false);
    setIsVerifyFormVisible(false);

    setEditingCatId(null);
    setFormData({
      tenDanhMuc: "",
      moTa: "",
      trangThai: "1",
    });

    setIsCreateFormVisible(true);
  };

  const handleEditFormClick = (catId) => {
    const categorySelected = data.find((cat) => cat.maDanhMuc === catId);

    setIsEditFormVisible(false);
    setIsVerifyFormVisible(false);
    setIsCreateFormVisible(false);

    if (categorySelected) {
      setFormData({
        maDanhMuc: categorySelected.maDanhMuc,
        tenDanhMuc: categorySelected.tenDanhMuc,
        moTa: categorySelected.moTa || "",
      });

      if (categorySelected.trangThai === 1) {
        setEditingCatId(catId);
        setIsEditFormVisible(true);
      } else {
        setEditingCatId(catId);
        setIsVerifyFormVisible(true);
      }
    }

    window.scrollTo(0, 0);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory(formData);
      alert("Tạo danh mục thành công");
      setIsCreateFormVisible(false);
    } catch (error) {
      console.error("Lỗi khi tạo danh mục:", error);
      alert("Tạo danh mục thất bại");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCategory({ id: editingCatId, data: formData });
      alert("Cập nhật thành công");
      setIsEditFormVisible(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Cập nhật thất bại");
    }
  };

  const handleStatusChange = async (e, status) => {
    e.preventDefault();

    try {
      await updateStatusCategory({ id: editingCatId, status });
      setIsVerifyFormVisible(false);
      alert("Cập nhật trạng thái thành công");
    } catch (error) {
      alert("Cập nhật trạng thái thất bại");
    }
  };

  const columns = [
    { header: "Tên danh mục", accessor: "tenDanhMuc" },
    { header: "Mô tả", accessor: "moTa" },
    {
      header: "Trạng thái",
      accessor: (row) => {
        const statusMap = {
          0: { label: "Chờ duyệt", color: "#ffbb54" },
          1: { label: "Đã duyệt", color: "#43a047" },
          2: { label: "Không duyệt", color: "#626461" },
        };
        const status = statusMap[row.trangThai];
        return (
          <StatusWrapper
            style={{
              color: status.color,
              fontWeight: "600",
            }}
            className="cat-status"
          >
            {status.label}
          </StatusWrapper>
        );
      },
    },
    {
      header: "Công ty đề xuất",
      accessor: (row) => {
        return row.tenCongTy ? (
          row.tenCongTy
        ) : (
          <Flex justifyContent="center">
            <LuBan />
          </Flex>
        );
      },
    },
    {
      header: "Thao tác",
      accessor: (row) => (
        <Button
          onClick={() => handleEditFormClick(row.maDanhMuc)}
          type="button"
          className="blue-outline-btn"
          p={1}
        >
          <LuClipboardPen style={{ height: "16px" }} />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <StyledFlex gap={8}>
        <Flex justifyContent="space-between">
          <Flex className="title">
            <p>Duyệt thông tin sự kiện</p>
          </Flex>

          <Button className="blue-btn" onClick={handleCreateFormClick}>
            + Thêm danh mục
          </Button>
        </Flex>

        <Flex className="content" flexDirection="column">
          <Flex flexDirection="column">
            <CategoryForm isVisible={isCreateFormVisible}>
              <form className="category-form">
                <Flex
                  flexDirection="column"
                  justifyContent="space-around"
                  gap={6}
                >
                  <Flex flexDirection="column">
                    <label htmlFor="category">Tên danh mục</label>
                    <InputGroup>
                      <input
                        id="category"
                        name="tenDanhMuc"
                        type="text"
                        onChange={handleInputChange}
                      />
                    </InputGroup>
                  </Flex>

                  <Flex flexDirection="column">
                    <label htmlFor="description">Mô tả</label>
                    <InputGroup>
                      <input
                        id="description"
                        name="moTa"
                        type="text"
                        onChange={handleInputChange}
                      />
                    </InputGroup>
                  </Flex>

                  <Flex gap={6} justifyContent="center">
                    <Button
                      w="120px"
                      className="blue-btn"
                      onClick={handleCreateSubmit}
                    >
                      Lưu
                    </Button>

                    <Button
                      onClick={() =>
                        setIsCreateFormVisible(!isCreateFormVisible)
                      }
                      w="120px"
                      className="red-btn"
                    >
                      Hủy
                    </Button>
                  </Flex>
                </Flex>
              </form>
            </CategoryForm>

            <CategoryForm isVisible={isEditFormVisible}>
              <form className="category-form">
                <Flex
                  flexDirection="column"
                  justifyContent="space-around"
                  gap={6}
                >
                  <Flex flexDirection="column">
                    <label htmlFor="category">Tên danh mục</label>
                    <InputGroup>
                      <input
                        id="category"
                        name="tenDanhMuc"
                        type="text"
                        value={formData.tenDanhMuc}
                        onChange={handleInputChange}
                      />
                    </InputGroup>
                  </Flex>

                  <Flex flexDirection="column">
                    <label htmlFor="description">Mô tả</label>
                    <InputGroup>
                      <input
                        id="description"
                        name="moTa"
                        type="text"
                        value={formData.moTa}
                        onChange={handleInputChange}
                      />
                    </InputGroup>
                  </Flex>

                  <Flex gap={6} justifyContent="center">
                    <Button
                      w="120px"
                      className="blue-btn"
                      onClick={handleEditSubmit}
                    >
                      Lưu
                    </Button>

                    <Button
                      onClick={() => setIsEditFormVisible(!isEditFormVisible)}
                      w="120px"
                      className="red-btn"
                    >
                      Hủy
                    </Button>
                  </Flex>
                </Flex>
              </form>
            </CategoryForm>

            <CategoryForm isVisible={isVerifyFormVisible}>
              <form className="category-form">
                <Flex
                  flexDirection="column"
                  justifyContent="space-around"
                  gap={6}
                >
                  <Flex flexDirection="column">
                    <label htmlFor="category">Tên danh mục</label>
                    <InputGroup>
                      <input
                        id="category"
                        name="category"
                        type="text"
                        value={formData.tenDanhMuc}
                        readOnly
                      />
                    </InputGroup>
                  </Flex>

                  <Flex flexDirection="column">
                    <label htmlFor="description">Mô tả</label>
                    <InputGroup>
                      <input
                        id="description"
                        name="description"
                        type="text"
                        value={formData.moTa}
                        readOnly
                      />
                    </InputGroup>
                  </Flex>

                  <Flex gap={6} justifyContent="center">
                    <Button
                      w="120px"
                      className="blue-btn"
                      onClick={(e) => handleStatusChange(e, "1")}
                    >
                      Duyệt
                    </Button>

                    <Button
                      w="120px"
                      className="red-btn"
                      onClick={(e) => handleStatusChange(e, "2")}
                    >
                      Không duyệt
                    </Button>

                    <Button
                      onClick={() =>
                        setIsVerifyFormVisible(!isVerifyFormVisible)
                      }
                      w="120px"
                      className="red-btn"
                    >
                      Hủy
                    </Button>
                  </Flex>
                </Flex>
              </form>
            </CategoryForm>
          </Flex>

          <Flex flexDirection="column" gap={6}>
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
                startElement={
                  <Icon as={LuSearch} style={{ fontSize: "16px" }} />
                }
              >
                <input
                  id="search-input"
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchText}
                  onChange={handleSearchInputChange}
                />
              </InputGroup>
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
        </Flex>
      </StyledFlex>
    </div>
  );
};

export default ListCategory;
