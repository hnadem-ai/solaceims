import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import New from './New'
import './App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<New />} />
      </Routes>
  )
}

export default App
