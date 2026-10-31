import React from "react";
import { api } from "./api";

const Medalemoji = { 1: "🥇", 2: "🥈", 3: "🥉" };

const LeaderBoard = () => {
  const userGrade = localStorage.getItem("userGrade");
  const [loading, setLoading] = React.useState(true);
  const [didweError, setDidweError] = React.useState(false);
  const [rankings, setRankings] = React.useState([]);
  const [selectedFilter, setSelectedFIlter] = React.useState("All");
  const [lastUpd, setLastUpd] = React.useState(new Date());
  const [elapsedTime, setElapsedTime] = React.useState(0);
  React.useEffect(() => {
    const fetchesMyRankings = async () => {
      try {
        const response = await api.get("csh/rankings");
        if (response.data.success) {
          setRankings(response.data.ranking);
        }
        setLastUpd(new Date());
      } catch (error) {
        console.log(error);
        setDidweError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchesMyRankings();
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const rightnow = new Date();
      const differncalies = Math.floor((rightnow - lastUpd) / 1000 / 60);
      setElapsedTime(differncalies >= 0 ? differncalies : 0);
    }, 60000);
    return () => clearInterval(timer);
  }, [lastUpd]);

  const filteredRankings = rankings.filter((items) => {
    if (selectedFilter === "Your grade") {
      return items.grade === userGrade;
    }
    return true;
  });

  const formatTime = (mins) => {
    if (mins === 0) {
      return "Updated just now";
    } else if (mins === 1) {
      return "Updated 1 min ago";
    } else {
      return `Updated ${mins} mins ago`;
    }
  };

  let statusText = "";
  if (loading) {
    statusText = "Loading...";
  } else if (didweError) {
    statusText = "Couldn't load rankings. Try again later.";
  } else if (filteredRankings.length === 0) {
    statusText = "No rankings found. Perhaps you don't have a grade!";
  }
  return (
    <div className="w-full h-screen flex flex-col px-4 pt-16 md:px-9 lg:pt-9 pb-8 space-y-2">
      <div className="shrink-0 space-y-1">
        <p className="text-base text-gray-500 dark:text-gray-400 italic font-mono">
          Complex CSH Tracker
        </p>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
            Leaderboard
          </h1>
        </div>

        <p className="text-base text-gray-500 dark:text-gray-400 font-mono">
          Lead the board!
        </p>
      </div>
      <div>
        <div className="flex items-center justify-between pb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
            {selectedFilter}
            <span className="italic"> • {formatTime(elapsedTime)}</span>
          </p>
          <div className="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 p-1 gap-1">
            <button
              onClick={() => {
                setSelectedFIlter("All");
              }}
              className={`text-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 
                ${
                  selectedFilter === "All"
                    ? "bg-blue-400 dark:bg-blue-500"
                    : "text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
                }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setSelectedFIlter("Your grade");
              }}
              className={`text-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 
              ${
                selectedFilter === "Your grade"
                  ? "bg-blue-400 dark:bg-blue-500"
                  : "text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
              }
              `}
            >
              Your grade
            </button>
          </div>
        </div>

        <div className="flex min-h-0 w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm dark:border-gray-800 dark:bg-[#161a22]/70 dark:text-white">
          <div className="grid shrink-0 grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-gray-200 px-4 py-3 text-sm font-mono tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <span>Rank</span>
            <span>Student</span>
            <span className="text-right">Time</span>
          </div>
          {statusText ? (
            <span className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm italic">
              {statusText}
            </span>
          ) : (
            <ul className="divide-y divide-gray-200 overflow-y-auto dark:divide-gray-800">
              {filteredRankings.map((items, index) => {
                const ranking = index + 1;
                const username = items.name || "N/A";

                return (
                  <li
                    key={items._id}
                    className={`grid grid-cols-[3rem_1fr_auto] bg-white dark:bg-gray-800/40 items-center gap-4 px-4 py-3 transition-colors `}
                  >
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {Medalemoji[ranking] || `#${ranking}`}
                    </span>

                    <div className="flex min-w-0 items-center gap-3">
                      {items.avatarUrl ? (
                        <img
                          src={items.avatarUrl}
                          alt={username}
                          className="h-8 w-8 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full dark:bg-gray-700 dark:text-gray-200 text-xs font-bold uppercase text-gray  bg-gray-300">
                          {username.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                          {username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {items.grade}
                        </p>
                      </div>
                    </div>
                    <span className="text-right font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {items.approvedHours} hrs
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
