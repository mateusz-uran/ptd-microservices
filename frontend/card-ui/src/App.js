import './App.css';
import Card from './components/Card';
import AddTrip from './components/AddTrip';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Card />} />
        <Route path='/add-trip' element={<AddTrip />} />
      </Routes>
    </div>
  );
}

export default App;
