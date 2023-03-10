import { Switch } from '@mui/material';
import {
  BrowserRouter,
  Route,
  Router,
  Routes,
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import './App.css';
import AddTrip from './components/AddTrip';
import Card from './components/Card';
import CardSpecification from './components/CardSpecification';
import ErrorPage from './components/ErrorPage';
import Home from './components/Home';
import Navbar from './components/Navbar';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "card/:cardId",
        element: <CardSpecification />,
      },
      {
        path: "card/:cardId/add",
        element: <AddTrip />,
      },
    ],
  },
]);

function App() {
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
