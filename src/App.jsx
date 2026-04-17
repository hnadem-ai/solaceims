import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import New from './New';
import Search from './Search';
import './App.css';
import ProjectView from './components/Views/ProjectView';
import SaleView from './components/Views/SaleView';
import BillView from './components/Views/BillView';

function App() {
  const [count, setCount] = useState(0)

  return (
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<New />} />
        <Route path="/search" element={<Search />} />
        <Route path="/project/:id" element={<ProjectView />} />
        <Route path="/sale/:id" element={<SaleView />} />
        <Route path="/bill/:id" element={<BillView />} />
      </Routes>
  )
}

export default App
