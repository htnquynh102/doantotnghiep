import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StyledFlex, PopUp, PopupContent } from "./style";
import { Flex, Box, Grid, GridItem, Button } from "@chakra-ui/react";
import { InputGroup } from "../../../components/ui/input-group";
import { ComboBox } from "../../../components/ui/combobox";
import { AddressSelector } from "../../../components/ui/select-address";
import { FileUploadSection } from "../../../components/ui/file-upload";
import { ImageUpload } from "../../../components/ui/image-upload";
import TiptapEditor from "../../../components/ui/text-editor";
import white from "../../../assets/images/white.png";
import edit from "../../../assets/images/icon/edit.png";
import trash from "../../../assets/images/icon/trash.png";
import {
  LuCircle,
  LuCircleCheck,
  LuX,
  LuCheck,
  LuArrowRight,
  LuArrowLeft,
} from "react-icons/lu";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../hooks/useAccount";
import { useOrganizerById } from "../../../hooks/useOrganizer";
import { useCategoriesForSelect } from "../../../hooks/useCategory";
import { useCreateCategory } from "../../../hooks/useCategory";
import { useCreateEvent } from "../../../hooks/useEvent";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { accountId } = useAuth();
  const { data: org, isLoading, isError, error } = useOrganizerById(accountId);
  const { data: categoryOptions } = useCategoriesForSelect();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [visitedSteps, setVisitedSteps] = useState([1]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAnnounce, setShowAnnounce] = useState(false);
  const [announceType, setAnnounceType] = useState(null);
  const [addCategoryFrom, setAddCategoryFrom] = useState(false);
  const [catFormData, setCatFormData] = useState({
    tenDanhMuc: "",
    moTa: "",
    trangThai: "0",
    maCTySuKien: org.maCTySuKien,
  });
  const [formData, setFormData] = useState({
    anhBia: white,
    tenSuKien: "",
    maDanhMuc: null,
    thoiGianMoBanVe: "",
    thoiGianNgungBanVe: "",
    diaDiemToChuc: "",
    soNhaDuong: "",
    maPhuongXa: null,
    moTa: "",
    trangThaiDuyet: "0",
    soVeMuaToiDa: "",
    minhChung: [],
    chuongTrinh: [],
  });
  const [openedBoxIndex, setOpenedBoxIndex] = useState(null);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [currentProgramIndex, setCurrentProgramIndex] = useState(0);

  const steps = [
    { number: 1, label: "Thông tin sự kiện" },
    { number: 2, label: "Thông tin vé" },
  ];

  useEffect(() => {
    if (org?.trangThaiDuyet !== undefined) {
      if (org.trangThaiDuyet === 1) {
        setAnnounceType("A");
      } else if (
        org.trangThaiDuyet === null ||
        org.trangThaiDuyet === 0 ||
        org.trangThaiDuyet === 2
      ) {
        setAnnounceType("B");
      }
      setShowAnnounce(true);
    }
  }, [org]);

  const canProceed = () => {
    if (step === 1)
      return (
        !!formData.tenSuKien &&
        !!formData.maDanhMuc &&
        !!formData.minhChung &&
        !!formData.diaDiemToChuc &&
        !!formData.maPhuongXa &&
        !!formData.moTa &&
        !!formData.anhBia
      );
    if (step === 2) {
      if (!formData.chuongTrinh || !Array.isArray(formData.chuongTrinh))
        return false;

      const isValidProgram = (program) =>
        program.thoiGianBatDau &&
        program.thoiGianKetThuc &&
        program.loaiVe.length > 0;

      const allchuongTrinh = formData.chuongTrinh;

      for (let i = 0; i < allchuongTrinh.length; i++) {
        const p = allchuongTrinh[i];
        const hasAnyData =
          p.thoiGianBatDau || p.thoiGianKetThuc || p.loaiVe?.length > 0;

        if (hasAnyData && !isValidProgram(p)) return false;
      }

      const hasAtLeastOneValidProgram = allchuongTrinh.some(isValidProgram);
      if (!hasAtLeastOneValidProgram) return false;

      return !!formData.soVeMuaToiDa;
    }
  };

  const handleFilesChange = (selectedFiles) => {
    setFormData((prev) => ({
      ...prev,
      minhChung: selectedFiles,
    }));
  };

  const validateTime = (updatedData) => {
    const {
      thoiGianBatDau,
      thoiGianKetThuc,
      thoiGianMoBanVe,
      thoiGianNgungBanVe,
      chuongTrinh,
    } = updatedData;

    chuongTrinh.forEach((program) => {
      if (
        program.thoiGianBatDau &&
        program.thoiGianBatDau < thoiGianNgungBanVe
      ) {
        alert(
          "Thời gian bắt đầu của chương trình không thể nhỏ hơn thời gian ngừng bán vé!"
        );
      }

      if (
        program.thoiGianKetThuc &&
        program.thoiGianKetThuc < program.thoiGianBatDau
      ) {
        alert("Thời gian kết thúc phải lớn hơn thời gian bắt đầu!");
      }
    });

    if (
      thoiGianMoBanVe &&
      thoiGianNgungBanVe &&
      thoiGianMoBanVe >= thoiGianNgungBanVe
    ) {
      alert("Thời gian mở bán vé phải nhỏ hơn thời gian ngừng bán vé!");
    }
  };

  const handleChange = (e, path = "") => {
    const { name, value } = e.target;

    if (path) {
      const keys = path.split(".");
      setFormData((prev) => {
        let updatedData = { ...prev };
        let temp = updatedData;
        for (let i = 0; i < keys.length - 1; i++) {
          temp = temp[keys[i]];
        }
        temp[keys[keys.length - 1]] = value;

        validateTime(updatedData);

        return updatedData;
      });
    } else {
      setFormData((prev) => {
        const updatedData = { ...prev, [name]: value };
        validateTime(updatedData);
        return updatedData;
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      anhBia: file,
    }));
  };

  const form = new FormData();
  form.append("maCTySuKien", org.maCTySuKien);
  form.append("tenSuKien", formData.tenSuKien);
  form.append("maDanhMuc", formData.maDanhMuc);
  form.append("thoiGianMoBanVe", formData.thoiGianMoBanVe);
  form.append("thoiGianNgungBanVe", formData.thoiGianNgungBanVe);
  form.append("diaDiemToChuc", formData.diaDiemToChuc);
  form.append("soNhaDuong", formData.soNhaDuong);
  form.append("maPhuongXa", formData.maPhuongXa);
  form.append("moTa", formData.moTa || "KHông có mô tả");
  form.append("soVeMuaToiDa", formData.soVeMuaToiDa);
  form.append("trangThaiDuyet", Number(formData.trangThaiDuyet));

  if (formData.anhBia instanceof File) {
    form.append("type", "event");
    form.append("anhBia", formData.anhBia);
  }

  if (formData.minhChung.length) {
    formData.minhChung.forEach((file) => form.append("minhChung", file));
  }

  form.append("chuongTrinh", JSON.stringify(formData.chuongTrinh || []));

  console.log("Dữ liệu FormData sau khi append:");
  for (let [key, value] of form.entries()) {
    console.log(key, value);
  }

  const nextStep = () => {
    if (!canProceed()) return;
    const next = step + 1;
    if (!visitedSteps.includes(next)) {
      setVisitedSteps((prev) => [...prev, next]);
    }
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step]);
    }
    setStep(next);
  };

  const prevStep = () => {
    const prev = step - 1;
    if (!visitedSteps.includes(prev)) {
      setVisitedSteps((prevSteps) => [...prevSteps, prev]);
    }
    setStep(prev);
  };

  const goToStep = (targetStep) => {
    if (visitedSteps.includes(targetStep)) {
      setStep(targetStep);
    }
  };

  const getStepStyle = (stepNumber) => {
    if (stepNumber === step) {
      return { color: "#009FDA", cursor: "pointer" };
    } else if (visitedSteps.includes(stepNumber)) {
      return { color: "#009FDA", cursor: "pointer" };
    } else {
      return {
        color: "#A1A1A1",
        cursor: "not-allowed",
      };
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowConfirm(true);
  };

  const { mutateAsync: createEvent } = useCreateEvent();
  const handleConfirm = async () => {
    try {
      const response = await createEvent(form);

      toast.success("Tạo sự kiện thành công!", {
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
      });
      setShowConfirm(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Cập nhật thất bại!", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setShowAnnounce(false);
    setAddCategoryFrom(false);
  };

  const buttons = [
    step > 1 && (
      <Button type="button" onClick={prevStep} key="back" className="blue-btn">
        <LuArrowLeft />
        Quay lại
      </Button>
    ),
    step < 2 && (
      <Button
        type="button"
        onClick={nextStep}
        disabled={!canProceed()}
        key="next"
        className="blue-btn"
      >
        Tiếp theo
        <LuArrowRight />
      </Button>
    ),
    step === 2 && (
      <Button
        type="submit"
        disabled={!canProceed()}
        key="submit"
        className="blue-btn"
      >
        Hoàn tất
        <LuCircleCheck />
      </Button>
    ),
  ].filter(Boolean);

  const handleTicketSubmit = (ticket) => {
    const updatedchuongTrinh = [...formData.chuongTrinh];
    if (currentTicket) {
      updatedchuongTrinh[currentProgramIndex].loaiVe = updatedchuongTrinh[
        currentProgramIndex
      ].loaiVe.map((t) =>
        t.tenLoaiVe === currentTicket.tenLoaiVe ? ticket : t
      );
    } else {
      updatedchuongTrinh[currentProgramIndex].loaiVe.push(ticket);
    }

    setFormData((prev) => ({
      ...prev,
      chuongTrinh: updatedchuongTrinh,
    }));
    setOpenedBoxIndex(null);
    setCurrentTicket(null);
  };

  const handleEditTicket = (ticket, programIndex) => {
    setCurrentTicket(ticket);
    setCurrentProgramIndex(programIndex);
    setOpenedBoxIndex(programIndex);
  };

  const handleDeleteTicket = (tenLoaiVe, programIndex) => {
    const updatedchuongTrinh = [...formData.chuongTrinh];
    updatedchuongTrinh[programIndex].loaiVe = updatedchuongTrinh[
      programIndex
    ].loaiVe.filter((t) => t.tenLoaiVe !== tenLoaiVe);
    setFormData((prev) => ({
      ...prev,
      chuongTrinh: updatedchuongTrinh,
    }));
  };

  const handleAddProgram = () => {
    setFormData((prev) => ({
      ...prev,
      chuongTrinh: [
        ...prev.chuongTrinh,
        {
          thoiGianBatDau: "",
          thoiGianKetThuc: "",
          loaiVe: [],
        },
      ],
    }));
  };

  const TicketModal = ({ onClose, onSubmit, ticket }) => {
    const [ticketData, setTicketData] = useState(
      ticket || { tenLoaiVe: "", soLuong: 0, giaBan: 0 }
    );

    const handleChange = (e) => {
      const { name, value } = e.target;
      setTicketData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleSubmitTicket = () => {
      onSubmit(ticketData);
    };

    return (
      <div className="ticket-model">
        <Flex p={4} flexDirection="column" gap={6}>
          <Flex justifyContent="space-between" alignItems="flex-end">
            <Flex flexDirection="column">
              <label htmlFor="">Tên loại vé</label>
              <InputGroup>
                <input
                  name="tenLoaiVe"
                  value={ticketData.tenLoaiVe}
                  onChange={handleChange}
                  placeholder="Tên loại vé"
                  height="40px"
                />
              </InputGroup>
            </Flex>
            <Flex flexDirection="column">
              <label htmlFor="">Số lượng bán</label>
              <InputGroup>
                <input
                  name="soLuong"
                  type="number"
                  value={ticketData.soLuong}
                  onChange={handleChange}
                  placeholder="Số lượng bán"
                  height="40px"
                />
              </InputGroup>
            </Flex>
            <Flex flexDirection="column">
              <label htmlFor="">Giá bán</label>
              <InputGroup>
                <input
                  name="giaBan"
                  type="number"
                  value={ticketData.giaBan}
                  onChange={handleChange}
                  placeholder="Giá bán"
                  height="40px"
                />
              </InputGroup>
            </Flex>
            <Flex gap={6}>
              <Button onClick={handleSubmitTicket} className="blue-btn">
                <LuCheck />
              </Button>
              <Button onClick={onClose} className="red-btn">
                <LuX />
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </div>
    );
  };

  const handleAddCategory = (event) => {
    event.preventDefault();
    setAddCategoryFrom(true);
  };

  const { mutateAsync: createCategory } = useCreateCategory();
  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      await createCategory(catFormData);
      toast.success("Gửi đề xuất thành công!", {
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
      });
      setAddCategoryFrom(false);
    } catch (error) {
      console.error("Lỗi khi tạo danh mục:", error);
      toast.error("Gửi đề xuất thất bại!", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  if (isLoading) return <p>Đang tải...</p>;
  if (isError) return <p>Lỗi: {error.message}</p>;

  return (
    <div>
      <StyledFlex gap={8}>
        <Box className="title">
          <p>Tạo sự kiện</p>
        </Box>

        <Flex className="content">
          <Flex className="progress-bar">
            {steps.map((s, idx) => {
              const isCompleted = completedSteps.includes(s.number);
              const Icon = isCompleted ? LuCircleCheck : LuCircle;
              return (
                <React.Fragment key={s.number}>
                  <Flex
                    className="progress-item"
                    key={s.number}
                    onClick={() => goToStep(s.number)}
                    style={{
                      ...getStepStyle(s.number),
                    }}
                  >
                    <Icon size={15} />
                    <span>{s.label}</span>
                  </Flex>
                  {idx < steps.length - 1 && (
                    <Flex justifyContent="center" alignItems="center">
                      <Box
                        flex="1"
                        height="1px"
                        width="60px"
                        bg="#A1A1A1"
                        mx="8px"
                        transform="translateY(0)"
                      />
                    </Flex>
                  )}
                </React.Fragment>
              );
            })}
          </Flex>

          <form
            className="create-form"
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
          >
            <Flex
              style={{
                margin: "32px 0",
                justifyContent:
                  buttons.length === 1 ? "flex-end" : "space-between",
              }}
            >
              {buttons}
            </Flex>

            {step === 1 && (
              <Flex flexDirection="column" gap={6}>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <GridItem>
                    <Flex flexDirection="column">
                      <label>Ảnh bìa sự kiện</label>
                      <ImageUpload
                        preview={formData.anhBia}
                        onChange={handleImageChange}
                        inputId="banner-upload"
                        width="100%"
                        height="300px"
                      />
                    </Flex>
                  </GridItem>

                  <GridItem>
                    <Flex flexDirection="column" gap={6}>
                      <Flex flexDirection="column">
                        <label htmlFor="event-name">Tên sự kiện</label>
                        <InputGroup>
                          <input
                            id="event-name"
                            name="tenSuKien"
                            type="text"
                            placeholder="Tên sự kiện"
                            value={formData.tenSuKien}
                            onChange={handleChange}
                          />
                        </InputGroup>
                      </Flex>

                      <Flex flexDirection="column">
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <label>Loại sự kiện</label>
                          <button
                            className="text-btn"
                            onClick={handleAddCategory}
                          >
                            Đề xuất danh mục mới?
                          </button>
                        </Flex>
                        <ComboBox
                          placeholder="Loại sự kiện"
                          items={categoryOptions}
                          value={formData.maDanhMuc}
                          onChange={(selected) =>
                            setFormData((prev) => ({
                              ...prev,
                              maDanhMuc: selected?.value,
                            }))
                          }
                          width="100%"
                        />
                      </Flex>

                      <Flex flexDirection="column">
                        <label>Tải lên tài liệu / minh chứng</label>
                        <FileUploadSection
                          onFilesChange={handleFilesChange}
                          maxFiles={5}
                        />
                      </Flex>
                    </Flex>
                  </GridItem>
                </Grid>

                <Flex flexDirection="column">
                  <label htmlFor="event-address">Địa điểm</label>
                  <InputGroup>
                    <input
                      placeholder="Địa điểm"
                      name="diaDiemToChuc"
                      id="event-address"
                      type="text"
                      value={formData.diaDiemToChuc}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Flex>

                <Flex flexDirection="column">
                  <label htmlFor="event-street-number">Số nhà, đường</label>
                  <InputGroup>
                    <input
                      placeholder="Số nhà, đường"
                      name="soNhaDuong"
                      id="event-street-number"
                      type="text"
                      value={formData.soNhaDuong}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Flex>

                <AddressSelector
                  initialWardId={formData.maPhuongXa}
                  onWardSelect={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      maPhuongXa: value,
                    }));
                  }}
                />

                <Flex flexDirection="column">
                  <label htmlFor="event-overview">Giới thiệu sự kiện</label>
                  <TiptapEditor
                    value={formData.moTa}
                    setFormData={setFormData}
                  />
                </Flex>
              </Flex>
            )}

            {step === 2 && (
              <Flex flexDirection="column" gap={6}>
                <Flex flexDirection="column">
                  <label htmlFor="ticket-max">
                    Quy định tối đa số lượng vé được mua
                  </label>
                  <InputGroup>
                    <input
                      id="ticket-max"
                      name="soVeMuaToiDa"
                      type="number"
                      placeholder="Số lượng vé mua tối đa"
                      value={formData.soVeMuaToiDa}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Flex>

                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <GridItem>
                    <Flex flexDirection="column">
                      <label htmlFor="event-start-ticket">
                        Thời gian mở bán vé
                      </label>
                      <InputGroup>
                        <input
                          id="event-start-ticket"
                          name="thoiGianMoBanVe"
                          type="datetime-local"
                          value={formData.thoiGianMoBanVe}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Flex>
                  </GridItem>

                  <GridItem>
                    <Flex flexDirection="column">
                      <label htmlFor="event-end-ticket">
                        Thời gian ngừng bán vé
                      </label>
                      <InputGroup>
                        <input
                          id="event-end-ticket"
                          name="thoiGianNgungBanVe"
                          type="datetime-local"
                          value={formData.thoiGianNgungBanVe}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Flex>
                  </GridItem>
                </Grid>

                {formData.chuongTrinh?.map((program, index) => (
                  <Box key={index} className="program-box">
                    <Flex alignItems="flex-end" flexDirection="column">
                      <Button
                        className="close-box-btn"
                        variant="outline"
                        onClick={() => {
                          const updatedchuongTrinh =
                            formData.chuongTrinh.filter((_, i) => i !== index);

                          setFormData((prev) => ({
                            ...prev,
                            chuongTrinh: updatedchuongTrinh,
                          }));

                          if (openedBoxIndex === index) {
                            setOpenedBoxIndex(null);
                            setCurrentTicket(null);
                          }

                          if (currentProgramIndex === index) {
                            setCurrentProgramIndex(0);
                          }

                          if (openedBoxIndex > index) {
                            setOpenedBoxIndex((prev) => prev - 1);
                          }
                          if (currentProgramIndex > index) {
                            setCurrentProgramIndex((prev) => prev - 1);
                          }
                        }}
                      >
                        <LuX />
                      </Button>
                    </Flex>

                    <Flex direction="column" gap={6}>
                      <Flex gap={6}>
                        <Flex flexDirection="column" w="50%">
                          <label htmlFor="start-time">Thời gian bắt đầu</label>
                          <InputGroup>
                            <input
                              id="start-time"
                              type="datetime-local"
                              value={program.thoiGianBatDau}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  `chuongTrinh.${index}.thoiGianBatDau`
                                )
                              }
                            />
                          </InputGroup>
                        </Flex>

                        <Flex flexDirection="column" w="50%">
                          <label htmlFor="end-time">Thời gian kết thúc</label>
                          <InputGroup>
                            <input
                              id="end-time"
                              type="datetime-local"
                              value={program.thoiGianKetThuc}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  `chuongTrinh.${index}.thoiGianKetThuc`
                                )
                              }
                            />
                          </InputGroup>
                        </Flex>
                      </Flex>

                      <Flex direction="column">
                        {program.loaiVe.map((ticket, idx) => (
                          <Flex
                            key={idx}
                            justify="space-between"
                            align="center"
                            p={4}
                            style={{
                              backgroundColor:
                                idx % 2 === 0 ? "#E1ECF1" : "#fff",
                            }}
                          >
                            <span>{ticket.tenLoaiVe}</span>
                            <Flex gap={2}>
                              <Button
                                className="img-btn"
                                onClick={() => handleEditTicket(ticket, index)}
                              >
                                <img src={edit} />
                              </Button>
                              <Button
                                className="img-btn"
                                onClick={() =>
                                  handleDeleteTicket(ticket.tenLoaiVe, index)
                                }
                              >
                                <img src={trash} />
                              </Button>
                            </Flex>
                          </Flex>
                        ))}
                      </Flex>

                      <Button
                        className="text-btn"
                        onClick={() => {
                          setCurrentProgramIndex(index);
                          setOpenedBoxIndex(index);
                          setCurrentTicket(null);
                        }}
                      >
                        + Thêm loại vé
                      </Button>

                      {/* Open Add Type Ticket */}
                      {openedBoxIndex === index && (
                        <TicketModal
                          onClose={() => setOpenedBoxIndex(null)}
                          onSubmit={handleTicketSubmit}
                          ticket={currentTicket}
                        />
                      )}
                    </Flex>
                  </Box>
                ))}

                <Button onClick={handleAddProgram} className="blue-btn">
                  Tạo thêm chương trình
                </Button>
              </Flex>
            )}
          </form>
        </Flex>

        {showConfirm && (
          <PopUp>
            <PopupContent>
              <p>Bạn có chắc chắn muốn tạo sự kiện này?</p>
              <Flex gap="10px" mt="20px" justifyContent="center">
                <Button onClick={handleConfirm} className="blue-btn">
                  Xác nhận
                </Button>
                <Button onClick={handleCancel} className="red-btn">
                  Huỷ
                </Button>
              </Flex>
            </PopupContent>
          </PopUp>
        )}

        {addCategoryFrom && (
          <PopUp>
            <PopupContent style={{ width: "60%" }}>
              <h2
                style={{
                  color: "black",
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "32px",
                }}
              >
                Đề xuất danh mục sự kiện
              </h2>
              <form>
                <Flex gap={4} flexDirection="column">
                  <label htmlFor="cat-name">Tên danh mục</label>
                  <InputGroup>
                    <input
                      id="cat-name"
                      type="text"
                      value={catFormData.tenDanhMuc}
                      onChange={(e) =>
                        setCatFormData({
                          ...catFormData,
                          tenDanhMuc: e.target.value,
                        })
                      }
                    />
                  </InputGroup>

                  <label htmlFor="cat-dexcribe">Mô tả</label>
                  <InputGroup>
                    <textarea
                      id="cat-describe"
                      type="text"
                      value={catFormData.moTa}
                      onChange={(e) =>
                        setCatFormData({
                          ...catFormData,
                          moTa: e.target.value,
                        })
                      }
                    />
                  </InputGroup>

                  <Flex gap="10px" mt="20px" justifyContent="center">
                    <Button onClick={handleSubmitCategory} className="blue-btn">
                      Xác nhận
                    </Button>
                    <Button onClick={handleCancel} className="red-btn">
                      Huỷ
                    </Button>
                  </Flex>
                </Flex>
              </form>
            </PopupContent>
          </PopUp>
        )}
      </StyledFlex>
    </div>
  );
};

export default CreateEvent;
