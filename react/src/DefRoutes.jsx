import { forwardRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./views/gudang/Dashboard";
import Analisis from "./views/gudang/Analisis";
import Transaksi from "./views/gudang/Transaksi";
import StokBarang from "./views/gudang/StokBarang";
import Pemasokan from "./views/gudang/Pemasokan";
import Supplier from "./views/gudang/Supplier";
import Pelanggan from "./views/gudang/Pelanggan";
import { motion } from "framer-motion";

const DefRoutes = forwardRef((props, ref) => {
	const location = useLocation();
	// debugger;
	return (
		<div ref={ref}>
			<Routes location={location} key={location.pathname}>
				{props.children}
				{/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analisis" element={<Analisis />} />
        <Route path="/transaksi" element={<Transaksi />} />
        <Route path="/stokbarang" element={<StokBarang />} />
        <Route path="/pemasokan" element={<Pemasokan />} />
        <Route path="/supplier" element={<Supplier />} />
        <Route path="/pelanggan" element={<Pelanggan />} /> */}
			</Routes>
		</div>
	);
});

const DefaultLayoutRoutes = motion(DefRoutes);
export default DefaultLayoutRoutes;
