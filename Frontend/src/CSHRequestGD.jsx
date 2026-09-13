// eslint-disable-next-line no-unused-vars
import React from "react";
import { toast } from "react-toastify";
import {
  GoogleDrive2026,
  AzureImage,
  Pdf,
  GoogleSheets,
  GoogleSlides,
  GoogleDocs,
} from "@thesvg/react";
import { Paperclip, X } from "lucide-react";
const formateFS = (byte) => {
  const num = Number(byte);
  if (!num || isNaN(num) || num <= 0) return null;
  const conversion = 1024;
  const types = ["Bytes", "KB", "MB", "GB", "TB"];
  const convertmifile = Math.floor(Math.log(num) / Math.log(conversion));
  const roundminumber = (num / Math.pow(conversion, convertmifile)).toFixed(1);
  return `${roundminumber} ${types[convertmifile]}`;
};

const fetchmemyToken = () => {
  try {
    const meOToken = sessionStorage.getItem("rvWiyipyYdbZ5Tkb6q35");
    if (!meOToken) return null;
    const { token, expiresAt } = JSON.parse(meOToken);
    if (token && expiresAt && Date.now() < expiresAt - 120 * 1000) {
      return token;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const stashingToken = (token, expiresInSeconds = 3599) => {
  const expiresAt = Date.now() + Number(expiresInSeconds) * 1000;
  sessionStorage.setItem(
    "rvWiyipyYdbZ5Tkb6q35",
    JSON.stringify({ token, expiresAt }),
  );
};

const fetchmemyImage = (mimeType = "", fileName = "") => {
  const ext = fileName.split(".").pop().toLowerCase();
  const mime = mimeType.toLowerCase();

  if (
    mime.startsWith("image/") ||
    ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext)
  ) {
    return {
      label: ext.toUpperCase() || "IMG",
      icon: <AzureImage className="w-8 h-8" />,
    };
  }

  if (mime.startsWith("pdf") || ext === "pdf") {
    return {
      label: "PDF",
      icon: <Pdf className="w-8 h-8" />,
    };
  }

  if (
    mime.includes("spreadsheet") ||
    mime.includes("excel") ||
    ["xlsx", "xls", "csv"].includes(ext)
  ) {
    return {
      label: "SHEET",
      icon: <GoogleSheets className="w-8 h-8" />,
    };
  }

  if (
    mime.includes("presentation") ||
    mime.includes("powerpoint") ||
    ["pptx", "ppt"].includes(ext)
  ) {
    return {
      label: "PRESENTATION",
      icon: <GoogleSlides className="w-8 h-8" />,
    };
  }

  if (
    mime.includes("document") ||
    mime.includes("word") ||
    ["docx", "doc", "txt"].includes(ext)
  ) {
    return {
      label: "DOCUMENT",
      icon: <GoogleDocs className="w-8 h-8" />,
    };
  }

  if (mime.startsWith("video/") || ["mp4", "mov", "avi", "mkv"].includes(ext)) {
    return {
      label: "VIDEO",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          style={{ display: "block" }}
        >
          <path
            d="M20.92 0H6.15C4.79 0 3.69 1.1 3.69 2.46V29.54C3.69 30.9 4.79 32 6.15 32H25.85C27.21 32 28.31 30.9 28.31 29.54V9.85L20.92 0Z"
            fill="#7C3AED"
          />
          <path d="M19.69 8.62V0.62L27.69 8.62H19.69Z" fill="#C4B5FD" />
          <path
            d="M12.62 14.77L18.35 18.46L12.62 22.15V14.77Z"
            fill="#FFFFFF"
          />
        </svg>
      ),
    };
  }

  if (
    mime.includes("zip") ||
    mime.includes("compressed") ||
    ["zip", "rar", "7z", "tar"].includes(ext)
  ) {
    return {
      label: "ZIP",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          style={{ display: "block" }}
        >
          <path
            d="M20.92 0H6.15C4.79 0 3.69 1.1 3.69 2.46V29.54C3.69 30.9 4.79 32 6.15 32H25.85C27.21 32 28.31 30.9 28.31 29.54V9.85L20.92 0Z"
            fill="#EAB308"
          />
          <path d="M19.69 8.62V0.62L27.69 8.62H19.69Z" fill="#FEF08A" />
          <path
            d="M10.15 4.92H13.85V7.38H10.15V4.92ZM13.85 7.38H17.54V9.85H13.85V7.38ZM10.15 9.85H13.85V12.31H10.15V9.85ZM13.85 12.31H17.54V14.77H13.85V12.31ZM10.15 14.77H17.54V17.23H10.15V14.77Z"
            fill="#854D0E"
          />
        </svg>
      ),
    };
  }

  return {
    label: ext ? ext.toUpperCase() : "FILE",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{ display: "block" }}
      >
        <path
          d="M20.92 0H6.15C4.79 0 3.69 1.1 3.69 2.46V29.54C3.69 30.9 4.79 32 6.15 32H25.85C27.21 32 28.31 30.9 28.31 29.54V9.85L20.92 0Z"
          fill="#475569"
        />
        <path d="M19.69 8.62V0.62L27.69 8.62H19.69Z" fill="#CBD5E1" />
      </svg>
    ),
  };
};

