/* eslint-disable no-unused-vars */
import React from "react";
import Home from "./Home";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// eslint-disable-next-line react-refresh/only-export-components
export function useAutoDarkDetect() {
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme:dark)");
    const handleChange = (event) => {
      setDarkMode(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return darkMode;
}

const WelcomeBackExtra = () => {
  const [showNext, setShowNext] = React.useState(() => {
    return sessionStorage.getItem("seenwelcome") === "true";
  });
  const [isFaded, setIsFaded] = React.useState(false);
  const [isLowTaperFade, setIsLowTaperFade] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const storedName = localStorage.getItem("userName") || "User";
  const CompleteOnboard = localStorage.getItem("CompleteOnboard") === "true";
  const seenwelcome = sessionStorage.getItem("seenwelcome") || false;

  const handleClick = () => {
    if (isFaded) return;
    setIsFaded(true);
    setTimeout(() => {
      setShowNext(true);
      sessionStorage.setItem("seenwelcome", "true");
      setIsFaded(false);
    }, 1000);
  };

  React.useEffect(() => {
    const loadingCheck = async () => {
      try {
        const response = await fetch("https://complex-csh-tracker.vercel.app");
        const data = await response.json();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLowTaperFade(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    }; //future me pls find a better solution to this. maybe remove it entirely?

    loadingCheck();
  }, []);

  if (isLoading) {
    return (
      <div
        className={`fixed inset-0 z-50 flex justify-center font-mono items-center min-h-screen bg-gray-100 dark:bg-black dark:text-white transition-opacity duration-1000 ease-in-out ${
          isLowTaperFade & showNext
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (CompleteOnboard & !showNext) {
    return (
      <div className="bg-white dark:bg-black">
        <div
          onClick={handleClick}
          className={`fixed inset-0 z-50 flex justify-center items-center bg-gray-100 dark:bg-black dark:text-white cursor-pointer select-none transition-opacity duration-1000 ease-in-out ${
            isFaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <p className="font-mono text-3xl"> Welcome back {storedName} </p>
        </div>
      </div>
    );
  }

  return null;
};

 // deadline actually moved to oct 31 wth.

const ZaHourRangePick = ({
  showMore,
  startHour,
  setStartHour,
  endHour,
  setEndHour,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  min = 0,
  max = 80,
}) => {
  if (!showMore) return null;
  const minVal = startHour !== "" ? startHour : min;
  const maxVal = endHour !== "" ? endHour : max;

  const minPos = ((minVal - min) / (max - min)) * 100;
  const maxPos = ((maxVal - min) / (max - min)) * 100;

  return (
    <div className="absolute right-0 top-10 z-50 p-4 bg-white dark:bg-[#161a22] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-3 min-w-65">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
        <span className="font-semibold text-xs text-gray-700 dark:text-gray-200">
          Hours Range
        </span>
        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium font-mono">
          {minVal} - {maxVal} hrs
        </span>
      </div>

      <div className="relative w-full h-2 rounded bg-gray-200 dark:bg-gray-700 my-2">
        <div
          className="absolute h-full bg-blue-500 rounded"
          style={{ left: `${minPos}%`, width: `${maxPos - minPos}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(e) => setStartHour(Math.min(e.target.value, maxVal - 1))}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none top-0 cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(e) => setEndHour(Math.max(e.target.value, minVal + 1))}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none top-0 cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
        />
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className="font-semibold text-xs text-gray-700 dark:text-gray-200">
          Sort By
        </span>
        <div className="flex gap-2 text-xs">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-2.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="submittedAt">Submission Date</option>
            <option value="dateofActivity">Activity Date</option>
            <option value="requestHours">Hours</option>
            <option value="activityName">Activity Name</option>
          </select>

          <button
            type="button"
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="px-2.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {sortOrder === "asc" ? "↑ Ascend" : "↓ Descend"}
          </button>
        </div>
      </div>

      {(startHour !== "" ||
        endHour !== "" ||
        sortBy !== "submittedAt" ||
        sortOrder !== "desc") && (
        <button
          onClick={() => {
            setStartHour("");
            setEndHour("");
            setSortBy("submittedAt");
            setSortOrder("desc");
          }}
          className="text-xs text-red-500 hover:underline text-right"
        >
          Reset More Filters
        </button>
      )}
    </div>
  );
};

const exportToPdf = async (data) => {
  const loadMyImagepls = (image) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = image;
    });

  const pdf = new jsPDF({ orientation: "landscape" });
  pdf.setFontSize(20);
  pdf.text("Complex CSH Tracker - Your History", 14, 15);
  pdf.setFontSize(15);
  pdf.text(`Exported on ${new Date().toLocaleString()}`, 14, 22);
  try {
    const amiloaded = await loadMyImagepls("/CSH.png");
    pdf.addImage(amiloaded, "PNG", 267, 10, 16, 16, undefined, "FAST");
  } catch (error) {
    console.log("Image pdf error has occured.");
  }

  autoTable(pdf, {
    startY: 28,
    head: [
      [
        "Activity",
        "Date of Activity",
        "Hours",
        "Status",
        "Teacher's Note",
        "Submitted On",
      ],
    ],
    body: data.map((row) => [
      row.activityName || "N/A",
      row.dateofActivity
        ? new Date(row.dateofActivity).toLocaleDateString()
        : "N/A",
      row.requestHours ?? "?",
      row.status || "Unknown",
      row.trnote || "",
      row.submittedAt ? new Date(row.submittedAt).toLocaleString() : "N/A",
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  pdf.save(
    `csh-history ${new Date().toLocaleString().replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
  );
}; // thank you tr. hamza

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
        <span>out of {total}</span>
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

// eslint-disable-next-line react-refresh/only-export-components
export { WelcomeBackExtra, ZaHourRangePick, exportToPdf, CircularProgress, ProgressBar };
