import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import React, { useState } from "react";

export const AuthContext = React.createContext();

function AuthProvider(props) {
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  const register = async (data) => {
    await axios.post("http://localhost:4001/auth/register", data);
    navigate("/login");
  };

  const login = async (data) => {
    // console.log(data)
    try {
      // console.log(data);
      const result = await axios.post("http://localhost:4001/auth/login", data);
      // console.log(result);
      const token = result.data.token;
      // console.log(token);
      localStorage.setItem("token", token);
      const userData = jwtDecode(token);
      setUserData({ ...userData, user: userData });
      navigate("/");
    } catch (err) {
      console.log("Err is : " + err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserData({ ...userData,user: null });
  };

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ userData, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };