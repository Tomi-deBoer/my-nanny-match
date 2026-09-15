import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import NannyDetails from "./components/NannyDetails";
import BookingForm from "./components/BookingForm";
import Bookings from "./components/Bookings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/nannies/:nannyId" element={<NannyDetails />} />
       <Route path="/bookings/new/:nannyId" element={<BookingForm />} />
       <Route path="/bookings/edit/:bookingId" element={<BookingForm />} />
       <Route path="/bookings" element={<Bookings />} />
    </Routes>
  );
}

export default App;
