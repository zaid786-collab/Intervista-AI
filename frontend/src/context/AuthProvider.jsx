import { useEffect, useState } from "react";
import { fetchCurrentUser, getToken, setToken, clearToken, login as apiLogin, signup as apiSignup } from "../api";
import { AuthContext } from "./authContextCore";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }

    let isMounted = true;

    fetchCurrentUser()
      .then((currentUser) => {
        if (isMounted) setUser(currentUser);
      })
      .catch(() => {
        clearToken();
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    const data = await apiLogin(credentials);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const signup = async (credentials) => {
    const data = await apiSignup(credentials);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: Boolean(user),
        isAdmin: Boolean(user?.is_admin),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
