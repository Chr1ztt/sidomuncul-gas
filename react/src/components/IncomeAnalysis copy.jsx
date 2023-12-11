import { Chart } from "chart.js/auto";
import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";

let chart = null;

export default function IncomeAnalysis({ datas, labels }) {
	const [incomes, setIncomes] = useState([]);
	const [incomeLabels, setIncomeLabels] = useState([]);
	const [loading, setLoading] = useState(false);
	const cfg = {
		type: "line",
		data: {
			labels: labels,
			datasets: [
				{
					label: "Pemasukan per hari",
					data: datas,
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

	useEffect(() => {
		// console.log(cfg.data);
		console.log("INCOMES ADALAH SEBAGAI BERIKUT");
		console.log(cfg.data);
		// chart.data = cfg.data;
		// chart.update();
	}, [labels]);

	const getIncomes = () => {
		axiosClient
			.get(`/analysis`)
			.then(({ data }) => {
				console.log("DATA ADALAH SEBAGAI BERIKUT");
				console.log(data.data);
				setIncomes(data.data.map((d) => d.income));
				setIncomeLabels(data.data.map((d) => d.created_at));
			})
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	};
	useEffect(() => {
		getIncomes;
	}, []);

	function IncomeChart() {
		useEffect(() => {
			if (chart) {
				chart.destroy();
			}

			let chartStatus = Chart.getChart("incomeChart");
			if (chartStatus) {
				chartStatus.destroy();
				console.log(chart);
			}

			chart = new Chart("incomeChart", cfg);
			// console.log(chart);
			return () => {
				chart.destroy();
			};
		}, []);

		return (
			<>
				<canvas id="incomeChart" />
			</>
		);
	}

	return (
		<div className="w-full">
			<IncomeChart />
			<div className="">ini halaman analysis</div>
		</div>
	);
}
