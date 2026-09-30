/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";
import CSHHistoryComp from "./CSHHistoryComp";
import {
  Clock,
  CircleCheckBig,
  ClipboardClock,
  CalendarDays,
} from "lucide-react";
import { backendUrl } from "./App";
import { toast } from "react-toastify";

axios.interceptors.request.use((config) => {
  config.baseURL = backendUrl + "/api/user/";
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const CircularProgress = ({ current, total }) => {
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);
  const radius = 70;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-full max-w-40 aspect-square">
      <svg viewBox="0 0 160 160" className="-rotate-90 w-full h-full">
        <circle
          cx="80"
          cy="80"
          r={radius}
          className="text-gray-200 dark:text-gray-700 stroke-current"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          className="text-emerald-500 stroke-current transition-all duration-500 ease-out"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashOffset}
        />
      </svg>

      <div className="absolute flex flex-col text-center text-[min(3.5vw,0.875rem)] text-gray-800 dark:text-gray-200/50 leading-tight">
        <span className="text-[min(9vw,2.25rem)] text-gray-800 dark:text-gray-200 font-bold">
          {current}
        </span>
        <span>out of 90</span>
        <span>hours</span>
      </div>
    </div>
  );
};

const ProgressBar = ({ current, yeargoal }) => {
  const percentage = Math.min(Math.max((current / yeargoal) * 100, 0), 100);

  return (
    <div className="w-full max-w-md flex flex-col gap-2">
      <div className="flex items-center justify-center gap-2">
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <span className="font-semibold text-emerald-500">
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="grid grid-cols-2 justify-between items-baseline text-sm text-gray-600 dark:text-gray-300">
        <span>{current} hours</span>
        <span className="text-right">{yeargoal} hours</span>
        <span className="text-gray-400">Approved</span>
        <span className="text-gray-400 text-right">Goal</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("All");
  const [requests, setRequests] = React.useState([]);
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
  const [isLoading, setIsLoading] = React.useState(true);

  const totalRequest =
    requestData.ApprovedRequest + requestData.PendingRequest;

  const today = new Date();
  const day = today.toDateString();

  const searchLog = requests
    .filter((item) => {
      const searchQ = search.toLowerCase().trim();
      const activity = String(item.activityName || "").toLowerCase();
      const matchSearch = !searchQ || activity.includes(searchQ);

      const searchFilter =
        filter === "All" ||
        item.status?.toLowerCase() === filter.toLowerCase();

      return searchFilter && matchSearch;
    })
    .sort((a, b) => {
      const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return dateB - dateA;
    });

  const PerPage = 5;

  const totalPage = Math.ceil(searchLog.length / PerPage);

  const currentReq = searchLog.slice(
    (currentPage - 1) * PerPage,
    currentPage * PerPage,
  );

  React.useEffect(() => {
    const fetchStuff = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const [response, responserequest] = await Promise.all([
          axios.post("csh/check", {
            userId,
          }),
          axios.post("csh/requestcheck", {
            userId,
          }),
        ]);

        if (response.data.success) {
          setCshData(response.data.data);
        }

        if (responserequest.data.success) {
          setRequestData(responserequest.data.data);
        }
      } catch (error) {
        console.error("Error fetching CSH data:", error);

        if (error.response && error.response.status === 403) {
          toast.error("Invalid Token! Returning to login..");

          setTimeout(() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.replace("/");
          }, 2000);
        } else {
          toast.error("An error has occurred while fetching your data!");
        }
      } finally {
        setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="flex justify-center font-mono items-center min-h-screen bg-gray-100 dark:bg-black dark:text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pt-16 md:px-9 lg:pt-9 pb-8 space-y-6">
      <div className="space-y-1">
        <p className="text-base text-gray-500 dark:text-gray-400 italic font-mono">
          Complex CSH Tracker
        </p>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
            {isRole} Dashboard
          </h1>

          <p className="flex text-base gap-2 text-gray-500 dark:text-gray-400 font-medium">
            <CalendarDays />
            {day}
          </p>
        </div>

        <p className="text-base text-gray-500 dark:text-gray-400 font-mono">
          Here's a quick overview of your CSH.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-gray-100 p-4 shadow-sm dark:bg-[#161a22]">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Clock className="h-9 w-9" />
            </div>

            <div className="flex flex-col">
              <p className="font-mono text-base font-medium text-gray-600 dark:text-gray-400">
                Total Requested
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

        <div className="rounded-xl bg-gray-100 p-4 shadow-sm dark:bg-[#161a22]">
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

        <div className="rounded-xl bg-gray-100 p-4 shadow-sm dark:bg-[#161a22]">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400">
              <ClipboardClock className="h-9 w-9" />
            </div>

            <div className="flex flex-col">
              <p className="font-mono text-base text-gray-600 dark:text-gray-400">
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1 min-w-0 p-4 bg-gray-100 rounded-xl shadow-sm dark:bg-[#161a22] dark:text-white border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
          <div className="flex justify-between pb-4">
            <div className="flex flex-col py-4 justify-between font-mono text-gray-500 dark:text-gray-400">
              <span>CSH Goal</span>

              <span className="font-semibold text-5xl text-gray-900 dark:text-white">
                60
                <span className="text-xl pl-2">hours</span>
              </span>

              <p className="flex flex-col text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>Track your progress towards</span>
                <span>your long term CSH goal.</span>
              </p>
            </div>

            <CircularProgress current={cshData.ApprovedHours} total={60} />
          </div>

          <div className="pt-3">
            <p className="pb-2 font-medium text-sm text-gray-600 dark:text-gray-300">
              Yearly progress
            </p>

            <ProgressBar
              current={cshData.ApprovedHours}
              yeargoal={15}
            />
          </div>
        </div>

        <div className="lg:col-span-2 min-w-0">
          <CSHHistoryComp
            searchLog={searchLog}
            search={search}
            currentReq={currentReq}
            selectedRequest={selectedRequest}
            setSelectedRequest={setSelectedRequest}
            setRequests={setRequests}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
