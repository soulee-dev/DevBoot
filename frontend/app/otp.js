"use client";

import { createRef, useRef, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const InputBox = ({
  index,
  handleKeyUp,
  handleKeyDown,
  handleInputChange,
  handlePaste,
  inputRef,
  value,
}) => {
  return (
    <div className="w-24 h-20">
      <input
        required
        ref={inputRef}
        className="border sm:text-3xl rounded-xl w-full h-full text-center px-2 py-2"
        type="text"
        maxLength="1"
        value={value}
        onKeyUp={(e) => handleKeyUp(e, index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
        onChange={(e) => handleInputChange(e, index)}
        onPaste={handlePaste}
      />
    </div>
  );
};

const OTPPage = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef(
    Array(6)
      .fill()
      .map(() => createRef())
  );

  const handleInputChange = (e, index) => {
    let value = e.target.value;

    value = value.replace(/[^a-z0-9]/gi, "").toUpperCase();

    if (value === "") {
      return;
    }

    let newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);
  };

  const handleKeyUp = (e, index) => {
    if (!/^[a-z0-9]$/i.test(e.key)) {
      return;
    }

    if (otp[index].length === 1 && index < 5) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    let newOtp = [...otp];

    if (e.key === "Backspace") {
      newOtp[index] = "";
      if (index > 0) {
        inputRefs.current[index - 1].current.focus();
      }
    }
    setOtp(newOtp);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    let data = e.clipboardData.getData("text").trim();
    data = data.replace(/[^a-z0-9]/gi, "").toUpperCase();

    if (data.length > 6) {
      data = data.substring(0, 6);
    }

    const newOtp = data.split("");
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);

    const nextIndex = newOtp.length < 6 ? newOtp.length : 5;
    inputRefs.current[nextIndex].current.focus();
  };

  useEffect(() => {
    inputRefs.current[0].current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/token`, { code: otpCode })
      .then((response) => {
        if (response.data.access_token) {
          localStorage.setItem("token", response.data.access_token);
          toast.success(
            <>
              <p>인증에 성공했습니다.</p>
              <p>잠시뒤 이동합니다.</p>
            </>
          );

          setTimeout(() => {
            router.push("/register");
          }, 1000);
        } else {
          toast.error(
            <>
              <p>인증에 실패했습니다.</p>
              <p>다시 시도해주세요.</p>
            </>
          );
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          <>
            <p>인증에 실패했습니다.</p>
            <p>다시 시도해주세요.</p>
            <p>{error.response.data.message}</p>
          </>
        );
      });
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white px-6 pt-10 pb-9 shadow-xl rounded-2xl max-w-lg">
        <div className="mx-auto max-w-md flex flex-col space-y-16">
          <div className="text-center space-y-2">
            <p className="text-3xl font-semibold">인증코드를 입력해주세요</p>
            <p className="text-sm font-medium text-gray-400">
              사전에 부여된 인증코드를 확인해주세요
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-16">
              <div className="flex justify-between mx-auto max-w-xs gap-x-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputBox
                    key={index}
                    index={index}
                    handleKeyUp={handleKeyUp}
                    handleKeyDown={handleKeyDown}
                    handleInputChange={handleInputChange}
                    handlePaste={handlePaste}
                    inputRef={inputRefs.current[index]}
                    value={otp[index]}
                  />
                ))}
              </div>
              <div className="flex flex-col space-y-5">
                <button className="w-full py-5 text-center text-sm text-white bg-blue-700 rounded-xl outline-none border-none shadow-sm">
                  인증하기
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
