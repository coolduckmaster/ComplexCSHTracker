import React from "react";
import { backendUrl } from "./App";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Onboarding = ({ SetOnboard }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [grade, setGrade] = React.useState("");
  const [campus, setCampus] = React.useState("");
  const [NCschoolId, SetSchoolId] = React.useState("");

  React.useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 50);
  }, []);

  const formHandler = async (event) => {
    event.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const schoolId = NCschoolId.toUpperCase()
      const response = await axios.post(backendUrl + "/api/user/onboarding", {
        userId,
        grade,
        campus,
        schoolId
      });

      if (response.data.success) { 
        toast.success("Infomation has been saved successfully!");
        SetOnboard(true);
        localStorage.setItem("CompleteOnboard", true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error to save!", error);
      toast.error(error.message);
    }
  };

  return (
    <div
      className={` fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black dark:text-white transition-opacity duration-1000 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <ToastContainer theme="dark" />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="item-center justify-center text-2xl">
          Let's add some infomation to your account.
        </p>
        <form
          onSubmit={formHandler}
          className="w-full max-w-md mx-auto mt-10 bg-white p-4 rounded-2xl shadow-lg  dark:bg-mist-950 dark:text-white"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="School ID"
              value={NCschoolId}
              onChange={(e) => SetSchoolId(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md dark:text-white  not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md dark:text-white dark:bg-mist-950 dark:border-white not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500"
              >
                <option hidden >Campus:</option>
                <option value="Campus A">Campus A</option>
                <option value="Campus B">Campus B</option>
                <option value="N/A Campus">N/A</option>
              </select>

              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md dark:text-white dark:dark:bg-mist-950 dark:border-white not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500"
              >
                <option hidden >Grade:</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
                <option value="N/A Grade">N/A</option>
              </select>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
