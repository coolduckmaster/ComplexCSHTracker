/* eslint-disable no-unused-vars */
import React from "react";
import { backendUrl } from "./App";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { CSHPanelComp, CSHPanelSelectComp } from "./CSHPanelComp";

const api = axios.create();

api.interceptors.request.use((config) => {
  config.baseURL = backendUrl + "/api/user/csh/";
  const token =
    localStorage.getItem("adtoken") || localStorage.getItem("trtoken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const CSHPanel = () => {
  const [hiddenOW, setHiddenOW] = React.useState(true);
  const [ow, setOW] = React.useState("");
  const [showFilter, setShowFilter] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [filterCampus, setFilterCampus] = React.useState("All");
  const [filterGrade, setFilterGrade] = React.useState("All");

  const [requests, setRequests] = React.useState([]);
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [processingId, setProcessingId] = React.useState(null);
  const [trnote, setTrNote] = React.useState("");

  const [currentPage, setCurrentPage] = React.useState(1);

  const searchRequest = requests.filter((item) => {
    const searchQ = search.toLowerCase().trim();

    const name = String(item.userName || "").toLowerCase();
    const activity = String(item.activityName || "").toLowerCase();
    const schoolId = String(item.schoolId || "").toLowerCase();
    const matchSearch =
      name.includes(searchQ) ||
      activity.includes(searchQ) ||
      schoolId.includes(searchQ);

    const gradeFilter =
      filterGrade === "All" ||
      String(item.grade ?? "").toLowerCase() ===
        String(filterGrade).toLowerCase();

    const campusFilter =
      filterCampus === "All" ||
      String(item.campus ?? "").toLowerCase() ===
        String(filterCampus).toLowerCase();

    return matchSearch && gradeFilter && campusFilter;
  });

  const PerPage = 5;
  const totalPage = Math.ceil(searchRequest.length / PerPage);

  const currentReq = searchRequest.slice(
    (currentPage - 1) * PerPage,
    currentPage * PerPage,
  );

  return (
    <div>
      <div className="w-full min-w-0 pl-9 pr-9 pt-16 lg:pt-9">
        <div className="mb-2 sm:mb-2 space-y-1">
          <p className="text-base text-gray-500 dark:text-gray-400 italic font-mono">
            Complex CSH Tracker
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
              Approval
            </h1>
          </div>
          <p className="text-base text-gray-500 dark:text-gray-400 font-mono">
            Approve, deny and verify.
          </p>
        </div>
        <div className="flex flex-col">
          <div className="w-full mt-2 grow-3 pb-2 p-4 bg-gray-100 dark:bg-[#161a22] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2 text-gray-900 dark:text-white">
            <div className="flex justify-between items-center gap-4">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Pending Request (
                <span className="tabular-nums">
                  {searchRequest.length || 0}
                </span>
                )
              </p>

              <div className="flex flex-1 max-w-md items-center gap-2">
                <div className="relative flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700/60 bg-white dark:bg-gray-800/60 text-gray-900 dark:text-white focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={search}
                    placeholder="Search by student name, ID or activity..."
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full text-sm bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                  />
                </div>

                <div className="relative">
                  <button
                    type="button"
                    className={`flex rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 text-gray-700 dark:text-gray-200 items-center hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors whitespace-nowrap text-sm ${
                      showFilter && "ring-2 ring-blue-500"
                    }`}
                    onClick={() => {
                      setShowFilter((prev) => !prev);
                    }}
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                    More filters
                  </button>
                  {showFilter && !selectedRequest && (
                    <div className="absolute right-0 top-10 z-50 p-4 bg-white dark:bg-[#161a22] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-1 min-w-65 text-xs">
                      <span className="font-semibold text-gray-700 dark:text-gray-200 pb-2 border-b border-gray-100 dark:border-gray-700">
                        More filter
                      </span>
                      <div className="grid grid-cols-1 gap-1 items-center justify-between pb-2">
                        <span className="text-gray-500 dark:text-gray-400">
                          Campus
                        </span>
                        <select
                          value={filterCampus}
                          onChange={(e) => setFilterCampus(e.target.value)}
                          className="w-auto  px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                          <option value="All">All Campuses</option>
                          <option value="Campus A">Campus A</option>
                          <option value="Campus B">Campus B</option>
                        </select>
                        <span className="text-gray-500 dark:text-gray-400">
                          Class
                        </span>
                        <select
                          value={filterGrade}
                          onChange={(e) => setFilterGrade(e.target.value)}
                          className="w-auto px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-whtite dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                          <option value="All">All Grade</option>
                          <option value="Grade 12">Grade 12</option>
                          <option value="Grade 11">Grade 11</option>
                          <option value="Grade 10">Grade 10</option>
                          <option value="Grade 9">Grade 9</option>
                        </select>
                      </div>
                      {(filterGrade !== "All" || filterCampus !== "All") && (
                        <button
                          onClick={() => {
                            setFilterCampus("All");
                            setFilterGrade("All");
                          }}
                          className="text-red-500 hover:underline text-right"
                        >
                          Reset More Filter
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-5 items-center w-full px-3.5 py-2 font-mono text-sm text-gray-500 dark:text-gray-400">
                <span>Student</span>
                <span>Activity</span>
                <span>Hours Requested</span>
                <span>Submitted At</span>
                <span>Vouch</span>
              </div>
              <div className="grid gap-1.5">
                <CSHPanelComp
                  currentReq={currentReq}
                  selectedRequest={selectedRequest}
                  setSelectedRequest={setSelectedRequest}
                  setTrNote={setTrNote}
                  setHiddenOW={setHiddenOW}
                  searchRequest={searchRequest}
                  search={search}
                  setRequests={setRequests}
                />

                {selectedRequest && (
                  <CSHPanelSelectComp
                    hiddenOW={hiddenOW}
                    setOW={setOW}
                    processingId={processingId}
                    setProcessingId={setProcessingId}
                    trnote={trnote}
                    setTrNote={setTrNote}
                    selectedRequest={selectedRequest}
                    requests={requests}
                    setRequests={setRequests}
                    setSelectedRequest={setSelectedRequest}
                    setHiddenOW={setHiddenOW}
                    currentPage={currentPage}
                    PerPage={PerPage}
                    setCurrentPage={setCurrentPage}
                  />
                )}
              </div>
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
    </div>
  );
};

export default CSHPanel;
