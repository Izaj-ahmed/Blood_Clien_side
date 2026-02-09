import { createBrowserRouter } from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import Coverage from "../Pages/Coverage/Coverage";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import PrivateRouter from "./PrivateRouter";
import DashboardLayout from "../Layout/DashboardLayout";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentSuccess from "../Pages/Dashboard/Payment/PaymentSuccess";
import PaymentCancel from "../Pages/Dashboard/Payment/PaymentCancel";
import ApproveRiders from "../Pages/Dashboard/ApproveRiders/ManageDonationRequests";
import UserManagement from "../Pages/Dashboard/UserManagement/UserManagement";
import AdminRoute from "./AdminRoute";
import AssignRider from "../Pages/Dashboard/AssignRider/AssignRider";
import RiderRoutes from "./VolunteerRoutes";
import CompletedDeliveries from "../Pages/Dashboard/CompletedDeliveries/CompletedDeliveries";
import PercelsTrack from "../Pages/PercelsTrack/PercelsTrack";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import Funding from "../Pages/Rider/Funding";
import MyDonations from "../Pages/Dashboard/MyParcels/MyDonations";
import MyDonationStatus from "../Pages/Dashboard/PaymentHistory/MyDonationStatus";
import BeAVolunteer from "../Pages/Dashboard/BeAVolunteer/BeAVolunteer";
import VolunteerAssignedRequests from "../Pages/Dashboard/AssignedDelivery/VolunteerAssignedRequests";
import ManageVolunteers from "../Pages/Dashboard/ManageVolunteers/ManageVolunteers";
import DonationRequests from "../Pages/DonationRequests/DonationRequests";

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
        path: 'coverage',
        Component: Coverage,
        loader: () => fetch('servicecenter.json').then(res => res.json())
      },
      {
        path: 'rider',
        element:<Funding></Funding>,
        loader: () => fetch('servicecenter.json').then(res => res.json())
      },
      {
        path: '/dashboard/be-volunteer',
        element: <PrivateRouter><BeAVolunteer></BeAVolunteer></PrivateRouter>,
        loader: () => fetch('servicecenter.json').then(res => res.json())
      },

      {
        path: 'donation-requests',
        element: <DonationRequests></DonationRequests>,
        loader: () => fetch('servicecenter.json').then(res => res.json())
      },
      {
        path: 'parcel-track/:trackingId',
        Component: PercelsTrack
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
        Component: Register,
        loader: () => fetch('servicecenter.json').then(res => res.json())
      }
    ]
  },
  {
    path: 'dashboard',
    element: <PrivateRouter><DashboardLayout></DashboardLayout></PrivateRouter>,
    children: [
      {
        index: true,
        Component: DashboardHome
      },
      {
        path: 'my-parcels',
        Component: MyDonations,
      },
      {
        path: 'payment/:parcelId',
        Component: Payment
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

      // Rider only routes

      {
        path: 'volunteer-requests',
        element: (
          <RiderRoutes>
            <VolunteerAssignedRequests></VolunteerAssignedRequests>
          </RiderRoutes>
        )
      }
      ,
      {
        path: 'completed-deliveries',
        element: <RiderRoutes><CompletedDeliveries></CompletedDeliveries></RiderRoutes>
      },

      // Admin routes
      {
        path: 'approve-riders',
        element: <AdminRoute><ApproveRiders></ApproveRiders></AdminRoute>
      },
      {
        path: 'manage-volunteers',
        element: <AdminRoute><ManageVolunteers></ManageVolunteers></AdminRoute>
      },

      {
        path: 'assign-riders',
        element: <AdminRoute><AssignRider></AssignRider></AdminRoute>
      },
      {
        path: 'users-management',
        element: <AdminRoute><UserManagement></UserManagement></AdminRoute>
      }
    ]

  }
]);

