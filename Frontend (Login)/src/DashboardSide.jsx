import React from "react";
import { NavLink, Outlet } from "react-router";
import {
  Menu,
  X,
  Home,
  ClipboardEdit,
  LogOutIcon,
  ShieldCog,
} from "lucide-react";

const DashboardSide = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isRole, setIsRole] = React.useState("Student");
  const [isOpen, setOpen] = React.useState(false); //Open menu yesidfk
  const [logoutOpen, setlogoutOpen] = React.useState(false);
  const storedName = localStorage.getItem("userName") || "User";

  React.useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 50);

    function assumeRole() {
      const adtoken = localStorage.getItem("adtoken") || "";
      const trtoken = localStorage.getItem("trtoken") || "";

      if (adtoken) {
        setIsRole("Admin");
      } else if (trtoken) {
        setIsRole("Teacher");
      }
    }

    assumeRole();
  }, []);


  const handleMenu = () => {
    if (isOpen) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `group flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.96] ${
      isActive
        ? "bg-gray-300 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold"
        : "hover:bg-gray-300/60 dark:hover:bg-gray-600/20 hover:text-blue-600 dark:hover:text-blue-400"
    }`;

  return (
    <div className="bg-gray-100 dark:bg-black">
      {logoutOpen === false ? null : (
        <div className="bits-modal-overlay fixed inset-0 z-9999 bg-darker/80 backdrop-blur-md">
          <div className="bits-modal-content fixed inset-0 z-10000 m-auto h-fit w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-2xl border dark:border-white/10 border-surface-300/70 border-black/20 bg-surface dark:bg-surface outline-none">
            <div className="h-1 w-full bg-red-500 dark:bg-red-500"></div>
            <div className="p-4 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-balance text-base md:text-lg font-semibold tracking-tight text-surface-content dark:text-white ">
                    Hang on a second!
                  </div>
                  <div className="mt-1 text-sm leading-snug text-muted sm:text-[15px] dark:text-white/50">
                    Are you sure you want to log out?
                  </div>
                </div>
                <button
                  onClick={() => setlogoutOpen(false)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-gray-800/60 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
                >
                  <X />
                </button>
              </div>
              <div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setlogoutOpen(false)}
                    className="inline-flex h-10 w-full shrink-0 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.93] motion-reduce:active:scale-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950 disabled:cursor-not-allowed disabled:opacity-60 bg-white dark:bg-black/20 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  >
                    Go back
                  </button>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      sessionStorage.clear();
                      window.location.reload();
                    }}
                    className="inline-flex h-10 min-h-10 w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.93] motion-reduce:active:scale-100 outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950 disabled:cursor-not-allowed disabled:opacity-60 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-800 text-white border border-red-700 dark:border-red-500 shadow-sm"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className={`min-h-screen w-full bg-[#d1d5da] dark:bg-mist-950 dark:text-white transition-opacity duration-1000 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex min-h-screen">
          <div
            className={`${isOpen ? "bits-modal-overlay fixed inset-0 z-9999 backdrop-blur-md" : ""}`}
            onClick={isOpen ? handleMenu : null}
          >
            <aside
              className={`${isOpen ? "bits-modal-content fixed inset-0 z-10000 md:flex md:justify-between" : "hidden md:flex"}  flex h-screen w-60 shrink-0 flex-col justify-between rounded-r-2xl bg-[#e1e4e8] px-3 py-4 text-surface-content shadow-2xl outline-1 outline-black/10 dark:bg-[#161a22] dark:outline-white/14`}
            >
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-2 rounded-xl px-2 pb-3 shadow-[0_1px_0_rgba(255,255,255,0.08)]">
                  <div className="user-info flex min-h-10 items-center gap-2">
                    <span className="font-medium text-xl">{storedName}</span>
                  </div>
                </div>
                <nav className="space-y-1 gap-2 items-center text-md">
                  <NavLink to="/" end className={navLinkClass}>
                    <Home className="p-0.5" />
                    Home
                  </NavLink>

                  <NavLink to="/requests" end className={navLinkClass}>
                    <ClipboardEdit className="p-0.5" />
                    Request
                  </NavLink>

                  {isRole === "Admin" && (
                    <NavLink to="/admin" end className={navLinkClass}>
                      <ShieldCog className="p-0.5" />
                      Admin
                    </NavLink>
                  )}

                  {isRole === "Teacher" && (
                    <NavLink to="/approval" className={navLinkClass}>
                      Approval Panel
                    </NavLink>
                  )}
                </nav>
              </div>

              <button
                onClick={() => setlogoutOpen(true)}
                className="flex min-h-10 w-full items-center justify-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white dark:text-white  bg-red-700 hover:bg-red-800 dark:hover:bg-red-950/50 transition-colors "
              >
                <LogOutIcon className="p-0.5" />
                Sign Out
              </button>
            </aside>
          </div>

          <main className="relative min-h-full min-w-0 flex-1 inline-block">
            <button
              className="absolute md:hidden left-6 top-6 z-50 rounded-xl dark:bg-[#161a22] bg-gray-200 flex p-2 active:scale-[0.93]"
              onClick={handleMenu}
            >
              <Menu />
            </button>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardSide;
