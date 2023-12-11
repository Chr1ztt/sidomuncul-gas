// import { Chart } from "chart.js/auto";
import React, { Fragment, useEffect, useRef, useState } from "react";
import axiosClient from "../axios-client";
import { Bar } from "react-chartjs-2";
import { fullRupiahFormat, rupiahFormat } from "../components/IDRFormat";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js/auto";
import NumberTypewriter from "./NumberTypewriter";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

let chart = null;

export default function IncomeAnalysis({
	loading,
	data,
	labels,
	summary = 0,
	mostIncome,
	debtList,
}) {
	const incomeRef = useRef(null);
	const navigate = useNavigate();
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
		labels: mostIncome.map((i) => i.name),
		datasets: [
			{
				label: "Total Pendapatan Kotor",
				data: mostIncome.map((i) => i.total_incomes),
				borderColor: "#9DC08B",
				backgroundColor: "#9DC08B",
			},
		],
	};

	useEffect(() => {
		return () => incomeRef?.current?.destroy();
	}, []);

	const cfg = {
		type: "line",
		data: {
			labels,
			datasets: [
				{
					// label: "Pemasukan per hari",
					data,
					fill: true,
					backgroundColor: ["#9DC08B"],
					borderColor: ["#40513B"],
					// hoverOffset: 4,
				},
			],
		},
		options: {
			animation: false,
			scales: {
				x: {
					grid: {
						display: false,
					},
				},
				y: {
					ticks: {
						maxTicksLimit: 6,
					},
				},
			},
			plugins: {
				legend: {
					display: false,
				},
			},
			responsive: true,
			maintainAspectRatio: false,
		},
	};

	// useEffect(() => {
	// 	// console.log(cfg.data);
	// 	console.log("INCOMES ADALAH SEBAGAI BERIKUT");
	// 	console.log(cfg.data);
	// 	// chart.data = cfg.data;
	// 	// chart.update();
	// }, [labels]);

	// const getIncomes = () => {
	// 	axiosClient
	// 		.get(`/analysis`)
	// 		.then(({ data }) => {
	// 			console.log("DATA ADALAH SEBAGAI BERIKUT");
	// 			console.log(data.data);
	// 			setIncomes(data.data.map((d) => d.income));
	// 			setIncomeLabels(data.data.map((d) => d.created));
	// 		})
	// 		.catch((err) => console.log(err))
	// 		.finally(() => setLoading(false));
	// };
	// useEffect(() => {
	// 	getIncomes();
	// }, []);

	function IncomeChart() {
		useEffect(() => {
			if (chart) {
				chart.destroy();
			}

			let chartStatus = ChartJS.getChart("incomeChart");
			if (chartStatus) {
				chartStatus.destroy();
				console.log(chart);
			}

			chart = new ChartJS("incomeChart", cfg);
			// console.log(chart);
			return () => {
				chart.destroy();
			};
			return () => chart.destroy();
		}, []);

		return (
			<>
				<canvas id="incomeChart" />
			</>
		);
	}

	return (
		<div className=" w-full grid sm:grid-rows-3 lg:grid-rows-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5 items-end h-full">
			<div className="flex flex-col pt-5 px-8 pb-16 items-start shadow-md text-lg font-bold bg-white/60 rounded-xl sm:col-span-2 self-start lg:order-3 h-[300px]">
				<div className="pb-5">Pendapatan Kotor Harian</div>
				<IncomeChart />
			</div>
			<div className="flex flex-col p-4 bg-white/60 rounded-xl lg:order-1 h-[300px] shadow-md self-start">
				{/* <br /><br /><br /><br /><br /><br />
				<br /><br /><br /><br /><br /><br />
				<br /><br /><br /><br /><br /><br /> */}
				<div className="text-center font-bold text-lg">Summary</div>
				<div className="font-light mt-5">total pemasukan</div>
				<div className="text-2xl">
					{loading ? (
						"Calculating..."
					) : (
						<span>
							Rp&nbsp;
							<NumberTypewriter target={summary?.total_income} />
							,00
						</span>
					)}
				</div>
				<div className="font-light mt-5">rata rata pemasukan per hari</div>
				<div className="text-2xl ">
					{loading ? (
						"Calculating..."
					) : (
						<span>
							Rp&nbsp;
							<NumberTypewriter target={parseInt(summary?.avg_income)} />
							,00
						</span>
					)}
				</div>
				<div className="font-light mt-5">barang terlaris</div>
				<div className="text-2xl">
					{loading ? "Calculating..." : <span>{summary?.max_income_date}</span>}
				</div>
			</div>
			<div className="flex flex-col px-4 pb-5 bg-white/60 rounded-xl h-[620px] overflow-y-auto sm:row-span-2 lg:order-2 self-start scrollbar-thin shadow-md">
				<div className="py-4 text-center font-bold text-lg ">
					Grafik Barang Terlaris
				</div>
				<div className="w-full h-full py-1">
					<Bar
						ref={incomeRef}
						options={horizontalBarOptions}
						data={horizontalBarData}
					/>
				</div>
			</div>
			<div className="flex flex-col py-4 bg-white/60 rounded-xl h-[300px] overflow-hidden lg:order-1 shadow-md self-start">
				<div className="text-center font-bold text-lg overflow">
					<span className="whitespace-pre">Daftar Hutang Pelanggan</span>
				</div>
				{/* TUBE CONTENT START */}
				<div className="row-span-2 md:row-span-1  order-4 pt-2  justify-center items-center text-center ">
					{/* <hr className=" w-full h-[0.13rem] mt-2" /> */}
					<div className="grid grid-cols-12 py-3 w-full gap-x-1 bg-gray-400/20 items-center text-gray-400 uppercase text-[0.6rem] lg:text-xs">
						<div className="col-span-2">No.</div>
						<div className="col-span-4 text-left">Pelanggan</div>
						<div className="col-span-6 pr-3">Hutang</div>
					</div>
					{/* <hr className=" w-full h-[0.13rem]" /> */}

					{/* TUBE DATA START */}
					<div className="flex flex-col w-full gap-x-1 items-center  max-h-[208px] text-xs  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-track-black/5 overflow-x-hidden">
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
						) : !debtList.length ? (
							<div className="flex col-span-full text-center justify-center items-center py-4 gap-x-1">
								Maaf, tidak ada Data
							</div>
						) : (
							debtList.map((t, i) => (
								<Fragment key={t.id}>
									<div
										className="grid grid-cols-12 w-full hover:bg-gray-400/10 cursor-pointer"
										onClick={() =>
											navigate(`/gudang/pelanggan/detail`, {
												state: { id: t.id },
											})
										}
									>
										<div className="col-span-2 py-3">{i + 1}.</div>
										<div className="col-span-4 py-3 whitespace-pre truncate text-left">
											{t.name}
										</div>
										<div className="col-span-6 py-3">
											{rupiahFormat(t?.total_debt)}
										</div>
									</div>

									<hr className=" w-full h-[0.09rem] " />
								</Fragment>
							))
						)}
					</div>
					{/* <hr className=" w-full bg-black h-[0.13rem] " /> */}
					{/* TUBE DATA END */}
				</div>
				{/* TUBE CONTENT END */}
			</div>

			{/* <div className="w-full flex h-full max-h-[40%] bg-white/60 my-4 p-4 border rounded-xl">
				kok overflow
			</div> */}
		</div>

		// <div className=" w-full flex flex-col items-end h-full">
		// 	<div className="w-full flex flex-col lg:flex-row lg:max-h-[55%] gap-4">
		// 		<div className="w-full lg:w-8/12 lg:order-2 flex flex-col justify-center items-center rounded-xl bg-white/60 px-4 py-8 md:p-7 lg:p-8 border max-h-[300px] lg:max-h-full ">
		// 			<div className="font-bold ">Pemasukan per Hari</div>
		// 			<IncomeChart />
		// 		</div>
		// 		<div className="w-full flex flex-col lg:w-4/12 lg:order-1 p-4 bg-white/60 rounded-xl border text-sm">
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
		// 		<div className="w-full lg:w-8/12 flex flex-col justify-center items-center rounded-xl bg-white/60 px-4 py-8 md:p-7 lg:p-8 border ">
		// 			<div className="font-bold ">Barang Dengan Pemasukan Terbesar</div>
		// 		</div>
		// 		<div className="w-full flex flex-col lg:w-4/12 p-4 bg-white/60 rounded-xl border text-sm">
		// 			<div className="text-center font-bold text-lg">Daftar Hutang Pelanggan</div>

		// 			<div className="text-2xl mt-5">Rp 3.424.000,00</div>
		// 			<div className="font-light">total pemasukan</div>
		// 		</div>
		// 	</div>
		// 	{/* <div className="w-full flex h-full max-h-[40%] bg-white/60 my-4 p-4 border rounded-xl">
		// 		kok overflow
		// 	</div> */}
		// </div>
	);
}
