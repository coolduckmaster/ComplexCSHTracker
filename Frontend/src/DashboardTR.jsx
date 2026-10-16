/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";
import { CSHPanelComp } from "./CSHPanelComp";
import { useNavigate } from "react-router";
import { CircularProgress } from "./misc";
import { backendUrl } from "./App";

axios.interceptors.request.use((config) => {
  config.baseURL = backendUrl + "/api/user/";
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const DashboardTR = () => {
  const [hiddenOW, setHiddenOW] = React.useState(true);
  const [trnote, setTrNote] = React.useState("");
  const [classCSH, setClassCSH] = React.useState(0);
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filterCampus, setFilterCampus] = React.useState("All");
  const [filterGrade, setFilterGrade] = React.useState("All");
  const [search, setSearch] = React.useState("");
  const [requests, setRequests] = React.useState([]);

  const sendto = useNavigate();

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

  const currentReq = searchRequest.slice(
    (currentPage - 1) * PerPage,
    currentPage * PerPage,
  );

  React.useEffect(() => {
    const fetchClassCSH = async () => {
      const grade = "Grade 11";
      try {
        const response = await axios.post("csh/checkclass", {
          grade,
        });
        if (response.data.success) {
          setClassCSH(response.data.data.totalApproved);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchClassCSH()
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-1 min-w-0 p-4 bg-gray-100 rounded-xl shadow-sm dark:bg-[#161a22] dark:text-white border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
        <div className="flex justify-between pb-4">
          <p className="flex flex-col py-4 justify-between font-mono text-gray-500 dark:text-gray-400">
            <span> Class Goal</span>
            <span className="font-semibold text-5xl text-gray-900 dark:text-white">
              1200
              <span className="text-xl pl-2">hours</span>
            </span>
            <span className="flex flex-col text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>Track your class progress toward</span>
              <span>their long term CSH goal</span>
            </span>
          </p>
          <CircularProgress current={classCSH} total={1200} />
        </div>
      </div>
      <div
        onClick={() => {
          sendto("/approval");
        }}
        className="lg:col-span-2 max-h-fit"
      >
        <div className="w-full p-4 bg-gray-100 dark:bg-[#161a22] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm text-gray-900 dark:text-white">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Requests
          </p>
          <div className="grid grid-cols-5 gap-4 px-3.5 pb-3 border-b border-gray-200 dark:border-gray-800 font-mono text-xs text-gray-500 dark:text-gray-400">
            <span>Student</span>
            <span>Activity</span>
            <span>Hours Requested</span>
            <span>Submitted At</span>
            <span>Vouch</span>
          </div>

          <div className="grid gap-1.5 mt-2">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTR;
