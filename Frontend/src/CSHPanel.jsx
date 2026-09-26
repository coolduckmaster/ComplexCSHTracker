/* eslint-disable no-unused-vars */
import React from "react";
import { backendUrl, Placeholder } from "./App";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Search,
  X,
} from "lucide-react";

const api = axios.create();

api.interceptors.request.use((config) => {
  config.baseURL = backendUrl + "/api/user/csh/";
  const token = localStorage.getItem("adtoken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const CSHPanel = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hiddenOW, setHiddenOW] = React.useState(true);
  const [ow, setOW] = React.useState("");

  const [search, setSearch] = React.useState("");

  const [requests, setRequests] = React.useState([]);
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [processingId, setProcessingId] = React.useState(null);
  const [trnote, setTrNote] = React.useState("");

  const [currentPage, setCurrentPage] = React.useState(1);
  const [showExtra, setShowExtra] = React.useState(false);

  React.useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data: FRdata } = await api.get("fetchpendingreq");
        if (FRdata?.success && Array.isArray(FRdata.data)) {
          setRequests(FRdata.data);
        } else {
          toast.error("Invalid Token! Returning to login..");
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
    fetchRequests();
  }, []);

  const handleProcess = async (status) => {
    if (!selectedRequest) return;
    const { userId, requestId } = selectedRequest;
    setProcessingId(requestId);

    try {
      const { data: HPdata } = await api.post("approval", {
        userId,
        requestId,
        status,
      });

      if (HPdata.success) {
        const updatedList = requests.filter((r) => r.requestId !== requestId);
        setRequests(updatedList);
        setSelectedRequest(null);
        setTrNote("");
        setHiddenOW(true);
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
      toast.error("Failed to process request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleNotes = async (owParam) => {
    if (!selectedRequest) return;
    const { userId, requestId } = selectedRequest;

    if (!trnote.trim()) {
      return toast.error("Missing teacher's note");
    }

    if (CurWordCount <= 250) {
      try {
        const saveNote = await api.post("approval", {
          userId,
          requestId,
          trnote,
          ow: owParam,
        });

        if (saveNote.data.success) {
          toast.success("Successfully noted!");
          setHiddenOW(true);
          setOW("");
        } else if (saveNote.data.message === "Trnote exist, overwrite") {
          setHiddenOW(false);
          toast.info("A note for this request already exist, overwrite?");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error saving note");
      }
    } else {
      toast.error("Word limit reached.");
    }
  };

  const handleVouchArray = (vouchZeInput) => {
    if (!vouchZeInput) return [];

    if (Array.isArray(vouchZeInput)) {
      return vouchZeInput.map((item, index) => {
        if (typeof item === "string") {
          return { id: index, name: `Attachment ${index + 1}`, url: item };
        }
        return {
          id: item.id || index,
          name: item.name || `Attachment ${index + 1}`,
          url: item.url || "#",
          sizeBytes: item.sizeBytes || null,
          mimeType: item.mimeType || "",
        };
      });
    }

    if (typeof vouchZeInput === "string") {
      try {
        const parsed = JSON.parse(vouchZeInput);
        if (Array.isArray(parsed)) return handleVouchArray(parsed);
      } catch (e) {
        return vouchZeInput
          .split(",")
          .map((url, index) => ({
            id: index,
            name: `Attachment ${index + 1}`,
            url: url.trim(),
          }))
          .filter((item) => item.url);
      }
    }
    return [];
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

  const CurWordCount = trnote.trim() ? trnote.trim().split(/\s+/).length : 0;

  const handleWordCount = (e) => {
    const val = e.target.value;
    const words = val.trim().split(/\s+/).filter(Boolean);
    if (words.length <= 250 || val.length < trnote.length) {
      setTrNote(val);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center font-mono items-center min-h-screen bg-gray-100 dark:bg-[#0d1117] dark:text-white">
        <p>Loading...</p>
      </div>
    );
  }

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
              <p className="text-lg font-semibold">
                Pending Request (<span>{searchRequest.length || "0"}</span>)
              </p>

              <div className="flex w-full max-w-sm items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  placeholder="Search by student or activity..."
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
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
                        onClick={() => {
                          setSelectedRequest(item);
                          setTrNote(item.trnote || "");
                          setHiddenOW(true);
                        }}
                        className={`p-3.5 cursor-pointer transition-all rounded-xl border ${
                          IamSelected
                            ? "bg-blue-50/80 dark:bg-gray-800 border-blue-500 dark:border-blue-500 shadow-sm"
                            : "bg-white dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80"
                        }`}
                      >
                        <div className="grid grid-cols-5 items-center">
                          <span className="font-mono text-gray-900 text-sm font-semibold dark:text-white flex flex-col">
                            {item.userName}
                            <span className="font-normal text-xs text-gray-500 dark:text-gray-400">
                              {item.grade}
                            </span>
                          </span>
                          <span className="text-xs text-gray-600 truncate font-medium dark:text-gray-300">
                            {item.activityName}
                          </span>
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 p-1 px-2 w-fit rounded-full border border-blue-200 dark:border-blue-800/50">
                            {item.requestHours} hours
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {item.submittedAt
                              ? new Date(item.submittedAt).toLocaleString()
                              : "N/A"}
                          </span>
                          <span className="text-xs">
                            {(() => {
                              const files = handleVouchArray(item.vouch);
                              if (files.length === 0)
                                return (
                                  <span className="text-gray-400">None</span>
                                );
                              return (
                                <span className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/50 px-2 py-0.5 rounded-full">
                                  <Paperclip className="w-3 h-3" />
                                  {files.length} file
                                  {files.length > 1 ? "s" : ""}
                                </span>
                              );
                            })()}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}

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
                        <div className="flex items-center py-4 text-base justify-between font-semibold border-b border-gray-100 dark:border-gray-800/60 pb-3">
                          <p>Request Details</p>
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(null)}
                            className="inline-flex items-center justify-center rounded-lg p-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-white transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div>
                          <div className="divide-y divide-gray-200 dark:divide-gray-800">
                            <div className="flex items-center gap-3 text-sm py-4">
                              <img
                                src={selectedRequest.avatarUrl || Placeholder}
                                alt="Student Avatar"
                                loading="lazy"
                                className="aspect-square rounded-full h-10 w-10 object-cover border border-gray-200 dark:border-gray-700"
                              />
                              <div className="flex-1">
                                <p className="flex justify-between font-semibold text-gray-900 dark:text-white">
                                  <span>{selectedRequest.userName}</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                                    Submitted At
                                  </span>
                                </p>

                                <p className="flex justify-between text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                                  <span>{selectedRequest.grade}</span>
                                  <span>
                                    {selectedRequest.submittedAt
                                      ? new Date(
                                          selectedRequest.submittedAt
                                        ).toLocaleString()
                                      : "N/A"}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 items-start">
                              <div className="flex flex-col items-start py-4 text-sm gap-3 text-gray-500 dark:text-gray-400 font-medium">
                                <span>Activity Name</span>
                                <span>Date of Activity</span>
                                <span>Hours Requested</span>
                                <span>Vouch</span>
                                <span>Description</span>
                              </div>
                              <div className="flex flex-col items-center py-4 text-sm gap-3 text-gray-900 dark:text-gray-200 text-left">
                                <div className="w-full flex flex-col gap-3 items-start">
                                  <span className="font-medium">{selectedRequest.activityName}</span>
                                  <span>
                                    {selectedRequest.dateofActivity
                                      ? new Date(
                                          selectedRequest.dateofActivity
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    {selectedRequest.requestHours} hrs
                                  </span>
                                  <div className="w-full">
                                    {(() => {
                                      const files = handleVouchArray(
                                        selectedRequest.vouch
                                      );
                                      if (files.length === 0) {
                                        return (
                                          <span className="text-xs text-gray-400">
                                            No documents attached
                                          </span>
                                        );
                                      }

                                      const firstFile = files[0];
                                      const remainingFile = files.slice(1);

                                      return (
                                        <div className="flex items-center gap-2 text-xs w-full max-w-xs relative">
                                          <a
                                            href={firstFile.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline truncate font-medium"
                                          >
                                            <Paperclip className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate">
                                              {firstFile.name}
                                            </span>
                                          </a>

                                          {remainingFile.length > 0 && (
                                            <button
                                              type="button"
                                              onClick={() => setShowExtra(true)}
                                              className="shrink-0 font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 px-1.5 py-0.5 rounded transition"
                                            >
                                              +{remainingFile.length} more
                                            </button>
                                          )}
                                          {showExtra && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                                              <div className="bg-white dark:bg-[#161a22] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl max-w-sm w-full p-4 relative flex flex-col gap-2">
                                                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 flex items-center justify-between">
                                                  <span>
                                                    Attached files (
                                                    {files.length})
                                                  </span>
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      setShowExtra(false)
                                                    }
                                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-white rounded p-0.5"
                                                  >
                                                    <X className="w-4 h-4" />
                                                  </button>
                                                </div>
                                                <div className="flex flex-col items-start py-2 border-b border-t border-gray-200 dark:border-gray-800">
                                                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 w-full">
                                                    {files.map((file) => (
                                                      <a
                                                        key={file.id}
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                                      >
                                                        <Paperclip className="w-3.5 h-3.5 shrink-0" />
                                                        <span className="truncate">
                                                          {file.name}
                                                        </span>
                                                      </a>
                                                    ))}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </div>
                                  <div className="max-h-24 overflow-y-auto pr-1 scrollbar-thin w-full">
                                    <span className="text-xs text-gray-600 dark:text-gray-300">
                                      {selectedRequest.description ||
                                        "No description provided."}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="py-4 flex flex-col gap-2">
                              <div className="grid grid-cols-2 items-center text-sm font-medium">
                                <span className="text-gray-900 dark:text-white">Teacher's note</span>
                                <span
                                  className={`text-xs flex justify-end ${
                                    CurWordCount >= 250
                                      ? "text-red-500 font-semibold"
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                >
                                  {CurWordCount}/250 words
                                </span>
                              </div>
                              <textarea
                                value={trnote}
                                onChange={handleWordCount}
                                placeholder="Send a note to your student regarding this request..."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                                rows={3}
                              />
                              <div className="flex gap-2 mt-1 justify-end">
                                {!hiddenOW ? (
                                  <button
                                    type="button"
                                    onClick={() => handleNotes("ow")}
                                    className="w-36 border border-purple-600 text-purple-600 dark:border-purple-500 dark:text-purple-400 justify-center items-center gap-1.5 rounded-lg py-1.5 px-3 text-xs font-semibold transition-all hover:bg-purple-50 dark:hover:bg-purple-950/30"
                                  >
                                    Overwrite
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleNotes("")}
                                    className="w-36 border border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 justify-center items-center gap-1.5 rounded-lg py-1.5 px-3 text-xs font-semibold transition-all hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                  >
                                    Save note
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-end items-center gap-3 w-full py-4">
                              <button
                                type="button"
                                disabled={
                                  processingId === selectedRequest.requestId
                                }
                                onClick={() => handleProcess("Denied")}
                                className="flex border border-red-600 text-red-600 dark:border-red-500 dark:text-red-400 justify-center items-center gap-1.5 rounded-xl py-2 px-4 text-sm font-semibold transition-all hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50"
                              >
                                <X className="w-4 h-4 shrink-0" />
                                <span>
                                  {processingId === selectedRequest.requestId
                                    ? "Processing..."
                                    : "Deny Request"}
                                </span>
                              </button>
                              <button
                                type="button"
                                disabled={
                                  processingId === selectedRequest.requestId
                                }
                                onClick={() => handleProcess("Approved")}
                                className="flex border border-green-600 bg-green-600 text-white justify-center items-center gap-1.5 rounded-xl py-2 px-4 text-sm font-semibold transition-all hover:bg-green-700 hover:border-green-700 disabled:opacity-50"
                              >
                                <Check className="w-4 h-4 shrink-0" />
                                <span>
                                  {processingId === selectedRequest.requestId
                                    ? "Processing..."
                                    : "Approve Request"}
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