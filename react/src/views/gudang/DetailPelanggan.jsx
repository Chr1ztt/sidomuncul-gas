import { motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { AiOutlineArrowLeft, AiOutlineLoading3Quarters } from "react-icons/ai";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import FadeInPage from "../../components/FadeInPage";
import { PiUserCircleLight } from "react-icons/pi";
import {
	IoCheckmarkCircle,
	IoCheckmarkCircleOutline,
	IoCheckmarkDoneCircleOutline,
	IoCheckmarkDoneCircle,
	IoArrowBack,
} from "react-icons/io5";

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

export default function DetailPelanggan() {
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = location.state;
	const [customer, setCustomer] = useState({});
	const [loading, setLoading] = useState(false);
	const rupiahFormat = (value) => new Intl.NumberFormat("id-ID").format(value);

	const getCustomer = () => {
		setLoading(true);
		axiosClient
			.get(`/customer/${id}`)
			.then(({ data }) => {
				setCustomer(data.data);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => setLoading(false));
	};
	useEffect(() => {
		getCustomer();
	}, []);
	return (
		<FadeInPage scrollable={false}>
			<div className="flex flex-row w-full justify-center md:justify-start  py-2 md:py-4 mt-2">
				<h3 className="flex items-center text-2xl font-bold ">
					<NavLink
						to={-1}
						className={
							"p-2 mr-1 rounded-md text-forth hover:bg-forth hover:text-white flex"
						}
					>
						<IoArrowBack size={23} className="min-w-max" />
					</NavLink>
					Detail Pelanggan
				</h3>
			</div>
			<div
				className={`flex w-full flex-col justify-center items-center  sm:flex-row gap-2 md:max-h-[40%] 
				bg-white/80 text-black shadow-lg py-10 rounded-xl ${
					loading && `animate-pulse`
				}`}
			>
				<div className="flex w-72 justify-center items-center">
					<div
						className={`flex ${
							loading && `bg-slate-200`
						} justify-center items-center rounded-full w-36 h-36 m-1`}
					>
						{!loading && <PiUserCircleLight size={200} className="min-w-max" />}
					</div>
				</div>
				<div
					className={`flex flex-col w-full ${
						loading && `gap-3`
					}  px-3 flex-wrap`}
				>
					<div
						className={`flex  ${
							loading ? `w-8/12 lg:w-4/12 bg-slate-200 ` : `w-full`
						} align-middle  my-2 rounded-full justify-center sm:justify-start font-bold text-2xl self-center sm:self-start`}
					>
						{loading ? (
							<span className="invisible text-base">tes</span>
						) : (
							customer?.name
						)}
					</div>
					<div
						className={`flex ${
							loading ? `  w-4/12 lg:w-2/12  bg-slate-200` : `w-full`
						}  rounded-full justify-center sm:justify-start text-md self-center sm:self-start`}
					>
						{loading ? (
							<span className="invisible  text-xs">tes</span>
						) : (
							new Date().getFullYear() - customer.birth_year + " Tahun"
						)}{" "}
					</div>
					<div
						className={`flex w-full ${
							loading && ` bg-slate-200`
						}  rounded-full justify-center sm:justify-start text-center sm:text-start text-md self-center sm:self-start`}
					>
						{loading ? (
							<span className="invisible  text-xs">tes</span>
						) : (
							customer?.address
						)}
					</div>
					<div className={`flex-row gap-3 flex`}>
						<div
							className={`flex ${
								loading ? `w-7/12 bg-slate-200 ` : `w-full`
							}  rounded-full justify-center sm:justify-start text-md self-center sm:self-start`}
						>
							{loading ? (
								<span className="invisible text-xs">tes</span>
							) : (
								"Telp. " + customer?.phone_number
							)}
						</div>
						<div
							className={`${
								loading ? `flex` : `hidden`
							} w-5/12 bg-slate-200  rounded-full`}
						>
							<span className="invisible  text-xs">tes</span>
						</div>
					</div>
					<div
						className={`flex ${
							loading ? `  w-7/12 lg:w-5/12  bg-slate-200` : `w-full`
						}  rounded-full justify-center sm:justify-start text-md self-center mt-4 sm:self-start font-light`}
					>
						{loading ? (
							<span className="invisible  text-xs ">tes</span>
						) : customer?.transactions?.length > 0 ? (
							`Total ${customer?.transactions?.length} transaksi telah tercatat`
						) : (
							`Belum pernah melakukan transaksi`
						)}{" "}
					</div>
				</div>
			</div>

			{/* <hr className="w-full bg-main my-1 sm:mt-5 h-[0.1rem]" /> */}
			<div className="flex w-full flex-col  my-6 flex-initial md:overflow-y-hidden shadow-md rounded-lg bg-white/80">
				<h2 className="font-bold text-2xl px-4 py-4 text-center sm:text-start">
					Riwayat Transaksi
				</h2>

				{/* <hr className="bg-main w-full h-[0.2rem]" /> */}

				<div
					className="flex flex-row w-full md:gap-2 py-3 bg-gray-400/20 justify-between cursor-default text-[0.6rem] lg:text-xs  text-gray-400 font-bold uppercase"
					style={{ scrollbarGutter: "stable" }}
				>
					<div className="w-1/12 flex lg:w-[4%] justify-center  text-center truncate">
						No.
					</div>
					<div className="flex w-4/12 text-left truncate">Transaksi</div>
					<div className="flex w-2/12 md:w-2/12  justify-end truncate">
						Harga
					</div>
					<div className="flex w-3/12 sm:w-2/12 xl:w-1/12 justify-center truncate">
						Tanggal
					</div>
					<div className="flex w-14 sm:w-16 lg:w-28  text-center justify-center">
						Status
					</div>
				</div>
				{/* <hr className="bg-main w-full h-[0.2rem]" /> */}

				<div className="flex-col w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-track-gray-100 overflow-x-hidden  ">
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
					) : customer?.transactions?.length ? (
						customer?.transactions.map((t, index) => {
							const months = [
								"Jan",
								"Feb",
								"Mar",
								"Apr",
								"May",
								"Jun",
								"Jul",
								"Aug",
								"Sep",
								"Oct",
								"Nov",
								"Dec",
							];
							const date = new Date(t.created_at);
							t.created = `${date.getDate()} ${
								months[date.getMonth()]
							} ${date.getFullYear()}`;
							t.customer = {
								name: customer.name,
								birth_year: customer.birth_year,
								address: customer.address,
								phone_number: customer.phone_number,
							};
							return (
								<div
									key={t.id}
									onClick={() =>
										navigate(`/gudang/transaksi/detail`, {
											state: { transaction: t },
										})
									}
								>
									<div
										className="flex flex-row w-full md:gap-2 py-3 hover:bg-gray-400/10 items-center cursor-pointer justify-between text-[0.7rem] sm:text-xs lg:text-sm"
										key={t.id}
										style={{ scrollbarGutter: "stable" }}
									>
										<div className="w-1/12 flex lg:w-[4%] justify-center  text-center text-[0.6rem] sm:text-xs lg:text-sm truncate">
											{index + 1}.
										</div>
										<div className="flex w-4/12 text-left text-[0.6rem] sm:text-xs lg:text-sm truncate">
											{t.transaction_lines
												.reduce((ac, tl) => ac + tl.gas.name + ", ", "")
												.slice(0, -2)}
										</div>
										<div className="flex w-2/12 md:w-2/12  justify-end text-[0.6rem] sm:text-xs lg:text-sm  truncate">
											<span className="hidden md:inline-flex">Rp&nbsp;</span>
											{rupiahFormat(t.total_price)}
											<span className="hidden md:inline-flex">,00</span>
										</div>
										<div className="flex w-3/12 sm:w-2/12 xl:w-1/12 justify-center text-[0.6rem] sm:text-xs lg:text-sm truncate">
											{t.created}
										</div>
										<div className="flex w-1/12 justify-center text-left text-[0.6rem] sm:text-xs lg:text-sm  truncate">
											{t.is_debt ? (
												t.is_tube_returned ? (
													<IoCheckmarkDoneCircleOutline
														size={25}
														className={`min-w-max text-green-500`}
													/>
												) : (
													<IoCheckmarkCircleOutline
														size={25}
														className={`min-w-max text-green-500`}
													/>
												)
											) : t.is_tube_returned ? (
												<IoCheckmarkDoneCircle
													size={25}
													className={`min-w-max text-green-500`}
												/>
											) : (
												<IoCheckmarkCircle
													size={25}
													className={`min-w-max text-green-500`}
												/>
											)}

											{/* {t.is_tube_returned ? (
										<IoIosCheckmarkCircle
											size={23}
											className="min-w-max text-green-500"
										/>
									) : null} */}
										</div>
										{/* <div className="flex w-fit text-center items-center justify-center">
									<button
										onClick={(ev) => {
											ev.preventDefault();
											onEditClick(t);
										}}
										className="text-green-700 text-sm"
									>
										<span className="flex hover:bg-green-700 border-2 border-green-700 hover:text-white px-2 py-1 rounded-sm items-center ">
											<span className="whitespace-pre flex items-center">
												<AiOutlineEdit
													size={18}
													className="inline-flex min-w-max "
												/>
												<span className="hidden lg:flex">Edit</span>
											</span>
										</span>
									</button>
									&nbsp;
									<button
										onClick={(ev) => onDeleteClick(t)}
										className="text-red-700 text-sm"
									>
										<span className="flex hover:bg-red-700 border-2 border-red-700 hover:text-white px-2 py-1 rounded-sm items-center">
											<span className="whitespace-pre flex items-center">
												<AiOutlineDelete
													size={18}
													className="inline-flex min-w-max"
												/>
												<span className="hidden lg:flex">Delete</span>
											</span>
										</span>
									</button>
								</div> */}
									</div>
									<hr className="bg-main w-full h-[0.09rem]" />
								</div>
							);
						})
					) : (
						<div className="flex w-full text-center justify-center items-center py-4 whitespace-pre ">
							Pelanggan ini belum melakukan transaksi apapun.
						</div>
					)}
				</div>
			</div>
		</FadeInPage>
	);
}
