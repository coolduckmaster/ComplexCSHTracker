import React from "react";

const CSHRequest = () => {
  //const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {}, 50);
  }, []);

  return (
    <div>
      <div className="w-full min-w-0 max-w-7xl p-4 pt-16 md:p-8 lg:pt-8">
        <div className="mb-2 sm:mb-2 space-y-1">
          <p className="text-lg text-gray-500 dark:text-gray-400 italic font-mono">
            Complex CSH Tracker
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
              Requests
            </h1>
          </div>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-mono">
            Have CSH needed to be cashed? Fill out a request.
          </p>
        </div>

        <div>
          <form className="w-2xl max-w-full mt-10 bg-[#e1e4e8] p-8 rounded-2xl shadow-lg space-y-6 dark:bg-[#161a22] dark:text-white">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <p>Activity Name</p>
                <input
              placeholder="e.g., Beach Cleanup, PTC"
              className="w-full px-4 py-3 border border-gray-300 rounded-md dark:text-white  not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500"
              >
              </input>
              </div>
              
              


              <p>DANG BRO2</p>
              <p>DANG BRO3</p>
              <p>DANG BRO4</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CSHRequest;
