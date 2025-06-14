import { useNavigate } from "react-router-dom";
import {
  WrapperCard,
  EventImage,
  ImageContainer,
  ContentContainer,
} from "./style";
import { Flex } from "@chakra-ui/react";
import { LuMapPinned, LuTicket, LuTimer } from "react-icons/lu";

const CardComponent = ({
  maSuKien,
  tenSuKien,
  soNhaDuong,
  diaDiemToChuc,
  anhBia,
  tenPhuongXa,
  tenQuanHuyen,
  tenTinhThanh,
  thoiGianBatDau,
  giaBanThapNhat,
}) => {
  const navigate = useNavigate();

  return (
    <WrapperCard>
      <ImageContainer className="image-container">
        <EventImage src={anhBia} />
      </ImageContainer>

      <ContentContainer className="content-container">
        <span>{tenSuKien}</span>
        <Flex
          flexDirection="column"
          style={{ borderLeft: "1px solid", paddingLeft: "12px" }}
        >
          <Flex gap={4} alignItems="center">
            <LuTimer className="icon" />
            <p>{new Date(thoiGianBatDau).toLocaleString("vi-VN")} </p>
          </Flex>
          <Flex gap={4} alignItems="flex-start">
            <LuMapPinned className="icon" />
            <p>
              {[
                soNhaDuong,
                diaDiemToChuc,
                tenPhuongXa,
                tenQuanHuyen,
                tenTinhThanh,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </Flex>
          <Flex gap={4} alignItems="center">
            <LuTicket className="icon" />
            <p>
              {giaBanThapNhat
                ? Number(giaBanThapNhat).toLocaleString("vi-VN") + "đ"
                : ""}
            </p>
          </Flex>
        </Flex>
        <div>
          <button onClick={() => navigate(`/eventDetail/${maSuKien}`)}>
            Xem chi tiết
          </button>
        </div>
      </ContentContainer>
    </WrapperCard>
  );
};
export default CardComponent;
