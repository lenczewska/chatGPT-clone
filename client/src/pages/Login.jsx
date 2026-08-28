import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../../src/lib/auth-client";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("login");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (forgotPassword) {
      if (!formData.email) {
        setError("Введите email для сброса пароля");
        setLoading(false);
        return;
      }

      if (!formData.newPassword || !formData.confirmPassword) {
        setError("Введите новый пароль и подтвердите его");
        setLoading(false);
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError("Пароли не совпадают");
        setLoading(false);
        return;
      }

      try {
        const result = await authClient.resetPassword({
          email: formData.email,
          password: formData.newPassword,
        });

        if (result.error) {
          setError(result.error.message || "Не удалось обновить пароль");
          setLoading(false);
          return;
        }

        setSuccessMessage("Пароль успешно обновлён. Пожалуйста, войдите снова.");
        setForgotPassword(false);
        setFormData((prev) => ({
          ...prev,
          email: "",
          password: "",
          name: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setState("login");
        setTimeout(() => {
          setSuccessMessage("");
        }, 2500);
      } catch (err) {
        setError(err.message || "Ошибка сброса пароля");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      if (state === "login") {
        const result = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
        });

        if (result.error) {
          setError(result.error.message || "Ошибка входа");
        } else {
          navigate("/chatBox");
        }
      } else {
        const result = await authClient.signUp.email({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });

        if (result.error) {
          setError(result.error.message || "Ошибка регистрации");
        } else {
          navigate("/chatBox");
        }
      }
    } catch (err) {
      setError(err.message || "Ошибка подключения к серверу");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-[calc(100vh-6rem)] w-full items-center justify-center px-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="login-form w-full max-w-md rounded-2xl border border-gray-300/60 bg-transparent px-6 py-8 text-center dark:border-gray-700 sm:px-8"
      >
        <h1 className=" login-h text-gray-900 dark:text-white text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Please sign in to continue
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-800 rounded-lg">
            <p className="text-green-700 dark:text-green-400 text-sm">{successMessage}</p>
          </div>
        )}

        {state !== "login" && !forgotPassword && (
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
              className="input w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none ring-0"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {!forgotPassword && (
          <>
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
                className="input w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none ring-0"
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
                className="input w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none ring-0"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {forgotPassword && (
          <>
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
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                name="newPassword"
                placeholder="New password"
                className="input w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none ring-0"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>

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
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                className="input w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none ring-0"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <div className="mt-4 text-left">
          {!forgotPassword ? (
            <button
              className="text-sm hover:underline cursor-pointer"
              type="button"
              onClick={() => {
                setForgotPassword(true);
                setState("login");
                setError("");
                setSuccessMessage("");
              }}
            >
              Forget password?
            </button>
          ) : (
            <button
              type="button"
              className="text-sm text-blue-500 hover:underline"
              onClick={() => {
                setForgotPassword(false);
                setFormData((prev) => ({
                  ...prev,
                  newPassword: "",
                  confirmPassword: "",
                }));
              }}
            >
              Back to login
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full h-11 rounded-full text-white bg-gray-400 dark:bg-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Loading..."
            : forgotPassword
            ? "Reset password"
            : state === "login"
            ? "Login"
            : "Sign up"}
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
          <span className="c-here  hover:underline">click here</span>
        </p>
      </form>
    </div>
  );
};

export default Login;