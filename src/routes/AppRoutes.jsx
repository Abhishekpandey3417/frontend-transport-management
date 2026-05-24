
import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/dashboard/Dashboard";
import Vehicles from "../pages/vehicles/Vehicles";
import Drivers from "../pages/drivers/Drivers";
import Shipments from "../pages/shipments/Shipments";
import Expenses from "../pages/expenses/Expenses";
import PrivateRoute from "./PrivateRoute";
import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />



      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="vehicles" element={<Vehicles />} />

        <Route path="drivers" element={<Drivers />} />

        <Route path="shipments" element={<Shipments />} />

        <Route path="expenses" element={<Expenses />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;