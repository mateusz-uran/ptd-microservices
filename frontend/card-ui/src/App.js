import { Switch } from '@mui/material';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import './App.css';
import AddTrip from './components/AddTrip';
import Card from './components/Card';
import Home from './components/Home';

function App() {
  return (
    <div className='App'>
      {/* <Card /> */}
      {/* <Home /> */}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/addtrip' element={<AddTrip/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
