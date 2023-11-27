import OTPPage from "./otp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ToastContainer />
      <OTPPage />
    </main>
  );
}
