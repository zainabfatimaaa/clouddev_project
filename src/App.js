import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginPage from './Login.tsx'
import SignupPage from './SignUp.tsx';
import LandingPage from './LandingPage.tsx'
import HomePage from './HomePage.tsx'
import MenuPage from './Menu.tsx'
import ProfilePage from './MyProfile.tsx';
import Success from './Success.tsx'
import MyOrders from './MyOrders.tsx'
import AllOrders from './Orders.tsx'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage/>}/>
        <Route exact path="/login" element={<LoginPage/>}/>
        <Route exact path="/signup" element={<SignupPage/>}/>
        <Route exact path="/home" element={<HomePage/>}/>
        <Route exact path="/menu" element={<MenuPage/>}/>
        <Route exact path="/profile" element={<ProfilePage/>}/>
        <Route exact path="/success" element={<Success/>}/>
        <Route exact path="/my-orders" element={<MyOrders/>}/>
        <Route exact path="/orders" element={<AllOrders/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
