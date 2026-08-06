import axios from "axios";
import { Clock, CircleCheckBig, ClipboardClock, CalendarDays} from "lucide-react";
import React from "react";
import { backendUrl } from "./App";

const Dashboard = () => {
  const [cshData, setCshData] = React.useState({
    ApprovedHours: 0,
    PendingHours: 0,
    TotalHours: 0,
  });
  const [requestData, setRequestData] = React.useState({
    ApprovedRequest: 0,
    PendingRequest: 0,
  });
  const [isRole, setIsRole] = React.useState("Student");
  const totalRequest = requestData.ApprovedRequest + requestData.PendingRequest;

  const today = new Date();
  const day = today.toDateString();

  React.useEffect(() => {
    const fetchStuff = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await axios.post(backendUrl + "/api/user/csh/check", {
          userId,
        });

        const responserequest = await axios.post(
          backendUrl + "/api/user/csh/requestcheck",
          {
            userId,
          },
        );

        if (response.data.success) {
          setCshData(response.data.data);
        }

        if (responserequest.data.success) {
          setRequestData(responserequest.data.data);
        }
      } catch (error) {
        console.error("Error fetching CSH data:", error);
      }
    };

    fetchStuff();

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
      <div className="w-full min-w-0 p-4 pt-16 md:p-9 lg:pt-9">
        <div className="mb-2 sm:mb-2 space-y-1">
          <p className="text-base text-gray-500 dark:text-gray-400 italic font-mono">
            Complex CSH Tracker
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
              {isRole} Dashboard
            </h1>
            <p className="flex text-base gap-2 text-gray-500 dark:text-gray-400 font-medium">
              <CalendarDays/>
              {day}
            </p>
          </div>

          <p className="text-base text-gray-500 dark:text-gray-400 font-mono">
            Here's a quick overview of your CSH.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-3 mt-4">
          <div className="rounded-xl bg-gray-200 p-4 shadow-sm dark:bg-[#161a22] shadow-white/30">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <Clock className="h-9 w-9" />
              </div>
              <div className="flex flex-col">
                <p className="font-mono text-base font-medium text-gray-600 dark:text-gray-400">
                  Total Logged
                </p>
                <span className="font-mono text-3xl font-bold text-gray-900 dark:text-white">
                  {cshData.TotalHours}
                  <span className="font-mono text-sm text-gray-900 dark:text-gray-400">
                    {" "}
                    hours
                  </span>
                </span>
                <span className="font-mono text-sm py-2 font-semibold text-gray-900 dark:text-gray-400">
                  Your total request: {totalRequest}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gray-200 p-4 shadow-sm dark:bg-[#161a22] shadow-white/30">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
                <CircleCheckBig className="h-9 w-9" />
              </div>

              <div className="flex flex-col">
                <p className="font-mono text-base font-medium text-gray-600 dark:text-gray-400">
                  Approved
                </p>
                <span className="font-mono text-3xl font-bold text-gray-900 dark:text-white">
                  {cshData.ApprovedHours}
                  <span className="font-mono text-sm font-bold text-gray-900 dark:text-gray-400">
                    {" "}
                    hours
                  </span>
                </span>
                <span className="font-mono text-sm font-semibold py-2 text-gray-900 dark:text-gray-400">
                  Your approved request: {requestData.ApprovedRequest}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gray-200 p-4 shadow-sm dark:bg-[#161a22] shadow-white/30">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400">
                <ClipboardClock className="h-9 w-9" />
              </div>

              <div className="flex flex-col">
                <p className="font-mono text-base  text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <span className="font-mono text-3xl font-bold text-gray-900 dark:text-white">
                  {cshData.PendingHours}
                  <span className="font-mono text-sm font-bold text-gray-900 dark:text-gray-400">
                    {" "}
                    hours
                  </span>
                </span>
                <span className="font-mono text-sm font-semibold py-2 text-gray-900 dark:text-gray-400">
                  Your pending request: {requestData.PendingRequest}
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
