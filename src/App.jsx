import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Login from "./components/Login";
import Home from "./components/Home";
import NannyDetails from "./components/NannyDetails";
import BookingForm from "./components/BookingForm";
import Bookings from "./components/Bookings";
import About from "./components/About";

import ErrorPage from "./components/ErrorPage";

function App() {
  return (
    <div className="app">
      <Header />

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/nannies/:nannyId" element={<NannyDetails />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/new/:nannyId" element={<BookingForm />} />
          <Route path="/profile" element={<div>Profile coming soon</div>} />

          <Route path="/about" element={<About />} />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;