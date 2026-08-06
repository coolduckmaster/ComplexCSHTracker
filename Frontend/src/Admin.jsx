// eslint-disable-next-line no-unused-vars
import React from "react";


const Admin = () => {
  return (
    <div>
      <div className="w-full min-w-0  p-4 pt-16 md:p-9 lg:pt-9">
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
        <div className="flex gap-3">
          <div className="w-3xl max-w-full mt-4 grow-3 bg-[#e1e4e8] rounded-2xl shadow-lg space-y-6 dark:bg-[#161a22] dark:text-white">
            <p>
              Approval Panel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
