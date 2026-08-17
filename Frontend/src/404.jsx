import React from "react";

const Notfound = () => {
  const [clicked, setClicked] = React.useState(false);
  const [build, setBuild] = React.useState(false);
  const [showText, setShowText] = React.useState(true);
  const [logs, setLogs] = React.useState([]);
  const [input, setInput] = React.useState("");
  
  const logContRef = React.useRef(null);
  const redirectInterveRef = React.useRef(null)
  
  const asciiArt = `
  _____               __          ___________ __   ______             __          
 / ___/__  __ _  __  / /____ __  / ___/ __/ // /  /_  __/______ _____/ /_____ ____
/ /__/ _ \\/  ' \\/ _\\/ / -_) \\ / / /___\\ \\/ _  /    / / / __/ _ \`/ __/  '_/ -_) __/
\\___/\\___/_/_/_/.__/_/\\__/_\\_\\  \\___/___/_//_/    /_/ /_/  \\_,_/\\__/_/\\_\\\\__/_/   
              /_/
`;
  const cooloutputline = [
    "[complexcshtracker] > {server} hmr update /src/404.jsx (x4)",
    "[complexcshtracker] > {server} watching path(s): *.*",
    "[complexcshtracker] > {server} watching extensions: js,jsx,ts,tsx",
    "[complexcshtracker] > {server} allocating env: production (v8.10.26-edge)",
    "[complexcshtracker] > {server} initializing worker pool: 4 threads",
    "[complexcshtracker] > {server} to restart at any time, enter `rs`",
    "[complexcshtracker] > {server} auto-restarting due to `Module(AutoRsOnClick)`...",
    "[complexcshtracker] > {server} purging cache: /node_modules/.vite/deps/",
    "[complexcshtracker] > {server} restarting `app.jsx` --v | --get",
    "[complexcshtracker] > {server} restarting `404.jsx` --v | --get",
    "[complexcshtracker] > {server} `app.jsx` && `404.jsx` (v.8.10.26 | 200 OK)",
    "[complexcshtracker] > {server} verifying HMAC session tokens...",
    "[complexcshtracker] > {server} all good - 100 CONTINUE",
    "[complexcshtracker] > {server} switching to client..",
    "[complexcshtracker] > (client) connecting from server...",
    "[complexcshtracker] > (client) connected",
    "[complexcshtracker] > (client) building website",
    "[complexcshtracker] > (client) (01/28) rendering src/main.jsx",
    "[complexcshtracker] > (client) (03/28) mounting DOM target: `#root`",
    "[complexcshtracker] > (client) (05/28) parsing global styles /src/index.css",
    "[complexcshtracker] > (client) (08/28) tree-shaking unused exports...",
    "[complexcshtracker] > (client) (10/28) evaluating router state...",
    "[complexcshtracker] > (client) (12/28) resolving dynamic import chunks...",
    "[complexcshtracker] > (client) (15/28) rendering src/App.jsx",
    "[complexcshtracker] > (client) (18/28) injecting CSS modules into head",
    "[complexcshtracker] > (client) (19/28) fetching route parameters...",
    "[complexcshtracker] > (client) (22/28) rendering src/CSHRequest.jsx",
    "[complexcshtracker] > (client) (24/28) executing client-side telemetry ping...",
    "[complexcshtracker] > (client) (26/28) checking path integrity: `/unknown_route`",
    "[complexcshtracker] > (client) (ER/28) rendering ERROR",
    "[complexcshtracker] > (client) CRITICAL: REQUESTED NOT FOUND",
    "[complexcshtracker] > (client) dynamic import failed: route unresolved",
    "[complexcshtracker] > (client) retransforming: fallback UI",
    "[complexcshtracker] > (client) emitting asset: assets/404-fallback.js [0.42 kB]",
    "[complexcshtracker] > (client) compiling error stack traces...",
    "[complexcshtracker] > (client) success! built in 5271ms",
    "[complexcshtracker] > (client) built completed - status: 404",
  ];

  const formatLogLine = (line) => {
    let baseColor = "text-gray-700 dark:text-gray-300";
    if (line.includes("ERROR") || line.includes("CRITICAL")) {
      baseColor = "text-red-500 font-semibold";
    } else if (
      line.includes("auto-restarting") ||
      line.includes("status: 404")
    ) {
      baseColor = "text-amber-500 dark:text-amber-400";
    } else if (
      line.includes("success") ||
      line.includes("200 OK") ||
      line.includes("connected") ||
      line.includes("100 CONTINUE")
    ) {
      baseColor = "text-emerald-500 dark:text-emerald-400 font-medium";
    }
    const tokens = line.split(
      /(\[complexcshtracker\] >|\{server\}|\(client\))/g,
    );

    return (
      <span className={baseColor}>
        {tokens.map((part, index) => {
          if (part === "[complexcshtracker] >") {
            return (
              <span
                key={index}
                className="text-cyan-600 dark:text-cyan-400 font-bold"
              >
                {part}{" "}
              </span>
            );
          }
          if (part === "{server}") {
            return (
              <span
                key={index}
                className="text-purple-500 dark:text-gray-700 font-semibold"
              >
                {part}
              </span>
            );
          }
          if (part === "(client)") {
            return (
              <span
                key={index}
                className="text-blue-500 dark:text-gray-700 font-semibold"
              >
                {part}
              </span>
            );
          }
          return part;
        })}
      </span>
    );
  };

  const handleClick = () => {
    if (clicked || build) return;
    setClicked(true);
    setBuild(true);
    let index = 0;
    const interveTime = (5000 - 500) / cooloutputline.length;
    const interve = setInterval(() => {
      if (index < cooloutputline.length) {
        const line = cooloutputline[index];
        setLogs((prev) => [...prev, line]);
        index++;
      } else {
        clearInterval(interve);
        setBuild(false);
      }
    }, interveTime);
    setTimeout(() => {
      setShowText(false);
    }, 600);
  };

  const trigRedirect = (endUrl, desname) => {
    setBuild(true);
    setInput("")
    const coolexitoutput = [
      `[complexcshtracker] > Continue to homepage? Y/N: ${input.toUpperCase()}`,
      `[complexcshtracker] > (client) resolving redirect => ${desname}`,
      `[complexcshtracker] > (client) clearing session cache`,
      `[complexcshtracker] > (client) redirecting...`,
    ]

    let step = 0
    redirectInterveRef.current = setInterval(() => {
      if (step < coolexitoutput.length) {
        const line = coolexitoutput[step]
        setLogs((prev) => [...prev, line])
        step++
      } else {
        clearInterval(redirectInterveRef.current)
        window.location.href = endUrl
      }
    }, 250)
  };

  React.useEffect(() => {
    if (logContRef.current) {
      logContRef.current.scrollTop = logContRef.current.scrollHeight;
    }
  }, [logs]);

  React.useEffect(() => {
    return () => {
      if (redirectInterveRef.current) {
        clearInterval(redirectInterveRef.current)
      }
    }
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!clicked || build) return;
      const key = e.key.toLowerCase();
      if (key === "y" || key === "n") {
        setInput(key);
      } else if (e.key === "Backspace") {
        setInput("");
      } else if (e.key === "Enter") {
        if (input === "y") {
          trigRedirect("/", "Dashboard.jsx")
        }
        if (input === "n") {
          trigRedirect("https://www.google.com", "External Search (Google)")
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clicked, build, input]);

  return (
    <div className="dark:bg-black dark:text-white bg-white text-black font-mono">
      <div className="w-screen h-screen grid place-items-center">
        {showText && (
          <p
            onClick={handleClick}
            className={`text-6xl font-mono cursor-pointer flex flex-col items-center justify-center transition-all duration-600 ease-in-out mb-8 ${
              clicked
                ? "opacity-0 -translate-y-4 pointer-events-none"
                : "opacity-100 hover:scale-105"
            }`}
          >
            Page not found!
            <span>404</span>
            <span className="text-xs text-gray-700 dark:text-gray-800">click for a diagnosis</span>
          </p>
        )}
        <div
          ref={logContRef}
          onClick={handleClick}
          className={`w-full max-w-2xl max-h-80 overflow-y-auto scrollbar-none cursor-pointer transition-all duration-500 ${
            clicked
              ? "opacity-100 scale-100"
              : "hidden opacity-80 hover:opacity-100"
          }`}
        >
          <pre className="sm:text-xs leading-none select-none mb-4">
            {asciiArt}
          </pre>

          <div className="mt-2 space-y-1 text-xs sm:text-sm">
            {logs.map((log, index) => (
              <div
                key={index}
                className="animate-fadeIn opacity-90 transition-opacity"
              >
                {formatLogLine(log)}
              </div>
            ))}
          </div>

          {clicked && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              {!build && (
                <div className="text-xs sm:text-sm">
                  <p className="text-white dark:text-white whitespace-pre-wrap">
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                      [complexcshtracker] {">"}{" "}
                    </span>
                    Continue to homepage?{" "}
                    <span className="text-green-500 dark:text-green-400">
                      Y
                    </span>
                    /<span className="text-red-500 dark:text-red-400">N</span>:
                    <span className="dark:text-white uppercase font-bold">
                      {" "}
                      {input}
                    </span>
                  </p>
                </div>
              )}
              <span
                className="w-2 h-4 bg-current block text-white"
                style={{ animation: "fast-pulse 0.6s ease-in-out infinite" }}
              >
                <style>{`
                  @keyframes fast-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                  }
                `}</style>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notfound;
