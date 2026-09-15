import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import NannyDetails from "./components/NannyDetails";
import BookingForm from "./components/BookingForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/nannies/:nannyId" element={<NannyDetails />} />
       <Route path="/bookings/new/:nannyId" element={<BookingForm />} />
    </Routes>
  );
}

export default App;
