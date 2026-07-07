const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const authClient = {
  signIn: {
    email: async ({ email, password }) => {
      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          return { error: { message: data.message || "Ошибка входа" } };
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("fluxAuthToken", data.token);
          localStorage.setItem("fluxUser", JSON.stringify({
            _id: data._id,
            name: data.name,
            email: data.email,
          }));
        }

        return { data, error: null };
      } catch (error) {
        return { error: { message: error.message || "Ошибка подключения" } };
      }
    },
  },
  signUp: {
    email: async ({ name, email, password }) => {
      try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          return { error: { message: data.message || "Ошибка регистрации" } };
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("fluxAuthToken", data.token);
          localStorage.setItem("fluxUser", JSON.stringify({
            _id: data._id,
            name: data.name,
            email: data.email,
          }));
        }

        return { data, error: null };
      } catch (error) {
        return { error: { message: error.message || "Ошибка подключения" } };
      }
    },
  },
  signOut: async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("fluxAuthToken");
      localStorage.removeItem("fluxUser");
      localStorage.removeItem("fluxChats");
      localStorage.removeItem("fluxSelectedChat");
    }

    return { success: true };
  },
};