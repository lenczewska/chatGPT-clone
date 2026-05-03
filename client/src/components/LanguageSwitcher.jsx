import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = ({ theme }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const options = [
    { value: "ru", label: "RU" },
    { value: "en", label: "EN" },
    { value: "az", label: "AZ" },
  ];

  const selected = options.find((o) => o.value === i18n.language) || options[0];

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
        style={{
          backgroundColor: theme === "dark" ? "#4A3A6B" : "#000000",
          color: "white",
        }}
        className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-full transition-all duration-200 hover:opacity-80"
      >
        <span>{selected?.icon}</span>
        <span>{selected?.label}</span>
        <span
          className={`text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-1 z-50 min-w-15 rounded-xl overflow-hidden shadow-lg border border-purple-800 dark:border-white/10 bg-white dark:bg-[#1e1028]">
          {options
            .filter((o) => o.value !== i18n.language)
            .map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  i18n.changeLanguage(option.value);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[12px] !text-white dark:text-white hover:bg-white/10 transition-colors duration-150"
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

export default LanguageSwitcher;
