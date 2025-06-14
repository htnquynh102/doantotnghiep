import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOTP, resendOTP } from "../../services/accountService";
import { CardWrapper, Card, OTPContainer, OTPInput, CardBottom } from "./style";
import { Button } from "@chakra-ui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const OTPForm = ({ email, type, onSuccess }) => {
  console.log("Type received:", type);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9a-zA-Z]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    try {
      const response = await verifyOTP(email, otpString, type);

      console.log("Phản hồi API:", response.data);
      if (!response.data.success) {
        toast.error(response.data.message, {
          position: "top-center",
          autoClose: 1000,
        });
        return;
      }

      toast.success("Xác thực thành công!", {
        position: "top-center",
        autoClose: 1000,
        onClose: () => {
          if (type === "register") {
            navigate("/sign-in");
          } else if (type === "reset") {
            onSuccess();
          }
        },
      });
    } catch (error) {
      // toast.error("Mã OTP không hợp lệ hoặc đã hết hạn.", {
      //   position: "top-center",
      //   autoClose: 1000,
      // });
      toast.error("Có lỗi xảy ra, vui lòng thử lại!", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP(email, type);
      setMessage("Mã OTP mới đã được gửi!");
    } catch (error) {
      setMessage("Lỗi khi gửi lại OTP.");
    }
  };

  return (
    <CardWrapper>
      <Card>
        <h2 style={{ fontSize: "16px", fontWeight: "600" }}>Nhập mã OTP</h2>
        <div>
          <span>Mã xác thực đã được gửi đến email của bạn</span>
        </div>
        <form onSubmit={handleVerifyOTP}>
          <OTPContainer>
            {otp.map((value, index) => (
              <OTPInput
                key={index}
                type="text"
                id={`otp-${index}`}
                value={value}
                maxLength="1"
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                required
              />
            ))}
          </OTPContainer>

          <Button className="blue-btn" type="submit">
            Xác thực
          </Button>
        </form>
        <p style={{ color: "#bc072c" }}>{message}</p>
      </Card>

      <CardBottom>
        <span>Chưa nhận được mã?</span>
        <button onClick={handleResendOTP}>Gửi lại OTP</button>
      </CardBottom>
    </CardWrapper>
  );
};
