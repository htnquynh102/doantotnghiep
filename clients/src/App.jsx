import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import routes from "./routes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "./socket";
import SocketSetup from "./components/Socket/Socket";

function App() {
  useEffect(() => {
    socket.on("new_notification", (data) => {
      toast.info(`${data.tieuDe}: ${data.noiDung}`, {
        position: "top-center",
        autoClose: 10000,
      });
    });

    return () => {
      socket.off("new_notification");
    };
  }, []);

  return (
    <>
      <SocketSetup />
      <ToastContainer />
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </>
  );
}

export default App;
