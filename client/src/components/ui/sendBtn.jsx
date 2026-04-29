import React from 'react';

const Button = () => {
  return (
<button className="group flex items-center  text-white gap-1 px-3 py-1 cursor-pointer font-semibold tracking-widest rounded-md  duration-300 hover:gap-2">
  <svg
    className="w-7 h-7 transition-transform duration-300 group-hover:-rotate-45"
    stroke="#B768DC"
    strokeWidth="2"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
</button>
  );
}

export default Button;
