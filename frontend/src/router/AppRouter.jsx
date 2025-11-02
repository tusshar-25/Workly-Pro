// src/router/AppRouter.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import NotFound from "../pages/NotFound";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
