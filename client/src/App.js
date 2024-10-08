import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import { SocketProvider } from "./context/SocketProvider";
import { UserProvider } from "./context/UserContext";

const App = () => {
  return (
    <Router>
      <UserProvider>
      <SocketProvider>
      <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/chatroom/:roomId" element={<ChatRoom />} />
      </Routes>
      </AuthProvider>
      </SocketProvider>
      </UserProvider>
    </Router>
  );
};

export default App;
