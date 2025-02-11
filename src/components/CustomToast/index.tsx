import { ToastContainer } from "react-toastify";

export default function CustomToast() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={700}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
      theme="light"
    />
  );
}
