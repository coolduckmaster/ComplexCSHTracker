/* eslint-disable no-unused-vars */
import React from "react";
import Home from "./Home";

// eslint-disable-next-line react-refresh/only-export-components
export function useAutoDarkDetect() {
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme:dark)");
    const handleChange = (event) => {
      setDarkMode(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return darkMode;
}

const WelcomeBackExtra = () => {
  const [showNext, setShowNext] = React.useState(() => {
    return sessionStorage.getItem("seenwelcome") === "true";
  });
  const [isFaded, setIsFaded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const storedName = localStorage.getItem("userName") || "User";
  const CompleteOnboard = localStorage.getItem("CompleteOnboard") === "true";
  const handleClick = () => {
    if (isFaded) return;
    setIsFaded(true);
    setTimeout(() => {
      setShowNext(true);
      sessionStorage.setItem("seenwelcome", "true");
      setIsFaded(false);
    }, 1000);
  };

  React.useEffect(() => {
    const loadingCheck = async () => {
      try {
        const response = await fetch("http://localhost:5173");
        const data = await response.json();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }; //future me pls find a better solution to this. maybe remove it entirely?

    loadingCheck();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center font-mono items-center min-h-screen bg-gray-100 dark:bg-black dark:text-white transition-opacity duration-1000 ease-in-out">
        <p>Loading...</p>
      </div>
    );
  }

  if (CompleteOnboard & !showNext) {
    return (
      <div className="bg-white dark:bg-black">
        <div
          onClick={handleClick}
          className={`fixed inset-0 z-50 flex justify-center items-center bg-gray-100 dark:bg-black dark:text-white cursor-pointer select-none transition-opacity duration-1000 ease-in-out ${
            isFaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <p className="font-mono text-3xl"> Welcome back {storedName} </p>
        </div>
      </div>
    );
  }

  return null;
};

export function ExportButton({ children }) {
  const [isExploded, setIsExploded] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);

  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const particlesRef = React.useRef([]);
  const animationFrameRef = React.useRef(null);

  React.useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.velocityX;
      p.y += p.velocityY;
      p.velocityY += 0.12;
      p.opacity -= p.decay;

      if (p.opacity <= 0) return false;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return true;
    });

    if (particlesRef.current.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setIsVisible(false);
    }
  };

  const handleExplode = () => {
    if (isExploded) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setIsExploded(true);

    const newParticles = [];

    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 3;
      newParticles.push({
        x: centerX,
        y: centerY,
        size: Math.random() * 4 + 2,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: `hsl(${Math.random() * 360}, 85%, 60%)`,
        opacity: 1,
        decay: Math.random() * 0.02 + 0.02,
      });
    }

    particlesRef.current = newParticles;
    animate();
  };

  if (!isVisible) return null;

  const child = React.Children.only(children);
  const enhancedChild = React.cloneElement(child, {
    onClick: (e) => {
      if (child.props.onClick) child.props.onClick(e);
      handleExplode();
    },
    disabled: isExploded || child.props.disabled,
    className: `${child.props.className} transform transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
      isExploded
        ? "opacity-0 scale-50 pointer-events-none"
        : "opacity-100 scale-100"
    }`,
  });

  return (
    <div ref={containerRef} className="relative inline-block">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-50"
      />
      {enhancedChild}
    </div>
  );
} // temp solution, gotta ship tmr :(

const ZaHourRangePick = ({
  showMore,
  startHour,
  setStartHour,
  endHour,
  setEndHour,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  min = 0,
  max = 80,
}) => {
  if (!showMore) return null;
  const minVal = startHour !== "" ? startHour : min;
  const maxVal = endHour !== "" ? endHour : max;

  const minPos = ((minVal - min) / (max - min)) * 100;
  const maxPos = ((maxVal - min) / (max - min)) * 100;

  return (
    <div className="absolute right-0 top-10 z-50 p-4 bg-white dark:bg-[#161a22] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-3 min-w-65">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
        <span className="font-semibold text-xs text-gray-700 dark:text-gray-200">
          Hours Range
        </span>
        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium font-mono">
          {minVal} - {maxVal} hrs
        </span>
      </div>

      <div className="relative w-full h-2 rounded bg-gray-200 dark:bg-gray-700 my-2">
        <div
          className="absolute h-full bg-blue-500 rounded"
          style={{ left: `${minPos}%`, width: `${maxPos - minPos}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(e) => setStartHour(Math.min(e.target.value, maxVal - 1))}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none top-0 cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(e) => setEndHour(Math.max(e.target.value, minVal + 1))}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none top-0 cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
        />
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className="font-semibold text-xs text-gray-700 dark:text-gray-200">
          Sort By
        </span>
        <div className="flex gap-2 text-xs">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 p-1.5 rounded-md border border-gray-300 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="submittedAt">Submission Date</option>
            <option value="dateofActivity">Activity Date</option>
            <option value="requestHours">Hours</option>
            <option value="activityName">Activity Name</option>
          </select>

          <button
            type="button"
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="px-2.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
          >
            {sortOrder === "asc" ? "↑ Ascend" : "↓ Descend"}
          </button>
        </div>
      </div>

      {(startHour !== "" ||
        endHour !== "" ||
        sortBy !== "submittedAt" ||
        sortOrder !== "desc") && (
        <button
          onClick={() => {
            setStartHour("");
            setEndHour("");
            setSortBy("submittedAt");
            setSortOrder("desc");
          }}
          className="text-xs text-red-500 hover:underline text-right"
        >
          Reset More Filters
        </button>
      )}
    </div>
  );
};

export { WelcomeBackExtra, ZaHourRangePick };
