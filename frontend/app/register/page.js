"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RegisterPage = () => {
  const router = useRouter();

  const handleSumbit = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    }
  }, []);
  return (
    <section>
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
                  이름
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="border sm:text-sm rounded-lg block w-full p-2.5"
                  placeholder="홍길동"
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
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium"
                >
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
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
