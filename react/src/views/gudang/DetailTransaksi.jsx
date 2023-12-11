import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { AiOutlineArrowLeft, AiOutlineLoading3Quarters } from "react-icons/ai";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import FadeInPage from "../../components/FadeInPage";
import { IoCheckmark } from "react-icons/io5";
import { PiUserCircleLight } from "react-icons/pi";
import { useStateContext } from "../../context/ContextProvider";
import ValidatorModal from "../../components/ValidatorModal";
import TransactionDeleteModal from "../../components/TransactionDeleteModal";
import PaidOffModal from "../../components/PaidOffModal";
import TubeReturnedModal from "../../components/TubeReturnedModal";
import { MdArrowBack } from "react-icons/md";

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

// const rupiahFormat = (value) => new Intl.NumberFormat("id-ID").format(value);

export default function DetailTransaksi() {
	const { user, setNotification } = useStateContext();
	const navigate = useNavigate();
	const location = useLocation();
	const { transaction } = location.state;
	const [loading, setLoading] = useState(false);
	// const [transaction, setTransaction] = useState({});
	const [total, setTotal] = useState(0);
	const [validatorModal, setValidatorModal] = useState(false);
	const [paidOffModal, setPaidOffModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);

	const fullRupiahFormat = (value) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
		}).format(value);

	// const getTransaction = () => {
	// 	// setLoading(true);
	// 	axiosClient
	// 		.get(`/transaction/${id}`)
	// 		.then(({ data }) => {
	// 			// console.log(data);
	// 			setTransaction(data);
	// 			let totalResult = 0,
	// 				tubeListResult = "";
	// 			data.transaction_lines.forEach((d) => {
	// 				totalResult += d.gas.selling_price;
	// 				tubeListResult += d.tube_id + ", ";
	// 			});
	// 			tubeListResult = tubeListResult.slice(0, -2);
	// 			setTotal(totalResult);
	// 			setTubeList(tubeListResult);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// 	// .finally(() => setLoading(false));
	// };

	const onValidatorYesClick = () => {
		const payload = {
			isUpdateTube: 1,
			id: transaction.id,
			customer_id: transaction.customer_id,
			total_price: transaction.total_price,
			is_tube_returned: 1,
			is_debt: transaction.is_debt,
			note: transaction.note,
			transaction_lines: transaction.transaction_lines,
		};
		axiosClient
			.put(`/transaction/${payload.id}`, payload)
			.then(({ data }) => {
				setNotification("Data tabung berhasil diupdate");
				setValidatorModal(false);
				navigate(-1);
			})
			.catch((err) => setNotification("Ada kesalahan"))
			.finally(() => setValidatorModal(false));
	};

	const onPaidYesClick = () => {
		const payload = {
			isUpdateTube: 0,
			id: transaction.id,
			customer_id: transaction.customer_id,
			total_price: transaction.total_price,
			is_tube_returned: transaction.is_tube_returned,
			is_debt: 0,
			note: transaction.note,
		};

		axiosClient
			.put(`/transaction/${payload.id}`, payload)
			.then(({ data }) => {
				setNotification("Data tabung berhasil diupdate");
				setValidatorModal(false);
				navigate(-1);
			})
			.catch((err) => setNotification("Ada kesalahan"))
			.finally(() => setValidatorModal(false));
	};

	const closePaidOffModal = () => {
		setPaidOffModal(false);
	};

	const closeValidatorModal = () => {
		setValidatorModal(false);
	};

	const closeDeleteModal = () => {
		setDeleteModal(false);
	};

	// useEffect(() => {
	// 	getTransaction();
	// }, []);

	return (
		<FadeInPage scrollable={false}>
			<div className="flex flex-row w-full justify-center md:justify-start py-2 md:py-4 mt-2 ">
				<h2 className="flex items-center text-2xl font-bold ">
					<NavLink
						to={-1}
						className={
							" p-2 mr-1 rounded-md text-forth hover:bg-forth hover:text-white flex"
						}
					>
						<MdArrowBack size={23} className="min-w-max" />
					</NavLink>
					Detail Transaksi
				</h2>
			</div>
			<div
				className={`printable flex flex-col w-full max-w-screen-sm p-5 sm:p-7 m-1 shadow-md bg-white rounded-md`}
				id="transaction_invoice"
			>
				<div className="flex mx-auto font-extrabold text-2xl pb-5 justify-self-center items-center">
					NOTA TRANSAKSI
				</div>
				<div className={`flex flex-row w-full text-[0.5rem] gap-2 sm:text-xs `}>
					<div className={`flex flex-col w-6/12 justify-end`}>
						<div
							className={`font-bold text-sm md:text-base ${
								loading && `animate-pulse`
							}`}
						>
							{loading ? (
								<div className="w-28 max-w-full my-1 h-4 bg-slate-200 rounded-full"></div>
							) : (
								"Pembeli"
							)}
						</div>
						<div className="">
							{loading ? (
								<div className="w-60 max-w-full  mt-2 h-2 bg-slate-200 rounded-full" />
							) : (
								transaction?.customer?.name
							)}{" "}
						</div>
						<div className="">
							{loading ? (
								<div className="w-36 max-w-full mt-2 h-2 bg-slate-200 rounded-full" />
							) : (
								new Date().getFullYear() -
								transaction?.customer?.birth_year +
								" Tahun"
							)}
						</div>
						<div className="">
							{loading ? (
								<div className="w-64 max-w-full mt-2 h-2 bg-slate-200 rounded-full" />
							) : (
								transaction?.customer?.address
							)}
						</div>
						<div className="">
							{loading ? (
								<div className="w-52 max-w-full mt-2 h-2 bg-slate-200 rounded-full" />
							) : (
								transaction?.customer?.phone_number
							)}
						</div>
					</div>
					<div className="flex flex-col w-6/12">
						<div className={`font-bold text-sm md:text-base `}>Penjual</div>
						<div className="font-bold text-xs sm:text-sm">
							Bengkel Las Sido Muncul
						</div>
						<div className="">
							Klenteng Mobil, Cat, Oxygen, Acetylen, Argon, Nitrogen
						</div>
						<div className="">
							Jl. Semarang - Bawen Km. 24,7 Ds, Lemahbang Rt.03 Rw. 05 No. 1
						</div>
						<div className="">082241252353</div>
					</div>
				</div>
				<div className="flex flex-col w-full my-5 text-[0.5rem] sm:text-xs">
					{/* TABLE WITH COL LAYOUT START*/}
					<hr className="bg-main w-full h-[2px]" />

					<div
						className="flex flex-row w-full gap-2 py-1 justify-around cursor-default"
						style={{ scrollbarGutter: "stable" }}
					>
						<div className="w-1/12 flex lg:w-[4%] justify-center  text-center truncate">
							No.
						</div>
						<div className="flex w-5/12 text-left truncate">Item</div>
						<div className="flex w-3/12  justify-center truncate">
							No. Tabung
						</div>
						<div className="flex w-3/12  justify-end truncate">
							Price &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						</div>
						{/* <div className="flex w-14 sm:w-16 lg:w-28  text-center justify-center">
						Status
					</div> */}
					</div>
					<hr className="bg-main w-full h-[1.2px]" />

					{/* DATA TABEL START*/}
					<div className="flex-col w-full overflow-y-auto  scrollbar-thin scrollbar-thumb-main/20 scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-track-selected-item/20 overflow-x-hidden  ">
						{loading ? (
							<div className="flex flex-col w-full text-center justify-center items-center gap-2 whitespace-pre ">
								<div className="w-full mt-2 h-2 bg-slate-200 rounded-full" />
								<div className="flex flex-row w-full gap-2">
									<div className="w-3/12 h-2 bg-slate-200 rounded-full" />
									<div className="w-9/12 h-2 bg-slate-200 rounded-full" />
								</div>
								<div className="flex flex-row w-full gap-2">
									<div className="w-8/12 h-2 bg-slate-200 rounded-full" />
									<div className="w-4/12 h-2 bg-slate-200 rounded-full" />
								</div>
								<div className="flex flex-row mb-2 w-full gap-2">
									<div className="w-8/12 h-2 bg-slate-200 rounded-full" />
									<div className="w-4/12 h-2 bg-slate-200 rounded-full" />
								</div>
								{/* <svg
									className="animate-spin flex items-center w-5 h-5 mr-2 "
									viewBox="0 0 30 30"
								>
									<AiOutlineLoading3Quarters
										size={30}
										className="fill-black min-w-max "
									/>
								</svg>
								Loading... */}
							</div>
						) : transaction?.transaction_lines?.length ? (
							transaction?.transaction_lines?.map((tl, index) => (
								<div key={tl.id}>
									<hr className="bg-main w-full h-[0.8px]" />
									<div
										className="flex flex-row w-full gap-2 py-2 items-center cursor-default justify-around"
										key={tl.id}
										style={{ scrollbarGutter: "stable" }}
									>
										<div className="w-1/12 flex lg:w-[4%] justify-center  text-center truncate">
											{index + 1}.
										</div>
										<div className="flex w-5/12 text-left truncate">
											{tl.gas.name}
										</div>
										<div className="flex w-3/12 justify-center truncate">
											{tl.tube_id}
										</div>
										<div className="flex w-3/12 justify-end   truncate">
											{/* <span>Rp&nbsp;</span> */}
											{fullRupiahFormat(tl.gas.selling_price)}
											{/* <span>,00</span> */}
											&nbsp;
										</div>
									</div>
								</div>
							))
						) : (
							<div className="flex w-full text-center justify-center items-center py-4 whitespace-pre ">
								Maaf, Tidak ada Data
							</div>
						)}
					</div>
					<hr className="bg-main w-full h-[1.5px]" />

					{/* DATA TABEL END */}

					<div className="flex flex-col w-full">
						<div className="flex flex-row w-full justify-end gap-2 font-extrabold  items-center">
							<div className="w-1/12 flex lg:w-[4%] justify-center  text-center truncate"></div>
							<div className="flex w-5/12 text-left truncate"></div>
							<div className="w-3/12 text-center bg-grey z-0 py-2">Total</div>
							<div className="w-3/12 text-end flex justify-end items-center">
								{loading ? (
									<div className="w-32 max-w-full justify-end my-1 h-2  bg-slate-200 rounded-full"></div>
								) : (
									fullRupiahFormat(transaction.total_price)
								)}
								&nbsp;
							</div>
						</div>
						<hr className="bg-main w-6/12 ms-auto h-[0.09rem]" />
					</div>
				</div>

				<div className="flex flex-row text-[0.5rem] gap-2 sm:text-xs ">
					<div className="flex w-6/12 flex-col">
						<div className="flex flex-row">
							Tabung yang dipinjam :&nbsp;
							{loading ? (
								<span className="w-14 lg:w-28 mt-1 h-1 sm:h-2 bg-slate-200 rounded-full" />
							) : (
								transaction?.transaction_lines
									?.reduce((r, t) => r + (t.tube_id + ", "), "")
									.slice(0, -2)
								// tubeList
							)}
						</div>
						<div className="pt-3 text-sm">Catatan Tambahan : </div>
						<div className="h-28 w-full">
							{loading ? (
								<div className="flex flex-col w-full pr-3">
									<div className="flex w-full  mt-1 h-1 sm:h-2 bg-slate-200 rounded-full" />
									<div className="flex flex-row gap-2">
										<div className="w-3/12  mt-1 h-1 sm:h-2 bg-slate-200 rounded-full" />
										<div className="w-9/12  mt-1 h-1 sm:h-2 bg-slate-200 rounded-full" />
									</div>
									<div className="flex flex-row gap-2">
										<div className="w-7/12  mt-1 h-1 sm:h-2 bg-slate-200 rounded-full" />
										<div className="w-5/12  mt-1 h-1 sm:h-2 bg-slate-200 rounded-full" />
									</div>
								</div>
							) : (
								transaction?.note
							)}
						</div>
						<div className="font-extrabold text-3xl py-3">Terima Kasih</div>
					</div>
					<div className="flex w-6/12 flex-col items-center justify-end">
						<div className="font-bold text-base">Hormat Kami,</div>
						<hr className="mt-20 bg-main w-60 max-w-full h-[2px]" />
						<div className="font-semibold text-sm pt-2">{user.name}</div>
					</div>
				</div>
			</div>

			<div className="flex flex-row flex-wrap w-full justify-center gap-2 py-4">
				<button
					className={`flex flex-row gap-2 items-center py-2 px-4  text-white rounded-md  ${
						!transaction.is_tube_returned
							? `bg-forth hover:opacity-70`
							: `bg-forth/70`
					}`}
					onClick={() => setValidatorModal(true)}
					disabled={transaction.is_tube_returned}
				>
					{transaction.is_tube_returned ? (
						<>
							<IoCheckmark size={20} className="flex min-w-max" />
							<span className="flex">Tabung Dikembalikan</span>
						</>
					) : (
						<span>Nyatakan Tabung Kembali</span>
					)}
				</button>

				<button
					className={`flex flex-row gap-2 items-center py-2 px-4  text-white rounded-md  ${
						transaction.is_debt ? `bg-forth hover:opacity-70` : `bg-forth/70`
					}`}
					onClick={() => setPaidOffModal(true)}
					disabled={!transaction.is_debt}
				>
					{transaction.is_debt ? (
						<span>Nyatakan Lunas</span>
					) : (
						<>
							<IoCheckmark size={20} className="flex min-w-max" />
							<span className="flex">Lunas</span>
						</>
					)}
				</button>

				<button
					className="py-2 px-4 bg-forth rounded-md  hover:opacity-70 text-white"
					onClick={() => setDeleteModal(true)}
				>
					Hapus
				</button>
				<button
					className="py-2 px-4 bg-forth text-white rounded-md  hover:opacity-70"
					onClick={() => window.print()}
				>
					Print
				</button>
			</div>

			{/* MODAL START */}
			<AnimatePresence>
				{paidOffModal && (
					<PaidOffModal
						onYesClick={onPaidYesClick}
						closeModal={closePaidOffModal}
					/>
				)}
				{validatorModal && (
					<TubeReturnedModal
						onYesClick={onValidatorYesClick}
						closeModal={closeValidatorModal}
					/>
				)}
				{deleteModal && (
					<TransactionDeleteModal
						closeDeleteModal={closeDeleteModal}
						detail={transaction}
					/>
				)}
			</AnimatePresence>
			{/* MODAL END */}
		</FadeInPage>
	);
}
