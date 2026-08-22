/* eslint-disable no-unused-vars */
import React from "react";
import { backendUrl } from "./App";
import axios from "axios";
import { toast } from "react-toastify";
import { Check, ChevronLeft, ChevronRight, Search, X } from "lucide-react";

const api = axios.create();

api.interceptors.request.use((config) => {
  config.baseURL = backendUrl + "/api/user/csh/";
  const token = localStorage.getItem("adtoken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const Admin = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [desStrg, setDesStrg] = React.useState(true);
  const [hiddenOW, setHiddenOW] = React.useState(true);
  const [ow, setOW] = React.useState("");

  const [search, setSearch] = React.useState("");

  const [requests, setRequests] = React.useState([]);
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [processingId, setProccessingId] = React.useState(null);
  const [trnote, setTrNote] = React.useState("");

  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data: FRdata } = await api.get("fetchpendingreq");
      if (FRdata?.success && Array.isArray(FRdata.data)) {
        setRequests(FRdata.data);
      } else {
        toast.error("Invaild Token! Returning to login..");
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcess = async (status) => {
    const { userId, requestId } = selectedRequest;
    if (!selectedRequest) return;
    setProccessingId(requestId);

    try {
      const { data: HPdata } = await api.post("approval", {
        userId,
        requestId,
        status,
      });

      if (HPdata.success) {
        const updatedList = requests.filter((r) => r.requestId !== requestId);
        setRequests(updatedList);
        setSelectedRequest(updatedList.length > 0 ? updatedList[0] : null);
        toast.success(HPdata.message);
        if (
          (currentPage - 1) * PerPage >= updatedList.length &&
          currentPage > 1
        ) {
          setCurrentPage((prev) => prev - 1);
        }
      } else {
        console.log(HPdata.message);
        toast.error(HPdata.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setProccessingId(null);
    }
  };

  const handleNotes = async (ow) => {
    const { userId, requestId } = selectedRequest;
    if (!trnote) {
      return toast.error("Missing teacher's note");
    }

    if (CurWordCount <= 250) {
      try {
        const saveNote = await api.post("approval", {
          userId,
          requestId,
          trnote,
          ow,
        });

        if (saveNote.data.success) {
          toast.success("Successfully noted!");
          setHiddenOW(true);
          setOW("");
        } else if (saveNote.data.message == "Trnote exist, overwrite") {
          setHiddenOW(false);
          toast.info("A note for this request already exist, overwrite?");
        }
      } catch (error) {
        console.log(error);
        toast.error(error);
        console.log(trnote);
      }
    } else {
      toast.error("Word limit reached.");
    }
  };

  const searchRequest = requests.filter((item) => {
    const searchQ = search.toLowerCase().trim();
    if (!searchQ) return true;

    const name = String(item.userName || "").toLowerCase();
    const activity = String(item.activityName || "").toLowerCase();

    return name.includes(searchQ) || activity.includes(searchQ);
  });

  const PerPage = 5;
  const indexLastItem = currentPage * PerPage;
  const indexFirstItem = indexLastItem - PerPage;
  const currentReq = searchRequest.slice(indexFirstItem, indexLastItem);
  const totalPage = Math.ceil(searchRequest.length / PerPage);

  const handleWordCount = (e) => {
    const val = e.target.value;
    const word = val.trim().split(/\s+/).filter(Boolean);
    if (word.length <= 100 || val.length < trnote.length) {
      setTrNote(val);
    }
  };

  const CurWordCount = trnote.trim().split(/\s+/).filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="flex justify-center font-mono items-center min-h-screen bg-gray-100 dark:bg-black dark:text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full min-w-0  pl-9 pr-9 pt-16 lg:pt-9">
        <div className="mb-2 sm:mb-2 space-y-1">
          <p className="text-base text-gray-500 dark:text-gray-400 italic font-mono">
            Complex CSH Tracker
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
              Administrative Page
            </h1>
          </div>
          <p className="text-base text-gray-500 dark:text-gray-400 font-mono">
            Debug, Manage, and Test New Feature
          </p>
        </div>
        <div className="flex flex-col">
          <div className="w-full mt-2 grow-3 pb-2 p-4 bg-[#e1e4e8] rounded-2xl shadow-lg space-y-2 dark:bg-[#161a22] dark:text-white">
            <div className="flex justify-between">
              <p className="text-lg font-semibold">
                Pending Request (<span>{searchRequest.length || "0"}</span>)
              </p>

              <div className="flex w-full max-w-sm items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by student or activity..."
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                ></input>
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
              <div className="grid gap-1">
                {searchRequest.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    {search
                      ? "No matching requests found!"
                      : "No pending request!"}
                  </div>
                ) : (
                  currentReq.map((item) => {
                    const IamSelected =
                      selectedRequest?.requestId === item.requestId;
                    return (
                      <div
                        key={item.requestId}
                        onClick={() => setSelectedRequest(item)}
                        className={`p-3.5 cursor-pointer transition-colors rounded-lg ${
                          IamSelected
                            ? "bg-blue-50/70 dark:bg-gray-700 border-l-4 border-blue-600"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-white/30 dark:bg-gray-800/50"
                        }`}
                      >
                        <div className="grid grid-cols-5 items-center">
                          <span className="font-mono text-gray-900 text-sm dark font-semibold dark:text-white flex flex-col">
                            {item.userName}
                            <span className="font-normal text-xs">
                              {item.grade}
                            </span>
                          </span>
                          <span className="text-xs text-gray-600 truncate font-medium dark:text-white">
                            {item.activityName}
                          </span>
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 p-1 w-fit rounded">
                            {item.requestHours} hours
                          </span>
                          <span className="text-xs text-gray-200 ">
                            {new Date(item.submittedAt).toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-200 ">
                            {item.vouch}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}

                {selectedRequest && (
                  <div className="bits-modal-overlay fixed inset-0 z-40 bg-darker/80 backdrop-brightness-50">
                    <div className="bits-modal-content fixed inset-0 z-50 m-auto h-fit w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl border dark:border-white/10 border-surface-300/70 border-black/20 bg-surface dark:bg-surface outline-none">
                      <div className="dark:bg-[#161a22] dark:text-white px-6">
                        <div className="flex items-center py-4 pb-0 text-base justify-between">
                          <p>Request Details</p>
                          <button
                            onClick={() => setSelectedRequest(null)}
                            className="inline-flex items-center justify-center rounded-lg p-1 text-sm transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.93] motion-reduce:active:scale-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-gray-700 "
                          >
                            <X />
                          </button>
                        </div>
                        <div>
                          <div className="divide-y divide-dotted divide-gray-500">
                            <div className="flex flex-col text-sm py-4">
                              <p className="flex justify-between">
                                <span>{selectedRequest.userName}</span>
                                <span>Submitted At</span>
                              </p>
                              <p className="flex justify-between dark:text-gray-400">
                                <span>{selectedRequest.grade}</span>
                                <span>
                                  {new Date(
                                    selectedRequest.submittedAt,
                                  ).toLocaleString()}
                                </span>
                              </p>
                            </div>
                            <div className="grid grid-cols-2 items-start">
                              <div className="flex flex-col items-start py-4 text-sm gap-3 dark:text-gray-400">
                                <span>Activity Name</span>
                                <span>Date of Activity</span>
                                <span>Hours Requested</span>
                                <span>Vouch</span>
                                <span>Description</span>
                              </div>
                              <div className="flex flex-col items-center py-4 text-sm gap-3 dark:text-gray-200 text-left">
                                <div className="w-full flex flex-col gap-3 items-start">
                                  <span>{selectedRequest.activityName}</span>
                                  <span>
                                    {new Date(
                                      selectedRequest.dateofActivity,
                                    ).toLocaleDateString()}
                                  </span>
                                  <span>
                                    {selectedRequest.requestHours} hrs
                                  </span>
                                  <span>{selectedRequest.vouch}</span>
                                  <div className="max-h-24 overflow-y-auto pr-1 scrollbar-thin">
                                    <span className="text-xs">
                                      {selectedRequest.description}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 py-4 flex flex-col gap-1 ">
                              <div className="grid grid-cols-2 items-center">
                                <span>Teacher's note</span>
                                <span
                                  className={`text-xs flex justify-end ${CurWordCount >= 250 ? "text-red-500 font-semibold" : "text-gray-500 dark:text-gray-400"}`}
                                >
                                  {CurWordCount}/250 words
                                </span>
                              </div>
                              <textarea
                                value={trnote}
                                onChange={(e) => setTrNote(e.target.value)}
                                placeholder="Send a note to your student regarding this request..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:text-white text-sm not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500 resize-none"
                              ></textarea>
                              <div className="flex gap-2 mt-2 justify-end">
                                {!hiddenOW ? (
                                  <button
                                    onClick={() => handleNotes("ow")}
                                    className="w-40 border-2 dark:border-purple-500 dark:text-purple-400 border-purple-600 text-purple-500 justify-center items-center gap-1.5 rounded-xl py-2 px-4 text-sm transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.93] motion-reduce:active:scale-100 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                                  >
                                    Overwrite
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleNotes("")}
                                    className="w-40 flex border-2 dark:border-blue-500 dark:text-blue-400 border-blue-600 text-blue-500 justify-center items-center gap-1.5 rounded-xl py-2 px-4 text-sm transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.93] motion-reduce:active:scale-100 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                  >
                                    Save note
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-center items-center gap-3 w-full py-4">
                              <button
                                onClick={() => handleProcess("Denied")}
                                className="w-40 flex border-2 dark:border-red-500 dark:text-red-500 border-red-600 text-red-600 justify-center items-center gap-1.5 rounded-xl py-2 px-4 text-sm transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.93] motion-reduce:active:scale-100  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:border-white dark:focus-visible:ring-offset-[#161a22] dark:focus-visible:border-[#161a22] hover:bg-red-50 dark:hover:bg-red-950/30"
                              >
                                <X className="w-4 h-4 shrink-0" />
                                <span className="leading-none pt-px">
                                  Deny Request
                                </span>
                              </button>
                              <button
                                onClick={() => handleProcess("Approved")}
                                className="w-fit flex border-2 border-green-600 bg-green-600 text-white justify-center items-center gap-1.5 rounded-xl py-2 px-4 text-sm transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.93] motion-reduce:active:scale-100 hover:bg-green-700 hover:border-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#161a22]"
                              >
                                <Check className="w-4 h-4 shrink-0" />
                                <span className="leading-none pt-px">
                                  Approve Request
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {totalPage > 1 && (
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-300 dark:border-gray-700">
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    Page {currentPage} of {totalPage}
                  </span>

                  <div className="flex gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage((prev) => prev - 1);
                        setSelectedRequest(null);
                      }}
                      className="px-3 py-1 text-xs font-semibold rounded-md bg-gray-200 dark:bg-gray-700 transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.93] motion-reduce:active:scale-100"
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      disabled={currentPage === totalPage}
                      onClick={() => {
                        setCurrentPage((prev) => prev + 1);
                        setSelectedRequest(null);
                      }}
                      className="px-3 py-1 text-xs font-semibold rounded-md bg-gray-200 dark:bg-gray-700 transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.93] motion-reduce:active:scale-100"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
