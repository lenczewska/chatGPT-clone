import React from "react";

const Button = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40px"
      height="40px"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="fill-none hover:rotate-90 duration-300 transition-transform"
    >
      <path
        d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
        strokeWidth="2"
      />
      <path d="M8 12H16" strokeWidth="2" />
      <path d="M12 16V8" strokeWidth="2" />
    </svg>
  );
};

export default Button;
