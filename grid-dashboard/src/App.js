import React from 'react';
import Navbar from './Navbar';
import Home from './pages/Home';
import {Route, Routes} from "react-router-dom"
import DataComparison from './pages/DataComparison';
import ScenarioStatistics from './pages/ScenarioStatistics';

function App() {

  return( 
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dataComparison" element={<DataComparison />} />
      <Route path="/scenarioStatistics" element={<ScenarioStatistics />} />
    </Routes>
  </>);
}

export default App;
