// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'
import MnemonicsGen from './components/Mnemonics_generator';
import Landing_page from './components/landing_page.jsx';

function App() {
 

  return (
    <>
   <Router>
      <Routes>
      
        <Route path="/" element={<Landing_page />} />
       
        <Route path="/CreateWallet" element={<MnemonicsGen />} />
      </Routes>
    </Router>


     {/* <MnemonicsGen/>  */}
    </>
  )
}

export default App
