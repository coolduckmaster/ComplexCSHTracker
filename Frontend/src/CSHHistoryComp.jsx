import React from "react";
import axios from "axios";

import { toast } from "react-toastify";
import { backendUrl } from "./App";

axios.interceptors.request.use((config) => {
  config.baseURL = `${backendUrl}/api/user/`;
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const CSHHistoryComp = ({
  searchLog = [],
  search = "",
  currentReq = [],
  selectedRequest = null,
  setSelectedRequest,
  setRequests,
}) => {
  React.useEffect(() => {
    const fetchRequests = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const { data } = await axios.post("/csh/fetchuserreq", {
          userId,
        });
        if (data?.success && Array.isArray(data.data)) {
          setRequests(data.data);
        } else {
          toast.error("Invalid Token! Returning to login..");
          localStorage.clear();
          sessionStorage.clear();
          window.location.replace("/");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load requests.");
      }
    };
    fetchRequests();
  }, [setRequests]);

  return (
    <div className="w-full p-4 bg-gray-100 rounded-xl shadow-sm dark:bg-[#161a22] dark:text-white border border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-5 gap-4 text-xs text-gray-500 dark:text-gray-400 tracking-wider px-3 pb-3 border-b border-gray-200 dark:border-gray-800 font-mono">
        <span>Activity</span>
        <span>Date of Activity</span>
        <span>Hours</span>
        <span>Status</span>
        <span>Submitted on</span>
      </div>

      <div className="grid gap-1.5 mt-2">
        {searchLog.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm italic">
            {search ? "No matching requests found!" : "No requests!"}
          </div>
        ) : (
          currentReq.map((item) => {
            const isSelected = selectedRequest?.requestId === item.requestId;

            return (
              <div
                key={item.requestId}
                onClick={() => setSelectedRequest(item)}
                className={`p-3 cursor-pointer transition-all rounded-lg ${
                  isSelected
                    ? "bg-blue-50 dark:bg-gray-800/90 border-l-4 border-blue-600 shadow-sm"
                    : "bg-white dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-800/80 border border-gray-200 dark:border-gray-700/40"
                }`}
              >
                <div className="grid grid-cols-5 gap-4 items-center">
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {item.activityName || "N/A"}
                  </span>

                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {item.dateofActivity
                      ? new Date(item.dateofActivity).toLocaleDateString()
                      : "N/A"}
                  </span>

                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 w-fit rounded-full border border-blue-200 dark:border-blue-800/50">
                    {item.requestHours} hours
                  </span>

                  <span
                    className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border w-fit ${
                      item.status === "Approved"
                        ? "text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/60 border-green-200 dark:border-green-800/50"
                        : item.status === "Denied"
                          ? "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800/50"
                          : "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {item.status || "Unknown"}
                  </span>

                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.submittedAt
                      ? new Date(item.submittedAt).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CSHHistoryComp;

