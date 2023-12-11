import { Navigate, createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Dashboard from "./views/Dashboard";
import GuestLayout from "./layouts/GuestLayout";
import Login from "./views/Login";
import SignUp from "./views/SignUp";
import Analisis from "./views/Analisis";
import Transaksi from "./views/Transaksi";
import Pemasokan from "./views/Pemasokan";
import StokBarang from "./views/StokBarang";
import Pelanggan from "./views/Pelanggan";
import Supplier from "./views/Supplier";

const router = createBrowserRouter([
    {
        path : '/',
        element : <DefaultLayout/>,
        children : [
            {
                path : '/',
                element : <Navigate to="/dashboard"/>
            },
            {
                path : '/dashboard',
                element : <Dashboard/>
            },
            {
                path : '/analisis',
                element : <Analisis/>
            },
            {
                path : '/transaksi',
                element : <Transaksi/>
            },
            {
                path : '/stokbarang',
                element : <StokBarang/>
            },
            {
                path : '/pemasokan',
                element : <Pemasokan/>
            },
            {
                path : '/pelanggan',
                element : <Pelanggan/>
            },
            {
                path : '/supplier',
                element : <Supplier/>
            },
        ]
    },
    {
        path : '/',
        element : <GuestLayout/>,
        children : [
            {
                path : '/login',
                element : <Login/>
            },
            {
                path : '/signup',
                element : <SignUp/>
            }

        ]
    },
]);

export default router;