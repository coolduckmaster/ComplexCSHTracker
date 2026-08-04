import React from "react";

const CSHRequest = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {}, 50);
  }, []);

  return (
    <div className="dark:text-white">
      <div>
        <div className="mx-auto w-full min-w-0  p-4 pt-16 md:p-8 lg:pt-8">
          <div className="mb-6 sm:mb-8 space-y-1">
            <p className="text-lg text-gray-500 dark:text-gray-400 italic font-mono">
              Complex CSH Tracker
            </p>
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
                Request Form
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSHRequest;
