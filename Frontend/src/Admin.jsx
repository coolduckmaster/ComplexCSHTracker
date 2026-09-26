import React from "react";
import axios from "axios";
import { ZaHourRangePick } from "./misc";
import { toast } from "react-toastify";
import { backendUrl } from "./App";
import {
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

axios.interceptors.request.use((config) => {
  config.baseURL = `${backendUrl}/ap/user/`;
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


const Admin = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [filter, setFilter] = React.useState("All");
  const [requests, setRequests] = React.useState([]);
  const [selectedRequest, setSelectedRequest] = React.useState(null);

  const [showRange, setShowRange] = React.useState(false);
  const [showMore, setShowMore] = React.useState(false);
  const [sortBy, setSortBy] = React.useState("submittedAt");
  const [sortOrder, setSortOrder] = React.useState("desc");

  const [startHour, setStartHour] = React.useState("");
  const [endHour, setEndHour] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const [search, setSearch] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    const fetchRequests = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const { data } = await axios.post("/csh/fetchuserreq", { userId });
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const zaDateRangeHelper = (itemDate, start, end) => {
    if (!start && !end) return true;
    if (!itemDate) return false;
    const itemTime = new Date(itemDate).getTime();
    if (start && itemTime < new Date(start).setHours(0, 0, 0, 0)) return false;
    if (end && itemTime > new Date(end).setHours(23, 59, 59, 999)) return false;
    return true;
  };

  const zaHourRangeHelper = (itemHours, start, end) => {
    if (start === "" && end === "") return true;
    const hours = Number(itemHours);
    if (isNaN(hours)) return false;
    const min = start !== "" ? Number(start) : 0;
    const max = end !== "" ? Number(end) : 80;
    return hours >= min && hours <= max;
  };

  const searchLog = requests
    .filter((item) => {
      const searchQ = search.toLowerCase().trim();
      const activity = String(item.activityName || "").toLowerCase();
      const matchSearch = !searchQ || activity.includes(searchQ);
      const searchFilter =
        filter === "All" || item.status?.toLowerCase() === filter.toLowerCase();
      return (
        searchFilter &&
        matchSearch &&
        zaDateRangeHelper(item.submittedAt, startDate, endDate) &&
        zaHourRangeHelper(item.requestHours, startHour, endHour)
      );
    })
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === "submittedAt" || sortBy === "dateofActivity") {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      } else if (sortBy === "requestHours") {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else {
        const strA = String(valA || "").toLowerCase();
        const strB = String(valB || "").toLowerCase();
        return sortOrder === "asc"
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      }

      return sortOrder === "asc" ? valA - valB : valB - valA;
    });

  const PerPage = 5;
  const currentReq = searchLog.slice(
    (currentPage - 1) * PerPage,
    currentPage * PerPage,
  );
  const totalPage = Math.ceil(searchLog.length / PerPage);

  if (isLoading) {
    return (
      <div className="flex justify-center font-mono items-center min-h-screen bg-gray-100 dark:bg-black dark:text-white">
        <p className="animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 px-4 sm:px-9 pt-16 lg:pt-9">
      <div className="mb-4 space-y-1">
        <p className="text-base text-gray-500 dark:text-gray-400 italic font-mono">
          Complex CSH Tracker
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Administrative
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-mono">
          Debug, Manage, and Test New Feature
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm items-center">
            <input
              type="text"
              placeholder="Search activities"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-sm rounded-lg border border-gray-300 dark:border-gray-700/60 bg-white dark:bg-gray-800/60 text-gray-900 dark:text-white pl-9 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button className="flex items-center text-sm font-medium rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-200 transition-colors">
            Export
          </button>
        </div>

        <div className="w-full p-2.5 px-4 bg-gray-200/80 rounded-xl shadow-sm dark:bg-[#161a22]/70 dark:text-white border border-gray-300/50 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center">
            <div className="flex items-center gap-4 text-sm font-medium">
              {["All", "Approved", "Pending", "Denied"].map((status) => (
                <button
                  key={status}
                  className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                    filter === status
                      ? "text-blue-600 dark:text-blue-400 font-semibold underline"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                  onClick={() => {
                    setFilter(status);
                    setCurrentPage(1);
                  }}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="relative">
                <button
                  className="flex rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 text-gray-700 dark:text-gray-200 items-center hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
                  onClick={() => {
                    setShowRange((prev) => !prev);
                    setShowMore(false);
                  }}
                >
                  <CalendarDays className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                  All time
                  {showRange ? (
                    <ChevronDown className="w-4 h-4 ml-2 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronUp className="w-4 h-4 ml-2 text-gray-500 dark:text-gray-400" />
                  )}
                </button>

                {showRange && (
                  <div className="absolute right-0 top-10 z-50 p-4 bg-white dark:bg-[#161a22] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-1.5 min-w-64">
                    <span className="font-semibold text-xs text-gray-700 dark:text-gray-200 pb-2 border-b border-gray-100 dark:border-gray-700">
                      Select Range
                    </span>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        Start Date:
                      </span>
                      <input
                        type="date"
                        className="p-1.5 rounded-md border border-gray-300 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        End Date:
                      </span>
                      <input
                        type="date"
                        min={startDate}
                        className="p-1.5 rounded-md border border-gray-300 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                    {(startDate || endDate) && (
                      <button
                        onClick={() => {
                          setStartDate("");
                          setEndDate("");
                          setCurrentPage(1);
                        }}
                        className="mt-0.5 text-xs text-red-500 hover:underline text-right"
                      >
                        Clear Dates
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  className="flex rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 text-gray-700 dark:text-gray-200 items-center hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
                  onClick={() => {
                    setShowMore((prev) => !prev);
                    setShowRange(false);
                  }}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                  More filter
                </button>
                <ZaHourRangePick
                  showMore={showMore}
                  startHour={startHour}
                  setStartHour={setStartHour}
                  endHour={endHour}
                  setEndHour={setEndHour}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full p-4 bg-gray-200/80 rounded-xl shadow-sm dark:bg-[#161a22] dark:text-white border border-gray-300/50 dark:border-gray-800">
          <div className="grid grid-cols-5 gap-4 text-xs text-gray-500 dark:text-gray-400 tracking-wider px-3 pb-3 border-b border-gray-300/60 dark:border-gray-800 font-mono">
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
                const isSelected =
                  selectedRequest?.requestId === item.requestId;
                return (
                  <div
                    key={item.requestId}
                    onClick={() => setSelectedRequest(item)}
                    className={`p-3 cursor-pointer transition-all rounded-lg ${
                      isSelected
                        ? "bg-blue-50/90 dark:bg-gray-800/90 border-l-4 border-blue-600 shadow-sm"
                        : "bg-white/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/40"
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

        {totalPage > 1 && (
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-200 dark:border-gray-800">
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPage}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => prev - 1);
                  setSelectedRequest(null);
                }}
                className="px-3 py-1 text-xs font-semibold rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPage}
                onClick={() => {
                  setCurrentPage((prev) => prev + 1);
                  setSelectedRequest(null);
                }}
                className="px-3 py-1 text-xs font-semibold rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;