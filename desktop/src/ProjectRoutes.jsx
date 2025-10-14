import { Routes, Route } from "react-router";

import PaginaLogin from "./pages/PaginaLogin";

import Dashboard from "./pages/portal/Dashboard";

function ProjectRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PaginaLogin />}></Route>
      <Route path="/dashboard" element={<Dashboard />} ></Route>
    </Routes>
  );
}

export default ProjectRoutes;
