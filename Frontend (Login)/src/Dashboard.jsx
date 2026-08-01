import React from "react";
import { Menu, X } from "lucide-react";

const Dashboard = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isRole, setIsRole] = React.useState("Student");
  const [isOpen, setOpen] = React.useState(false); //Open menu yesidfk
  const frontendUrl = "http://localhost:5173/";
  const storedName = localStorage.getItem("userName") || "User";

  React.useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 50);

    function assumeRole() {
      const adtoken = 
        localStorage.getItem("adtoken") || ""
      
      const trtoken = 
        localStorage.getItem("trtoken") || ""

      if (adtoken) {
        setIsRole("Admin");
      } else if (trtoken) {
        setIsRole("Teacher");
      }
    }

    assumeRole();

}, []);

  return (
    <div className="bg-gray-100 dark:bg-black">
      <div
        className={`h-screen w-screen bg-[#d1d5da] dark:bg-mist-950 dark:text-white transition-opacity duration-1000 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="space-y-6">
          <aside className=" hidden md:block  min-h-screen w-52 flex-col overflow-y-auto rounded-r-2xl px-3 py-4 text-surface-content lg:block shadow-2xl dark:outline-white/14 dark:outline-1 bg-[#e1e4e8] dark:bg-[#161a22]">
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-2 rounded-xl px-2 pb-3 shadow-[0_1px_0_rgba(255,255,255,0.08)]">
              <div className="user-info flex min-h-10 items-center gap-2">
                <span className="font-medium text-xl">{storedName}</span>
              </div>
            </div>
            <nav className="space-y-1">
              <a
                className="group flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.96] hover:bg-gray-300/60 dark:hover:bg-gray-800/80 hover:text-blue-600 dark:hover:text-blue-400"
                href={frontendUrl + "requests"}
              >
                Request
              </a>

              <a className="group flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.96] hover:bg-gray-300/60 dark:hover:bg-gray-800/80 hover:text-blue-600 dark:hover:text-blue-400"
                href={frontendUrl + "admin"}
              >
                Admin
              </a>
            </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
