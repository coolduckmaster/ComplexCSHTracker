/* eslint-disable no-unused-vars */
import React from "react";
import { backendUrl } from "./App";
import axios from "axios";
import { toast } from "react-toastify";
import {
  SendHorizontal,
  Info,
  Clock,
  CheckCircle,
  Hourglass,
  FileText,
} from "lucide-react";

axios.interceptors.request.use((config) => {
  config.baseURL = backendUrl + "/api/user/";
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const CSHRequest = () => {
  //const [isVisible, setIsVisible] = React.useState(false);
  const [inputCD, setInputCD] = React.useState(false);
  const [inputType, setInputType] = React.useState("text");
  const [activityName, setActivityName] = React.useState("");
  const [requestHours, setRequestHours] = React.useState("");
  const [doa, setDoA] = React.useState("");
  const [vouch, setVouch] = React.useState("");
  const [des, setDes] = React.useState("");

  React.useEffect(() => {
    const fetchauth = async () => {
      try {
        const verified = sessionStorage.getItem(
          "xq1hBo4x4a9xxa6Op3TQtqw3CoCZXaVO",
        );
        if (!verified) {
          const response = await axios.post("authcheck");
          if (response.data.success) {
            sessionStorage.setItem("xq1hBo4x4a9xxa6Op3TQtqw3CoCZXaVO", true);
          } else {
            toast.error("An error has occurred while verifying your data!");
          }
        }
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 403) {
          toast.error("Invaild Token! Returning to login..");
          setTimeout(() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.replace("/");
          }, 2000);
        } else {
          toast.error("An error has occurred while verifying your data!");
        }
      }
    };

    fetchauth();
  }, []);

  function handleCoolDown() {
    setInputCD(true);
    setTimeout(() => {
      setInputCD(false);
    }, 10000);
  }

  const handleDesChange = (e) => {
    const val = e.target.value;
    const word = val.trim().split(/\s+/).filter(Boolean);
    if (word.length <= 100 || val.length < des.length) {
      setDes(val);
    }
  };

  const CurWordCount = des.trim().split(/\s+/).filter(Boolean).length;

  const formHandler = async (event) => {
    event.preventDefault();
    if (!inputCD) {
      if (CurWordCount <= 100) {
        try {
          const userId = localStorage.getItem("userId");
          const response = await axios.post("csh/register", {
            userId,
            activityName,
            requestHours,
            dateofActivity: doa,
            vouch,
            description: des,
          });
          if (response.data.success) {
            toast.success("RegisterCSH");
            handleCoolDown();
            FormReset()
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error("An error occurred while submitting the request.");
          console.log(error);
        }
      } else {
        toast.error("Your description is more than 100 words!");
      }
    }
  };

  function FormReset() {
    setActivityName("");
    setRequestHours("");
    setDoA("");
    setVouch("");
    setDes("");
    setInputType("text");
  }

  return (
    <div>
      <div className="w-full min-w-0  p-4 pt-16 md:p-9 lg:pt-9">
        <div className="mb-1 sm:mb-1 space-y-1">
          <p className="text-base text-gray-500 dark:text-gray-400 italic font-mono">
            Complex CSH Tracker
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
              Requests
            </h1>
          </div>
          <p className="text-base text-gray-500 dark:text-gray-400 font-mono">
            Have CSH needed to be cashed? Fill out a request.
          </p>
        </div>
        <div className="flex gap-3">
          <form
            onSubmit={formHandler}
            className="w-3xl max-w-full mt-4 grow-3 bg-[#e1e4e8] rounded-2xl shadow-lg space-y-6 dark:bg-[#161a22] dark:text-white"
          >
            <div className="grid grid-cols-2 gap-4 p-5">
              <div className="flex flex-col space-y-2 mt-2">
                <p>Activity Name</p>
                <input
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  required
                  type="string"
                  placeholder="e.g., Beach Cleanup, PTC"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:text-white  not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500"
                ></input>
                <span className="text-xs dark:text-white/70">
                  Enter the name of your activity.
                </span>
              </div>

              <div className="flex flex-col space-y-2 mt-2">
                <span>Requested Hours</span>
                <input
                  value={requestHours}
                  onChange={(e) => setRequestHours(e.target.value)}
                  required
                  type="number"
                  min="0"
                  placeholder="e.g., 3, 5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:text-white not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500"
                ></input>
                <span className="text-xs dark:text-white/70">
                  Enter the number of requested hours. 
                </span>
              </div>

              <div className="flex flex-col space-y-2">
                <span>Date of Activity</span>
                <input
                  value={doa}
                  type={inputType}
                  required
                  onFocus={() => setInputType("date")}
                  onBlur={(e) => {
                    if (!e.target.value) setInputType("text");
                  }}
                  onChange={(e) => setDoA(e.target.value)}
                  placeholder="Select date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:text-white  not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500"
                ></input>
                <span className="text-xs dark:text-white/70">
                  Enter the date this activity took place.
                </span>
              </div>

              <div className="flex flex-col space-y-2">
                <span>Vouch</span>
                <input
                  value={vouch}
                  type="text"
                  required
                  placeholder=""
                  onChange={(e) => setVouch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:text-white  not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500"
                ></input>
              </div>

              <div className="flex flex-col col-span-2 space-y-2">
                <div className="flex justify-between items-center">
                  <p>Description</p>
                  <span
                    className={`text-xs ${CurWordCount >= 100 ? "text-red-500 font-semibold" : "text-gray-500 dark:text-gray-400"}`}
                  >
                    {CurWordCount}/100 words
                  </span>
                </div>
                <textarea
                  value={des}
                  required
                  rows={3}
                  placeholder="Describe the activity you did, what your role was, and what you accomplished."
                  onChange={(e) => setDes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:text-white text-sm not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500 resize-none"
                />
              </div>
                  <div></div>
              <div
                onClick={() =>
                  inputCD &&
                  toast.error("Please wait 10 seconds before submitting again.")
                }
                className="w-full flex justify-end"
              >
                <button
                  disabled={inputCD}
                  className={`w-45 flex justify-center items-center text-sm font-medium py-2 rounded-md transition duration-300
                  ${inputCD ? "bg-gray-400 cursor-not-allowed text-gray-200" : "bg-blue-600 hover:bg-blue-700 text-white"}
                  `}
                >
                  Submit Request
                </button>
              </div>
            </div> 
          </form>

          <div className="mt-4 ml-3 p-5 gap-3 grow bg-[#e1e4e8] rounded-2xl shadow-lg dark:bg-[#161a22] dark:text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full dark:text-blue-500 dark:bg-mist-950 bg-gray-100 text-blue-600">
                <Info className="h- w-5" />
              </div>
              <span className="text-base font-semibold">
                Request Guidelines
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 ml-2 text-sm">
              <div className="flex gap-4 items-center">
                <div className="dark:text-white/60 text-black/70">
                  <Clock className="h-7 w-7" />
                </div>
                <span className="flex flex-col">
                  Submit requests within 7 days
                  <span className="dark:text-white/60 text-black/70">
                    of the activity date.
                  </span>
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <div className="dark:text-white/60 text-black/70">
                  <CheckCircle className="h-7 w-7" />
                </div>
                <span className="flex flex-col">
                  You will be notified once
                  <span className="dark:text-white/60 text-black/70">
                    your request has been approved.
                  </span>
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <div className="dark:text-white/60 text-black/70">
                  <Hourglass className="h-7 w-7" />
                </div>
                <span className="flex flex-col">
                  Be honest with your hours.
                  <span className="dark:text-white/60 text-black/70">
                    Ensure that your hours are correct.
                  </span>
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <div className="dark:text-white/60 text-black/70">
                  <FileText className="h-7 w-7" />
                </div>
                <span className="flex flex-col">
                  Submit accurate infomation.
                  <span className="dark:text-white/60 text-black/70">
                    Double-check your hours and details.
                  </span>
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <div className="dark:text-white/60 text-black/70">
                  <FileText className="h-7 w-7" />
                </div>
                <span className="flex flex-col">
                  Follow school policy.
                  <span className="dark:text-white/60 text-black/70 flex flex-col">
                    All your activities must fit within
                    <span>school's policy to be eligable for credits.</span>
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

export default CSHRequest;
