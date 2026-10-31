import React from "react";
import { toast } from "react-toastify";
import { api } from "./api";
import { X } from "lucide-react";

const Setting = ({ setShowSetting }) => {
  const [selectedGrade, setSelectedGrade] = React.useState(
    () => localStorage.getItem("ownedClass") || "None",
  );

  const handleClick = async () => {
    try {
      const response = await api.post("sync", { ownedClass: selectedGrade });
      if (response.data.success) {
        toast.success("Settings updated successfully");
        localStorage.setItem("ownedClass", selectedGrade);
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating settings");
    }
  };

  return (
    <div className="bits-modal-overlay fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bits-modal-content w-full max-w-xl overflow-hidden rounded-2xl border dark:border-white/15 bg-white dark:bg-[#161a22] text-gray-900 dark:text-white shadow-2xl outline-none">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800/60 dark:bg-black/20">
          <p className="text-base font-semibold tracking-tight">Settings</p>
          <button
            type="button"
            onClick={() => setShowSetting(false)}
            className="inline-flex items-center justify-center rounded-lg p-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-white transition-all hover:bg-gray-100 dark:hover:bg-gray-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Select your default filter grade for your teacher dashboard
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-sm border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-black/30 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
            >
              <option value="None">None</option>
              <option value="Grade 12">Grade 12</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 9">Grade 9</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-black/20">
          <button
            type="button"
            onClick={() => setShowSetting(false)}
            className="px-4 py-2 text-sm font-medium rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm transition-all active:scale-[0.96] outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
            onClick={handleClick}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
