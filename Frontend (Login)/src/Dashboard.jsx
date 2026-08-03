import axios from "axios";
import { Clock, CheckIcon, CalendarClock } from "lucide-react";
import React from "react";
import { backendUrl } from "./App";

const Dashboard = () => {
  const [cshData, setCshData] = React.useState({
    ApprovedHours: 0,
    PendingHours: 0,
    TotalHours: 0,
  });
  const [isRole, setIsRole] = React.useState("Student");
  const today = new Date();
  const day = today.toDateString();
  React.useEffect(() => {
    const fetchCSH = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await axios.post(backendUrl + "/api/user/csh/check", {
          userId,
        });

        if (response.data.success) {
          setCshData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching CSH data:", error);
      }
    };

    fetchCSH();

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

  return (
    <div>
      <div className="mx-auto w-full min-w-0  p-4 pt-16 md:p-8 lg:pt-8">
        <div className="mb-6 sm:mb-8 space-y-1">
          <p className="text-lg text-gray-500 dark:text-gray-400 italic font-mono">
            Complex CSH Tracker
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
              {isRole} Dashboard
            </h1>
            <p className="text-md text-gray-500 dark:text-gray-400 font-medium">
              {day}
            </p>
          </div>

          <p className="text-lg text-gray-500 dark:text-gray-400 font-mono">
            Here's a quick overview of your CSH.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 lg:grid-cols-3 ">
          <div className="rounded-xl border border-gray-300 bg-gray-200 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 ">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <Clock className="h-9 w-9" />
              </div>

              <div className="flex flex-col">
                <p className="font-mono text-2sm  font-medium text-gray-600 dark:text-gray-400">
                  Total Logged
                </p>
                <span className="font-mono text-4xl font-bold text-gray-900 dark:text-white">
                  {cshData.TotalHours}
                  <span className="font-mono text-xl font-bold text-gray-900 dark:text-white">
                    {" "}
                    hours
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-300 bg-gray-200 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
                <CheckIcon className="h-9 w-9" />
              </div>

              <div className="flex flex-col">
                <p className="font-mono text-2sm font-medium text-gray-600 dark:text-gray-400">
                  Approved
                </p>
                <span className="font-mono text-4xl font-bold text-gray-900 dark:text-white">
                  {cshData.ApprovedHours}
                  <span className="font-mono text-xl font-bold text-gray-900 dark:text-white">
                    {" "}
                    hours
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-300 bg-gray-200 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400">
                <CalendarClock className="h-9 w-9" />
              </div>

              <div className="flex flex-col">
                <p className="font-mono text-2sm font-medium text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <span className="font-mono text-4xl font-bold text-gray-900 dark:text-white">
                  {cshData.PendingHours}
                  <span className="font-mono text-xl font-bold text-gray-900 dark:text-white">
                    {" "}
                    hours
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
