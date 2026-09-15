import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import NannyDetails from "./components/NannyDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/nannies/:nannyId" element={<NannyDetails />} />
    </Routes>
  );
}

export default App;
