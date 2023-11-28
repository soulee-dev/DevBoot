"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import zxcvbn from "zxcvbn";

const RegisterPage = () => {
  const router = useRouter();

  const handleSumbit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // if name is not alphanumeric, return
    if (!name.match(/^[0-9a-zA-Z]+$/)) {
      toast.error("닉네임은 영문, 숫자만 가능합니다.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length > 64) {
      toast.error("비밀번호는 64자 이하로 입력해주세요.");
      return;
    }

    const passwordScore = zxcvbn(password).score;
    if (passwordScore < 3) {
      toast.error("더 강력한 비밀번호를 입력해주세요.");
      return;
    }

    const data = {
      username: name,
      email,
      password,
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/register`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);
        toast.success("회원가입에 성공했습니다.");
      })
      .catch((err) => {
        console.log(err);
        toast.error("회원가입에 실패했습니다.");
      });
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    }
  }, []);
  return (
    <section>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen p-24">
        <div className="w-full bg-white rounded-2xl shadow-xl md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
              계정 만들기
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSumbit}>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  닉네임 (영문, 숫자만 가능합니다)
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="border sm:text-sm rounded-lg block w-full p-2.5"
                  placeholder="honggildong"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  이메일 주소
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="border sm:text-sm rounded-lg block w-full p-2.5"
                  placeholder="pymyrepl@gmail.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium"
                >
                  비밀번호
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="border sm:text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium"
                >
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className="border sm:text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-5 text-center text-sm text-white bg-blue-700 rounded-xl outline-none border-none shadow-sm"
              >
                계정 만들기
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
