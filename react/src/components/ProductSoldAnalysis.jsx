import React, { Fragment, useEffect, useRef } from "react";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import NumberTypewriter from "./NumberTypewriter";
// import faker from "faker";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export default function ProductSoldAnalysis({
	loading,
	inData,
	outData,
	barLabels,
	summary,
	mostSold,
	oldProduct,
}) {
	const saleRef = useRef(null);
	const dailyGraphRef = useRef(null);
	const horizontalBarOptions = {
		animation: false,
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				display: false,
				grid: {
					display: false,
				},
			},
			y: {
				grid: {
					display: false,
				},
			},
		},
		indexAxis: "y",
		elements: {
			bar: {
				borderWidth: 2,
			},
		},
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
			// title: {
			// 	display: true,
			// 	text: "Chart.js Horizontal Bar Chart",
			// },
		},
	};
	const horizontalBarData = {
		labels: mostSold.map((s) => s.name),
		datasets: [
			{
				label: "Total Produk Terjual",
				data: mostSold.map((s) => s.total_sales),
				borderColor: "#9DC08B",
				backgroundColor: "#9DC08B",
			},
		],
	};

	const options = {
		animation: false,
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				grid: {
					display: false,
				},
			},
		},
		plugins: {
			legend: {
				position: "top",
			},
			title: {
				display: false,
				text: "Grafik jumlah barang masuk dan keluar",
			},
		},
	};
	const data = {
		labels: barLabels,
		datasets: [
			{
				label: "Barang Masuk",
				data: inData,
				backgroundColor: "#9DC08B",
			},
			{
				label: "Barang Keluar",
				data: outData,
				backgroundColor: "#40513B",
			},
		],
	};
	useEffect(() => {
		return () => {
			saleRef?.current?.destroy();
			dailyGraphRef?.current?.destroy();
		};
	}, []);

	return (
		<div className=" w-full grid grid-rows-5 sm:grid-rows-3 lg:grid-rows-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5 items-end h-full">
			<div className="flex flex-col pt-5 px-8 pb-10 font-bold items-center bg-white/60 rounded-lg shadow-md sm:col-span-2 lg:order-3 h-[300px] self-start">
				Grafik Harian Barang Masuk dan keluar
				<Bar data={data} options={options} ref={dailyGraphRef} />
			</div>
			<div className="flex flex-col p-4 bg-white/60 rounded-lg shadow-md lg:order-1 h-[300px] self-start">
				<div className="text-center font-bold text-lg">Summary</div>
				<div className="font-light mt-5">total barang terjual</div>
				<div className="text-2xl">
					{loading ? (
						"Calculating..."
					) : (
						<span>
							<NumberTypewriter target={summary?.total_sold} />
						</span>
					)}
				</div>
				<div className="font-light mt-5">barang keluar per hari</div>
				<div className="text-2xl ">
					{loading ? (
						"Calculating..."
					) : (
						<span>
							<NumberTypewriter target={summary?.avg_sold} />
						</span>
					)}
				</div>
				<div className="font-light mt-5">barang terlaris</div>
				<div className="text-2xl">
					{loading ? "Calculating..." : <span>{mostSold[0]?.name}</span>}
				</div>
			</div>
			<div className="flex flex-col px-4 pb-8 bg-white/60 rounded-lg shadow-md h-[620px] overflow-y-auto sm:row-span-2 lg:order-2 scrollbar-thin self-start">
				<div className="py-4 text-center font-bold text-lg ">
					Grafik Barang Terlaris
				</div>
				<div className="w-full h-full py-1">
					<Bar
						ref={saleRef}
						options={horizontalBarOptions}
						data={horizontalBarData}
					/>
				</div>
			</div>
			<div className="flex flex-col py-4 bg-white/60 rounded-lg shadow-md h-[300px] lg:order-1 overflow-y-hidden self-start">
				<div className="text-center font-bold text-lg">Daftar Barang Lama</div>
				{/* TUBE CONTENT START */}
				<div className=" row-span-2 md:row-span-1  order-4 pt-2 justify-center items-center text-center text-sm">
					{/* <hr className="bg-main w-full h-[0.13rem] mt-2" /> */}
					<div className="grid grid-cols-12 w-full py-3 bg-black/5 text-gray-400 uppercase text-[0.6rem] lg:text-xs gap-x-1 items-centert">
						<div className="col-span-4 text-center">No. tabung</div>
						<div className="col-span-5 ">Isi</div>
						<div className="col-span-3 text-center pr-3">Produksi</div>
					</div>
					{/* <hr className="bg-main w-full h-[0.13rem]" /> */}

					{/* TUBE DATA START */}
					<div className="flex flex-col w-full gap-x-1 items-center text-xs max-h-[208px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-track-black/5 overflow-x-hidden">
						{loading ? (
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
						) : !oldProduct.length ? (
							<div className="flex col-span-full text-center justify-center items-center py-4 gap-x-1">
								Maaf, tidak ada Data
							</div>
						) : (
							oldProduct.map((t, i) => (
								<Fragment key={t.id}>
									<div className="grid grid-cols-12 w-full hover:bg-black/5 py-3">
										<div className="col-span-4 text-center">{t.id}</div>
										<div className="col-span-5 text-center whitespace-pre truncate">
											{t.gas.name ? t.gas.name : "Kosong"}
										</div>
										<div className="col-span-3 flex text-center justify-center">
											{t.formatted_date.slice(0, -4)}
										</div>
									</div>

									<hr className="bg-main w-full h-[0.09rem] " />
								</Fragment>
							))
						)}
					</div>
					<hr className="bg-main w-full h-[0.13rem] " />
					{/* TUBE DATA END */}
				</div>
				{/* TUBE CONTENT END */}
			</div>

			{/* <div className="w-full flex h-full max-h-[40%] bg-white/60 my-4 p-4 shadow-md rounded-xl">
				kok overflow
			</div> */}
		</div>

		// <div className=" w-full flex flex-col items-end h-full">
		// 	<div className="w-full flex flex-col lg:flex-row lg:max-h-[55%] gap-4">
		// 		<div className="w-full lg:w-8/12 flex flex-col justify-center items-center rounded-xl bg-white/60 px-4 py-8 md:p-7 lg:p-8 shadow-md max-h-[300px] lg:max-h-full ">
		// 			<div className="font-bold ">Pemasukan per Hari</div>
		// 			<Bar data={data} options={options} />
		// 		</div>
		// 		<div className="w-full flex flex-col lg:w-4/12 p-4 bg-white/60 rounded-xl shadow-md text-sm">
		// 			<div className="text-center font-bold text-lg">Summary</div>

		// 			<div className="text-2xl mt-5">Rp 3.424.000,00</div>
		// 			<div className="font-light">total pemasukan</div>

		// 			<div className="text-2xl mt-5">Rp 252.234,00</div>
		// 			<div className="font-light">rata rata pemasukan per hari</div>

		// 			<div className="text-2xl mt-5">Oksigen</div>
		// 			<div className="font-light">barang terlaris</div>
		// 		</div>
		// 	</div>
		// 	<div className="w-full flex flex-col lg:flex-row h-full lg:max-h-[45%] gap-4 my-4">
		// 		<div className="w-full lg:w-8/12 lg:order-2 flex flex-col justify-center items-center rounded-xl bg-white/60 px-4 py-8 md:p-7 lg:p-8 shadow-md ">
		// 			<div className="font-bold ">Barang terlaris</div>
		// 		</div>
		// 		<div className="w-full flex flex-col lg:w-4/12 p-4 bg-white/60 rounded-xl shadow-md text-sm">
		// 			<div className="text-center font-bold text-lg">Daftar Stok Lama</div>

		// 			<div className="text-2xl mt-5">Rp 3.424.000,00</div>
		// 			<div className="font-light">total pemasukan</div>
		// 		</div>
		// 	</div>
		// 	{/* <div className="w-full flex h-full max-h-[40%] bg-white/60 my-4 p-4 shadow-md rounded-xl">
		// 		kok overflow
		// 	</div> */}
		// </div>
		// <div className="absolute w-full flex flex-col items-center h-full">
		// 	<div className="w-full flex justify-center max-h-[70%]">
		// 		<Bar data={data} options={options} />
		// 	</div>
		// 	<div className="">ini halaman analysis</div>
		// </div>
	);
}
