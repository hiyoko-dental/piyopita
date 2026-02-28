import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { PatientSearchPage } from "./pages/PatientSearchPage";
import { PatientDetailPage } from "./pages/PatientDetailPage";
import { MessagePage } from "./pages/MessagePage";
import { SettingsPage } from "./pages/SettingsPage";

// Authentication guard component
// Checks if the user is authenticated, otherwise redirects to login
const RequireAuth = () => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    element: <RequireAuth />,
    children: [
      {
        // Pathless layout route to wrap dashboard pages
        Component: DashboardLayout,
        children: [
          {
            index: true,
            Component: HomePage,
          },
          {
            path: "patients",
            Component: PatientSearchPage,
          },
          {
            path: "patients/:id",
            Component: PatientDetailPage,
          },
          {
            path: "messages",
            Component: MessagePage,
          },
          {
            path: "settings",
            Component: SettingsPage,
          },
          {
            path: "*",
            element: <Navigate to="/" replace />,
          },
        ],
      },
    ],
  },
]);
