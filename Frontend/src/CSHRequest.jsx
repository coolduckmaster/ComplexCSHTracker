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

const CSHRequest = () => {
  //const [isVisible, setIsVisible] = React.useState(false);
  const [inputCD, setInputCD] = React.useState(false);
  const [inputType, setInputType] = React.useState("text");
  const [activityName, setActivityName] = React.useState("");
  const [requestHours, setRequestHours] = React.useState("");
  const [doa, setDoA] = React.useState("");
  const [vouch, setVouch] = React.useState("");

  function handleCoolDown() {
    setInputCD(true);
    setTimeout(() => {
      setInputCD(false);
    }, 10000);
  }

  const formHandler = async (event) => {
    event.preventDefault();
    if (!inputCD) {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.post(
          backendUrl + "/api/user/csh/register",
          {
            userId,
            activityName,
            requestHours,
            dateofActivity: doa,
            vouch,
          },
        );
        if (response.data.success) {
          toast.success("RegisterCSH");
          handleCoolDown();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("An error occurred while submitting the request.");
        console.log(error);
      }
    }
  };

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
            <div className="grid grid-cols-2 gap-6 p-5">
              <div className="flex flex-col space-y-2 mt-2">
                <p>Activity Name</p>
                <input
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
                <p>Requested Hours</p>
                <input
                  onChange={(e) => setRequestHours(e.target.value)}
                  required
                  type="number"
                  min="0"
                  placeholder="e.g., 3, 5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:text-white  not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500"
                ></input>
                <span className="text-xs dark:text-white/70">
                  Enter the number of requested hours.
                </span>
              </div>

              <div className="flex flex-col space-y-2">
                <p>Date of Activity</p>
                <input
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
                <p>Vouch</p>
                <input
                  type="text"
                  required
                  placeholder=""
                  onChange={(e) => setVouch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:text-white  not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500"
                ></input>
              </div>
              <div
                onClick={() =>
                  inputCD &&
                  toast.error("Please wait 10 seconds before submitting again.")
                }
              >
                <button
                  disabled={inputCD}
                  className={`w-45 flex justify-center items-center gap-3 text-sm font-medium py-2 rounded-md transition duration-300 
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
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-blue-500 bg-mist-950">
                <Info className="h- w-5" />
              </div>
              <span className="text-base font-semibold">
                Request Guidelines
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 ml-2 text-sm">
              <div className="flex gap-4 items-center">
                <div className="text-white/60">
                  <Clock className="h-7 w-7" />
                </div>
                <span className="flex flex-col">
                  Submit requests within 7 days
                  <span className="text-white/60">of the activity date.</span>
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <div className="text-white/60">
                  <CheckCircle className="h-7 w-7" />
                </div>
                <span className="flex flex-col">
                  You will be notified once
                  <span className="text-white/60">
                    your request has been approved.
                  </span>
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <div className="text-white/60">
                  <Hourglass className="h-7 w-7" />
                </div>
                <span className="flex flex-col">
                  Be honest with your hours.
                  <span className="text-white/60">
                    Ensure that your hours are correct.
                  </span>
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <div className="text-white/60">
                  <FileText className="h-7 w-7" />
                </div>
                <span className="flex flex-col">
                  Submit accurate infomation.
                  <span className="text-white/60">
                    Double-check your hours and details.
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
