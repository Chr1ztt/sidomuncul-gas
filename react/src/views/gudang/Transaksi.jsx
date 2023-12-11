import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios-client";
import ReactPaginate from "react-paginate";
import {
	IoCheckmarkCircle,
	IoCheckmarkCircleOutline,
	IoCheckmarkDoneCircleOutline,
	IoCheckmarkDoneCircle,
	IoCheckmark,
	IoCheckmarkDone,
} from "react-icons/io5";

// ICONS
import { FaCircle, FaRegCircle } from "react-icons/fa";
import { AiOutlineLoading3Quarters, AiOutlineSearch } from "react-icons/ai";
import SupplyDeleteModal from "../../components/SupplyDeleteModal";
import { Navigate, useNavigate } from "react-router-dom";
import FadeInPage from "../../components/FadeInPage";

const rupiahFormat = (value) => new Intl.NumberFormat("id-ID").format(value);

export default function Transaksi() {
	const navigate = useNavigate();
	const [searchKeyword, setSearchKeyword] = useState("");
	const [countPage, setCountPage] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [openPanduan, setOpenPanduan] = useState(false);

	const handleSearchClick = (ev) => {
		ev.preventDefault();
		setCurrentPage(1);
		getTransactions();
	};

	const getTransactions = () => {
		setLoading(true);
		axiosClient
			.get(
				`/transaction?page=${currentPage}${
					searchKeyword ? "&search=" + searchKeyword : ""
				}`
			)
			.then(({ data }) => {
				setLoading(false);
				// console.log(data);
				// setSuppliers({
				//   data: data.data,
				//   currentPage: data.meta.current_page,
				//   pageCount: Math.ceil(data.meta.page_count),
				// });
				setCountPage(data.meta.last_page);
				setTransactions(data.data);
			})
			.catch(() => {
				setLoading(false);
			});
		// .finally(()=>console.log(suppliers));
	};

	const handlePaginationClick = (ev) => {
		const halaman = ev.selected + 1;
		setCurrentPage(halaman);
		// getSuppliers();
	};

	const onRowClick = (ev) => {
		return <Navigate to={"/gudang/transaksi/detail"} />;
	};

	useEffect(() => {
		getTransactions();
	}, [currentPage]);

	return (
		<FadeInPage>
			{/* HEADER */}
			<div className="flex flex-row w-full justify-between py-2 md:py-4 mt-2">
				<div className="flex items-center text-3xl font-bold ">
					Data Transaksi
				</div>
				<div className="relative ">
					<button
						onClick={() => setOpenPanduan(!openPanduan)}
						className="flex py-2 px-4 bg-forth hover:bg-forth/90 text-white rounded-sm "
					>
						Panduan Status
					</button>
					<div
						className={`absolute flex right-0   flex-col rounded-md mt-2 bg-white overflow-y-hidden transition-all z-10 ${
							openPanduan ? `border-2 border-forth max-h-96 ` : `max-h-0`
						}`}
					>
						<div className="flex whitespace-pre px-6 py-1 mt-4">
							Status Pembayaran
						</div>
						<div className="flex flex-row px-6 py-1 gap-2 items-center whitespace-pre">
							&nbsp;
							<FaRegCircle size={20} className="min-w-max  text-forth" />
							<span>Belum Lunas</span>
						</div>
						<div className="flex flex-row gap-2 px-6 py-1 items-center whitespace-pre">
							&nbsp;
							<FaCircle size={20} className="min-w-max text-forth" />
							<span>Sudah Lunas</span>
						</div>
						<div className="flex whitespace-pre px-6 py-1">Status Tabung </div>
						<div className="flex flex-row gap-2 px-6 py-1 items-center whitespace-pre">
							&nbsp;
							<IoCheckmark size={20} className="min-w-max  text-forth" />
							<span>Tabung berada di Pelanggan</span>
						</div>
						<div className="flex flex-row gap-2 px-6 py-1 items-center whitespace-pre">
							&nbsp;
							<IoCheckmarkDone size={20} className="min-w-max  text-forth" />
							<span>Tabung Sudah dikembalikan</span>
						</div>
						<button
							onClick={() => setOpenPanduan(false)}
							className="bg-forth text-white flex w-fit self-end py-1 px-3 mx-5 mb-5 mt-3 rounded-sm hover:bg-forth/80"
						>
							Aku Mengerti !
						</button>
					</div>
				</div>
			</div>
			{/* HEADER */}

			{/* SEARCH OPTION START*/}
			<div className="flex flex-col lg:flex-row w-full mb-3 gap-2">
				<form
					onSubmit={handleSearchClick}
					className="flex flex-grow w-full bg-[#FBFCF7] items-center justify-between border-2 border-gray-200 px-2 rounded-md"
				>
					{/* <button className="flex text-black  py-2 px-3 bg-gray-300 border-collapse hover:bg-gray-200 cursor-pointer rounded-sm ">
					Search
				</button> */}
					<div className="flex flex-grow rounded-lg  justify-center items-center">
						<AiOutlineSearch size={23} className="min-w-max ml-1" />
						<input
							value={searchKeyword}
							placeholder="Search..."
							onChange={(ev) => setSearchKeyword(ev.target.value)}
							className="flex-1  p-2 rounded-sm focus:outline-none outline-none bg-[#FBFCF7]"
							type="text"
						/>
					</div>
				</form>
				{/* BOTTOM BUTTON START*/}
				<div className="flex flex-row w-full justify-between items-center gap-1">
					<div className="flex flex-row justify-between gap-2 ">
						<div
							className="px-3 sm:px-4 py-2  bg-forth text-white hover:bg-forth/80 cursor-pointer text-xs sm:text-sm lg:text-base rounded-sm whitespace-pre "
							onClick={() => navigate(`/gudang/transaksi/tambah`)}
						>
							Tambah{" "}
							<span className="hidden sm:inline lg:hidden xl:inline">
								Transaksi
							</span>
						</div>
					</div>
					<div className="flex">
						<ReactPaginate
							pageCount={countPage}
							// pageCount={Math.ceil(suppliers.pageCount)}
							// initialPage={suppliers.currentPage+1}
							pageRangeDisplayed={2}
							marginPagesDisplayed={1}
							activeLinkClassName="py-1  px-2 rounded-sm border-main bg-forth text-white hover:bg-main hover:text-black text-xs sm:text-sm"
							pageLinkClassName="py-1  px-2 rounded-sm  border-forth hover:bg-forth hover:text-white text-xs sm:text-sm"
							breakClassName="py-2"
							nextLabel="&#x276F;"
							previousLabel="&#x276E;"
							previousLinkClassName="hover:bg-forth hover:text-white py-1 px-2 rounded-sm flex text-xs sm:text-sm"
							nextLinkClassName="hover:bg-forth hover:text-white py-1 px-2 rounded-sm flex text-xs sm:text-sm"
							containerClassName="flex flex-row gap-[0.1rem] text-sm items-center"
							onPageChange={handlePaginationClick}
						/>
					</div>
				</div>
				{/* BOTTOM BUTTON END*/}
			</div>
			{/* SEARCH OPTION END*/}

			{/* TABLE WITH COL LAYOUT START*/}
			{/* <hr className=" w-full h-[0.2rem]" /> */}

			<div className="flex w-full flex-col  mb-6 flex-initial overflow-y-hidden shadow-md rounded-md bg-white/80">
				<div
					className="flex flex-row w-full md:gap-2 py-3 bg-black/10 justify-between cursor-default text-[0.6rem] lg:text-xs  text-gray-400 font-bold uppercase"
					style={{ scrollbarGutter: "stable" }}
				>
					<div className="w-[3rem] justify-center  text-center  truncate">
						No.
					</div>
					<div className="flex w-3/12 text-left  truncate">Pelanggan</div>
					<div className="flex w-3/12  justify-end  truncate">Harga</div>
					<div className="flex w-3/12 justify-center  truncate">Tanggal</div>
					<div className="flex w-16 sm:w-20 lg:w-28  text-center  justify-center">
						Status
					</div>
				</div>
				{/* <hr className=" w-full h-[0.09rem]" /> */}

				{/* DATA TABEL START*/}
				<div className="flex-col w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-track-gray-100 overflow-x-hidden  ">
					{loading ? (
						<div className="flex w-full text-center justify-center items-center py-4 whitespace-pre ">
							<svg
								className="animate-spin flex items-center w-5 h-5 mr-2 "
								viewBox="0 0 30 30"
							>
								<AiOutlineLoading3Quarters
									size={30}
									className="fill-black min-w-max  "
								/>
							</svg>
							Loading...
						</div>
					) : transactions.length ? (
						transactions.map((t, index) => (
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
									<div className="w-[3rem] justify-center  text-center truncate">
										{index + 1 + 20 * (currentPage - 1)}.
									</div>
									<div className="flex w-3/12 text-left truncate">
										{t.customer_name}
									</div>
									<div className="flex w-3/12  justify-end  truncate">
										<span className="hidden md:inline-flex">Rp&nbsp;</span>
										{rupiahFormat(t.total_price)}
										<span className="hidden md:inline-flex">,00</span>
									</div>
									<div className="flex w-3/12  justify-center truncate">
										{t.created}
									</div>
									<div className="flex w-16 sm:w-20 lg:w-28  justify-center text-left  truncate">
										{t.is_debt ? (
											t.is_tube_returned ? (
												<IoCheckmarkDoneCircleOutline
													size={25}
													className={`min-w-max text-forth`}
												/>
											) : (
												<IoCheckmarkCircleOutline
													size={25}
													className={`min-w-max text-forth`}
												/>
											)
										) : t.is_tube_returned ? (
											<IoCheckmarkDoneCircle
												size={25}
												className={`min-w-max text-forth`}
											/>
										) : (
											<IoCheckmarkCircle
												size={25}
												className={`min-w-max text-forth`}
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
								<hr className="bg-gray-200 w-full h-[0.1rem]" />
							</div>
						))
					) : (
						<div className="flex w-full text-center justify-center items-center py-4 whitespace-pre ">
							Maaf, Tidak ada Data
						</div>
					)}
				</div>
				{/* DATA TABEL END */}

				{/* <hr className=" w-full h-[0.2rem]" /> */}
			</div>
			{/* TABLE WITH COL LAYOUT END*/}
		</FadeInPage>
	);
}
