import React from "react";

const Dashboard = () => {
  const [isRole, setIsRole] = React.useState("Student");
  React.useEffect(() => {
    function assumeRole() {
      const adtoken = localStorage.getItem("adtoken") || "";
      const trtoken = localStorage.getItem("trtoken") || "";

      if (adtoken) {
        setIsRole("Admin");
      } else if (trtoken) {
        setIsRole("Teacher");
      }
    }

    assumeRole();
  }, []);

  return (
    <div>
      <div className="mx-auto w-full min-w-0 max-w-7xl p-4 pt-16 md:p-8 lg:pt-8">
        <div className="mb-6 sm:mb-8">
          <p className="text-lg text-gray-500 dark:text-gray-400 italic font-mono">
            Complex CSH Tracker
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
            {isRole} Dashboard
          </h1>
        </div>
        <div className=" dark:bg-black rounded-lg border border-gray-300 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
          <p className="text-lg justify-center font-mono">You logged:</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
