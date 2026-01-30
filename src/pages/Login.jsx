import React from "react";
import { useState } from "react";

const Login = () => {
  const [state, setState] = useState("login");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sm:w-[352px] w-full text-center border border-gray-300/60 dark:border-gray-700 rounded-2xl px-8 bg-transparent"
    >
      <h1 className=" login-h text-gray-900 dark:text-white text-3xl mt-10 font-medium">
        {state === "login" ? "Login" : "Sign up"}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
        Please sign in to continue
      </p>

      {state !== "login" && (
        <div className="flex items-center mt-6 w-full   border border-gray-300/80 dark:border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500 dark:text-gray-400"
          >
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className=" input w-full  placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none ring-0"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      )}

      <div className="flex items-center w-full mt-4  border border-gray-300/80 dark:border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-500 dark:text-gray-400"
        >
          <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
          <rect x="2" y="4" width="20" height="16" rx="2" />
        </svg>
        <input
          type="email"
          name="email"
          placeholder="Email id"
          className=" input w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none ring-0"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex items-center mt-4 w-full   border border-gray-300/80 dark:border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-500 dark:text-gray-400"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <input
          type="password"
          name="password"
          placeholder="Password"
          className=" input w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none ring-0"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mt-4 text-left">
        <button
          className="text-sm text-indigo-500 dark:text-black hover:underline cursor-pointer "
          type="button"
        >
          Forget password?
        </button>
      </div>

      <button
        type="submit"
        className="mt-2 w-full h-11 rounded-full text-white bg-gray dark:bg-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
      >
        {state === "login" ? "Login" : "Sign up"}
      </button>

      <p
        onClick={() =>
          setState((prev) => (prev === "login" ? "register" : "login"))
        }
        className="text-gray-500 dark:text-gray-400 text-sm mt-3 mb-11 cursor-pointer"
      >
        {state === "login"
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <span className="c-here  hover:underline">
          click here
        </span>
      </p>
    </form>
  );
};

export default Login;