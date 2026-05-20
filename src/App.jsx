import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f1e7_0%,#ffffff_55%,#edf4ff_100%)] text-slate-900">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.22),_transparent_58%)]" />
      <main className="w-full">
        <Outlet />
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        newestOnTop
      />
    </div>
  );
}

export default App;
