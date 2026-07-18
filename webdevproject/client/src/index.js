import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Member from "./Member";
import Admin from "./Admin";
import Payment from "./Payment";
import UploadReceipt from "./UploadReceipt";
import AllStepDone from "./AllStepDone";
import ReserveForm from "./reservelist";
import AllTour from "./pages/AllTour";
import Confirm from "./Confirm";
import ProfileForm from "./Profile";
import TourSchedule from "./pages/TourSchedule";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/member",
    element: <Member />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/payments",
    element: <Payment />,
  },
  {
    path: "/uploadreceipt",
    element: <UploadReceipt />,
  },
  {
    path: "/AllStepDone",
    element: <AllStepDone />,
  },
  {
    path: "/history",
    element: <ReserveForm />,
  },
  {
    path: "/alltour",
    element: <AllTour />,
  },
  {
    path: "/tour-schedule/:tourId",
    element: <TourSchedule />,
  },
  {
    path: "/confirm",
    element: <Confirm />,
  },
  {
    path: "/profile",
    element: <ProfileForm />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
