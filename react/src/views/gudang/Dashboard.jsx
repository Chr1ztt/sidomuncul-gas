import { motion } from "framer-motion";
import NumberTypewriter from "../../components/NumberTypewriter";
import { useStateContext } from "../../context/ContextProvider";
import FadeInPage from "../../components/FadeInPage";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../../axios-client";

import image from "../../assets/029-drawkit-full-stack-man-colour.svg";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
	cutout: 80,
	maintainAspectRatio: false,
	responsive: true,
	plugins: {
		legend: {
			display: false,
			position: "bottom",
		},
	},
};

export default function Dashboard() {
	const navigate = useNavigate();
	const doughnutRef = useRef(null);
	const [sales, setSales] = useState(0);
	const [loading, setLoading] = useState(false);
	const [profits, setProfits] = useState(0);
	const [stocks, setStocks] = useState(0);
	const [graphData, setGraphData] = useState([]);
	const [customers, setCustomers] = useState([]);

	const getReportData = () => {
		setLoading(true);
		axiosClient
			.get(`/dashboard`)
			.then(({ data }) => {
				setSales(data.today_sales);
				setProfits(data.today_income);
				setStocks(data.today_stocks);
				setGraphData(Object.values(data.paid_off_transaction));
				setCustomers(data.loyal_customer);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => setLoading(false));
	};

	const data = {
		labels: ["Lunas", "Tidak Lunas"],
		datasets: [
			{
				label: "# of Votes",
				data: graphData,
				backgroundColor: [
					"#609966",
					"#EDF1D6",
					"#FFFFFF11",
					"#346CF6",
					"#E6E7EB",
					"rgba(255, 206, 86, 0.2)",
					"rgba(75, 192, 192, 0.2)",
					"rgba(153, 102, 255, 0.2)",
					"rgba(255, 159, 64, 0.2)",
				],
				// borderRadius: "5",
				borderColor: [
					"#609966",
					"#EDF1D6",
					"#FFFFFF11",
					"#346CF6",
					"#E6E7EB",
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
				],
				borderWidth: 1,
			},
		],
	};

	useEffect(() => {
		getReportData();
		return () => doughnutRef?.current?.destroy();
	}, []);
	return (
		<FadeInPage scrollable={false}>
			<h1 className="py-2 md:py-4 pl-1 text-3xl mr-auto font-bold  mt-2">
				Dashboard
				{/* Hai, {user.name} ! */}
			</h1>
			{/* <div className="pl-1 mr-auto font-light">
				Kami harap kamu baik baik saja ^-^
			</div> */}
			<div className="flex w-full flex-none h-[20rem] sm:h-[40%] shadow-md bg-white/80 rounded-xl text-black px-7 py-5 font-light">
				<div className="flex flex-col sm:flex-row w-full sm:items-center sm:justify-between gap-2">
					<div className="flex flex-col sm:w-7/12 lg:w-5/12 2xl:w-3/12 justify-center gap-1">
						<div className="text-3xl">
							{loading ? (
								<span className="">Calculating...</span>
							) : (
								<span className="font-bold">
									Rp&nbsp;
									<NumberTypewriter target={profits} />
									,00
								</span>
							)}
						</div>
						<div className="text-lg">Pemasukan Hari ini </div>
					</div>
					<div className="flex flex-col sm:w-5/12 lg:w-3/12 2xl:w-4/12 2xl:flex-row h-80 sm:h-full justify-evenly 2xl:justify-between 2xl:items-center ">
						<div className="flex flex-col gap-1">
							<div className="text-2xl">
								{loading ? (
									<span className="">Calculating...</span>
								) : (
									<span className="font-bold">
										<NumberTypewriter target={sales} />
									</span>
								)}
							</div>
							<div>Penjualan Hari ini</div>
						</div>
						<div className="flex flex-col gap-1">
							<div className="text-2xl">
								{loading ? (
									<span className="">Calculating...</span>
								) : (
									<span className="font-bold">
										<NumberTypewriter target={stocks} />
									</span>
								)}
							</div>
							<div>Stok Tersedia</div>
						</div>
					</div>
					<div className="hidden lg:flex flex-col md:w-4/12 overflow-hidden   h-full justify-center items-end">
						<div className="flex rounded-xl">
							<img src={image} alt="svg gambar" className="w-11/12 m-auto" />
						</div>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col  sm:flex-row sm:overflow-y-hidden   py-5 gap-5">
				<div className="flex w-full mx-auto text-black flex-col sm:order-2  items-center sm:w-5/12 lg:w-4/12 text-base lg:text-lg font-bold bg-white/80 rounded-xl shadow-md px-4 pt-4 pb-1 ">
					Transaksi Lunas
					{loading ? (
						<div className="flex col-span-full h-full text-center justify-center items-center py-4 text-base">
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
						<div className="relative flex flex-col justify-center items-center w-full h-full py-4">
							<Doughnut
								width={"100%"}
								data={data}
								options={options}
								ref={doughnutRef}
							/>
							{/* <div className="p-2" onClick={() => doughnutRef?.current?.destroy()}> coba click</div> */}
							<div className="absolute flex flex-row text-3xl justify-center items-center whitespace-pre font-bold top-[43%]  text-forth">
								<NumberTypewriter
									target={(graphData[0] / (graphData[0] + graphData[1])) * 100}
								/>
								<span>%</span>
								{/* <div className="text-sm">Sisa Stok Ready</div> */}
							</div>
						</div>
					)}
				</div>

				<div className="flex w-full  flex-col text-xs lg:text-base items-start sm:w-7/12 lg:w-8/12 bg-white/80 rounded-xl shadow-md pt-4 overflow-y-hidden">
					<div className="pb-4 text-left font-bold text-base lg:text-lg px-5">
						Pelanggan Kamu yang paling setia
					</div>
					{/* TABLE WITH COL LAYOUT START*/}
					{/* <hr className="bg-gray-200 w-full h-[0.2rem]" /> */}
					<div
						className="flex flex-row w-full gap-2 py-3 text-sm justify-start cursor-default text-[0.6rem] lg:text-xs font-bold bg-gray-400/20 text-gray-400 uppercase "
						style={{ scrollbarGutter: "stable" }}
					>
						<div className="w-[3rem]  justify-center  text-center">No.</div>
						<div className="flex w-6/12  justify-start lg:text-left">Nama</div>
						<div className="flex w-5/12 justify-end pr-4 text-center whitespace-pre">
							Total Transaksi
						</div>
						{/* <div className="hidden lg:flex lg:w-5/12 justify-end  text-end">
							Alamat
						</div> */}
						{/* <div className="flex w-4/12 sm:w-3/12 lg:w-2/12  text-center justify-center">
							Action	
						</div> */}
					</div>
					{/* <hr className="bg-gray-200 w-full h-[0.2rem]" /> */}
					{/* <div
						className="flex flex-row w-full gap-2 py-1 justify-around cursor-default"
						style={{ scrollbarGutter: "stable" }}
					>
						<div className="w-1/12  flex  lg:w-[4%] justify-center  text-center">
							1.
						</div>
						<div className="flex w-6/12 sm:w-6/12 lg:w-3/12  justify-center lg:justify-start lg:text-left">
							Christian
						</div>
						<div className="flex w-1/12 justify-center lg:text-left">
							6 tahun
						</div>
						<div className="hidden lg:flex lg:w-5/12  text-end justify-end">
							Ampel, Boyolali
						</div>
						<div className="flex w-4/12 sm:w-3/12 lg:w-2/12  text-center justify-center">
							Action
						</div>
					</div> */}

					{/* DATA TABEL START*/}
					<div className="flex-col w-full  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-track-gray-100 overflow-x-hidden  ">
						{loading ? (
							<div className="flex w-full text-center justify-center items-center py-4 whitespace-pre ">
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
						) : customers.length ? (
							customers.map((c, index) => (
								<div
									key={c.id}
									onClick={() =>
										navigate(`/gudang/pelanggan/detail`, {
											state: { id: c.id },
										})
									}
								>
									<div
										className="flex flex-row w-full gap-2 py-3 hover:bg-gray-400/10	 items-center cursor-pointer justify-start text-xs lg:text-sm"
										key={c.id}
										style={{ scrollbarGutter: "stable" }}
									>
										<div className="w-[3rem] justify-start  text-center ">
											{index + 1}.
										</div>
										<div className="flex w-6/12 text-left whitespace-pre truncate">
											{c.name}
										</div>
										<div className="flex w-5/12   text-center justify-self-end self-end justify-end truncate">
											{c.transactions_count}{" "}
											&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										</div>
										{/* <div className="hidden lg:flex w-5/12  text-left truncate">
											{c.address}
										</div> */}
									</div>
									<hr className="bg-main w-full h-[0.1rem]" />
								</div>
							))
						) : (
							<div className="flex w-full text-center justify-center items-center py-4 whitespace-pre ">
								Maaf, Tidak ada Data
							</div>
						)}
					</div>
					{/* DATA TABEL END */}
					{/* <hr className="bg-gray-200 w-full h-[0.2rem]" /> */}
					{/* TABLE WITH COL LAYOUT END*/}
				</div>
			</div>
		</FadeInPage>
	);
}
