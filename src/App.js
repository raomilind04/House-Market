import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Explore from "./pages/explore";
import Offers from "./pages/offers";
import Profile from "./pages/profile";
import SignIN from "./pages/signIn";
import SignUP from "./pages/signUp";
import ForgotPassword from "./pages/forgotPassword";
import Category from "./pages/category";
import CreateListing from "./pages/createListing";
import Listing from "./pages/listing";


import Navbar from "./components/navbar";
import PrivateRoute from "./components/privateRoute";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/profile" element={<PrivateRoute />} >
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SignIN />} />
          <Route path="/sign-up" element={<SignUP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/category/:categoryName/:listingId" element={<Listing />} />
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
