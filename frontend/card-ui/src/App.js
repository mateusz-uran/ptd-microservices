import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import './App.css';
import AddFuel from './components/AddFuel';
import AddTrip from './components/AddTrip';
import CardSpecification from './components/CardSpecification';
import ErrorPage from './components/ErrorPage';
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
        path: "card/:cardId/add-trip",
        element: <AddTrip />,
      },
      {
        path: "card/:cardId/add-fuel",
        element: <AddFuel />,
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
