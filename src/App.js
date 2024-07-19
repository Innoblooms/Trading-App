import React from 'react';
import Login from './Login';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './components/Signup';
import AdminDashboard from './Admin';

function App() {
  return (
   <BrowserRouter>
       <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/dashboard' element={<AdminDashboard/>}></Route>
       </Routes>
   </BrowserRouter>
  );
}

export default App;
