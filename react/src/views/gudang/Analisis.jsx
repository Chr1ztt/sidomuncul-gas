import { AnimatePresence, motion } from "framer-motion";
import DropdownMenu from "../../general_components/DropdownMenu";
// import { ChartJS } from "chart.js/auto";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnalysisMenu as menu } from "../../components/AnalysisMenu";
import FadeInPage from "../../components/FadeInPage";
import axiosClient from "../../axios-client";
import IncomeAnalysis from "../../components/IncomeAnalysis";
import React from "react";
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
import ProductSoldAnalysis from "../../components/ProductSoldAnalysis";
// import faker from "faker";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

let chart;

const data = {
	labels: ["Red", "Blue", "Yellow"],
	datasets: [
		{
			label: "My First Dataset",
			data: [300, 50, 100],
			backgroundColor: [
				"rgb(255, 99, 132)",
				"rgb(54, 162, 235)",
				"rgb(255, 205, 86)",
			],
			hoverOffset: 4,
		},
	],
};

export default function Analisis() {
	const [income, setIncome] = useState([]);
	const [lab, setLab] = useState([]);
	const [productSold, setProductSold] = useState([]);
	const [productEntry, setProductEntry] = useState([]);
	const [summary, setSummary] = useState({});
	const [debtList, setDebtList] = useState([]);
	const [oldProduct, setOldProduct] = useState([]);

	const cfg = {
		type: "line",
		data: {
			labels: lab,
			datasets: [
				{
					label: "Pemasukan per hari (juta)",
					data: income,
					backgroundColor: [
						"rgb(255, 99, 132)",
						"rgb(54, 162, 235)",
						"rgb(255, 205, 86)",
					],
					// hoverOffset: 4,
				},
			],
		},
	};

	const location = useLocation();
	const navigate = useNavigate();
	const [current, setCurrent] = useState(menu[0]);
	const [loading, setLoading] = useState(false);
	const [mostIncome, setMostIncome] = useState([]);
	const [mostSold, setMostSold] = useState([]);

	// function IncomeChart() {
	// 	// const cfg = {
	// 	// 	type: "line",
	// 	// 	data: {
	// 	// 		labels: lab,
	// 	// 		datasets: [
	// 	// 			{
	// 	// 				label: "Pemasukan per hari (juta)",
	// 	// 				data: income,
	// 	// 				backgroundColor: [
	// 	// 					"rgb(255, 99, 132)",
	// 	// 					"rgb(54, 162, 235)",
	// 	// 					"rgb(255, 205, 86)",
	// 	// 				],
	// 	// 				// hoverOffset: 4,
	// 	// 			},
	// 	// 		],
	// 	// 	},
	// 	// };
	// 	useEffect(() => {
	// 		if (chart) {
	// 			chart.destroy();
	// 		}

	// 		chart = new ChartJS("incomeChart", cfg);
	// 		console.log(chart);
	// 		return () => {
	// 			chart.destroy();
	// 		};
	// 	}, []);

	// 	return (
	// 		<>
	// 			<canvas id="incomeChart" />
	// 		</>
	// 	);
	// }

	const getAnalytics = () => {
		setLoading(true);
		axiosClient
			.get(`/analysis`)
			.then(({ data }) => {
				// let sold = [...data.most_sold];
				setIncome(data.result.map((r) => r.income));
				setProductSold(data.result.map((r) => r.product_sold));
				setProductEntry(data.result.map((r) => r.product_entry));
				setLab(data.result.map((r) => r.created.slice(0, -4)));
				setSummary(data.summary[0]);
				setDebtList(data.debt);
				setOldProduct(data.tubes);
				setMostIncome(data.most_sold);
				setMostSold(data.most_sold.toSorted((a, b) => b.total_sales - a.total_sales));
			})
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		getAnalytics();
	}, []);

	return (
		<FadeInPage
			className="absolute flex flex-col w-full items-center bg-secondary h-full lg:px-2 font-semibold"
			scrollable={false}
		>
			{/* {!loading && <IncomeChart />} */}
			{/* <ChartMaker /> */}
			{/* <button
				onClick={() => {
					console.log(chart.id);
					chart.clear();
					console.log(chart);
				}}
				className="p-2 bg-second rounded-md"
			>
				hapus
			</button> */}

			{/* HEADER */}
			<div className="w-full">
				<div className="relative flex flex-row w-full justify-center items-center py-3 gap-5 md:py-5 flex-wrap lg:h-[10%] ">
					<div className="flex text-3xl font-bold mr-auto ">
						<span>Analisis</span>
					</div>
					<ul className=" flex flex-row mt-auto text-xs md:text-sm overflow-x-hidden">
						{menu.map((m) => (
							<li
								onClick={() => setCurrent(m)}
								key={m.name}
								className={`flex py-2 px-4 cursor-pointer ${
									m === current ? m.activeLink : m.disabledLink
								}`}
							>
								{m.name}
							</li>
						))}
					</ul>
				</div>
				{/* HEADER */}
				<AnimatePresence mode="popLayout" initial={false}>
					<motion.div
						key={current.name}
						variants={current.menuTransition}
						initial="initial"
						animate="animate"
						exit="exit"
						className="flex w-full h-full lg:h-[90%]"
					>
						{current.element ? (
							<ProductSoldAnalysis
								inData={productEntry}
								outData={productSold}
								barLabels={lab}
								summary={summary}
								oldProduct={oldProduct}
								mostSold={mostSold}
								loading={loading}
							/>
						) : (
							<IncomeAnalysis
								data={income}
								labels={lab}
								mostIncome={mostIncome}
								debtList={debtList}
								summary={summary}
								loading={loading}
							/>
						)}
					</motion.div>
				</AnimatePresence>
			</div>
		</FadeInPage>
	);
}
