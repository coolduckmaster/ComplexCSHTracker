
import axios from "axios";
//const backendUrltest = "http://localhost:4000";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

const signout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.replace("/login");
};

const reqformat = (getToken) => {
  const axiosconfig = axios.create({ baseURL: `${backendUrl}/api/user/` });

  axiosconfig.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosconfig.interceptors.response.use(
    (res) => res,
    (error) => {
      if ([401, 403].includes(error.response?.status)) {
        signout();
      }
      return Promise.reject(error);
    },
  );

  return axiosconfig;
};

export const api = reqformat(() => localStorage.getItem("token"));
export const staffApi = reqformat(
  () => localStorage.getItem("adtoken") || localStorage.getItem("trtoken"),
);
export const publicApi = axios.create({ baseURL: `${backendUrl}/api/user` });

//credits to tr.brishi for the frontend-backend API help :P