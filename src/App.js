import React from 'react';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "dashboard",
    element: <Dashboard />
  }
]);

function App() {
  return (
    <RouterProvider router={router}>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </nav>
        </header>
      </div>
    </RouterProvider>
  );
}

export default App;