const CSHRequestGDPick = ({ vouch = [], setVouch }) => {
  const renderMePicker = (accessToken) => {
    window.gapi.load("picker", () => {
      document.body.style.overflow = "hidden";

      const unlockBody = () => {
        document.body.style.overflow = "";
      };
      const recentView = new window.google.picker.DocsView()
        .setMode(window.google.picker.DocsViewMode.GRID)
        .setLabel("Recent");
      const uploadView = new window.google.picker.DocsUploadView()
        .setIncludeFolders(true)
        .setLabel("Upload"); 
      const driveView = new window.google.picker.DocsView()
        .setIncludeFolders(true)
        .setSelectFolderEnabled(false)
        .setMode(window.google.picker.DocsViewMode.LIST)
        .setLabel("My Drive");
      const modelWidth = Math.min(window.innerWidth - 40, 1050);
      const modelHeight = Math.min(window.innerHeight - 100, 600);

      const picker = new window.google.picker.PickerBuilder()
        .setTitle("Insert files using Google Drive")
        .addView(recentView)
        .addView(uploadView)
        .addView(driveView)
        .setSize(modelWidth, modelHeight)
        .setOrigin(window.location.origin)
        .setOAuthToken(accessToken)
        .setDeveloperKey(import.meta.env.VITE_GOOGLE_API_KEY)
        .setAppId(import.meta.env.VITE_GOOGLE_APP_ID)
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .enableFeature(window.google.picker.Feature.SUPPORT_DRIVES)
        .setCallback((data) => {
          if (data.action === window.google.picker.Action.PICKED) {
            unlockBody();
            const docs = data[window.google.picker.Response.DOCUMENTS] || [];
            const selected = docs.map((doc) => ({
              id: doc.id,
              name: doc.name,
              url: doc.url,
              mimeType: doc.mimeType || "",
              iconUrl: doc.iconUrl || null,
              sizeBytes: doc.sizeBytes || null,
            }));
            
            setVouch((prev) => [...prev, ...selected]);
            toast.success(`${selected.length} Drive file(s) attached!`);
          } else if (data.action === window.google.picker.Action.CANCEL) {
            unlockBody();
          }
        })
        .build();

      picker.setVisible(true);
    });
  };
  const handleOpenerPick = () => {
    if (!window.google?.accounts?.oauth2 || !window.gapi) {
      toast.error("Google API client is loading. Please wait!");
      return;
    }
    const seeMeOToken = fetchmemyToken();
    if (seeMeOToken) {
      renderMePicker(seeMeOToken);
      return;
    }
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope:
        "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly",
      callback: (tokenRes) => {
        if (tokenRes.error) {
          toast.error("FAILURE: " + tokenRes.error);
          return;
        }
        stashingToken(tokenRes.access_token, tokenRes.expires_in);
        renderMePicker(tokenRes.access_token);
      },
    });

    tokenClient.requestAccessToken({ prompt: "" });
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-1.5">
        <Paperclip className="h-4 w-4 text-blue-500" />
        <span>Vouch</span>
      </div>
      <div>
        <button
          type="button"
          onClick={handleOpenerPick}
          className="w-full flex items-center justify-center gap-2 px-3 py-5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
        >
          <GoogleDrive2026 className="h-4.5 w-4.5" />
          {vouch.length > 0
            ? "Add more or change files?"
            : "Attach a file with Google Drive?"}
        </button>
      </div>
    </div>
  );
};
const CSHRequestGDList = ({ vouch = [], setVouch }) => {
  const removeVouch = (id) => {
    setVouch((prev) => prev.filter((file) => file.id !== id));
  };

  if (vouch.length === 0) return null;

  return (
    <div className="flex flex-col col-span-2 space-y-1 w-full">
      <ul className="grid grid-cols-1 sm:grid-cols-4 gap-2 max-h-14 overflow-y-auto pr-1">
        {vouch.map((file) => {
          const miImage = fetchmemyImage(file.mimeType, file.name);
          return (
            <li
              key={file.id}
              className="p-2 flex items-center justify-between text-xs border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
                  {miImage.icon}
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[80%]"
                >
                  {file.name}
                </a>
                {file.sizeBytes && (
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {formateFS(file.sizeBytes)}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeVouch(file.id)}
                className="text-gray-400 hover:text-red-500 cursor-pointer p-0.5"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export { CSHRequestGDPick, CSHRequestGDList };
  