/* eslint-disable react-hooks/set-state-in-effect */
import React from "react";
import CSHHistoryComp from "./CSHHistoryComp";
import { ZaHourRangePick, ExportButton } from "./misc";

import {
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const Admin = () => {
  const [requests, setRequests] = React.useState([]);
  const [filter, setFilter] = React.useState("All");
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

  const zaDateRangeHelper = (itemDate, start, end) => {
    if (!start && !end) return true;
    if (!itemDate) return false;
    const itemTime = new Date(itemDate).getTime();

    if (start) {
      const startTime = new Date(start).setHours(0, 0, 0, 0);
      if (itemTime < startTime) return false;
    }

    if (end) {
      const endTime = new Date(end).setHours(23, 59, 59, 999);
      if (itemTime > endTime) return false;
    }

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
        filter === "All" ||
        item.status?.toLowerCase() === filter.toLowerCase();

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

  const totalPage = Math.ceil(searchLog.length / PerPage);

  const currentReq = searchLog.slice(
    (currentPage - 1) * PerPage,
    currentPage * PerPage,
  );

  React.useEffect(() => {
    if (totalPage > 0 && currentPage > totalPage) {
      setCurrentPage(totalPage);
    }

    if (totalPage === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPage]);

  React.useEffect(() => {
    setCurrentPage(1);
    setSelectedRequest(null);
  }, [
    filter,
    search,
    startDate,
    endDate,
    startHour,
    endHour,
    sortBy,
    sortOrder,
  ]);

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

          <ExportButton>
            <button
              type="button"
              className="flex items-center text-sm font-medium rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-200 transition-colors"
            >
              Export
            </button>
          </ExportButton>
        </div>

        <div className="w-full p-2.5 px-4 bg-gray-100 rounded-xl shadow-sm dark:bg-[#161a22]/70 dark:text-white border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center">
            <div className="flex items-center gap-4 text-sm font-medium">
              {["All", "Approved", "Pending", "Denied"].map((status) => (
                <button
                  key={status}
                  type="button"
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
                  type="button"
                  className="flex rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 text-gray-700 dark:text-gray-200 items-center hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
                  onClick={() => {
                    setShowRange((prev) => !prev);
                    setShowMore(false);
                  }}
                >
                  <CalendarDays className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                  All time
                  {showRange ? (
                    <ChevronUp className="w-4 h-4 ml-2 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-2 text-gray-500 dark:text-gray-400" />
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
                        className="p-1.5 rounded-md border border-gray-300 dark:border-gray-700/60 bg-white dark:bg-gray-800/60 text-gray-900 dark:text-white"
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
                        className="p-1.5 rounded-md border border-gray-300 dark:border-gray-700/60 bg-white dark:bg-gray-800/60 text-gray-900 dark:text-white"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>

                    {(startDate || endDate) && (
                      <button
                        type="button"
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
                  type="button"
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

        <div>
          <CSHHistoryComp
            searchLog={searchLog}
            search={search}
            currentReq={currentReq}
            selectedRequest={selectedRequest}
            setSelectedRequest={setSelectedRequest}
            setRequests={setRequests}
          />

          {selectedRequest && (
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedRequest(null);
                }
              }}
              className="bits-modal-overlay fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            >
              <div className="bits-modal-content fixed inset-0 z-50 m-auto h-fit w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161a22] shadow-2xl outline-none">
                <div className="bg-white dark:bg-[#161a22] text-gray-900 dark:text-white px-6">
                  <div className="py-4 border-b border-gray-100 dark:border-gray-800/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        Request Details
                      </p>

                      <button
                        type="button"
                        onClick={() => setSelectedRequest(null)}
                        aria-label="Close details"
                        className="inline-flex items-center justify-center rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pb-2">
                        <span>Submitted At</span>

                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {selectedRequest?.submittedAt
                            ? new Date(
                                selectedRequest.submittedAt,
                              ).toLocaleString()
                            : "N/A"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 items-start">
                        <div className="flex flex-col items-start py-4 text-sm gap-3 text-gray-500 dark:text-gray-400 font-medium">
                          <span>Activity Name</span>
                          <span>Date of Activity</span>
                          <span>Hours Requested</span>
                          <span>Status</span>
                          <span>Teacher's note</span>
                        </div>

                        <div className="flex flex-col items-center py-4 text-sm gap-3 text-gray-900 dark:text-gray-200 text-left">
                          <div className="w-full flex flex-col gap-3 items-start">
                            <span className="font-medium">
                              {selectedRequest.activityName || "N/A"}
                            </span>

                            <span>
                              {selectedRequest.dateofActivity
                                ? new Date(
                                    selectedRequest.dateofActivity,
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>

                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              {selectedRequest.requestHours} hrs
                            </span>

                            <span
                              className={`items-center px-2 py-0.5 rounded-md font-semibold border w-fit ${
                                selectedRequest.status === "Approved"
                                  ? "text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/60 border-green-200 dark:border-green-800/50"
                                  : selectedRequest.status === "Denied"
                                    ? "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800/50"
                                    : "text-gray-700 bg-gray-50 dark:text-gray-300 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                              }`}
                            >
                              {selectedRequest.status || "Unknown"}
                            </span>

                            <span>{selectedRequest.trnote || "____"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
