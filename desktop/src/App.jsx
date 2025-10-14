import { BrowserRouter } from "react-router";
import ProjectRoutes from "./ProjectRoutes";

function App() {
  return (
    <>
      <BrowserRouter basename="/medcard">
        <ProjectRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
