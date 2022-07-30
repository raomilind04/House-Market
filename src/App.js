import {BrowserRouter as Router, Route, Routes} from "react-router-dom"; 

import Explore from "./pages/explore";
import Offers from "./pages/offers";
import Profile from "./pages/profile";
import SignIN from "./pages/signIn";
import SignUP from "./pages/signUp";
import ForgotPassword from "./pages/forgotPassword";

import Navbar from "./components/navbar";

function App() {
  return (
   <>
    <Router>
      <Routes>
        <Route path= "/" element={<Explore />} />
        <Route path= "/offers" element={<Offers />} />
        <Route path= "/profile" element={<Profile />} />
        <Route path= "/sign-in" element={<SignIN />} />
        <Route path= "/sign-up" element={<SignUP />} />
        <Route path= "/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <Navbar />
    </Router>
   </>
  );
}

export default App;
