import React from "react";
import { staffApi } from "./api";

const barColor = (pct) =>
  pct < 33 ? "bg-red-500" : pct < 66 ? "bg-amber-500" : "bg-emerald-500";

const LowestStudents = ({ grade, goal = 60 }) => {
  const [students, setStudents] = React.useState([]);
  const [status, setStatus] = React.useState("loading"); // loading done error

  React.useEffect(() => {
    if (!grade || grade === "None") return;
    let cancelled = false;

    const load = async () => {
      try {
        const { data } = await staffApi.post("csh/trrankings", { grade });
        if (cancelled) return;
        if (data.success) {
          setStudents(data.ranking);
          setStatus("done");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setStatus("error");
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [grade]);

  return (
    <div className="p-4 bg-gray-100 rounded-xl shadow-sm dark:bg-[#161a22] dark:text-white border border-gray-200 dark:border-gray-800">
      <p className="font-mono text-sm text-gray-500 dark:text-gray-400 mb-3">
        Lowest CSH in class
      </p>

      {!grade || grade === "None" ? (
        <p className="text-sm italic text-gray-500 dark:text-gray-400">
          No class selected. Pick one in Settings.
        </p>
      ) : status === "loading" ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      ) : status === "error" ? (
        <p className="text-sm text-red-500">Couldn't load students.</p>
      ) : students.length === 0 ? (
        <p className="text-sm italic text-gray-500 dark:text-gray-400">
          No students in this class yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {students.map((s) => {
            const pct = Math.min(Math.round((s.approvedHours / goal) * 100), 100);
            return (
              <li key={s._id} className="space-y-1">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    {s.avatarUrl ? (
                      <img
                        src={s.avatarUrl}
                        alt={s.name}
                        className="h-6 w-6 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-xs font-bold uppercase">
                        {s.name?.charAt(0)}
                      </div>
                    )}
                    <span className="truncate font-medium">{s.name}</span>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-gray-600 dark:text-gray-300">
                    {s.approvedHours}/{goal} hrs
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor(pct)}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LowestStudents;