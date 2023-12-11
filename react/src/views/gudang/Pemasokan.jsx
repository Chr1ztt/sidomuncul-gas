import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios-client";
import ReactPaginate from "react-paginate";

// ICONS
import {
	AiOutlineEdit,
	AiOutlineDelete,
	AiOutlineLoading3Quarters,
	AiOutlineSearch,
} from "react-icons/ai";
import SupplyDeleteModal from "../../components/SupplyDeleteModal";
import FadeInPage from "../../components/FadeInPage";
import { useNavigate } from "react-router-dom";

export default function Supplies() {
	// const [suppliers, setSuppliers] = useState({
	//   data: [],
	//   currentPage: 1,
	//   pageCount: 1,
	// });
	const navigate = useNavigate();
	const [searchKeyword, setSearchKeyword] = useState("");
	const [countPage, setCountPage] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [supplies, setSupplies] = useState([]);
	const [loading, setLoading] = useState(false);
	const { setNotification } = useStateContext();
	const [modalOpen, setModalOpen] = useState(false);
	const [edit, setEdit] = useState(false);

	const handleSearchClick = (ev) => {
		ev.preventDefault();
		setCurrentPage(1);
		getSupplies();
	};

	const getSupplies = () => {
		setLoading(true);
		axiosClient
			.get(
				`/supply?page=${currentPage}${
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
				setSupplies(data.data);
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

	useEffect(() => {
		getSupplies();
	}, [currentPage]);

	return (
		<FadeInPage
		// variants={pageTransition}
		// initial="initial"
		// animate="animate"
		// exit="exit"
		// transition={{
		// 	// type : "spring",
		// 	// duration: 0.3,
		// 	// damping: 60,
		// 	// stiffness: 500,
		// 	type: "tween",
		// 	duration: 0.25,
		// 	ease: "easeOut",
		// }}
		// className="absolute flex flex-col w-full items-center bg-grey h-full px-2 md:px-4 lg:px-5 font-semibold"
		>
			{/* HEADER */}
			<div className="flex flex-row w-full justify-between py-2 md:py-4">
				<div className="flex items-center text-3xl font-bold pt-2">
					Data Pemasokan Produk
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
							onClick={() => navigate(`/gudang/pemasokan/tambah`)}
						>
							Tambah{" "}
							<span className="hidden sm:inline lg:hidden xl:inline">
								Pemasokan
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
			{/* <hr className="bg-main w-full h-[0.2rem]" /> */}

			<div className="flex w-full flex-col  mb-6 flex-initial overflow-y-hidden shadow-md rounded-md bg-white/80">
				<div
					className="flex flex-row w-full md:gap-2 py-3 bg-black/10 justify-between cursor-default text-[0.6rem] lg:text-xs  text-gray-400 font-bold uppercase"
					style={{ scrollbarGutter: "stable" }}
				>
					<div className="w-1/12 flex lg:w-[4%] justify-center  text-center truncate">
						No.
					</div>
					<div className="flex w-5/12 sm:w-6/12 xl:w-8/12 text-left truncate">
						Supplier
					</div>
					<div className="flex w-3/12 text-center justify-center truncate">
						Jumlah tabung
					</div>
					<div className="flex w-3/12 sm:w-2/12 xl:w-1/12 text-left truncate">
						Tanggal
					</div>
					{/* <div className="flex w-24 sm:w-20 lg:w-36  text-center justify-center">
					Action
				</div> */}
				</div>
				{/* <hr className="bg-main w-full h-[0.2rem]" /> */}

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
									className="fill-black min-w-max "
								/>
							</svg>
							Loading...
						</div>
					) : supplies.length ? (
						supplies.map((s, index) => (
							<div
								key={s.id}
								onClick={() =>
									navigate(`/gudang/pemasokan/detail`, {
										state: { supply: s },
									})
								}
							>
								<div
									className="flex flex-row w-full md:gap-2 py-3 hover:bg-gray-400/10 items-center cursor-pointer justify-between text-[0.7rem] sm:text-xs lg:text-sm"
									key={s.id}
									style={{ scrollbarGutter: "stable" }}
								>
									<div className="w-1/12 flex lg:w-[4%] py-1 justify-center  text-center text-[0.6rem] sm:text-xs lg:text-sm truncate">
										{index + 1 + 20 * (currentPage - 1)}.
									</div>
									<div className="flex w-5/12 sm:w-6/12 xl:w-8/12 py-1 text-left text-[0.6rem] sm:text-xs lg:text-sm truncate">
										{s.supplier_name}
									</div>
									<div className="flex w-3/12  py-1 text-center justify-center text-[0.6rem] sm:text-xs lg:text-sm  truncate hover:font-extrabold hover:text-blue-800 hover:cursor-pointer">
										{s.tube_count}
									</div>
									<div className="flex w-3/12 sm:w-2/12 xl:w-1/12 text-left text-[0.6rem] sm:text-xs lg:text-sm truncate">
										{s.created}
									</div>
									{/* <div className="flex w-fit py-1 text-center items-center justify-center">
									<button
										onClick={(ev) => {
											ev.preventDefault();
											setEdit(true);
											onEditClick(s);
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
										onClick={(ev) => onDeleteClick(s)}
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
								<hr className="bg-main w-full h-[0.1rem]" />
							</div>
						))
					) : (
						<div className="flex w-full text-center justify-center items-center py-4 whitespace-pre ">
							Maaf, Tidak ada Data
						</div>
					)}
				</div>
			</div>
			{/* DATA TABEL END */}

			{/* <hr className="bg-main w-full h-[0.2rem]" /> */}
			{/* TABLE WITH COL LAYOUT END*/}

			{/* MODAL START*/}
			{/* <AnimatePresence>
				{modalOpen && (
					<SupplyForm
						closeModal={closeModal}
						// handleSubmit={onSubmit}
						detail={detail}
						setDetail={setDetail}
						getSupplies={getSupplies}
						edit={edit}
					/>
				)}

				{deleteModal && (
					<SupplyDeleteModal
						closeDeleteModal={closeDeleteModal}
						handleDelete={handleDeleteClick}
						detail={detail}
					/>
				)}
			</AnimatePresence> */}
			{/* MODAL END*/}
		</FadeInPage>
	);
}
