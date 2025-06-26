import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EditWrapper, PopUp, PopupContent } from "./style";
import { Flex, Box, Grid, GridItem, Button } from "@chakra-ui/react";
import { InputGroup } from "../../../components/ui/input-group";
import { ImageUpload } from "../../../components/ui/image-upload";
import { FileUploadSection } from "../../../components/ui/file-upload";
import { AddressSelector } from "../../../components/ui/select-address";
import { ComboBox } from "../../../components/ui/combobox";
import TiptapEditor from "../../../components/ui/text-editor";
import edit from "../../../assets/images/icon/edit.png";
import trash from "../../../assets/images/icon/trash.png";
import { LuCircleChevronLeft, LuX, LuCheck } from "react-icons/lu";
import { useEventById, useUpdateEvent } from "../../../hooks/useEvent";
import { useCategoriesForSelect } from "../../../hooks/useCategory";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditEvent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { data: event, isLoading, error } = useEventById(eventId);
  const { data: categoryOptions } = useCategoriesForSelect();
  const [step, setStep] = useState(1);
  const [openedBoxIndex, setOpenedBoxIndex] = useState(null);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [currentProgramIndex, setCurrentProgramIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    anhBia: "",
    maDanhMuc: "",
    tenSuKien: "",
    thoiGianMoBanVe: "",
    thoiGianNgungBanVe: "",
    diaDiemToChuc: "",
    soNhaDuong: "",
    maPhuongXa: "",
    moTa: "",
    trangThaiDuyet: 0,
    soVeMuaToiDa: 0,
    chuongTrinh: [],
    minhChung: [],
  });

  useEffect(() => {
    if (event) {
      const normalizeDateTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const hh = String(date.getHours()).padStart(2, "0");
        const mi = String(date.getMinutes()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
      };

      const normalizedChuongTrinh =
        event.chuongtrinh?.map((ct) => ({
          ...ct,
          thoiGianBatDau: normalizeDateTime(ct.thoiGianBatDau),
          thoiGianKetThuc: normalizeDateTime(ct.thoiGianKetThuc),
        })) || [];

      setFormData({
        anhBia: event.anhBia,
        maDanhMuc: event.maDanhMuc,
        tenSuKien: event.tenSuKien,
        thoiGianMoBanVe: normalizeDateTime(event.thoiGianMoBanVe),
        thoiGianNgungBanVe: normalizeDateTime(event.thoiGianNgungBanVe),
        diaDiemToChuc: event.diaDiemToChuc,
        soNhaDuong: event.soNhaDuong,
        maPhuongXa: event.maPhuongXa,
        moTa: event.moTa,
        trangThaiDuyet: event.trangThaiDuyet,
        soVeMuaToiDa: event.soVeMuaToiDa,
        chuongTrinh: normalizedChuongTrinh,
        minhChung: event.minhChung,
      });
    }
  }, [event]);

  const steps = [
    { number: 1, label: "Thông tin sự kiện" },
    { number: 2, label: "Thông tin vé" },
  ];

  const validateTime = (updatedData) => {
    const { thoiGianMoBanVe, thoiGianNgungBanVe, chuongTrinh } = updatedData;

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

  const handleDateChange = (date, path) => {
    setFormData((prev) => {
      let updatedData = { ...prev };
      const keys = path.split(".");
      let temp = updatedData;

      for (let i = 0; i < keys.length - 1; i++) {
        temp[keys[i]] = Array.isArray(temp[keys[i]])
          ? [...temp[keys[i]]]
          : { ...temp[keys[i]] };
        temp = temp[keys[i]];
      }

      temp[keys[keys.length - 1]] = date.toISOString().slice(0, 16);

      validateTime(updatedData);
      return updatedData;
    });
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

  const handleFilesChange = (selectedFiles) => {
    setFormData((prev) => ({
      ...prev,
      minhChung: selectedFiles,
    }));
  };

  const form = new FormData();
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

  if (formData.anhDaiDien instanceof File) {
    form.append("type", "event");
    form.append("anhBia", formData.anhBia);
  } else if (
    typeof formData.anhBia === "string" &&
    formData.anhBia.startsWith("http")
  ) {
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

  const canUpdateEvent =
    event?.trangThaiDuyet === 0 ||
    (event?.trangThaiDuyet === 1 &&
      new Date() < new Date(event.thoiGianMoBanVe));

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowConfirm(true);
  };

  const { mutateAsync: updateEvent } = useUpdateEvent();
  const handleConfirm = async () => {
    setShowConfirm(false);
    try {
      const response = await updateEvent({ id: eventId, data: form });

      toast.success("Cập nhật sự kiện thành công!", {
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
      });
      setShowConfirm(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Cập nhật thất bại!", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const goToStep = (targetStep) => {
    setStep(targetStep);
  };

  const getStepStyle = (stepNumber) => ({
    cursor: "pointer",
    padding: "6px 12px",
    fontWeight: step === stepNumber ? "600" : "500",
    borderBottom: step === stepNumber ? "2px solid #009fda" : "none",
    color: step === stepNumber ? "#009fda" : "#626461",
  });

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
    setCurrentProgramIndex(programIndex);
    setCurrentTicket(ticket);
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

  if (isLoading) return <p>Đang tải dữ liệu sự kiện...</p>;
  if (error) return <p>Có lỗi xảy ra khi lấy dữ liệu sự kiện.</p>;

  return (
    <div>
      <EditWrapper gap={8}>
        <Box className="title">
          <p>Chỉnh sửa sự kiện</p>
        </Box>

        <Flex className="edit-content">
          <a href="" className="events-link">
            <Flex
              alignItems="center"
              gap={2}
              onClick={() => navigate(`/organizer/my-events`)}
            >
              <LuCircleChevronLeft />
              <p>Danh sách sự kiện</p>
            </Flex>
          </a>

          <form
            className="edit-form"
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
          >
            <Flex flexDirection="column" gap="32px">
              <Flex className="event-title">
                <Flex className="event-info">
                  <Flex alignItems="center">
                    <p
                      className="event-name"
                      style={{ textTransform: "uppercase", fontSize: "20px" }}
                    >
                      {event.tenSuKien}
                    </p>
                    <p className="event-status">Đã kết thúc</p>
                  </Flex>

                  <p className="event-addr">
                    {event.diaDiemToChuc}
                    {", "}
                    {event.soNhaDuong ? formData.soNhaDuong : ""}
                    {", "}
                    {event.tenPhuongXa} {event.tenQuanhuyen}
                    {", "}
                    {event.tenTinhThanh}
                  </p>
                </Flex>

                <Button
                  className="blue-btn"
                  type="submit"
                  disabled={!canUpdateEvent}
                >
                  Lưu thông tin
                </Button>
              </Flex>

              <Flex className="progress-bar" justifyContent="center" gap={8}>
                {steps.map((s) => (
                  <React.Fragment key={s.number}>
                    <Flex
                      className="progress-item"
                      key={s.number}
                      onClick={() => goToStep(s.number)}
                      style={{
                        ...getStepStyle(s.number),
                      }}
                    >
                      <span>{s.label}</span>
                    </Flex>
                  </React.Fragment>
                ))}
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
                              value={formData.tenSuKien || ""}
                              onChange={handleChange}
                            />
                          </InputGroup>
                        </Flex>

                        <Flex flexDirection="column">
                          <label>Loại sự kiện</label>
                          <ComboBox
                            placeholder="Loại sự kiện"
                            items={categoryOptions}
                            value={formData.maDanhMuc}
                            onChange={(value) =>
                              handleChange({
                                target: { name: "eventType", value },
                              })
                            }
                            width="100%"
                          />
                        </Flex>

                        {(event.trangThaiDuyet === 0 ||
                          event.trangThaiDuyet === 2) && (
                          <Flex flexDirection="column">
                            <label>Tải lên tài liệu / minh chứng</label>
                            <FileUploadSection
                              onFilesChange={handleFilesChange}
                              maxFiles={5}
                            />
                          </Flex>
                        )}
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
                        value={formData.diaDiemToChuc || ""}
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
                        value={formData.soNhaDuong || ""}
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
                      value={formData.moTa || ""}
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
                        value={formData.soVeMuaToiDa || ""}
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
                        <DatePicker
                          selected={
                            formData.thoiGianMoBanVe
                              ? new Date(
                                  formData.thoiGianMoBanVe.replace("Z", "")
                                )
                              : null
                          }
                          onChange={(date) => {
                            const formatted = formatDateTimeToInput(date);
                            setFormData((prev) => ({
                              ...prev,
                              thoiGianNgungBanVe: formatted,
                            }));
                          }}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="dd/MM/yyyy HH:mm"
                        />
                      </Flex>
                    </GridItem>
                    <GridItem>
                      <Flex flexDirection="column">
                        <label htmlFor="event-end-ticket">
                          Thời gian ngừng bán vé
                        </label>
                        <DatePicker
                          selected={
                            formData.thoiGianNgungBanVe
                              ? new Date(
                                  formData.thoiGianNgungBanVe.replace("Z", "")
                                )
                              : null
                          }
                          onChange={(date) =>
                            handleDateChange(date, "thoiGianNgungBanVe")
                          }
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="dd/MM/yyyy HH:mm"
                        />
                      </Flex>
                    </GridItem>
                  </Grid>

                  {formData.chuongTrinh.map((program, index) => (
                    <Box key={index} className="program-box">
                      <Flex alignItems="flex-end" flexDirection="column">
                        <Button
                          className="close-box-btn"
                          variant="outline"
                          onClick={() => {
                            const updatedchuongTrinh =
                              formData.chuongTrinh.filter(
                                (_, i) => i !== index
                              );

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
                            <label htmlFor="start-time">
                              Thời gian bắt đầu
                            </label>

                            <DatePicker
                              selected={
                                program.thoiGianBatDau
                                  ? new Date(
                                      program.thoiGianBatDau.replace("Z", "")
                                    )
                                  : null
                              }
                              onChange={(date) =>
                                handleDateChange(
                                  date,
                                  `chuongTrinh.${index}.thoiGianBatDau`
                                )
                              }
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={15}
                              dateFormat="dd/MM/yyyy HH:mm"
                            />
                          </Flex>

                          <Flex flexDirection="column" w="50%">
                            <label htmlFor="end-time">Thời gian kết thúc</label>
                            <DatePicker
                              selected={
                                program.thoiGianKetThuc
                                  ? new Date(
                                      program.thoiGianKetThuc.replace("Z", "")
                                    )
                                  : null
                              }
                              onChange={(date) =>
                                handleDateChange(
                                  date,
                                  `chuongTrinh.${index}.thoiGianKetThuc`
                                )
                              }
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={15}
                              dateFormat="dd/MM/yyyy HH:mm"
                            />
                          </Flex>
                        </Flex>

                        <Flex direction="column">
                          {program.loaiVe.map((ticket, idx) => (
                            <Box key={idx}>
                              <Flex
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
                                    onClick={() =>
                                      handleEditTicket(ticket, idx)
                                    }
                                  >
                                    <img src={edit} />
                                  </Button>
                                  <Button
                                    className="img-btn"
                                    onClick={() =>
                                      handleDeleteTicket(
                                        ticket.tenLoaiVe,
                                        index
                                      )
                                    }
                                  >
                                    <img src={trash} />
                                  </Button>
                                </Flex>
                              </Flex>
                            </Box>
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
              {/* End Step 2 */}
            </Flex>
          </form>
        </Flex>

        {/* Confirm PopUp */}
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

        {/* End Confirm PopUp */}
      </EditWrapper>
    </div>
  );
};

export default EditEvent;
