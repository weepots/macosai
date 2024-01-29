import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App';
import ErrorPage from "./pages/ErrorPage";
import Semantic from './pages/Semantic';
import BackgroundRemover from './pages/BackgroundRemover';
import SuperResolution from './pages/SuperResolution';
import StableDiffusion from './pages/StableDiffusion';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />

  },
  {
    path:'/semantic',
    element: <Semantic />
  },

  {
    path:'/backgroundRemover',
    element: <BackgroundRemover />
  },
  {
    path:'/superResolution',
    element: <SuperResolution />
  },
  {
    path:'/stableDiffusion',
    element: <StableDiffusion />
  }


]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
