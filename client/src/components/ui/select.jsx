import { useState, useRef, useEffect } from "react";

const ModeSelect = ({ mode, setMode, theme }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const options = [
    { value: "text", label: "Text", icon: "✦" },
    { value: "image", label: "Image", icon: "⬡" },
  ];

  const selected = options.find((o) => o.value === mode);

  // Закрываем по клику вне компонента
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200
          ${theme === "dark"
            ? "text-white bg-white/10 hover:bg-white/20"
            : "text-purple-700 bg-[#6D5FB9] hover:bg-purple-500"
          }`}
      >
        <span>{selected?.icon}</span>
        <span>{selected?.label}</span>
        <span className={`text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[100px] rounded-xl overflow-hidden shadow-lg border border-purple-800 dark:border-white/10 bg-white dark:bg-[#1e1028]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => { setMode(option.value); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-150
                ${mode === option.value
                  ? "bg-purple-400 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-white/5"
                }`}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModeSelect;