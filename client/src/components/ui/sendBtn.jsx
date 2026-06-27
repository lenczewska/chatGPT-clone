import React from "react";

const Button = ({ theme, loading = false }) => {
  const iconColor = loading
    ? "text-purple-700"
    : theme === "dark"
      ? "text-[#9C30BD]"
      : "text-black";

  return (
    <span className="group flex items-center justify-center pointer-events-none">
      <svg
        className={`w-7 h-7 transition-transform duration-300 ${loading ? "" : "group-hover:-rotate-45"} ${iconColor}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {loading ? (
          <path
            d="M6 6h12v12H6z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
      </svg>
    </span>
  );
};

export default Button;
