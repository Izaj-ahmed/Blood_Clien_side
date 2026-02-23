import { createBrowserRouter } from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import PrivateRouter from "./PrivateRouter";
import DashboardLayout from "../Layout/DashboardLayout";

// Dashboard Pages
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import UserManagement from "../Pages/Dashboard/UserManagement/UserManagement";

// Admin Components
import ManageVolunteers from "../Pages/Dashboard/ManageVolunteers/ManageVolunteers";

// Routes Guards
import AdminRoute from "./AdminRoute";
import Profile from "../Pages/Dashboard/Profile/Profile";
import MyDonations from "../Pages/Dashboard/MyParcels/MyDonations";
import VolunteerAllBloodRequest from "../Pages/VolunteerAllBloodRequest/VolunteerAllBloodRequest";
import ManageDonationRequests from "../Pages/Dashboard/ApproveRiders/ManageDonationRequests";
import DonorRoute from "./DonorRoute";
import Funding from "../Pages/Rider/Funding";
import BeAVolunteer from "../Pages/Dashboard/BeAVolunteer/BeAVolunteer";
import DonationRequests from "../Pages/DonationRequests/DonationRequests";
import PaymentSuccess from "../Pages/Dashboard/Payment/PaymentSuccess";
import PaymentCancel from "../Pages/Dashboard/Payment/PaymentCancel";
import MyDonationStatus from "../Pages/Dashboard/PaymentHistory/MyDonationStatus";


export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path:'fundings',
        element:<Funding></Funding>,
        loader: () => fetch('/servicecenter.json').then(res => res.json())
      },
      {
        path: '/dashboard/be-volunteer',
        element: <PrivateRouter><BeAVolunteer></BeAVolunteer></PrivateRouter>,
        loader: () => fetch('/servicecenter.json').then(res => res.json())
      },
      {
        path: 'donation-requests',
        element:  <DonorRoute><DonationRequests></DonationRequests></DonorRoute>,
        loader: () => fetch('/servicecenter.json').then(res => res.json())
      },
      {
        path: 'donation-request/:id',
        element: <PrivateRouter><ManageDonationRequests/></PrivateRouter> // You need to create this
      }
    ]
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'register',
        Component: Register
      }
    ]
  },
  {
    path: 'dashboard',
    element: <PrivateRouter><DashboardLayout></DashboardLayout></PrivateRouter>,
    children: [
      // Common routes for ALL users
      {
        index: true,
        Component: DashboardHome
      },
      {
        path: 'profile',
        Component: Profile 
      },
      {
        path: 'payment-success',
        Component: PaymentSuccess
      },
      {
        path: 'payment-cancelled',
        Component: PaymentCancel
      },
      {
        path: 'payment-history',
        Component: MyDonationStatus
      },
      
      // Donor only routes
      
      {
        path: 'my-donation-requests',
        element: <DonorRoute><MyDonations /></DonorRoute>
      },
      
      // Admin & Volunteer shared route (but with different permissions inside the component)
      {
        path: 'all-blood-donation-request',
        element: <VolunteerAllBloodRequest /> // Component will check role internally
      },
      
      // Admin only routes
      {
        path: 'all-users',
        element: <AdminRoute><UserManagement /></AdminRoute>
      },
      {
        path: 'manage-volunteers',
        element: <AdminRoute><ManageVolunteers /></AdminRoute>
      }
    ]
  }
]);