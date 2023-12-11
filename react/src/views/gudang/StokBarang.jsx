import { motion } from "framer-motion";
import { Fragment, useEffect, useRef, useState } from "react";
import axiosClient from "../../axios-client";
import NumberTypewriter from "../../components/NumberTypewriter";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import FadeInPage from "../../components/FadeInPage";
import { PiWarningCircle } from "react-icons/pi";

const pageTransition = {
	initial: {
		y: 100,
		opacity: 0,
	},
	animate: {
		y: 0,
		opacity: 1,
	},
	exit: {
		y: -100,
		opacity: 0,
	},
};

export default function StokBarang() {
	const [loadingGas, setLoadingGas] = useState(false);
	const [loadingTube, setLoadingTube] = useState(false);
	const [loadingGraph, setLoadingGraph] = useState(false);
	const [tubes, setTubes] = useState([]);
	const [gases, setGases] = useState([]);
	const [stock, setStock] = useState([]);
	const chartRef = useRef(null);

	ChartJS.register(ArcElement, Tooltip, Legend);

	const gaugePlugins = {
		id: "gaugeText",
		beforeDatasetsDraw(chart, args, pluginOptions) {
			const {
				ctx,
				data,
				chartArea: { top, bottom, left, right, width, height },
			} = chart;

			const xCenter = chart.getDatasetMeta(0).data[0].x;
			const yCenter = chart.getDatasetMeta(0).data[0].y;

			ctx.save();
			ctx.fillStyle = "gray";
			ctx.font = "bold 30px sans-serif";
			ctx.textAlign = "center";
			ctx.fillText("data.datasets[0].data[0]", xCenter, yCenter - 15);
		},
	};

	const data = {
		labels: ["Ready", "Di Supplier", "Kosong", "Di Pembeli"],
		datasets: [
			{
				label: "Jumlah",
				data: stock,
				backgroundColor: ["#40513B", "#40513BAA", "#F3F5F1", "#ECEEEB"],
				borderColor: ["#40513B", "#40513BAA", "#F3F5F1", "#ECEEEB"],
				circumference: 180,

				rotation: 270,
			},
		],
	};

	const getGases = () => {
		setLoadingGas(true);
		axiosClient
			.get(`/gas/stock`)
			.then(({ data }) => {
				setGases(data.data);
				// console.log(data);
			})
			.catch(() => {
				console.log("ada kesalahan");
			})
			.finally(() => setLoadingGas(false));
	};

	const getTubes = () => {
		setLoadingTube(true);
		axiosClient
			.get(`/tube/stock`)
			.then(({ data }) => setTubes(data.data))
			.catch(() => console.log("Ada kesalahan di dalam getTubes"))
			.finally(() => setLoadingTube(false));
	};

	const getStockRatio = () => {
		setLoadingGraph(true);
		axiosClient
			.get(`/tube/ratio`)
			.then(({ data }) => {
				setStock(Object.values(data));
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoadingGraph(false);
			});
	};

	useEffect(() => {
		getGases();
		getTubes();
		getStockRatio();
		// if (chartRef?.current) {
		// 	// chartRef.current.destroy();
		// 	console.log(chartRef.current);
		// 	// console.log(chartRef.current.chart);
		// }
		return () => {
			chartRef?.current?.destroy();
			// console.log(chartRef.current);
		};
	}, []);

	return (
		<FadeInPage
			scrollable={false}
			// variants={pageTransition}
			// initial="initial"
			// animate="animate"
			// exit="exit"
			// transition={{
			// 	type: "tween",
			// 	duration: 0.135,
			// 	ease: "easeOut",
			// }}
			// className="absolute flex flex-col w-full px-1 items-center bg-secondary h-[200vh] md:h-full font-semibold "
		>
			{/* TITLE START */}
			<div className="flex flex-row w-full justify-between py-2 md:py-4 mt-2">
				<h1 className="flex items-center text-3xl font-bold ">
					Stok Barang
				</h1>
			</div>
			{/* TITLE END */}

			{/* CONTENT START */}
			<div className="grid md:grid-rows-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full md:h-[85%]  gap-5 py-2 mb-4">
				{/* GAS CONTENT START */}
				<div className="bg-white/80 flex flex-col row-span-2 lg:col-span-2 order-2 pt-3 items-start text-center rounded-xl cursor-default shadow-md overflow-y-hidden">
					<div className="flex flex-row pb-3 text-left w-full items-center justify-between font-bold text-base lg:text-lg px-5">
						<div className="">Daftar Produk</div>
						<div className="flex flex-row flex-initial justify-end">
							{/* <div> */}
							<NavLink
								to={`/gudang/stokbarang/gas`}
								className={`bg-forth py-2 px-3 rounded text-sm hover:opacity-70 font-semibold text-white`}
							>
								Kelola Data Gas
							</NavLink>
							{/* </div> */}
						</div>
					</div>

					{/* <hr className="bg-main w-full h-[0.13rem] mt-2" /> */}
					<div className="grid grid-cols-12 w-full py-3 gap-x-1 text-[0.6rem] lg:text-xs font-bold bg-gray-400/20 text-gray-400 uppercase ">
						<div className="md:col-span-2 lg:col-span-1">No.</div>
						<div className="col-span-8 lg:col-span-9 text-left">
							Nama Produk
						</div>
						<div className="col-span-2 text-right pr-2  ">Stok</div>
					</div>
					{/* <hr className="bg-main w-full h-[0.13rem]" /> */}

					{/* GAS TABLE START */}
					<div className="flex-col w-full  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-track-gray-100 overflow-x-hidden   ">
						{loadingGas ? (
							<div className="flex col-span-full text-center justify-center items-center py-4 text-base">
								<svg
									className="animate-spin flex items-center w-5 h-5 mr-2 "
									viewBox="0 0 30 30"
								>
									<AiOutlineLoading3Quarters
										size={30}
										className="fill-black min-w-max "
									/>
								</svg>
								Loading...
							</div>
						) : !gases.length ? (
							<div className="flex col-span-full text-center justify-center items-center py-4 gap-x-1">
								Maaf, tidak ada Data
							</div>
						) : (
							gases?.map((g, index) => (
								<Fragment key={g.id}>
									<div className="grid grid-cols-12 w-full gap-2 py-3 hover:bg-gray-400/10	 items-center cursor-pointer justify-start text-xs lg:text-sm">
										<div className="md:col-span-2 lg:col-span-1">
											{index + 1}.
										</div>
										<div className="col-span-8 lg:col-span-9 text-left">
											{g.name}
										</div>
										<div
											className={`flex flex-row items-center justify-end col-span-2 text-right pr-3 text-base `}
										>
											{g.tubes_count <= 5 && (
												<PiWarningCircle
													size={25}
													className="min-w-max pr-2 fill-forth"
												/>
											)}
											{g.tubes_count}
										</div>
									</div>
									<hr className="bg-main w-full h-[0.1rem]" />
								</Fragment>
							))
						)}
					</div>
					{/* <hr className="bg-main w-full h-[0.13rem]" /> */}
					{/* GAS TABLE END */}
				</div>
				{/* GAS CONTENT END */}

				{/* GRAPH START */}
				<div className="bg-white/80 row-span-1 order-1  md:order-3 p-2 justify-center items-center text-center rounded-xl shadow-md max-h-[300px] md:max-h-full">
					<div className="h-full">
						<div className="relative flex flex-col w-full h-full justify-center items-center">
							{loadingGraph ? (
								<div className="flex col-span-full text-center justify-center items-center py-4 text-base">
									<svg
										className="animate-spin flex items-center w-5 h-5 mr-2 "
										viewBox="0 0 30 30"
									>
										<AiOutlineLoading3Quarters
											size={30}
											className="fill-black min-w-max "
										/>
									</svg>
									Loading...
								</div>
							) : (
								<>
									<Doughnut
										ref={chartRef}
										id="1"
										data={data}
										options={{
											cutout: 70,
											responsive: true,
										}}
										plugins={gaugePlugins}
									/>
									{/* <button
										className="bg-fifth"
										onClick={() => chartRef.current.destroy()}
									>
										hapus
									</button> */}
									<div className="absolute flex flex-col text-3xl justify-center items-center font-bold bottom-[15%]  text-third">
										<NumberTypewriter target={stock[0]} />
										<div className="text-sm">Sisa Stok Ready</div>
									</div>
									<div className="absolute flex bottom-0 w-full text-2xl text-center justify-center">
										{/* Tabung Terisi */}
									</div>
								</>
							)}
						</div>
					</div>
				</div>
				{/* GRAPH END */}

				{/* TUBE CONTENT START */}
				<div className="bg-white/80 row-span-2 md:row-span-1 flex flex-col  order-4 pt-3 items-center text-center rounded-xl shadow-md overflow-y-hidden">
					<div className="flex flex-row pb-3 text-left w-full items-center justify-between font-bold text-base lg:text-lg px-5">
						<div className="">Daftar Tabung</div>
						<div className="flex flex-row flex-initial justify-end">
							{/* <div> */}
							<NavLink
								to={`/gudang/stokbarang/tabung`}
								className={`bg-forth py-2 px-3 rounded text-sm hover:opacity-70 font-semibold text-white`}
							>
								Kelola Data Tabung
							</NavLink>
							{/* </div> */}
						</div>
					</div>

					{/* <hr className="bg-main w-full h-[0.13rem] mt-2" /> */}
					<div className="grid grid-cols-12 w-full py-3 gap-x-1 items-center  text-[0.6rem] lg:text-xs font-bold bg-gray-400/20 text-gray-400 uppercase">
						<div className="col-span-2">No.</div>
						<div className="col-span-4 text-left">No. tabung</div>
						<div className="col-span-6 pr-3">Isi</div>
					</div>
					<hr className="bg-main w-full h-[0.13rem]" />

					{/* TUBE DATA START */}
					<div className="flex flex-col w-full gap-x-1 items-center text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-track-gray-100 overflow-x-hidden ">
						{loadingTube ? (
							<div className="flex text-center justify-center items-center py-4 text-base">
								<svg
									className="animate-spin flex items-center w-5 h-5 mr-2 "
									viewBox="0 0 30 30"
								>
									<AiOutlineLoading3Quarters
										size={30}
										className="fill-black min-w-max "
									/>
								</svg>
								Loading...
							</div>
						) : !tubes.length ? (
							<div className="flex col-span-full text-center justify-center items-center py-4 gap-x-1">
								Maaf, tidak ada Data
							</div>
						) : (
							tubes.map((t, i) => (
								<Fragment key={t.id}>
									<div className="grid grid-cols-12 w-full md:gap-1 py-3 hover:bg-gray-400/10	 items-center cursor-pointer justify-start text-xs lg:text-sm">
										<div className="col-span-2">{i + 1}.</div>
										<div className="col-span-4 text-left">{t.id}</div>
										<div className="col-span-6">
											{t.name ? t.name : "Kosong"}
										</div>
									</div>

									<hr className="bg-main w-full h-[0.09rem] " />
								</Fragment>
							))
						)}
					</div>
					{/* <hr className="bg-main w-full h-[0.13rem] " /> */}
					{/* TUBE DATA END */}
				</div>
				{/* TUBE CONTENT END */}
			</div>
			{/* CONTENT END */}
		</FadeInPage>
	);
}
