import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios-client";
import { AnimatePresence, motion } from "framer-motion";
import ReactPaginate from "react-paginate";

// ICONS
import {
	AiOutlineEdit,
	AiOutlineDelete,
	AiOutlineLoading3Quarters,
	AiOutlineSearch,
} from "react-icons/ai";
import SupplierForm from "../../components/SupplierForm";
import SupplierDeleteModal from "../../components/SupplierDeleteModal";
import FadeInPage from "../../components/FadeInPage";
import { useNavigate } from "react-router-dom";

export default function Supplier() {
	// const [suppliers, setSuppliers] = useState({
	//   data: [],
	//   currentPage: 1,
	//   pageCount: 1,
	// });
	const navigate = useNavigate();

	const [searchKeyword, setSearchKeyword] = useState("");
	const [countPage, setCountPage] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [suppliers, setSuppliers] = useState([]);
	const [loading, setLoading] = useState(false);
	const { setNotification } = useStateContext();
	const [modalOpen, setModalOpen] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [sup, setSup] = useState({
		id: null,
		name: "",
		address: "",
		phone_number: "",
	});

	const closeModal = () => {
		setModalOpen(false);
		setSup({
			id: null,
			name: "",
			address: "",
			phone_number: "",
		});
	};

	const closeDeleteModal = () => {
		setDeleteModal(false);
		setSup({
			id: null,
			name: "",
			address: "",
			phone_number: "",
		});
	};

	const handleSearchClick = (ev) => {
		ev.preventDefault();
		setCurrentPage(1);
		getSuppliers();
	};

	const getSuppliers = () => {
		setLoading(true);
		axiosClient
			.get(
				`/supplier?page=${currentPage}${
					searchKeyword ? "&search=" + searchKeyword : ""
				}`
			)
			.then(({ data }) => {
				setLoading(false);
				// setSuppliers({
				//   data: data.data,
				//   currentPage: data.meta.current_page,
				//   pageCount: Math.ceil(data.meta.page_count),
				// });
				setCountPage(data.meta.last_page);
				setSuppliers(data.data);
			})
			.catch(() => {
				setLoading(false);
			})
			.finally(() => setLoading(false));
		// .finally(()=>console.log(suppliers));
	};

	const onEditClick = (s) => {
		setSup(s);
		setModalOpen(true);
	};

	// const onSubmit = (s) => {
	//   if (s.id) {
	//     axiosClient
	//       .put(`/supplier/${s.id}`, s)
	//       .then(() => {
	//         getSuppliers();
	//         setNotification("Supplier berhasil diupdate");
	//         setModalOpen(false);
	//         setSup({
	//           id: null,
	//           name: "",
	//           address: "",
	//         });
	//       })
	//       .catch((err) => {
	//         const response = err.response;
	//         if (response && response.status === 422) {
	//           //TODO HANDLING ERROR
	//           console.log(response.data.errors);
	//         }
	//       });
	//   } else {
	//     axiosClient
	//       .post("/supplier", s)
	//       .then(() => {
	//         getSuppliers();
	//         setNotification("Supplier berhasil ditambahkan");
	//         setModalOpen(false);
	//       })
	//       .catch((err) => {
	//         const response = err.response;
	//         if (response && response.status === 422) {
	//           // TODO HANDLING ERROR
	//           console.log(response.data.errors);
	//         }
	//       });
	//   }
	// };

	const onDeleteClick = (s) => {
		setSup(s);
		setDeleteModal(true);
	};

	const handleDeleteClick = (id) => {
		axiosClient
			.delete(`/supplier/${id}`)
			.then(() => {
				setNotification("Data berhasil dihapus");
				getSuppliers();
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => closeDeleteModal());
	};

	const handlePaginationClick = (ev) => {
		const halaman = ev.selected + 1;
		console.log(ev.selected);
		setCurrentPage(halaman);
		console.log(currentPage);
		// getSuppliers();
	};

	useEffect(() => {
		getSuppliers();
	}, [currentPage]);

	return (
		<FadeInPage>
			{/* HEADER */}
			<div className="flex flex-row w-full justify-between py-2 md:py-4 mt-2">
				<div className="flex items-center text-3xl font-bold ">
					Data Supplier
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
							onClick={() => setModalOpen(true)}
						>
							Tambah{" "}
							<span className="hidden sm:inline lg:hidden xl:inline">
								Supplier
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
					<div className="w-1/12  flex  lg:w-[4%] justify-center  text-center">
						No.
					</div>
					<div className="flex w-7/12 sm:w-8/12 lg:w-4/12  justify-center lg:justify-start lg:text-left">
						Nama
					</div>
					<div className="hidden lg:flex lg:w-5/12  text-left">Alamat</div>
					<div className="flex w-4/12 sm:w-3/12 lg:w-2/12  text-center justify-center">
						Action
					</div>
				</div>
				<hr className=" w-full h-[0.2rem]" />

				{/* DATA TABEL START*/}
				<div className="flex-col w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-track-gray-100 overflow-x-hidden   ">
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
					) : suppliers.length ? (
						suppliers.map((s, index) => (
							<div
								key={s.id}
								onClick={() =>
									navigate(`/gudang/supplier/detail`, {
										state: { id: s.id },
									})
								}
							>
								<div
									className="flex flex-row w-full md:gap-2 py-2 hover:bg-gray-400/10 items-center cursor-pointer justify-between text-[0.7rem] sm:text-xs lg:text-sm"
									key={s.id}
									style={{ scrollbarGutter: "stable" }}
								>
									<div className="w-1/12 flex lg:w-[4%] justify-center  text-center truncate">
										{index + 1 + 20 * (currentPage - 1)}.
									</div>
									<div className="flex w-7/12 sm:w-8/12 lg:w-4/12  text-left truncate">
										{s.name}
									</div>
									<div className="hidden lg:flex w-5/12  text-left truncate">
										{s.address}
									</div>
									<div className="flex w-4/12 sm:w-3/12 lg:w-2/12  text-center items-center justify-center">
										<button
											onClick={(ev) => {
												ev.stopPropagation();
												onEditClick(s);
											}}
											className="text-forth text-sm"
										>
											<span className="flex hover:bg-forth border-2 border-forth hover:text-white px-2 py-1 rounded items-center ">
												<span className="whitespace-pre flex items-center">
													<AiOutlineEdit
														size={18}
														className="hidden sm:inline-flex min-w-max "
													/>
													Edit
												</span>
											</span>
										</button>
										&nbsp;
										<button
											onClick={(ev) => {
												ev.stopPropagation();
												onDeleteClick(s);
											}}
											className="text-forth text-sm"
										>
											<span className="flex hover:bg-forth border-2 border-forth hover:text-white px-2 py-1 rounded items-center">
												<span className="whitespace-pre flex items-center">
													<AiOutlineDelete
														size={18}
														className="hidden sm:inline-flex min-w-max"
													/>
													Delete
												</span>
											</span>
										</button>
									</div>
								</div>
								<hr className=" w-full bg-main h-[0.1rem]" />
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

			{/* <hr className=" w-full h-[0.2rem]" /> */}
			{/* TABLE WITH COL LAYOUT END*/}

			{/* BOTTOM BUTTON START*/}
			{/* <div className="flex flex-row w-full justify-between items-center mt-5 mb-3 sm:pr-3">
				<div className="flex flex-row justify-between gap-2">
					<div
						className="px-4 py-2 bg-main text-white hover:bg-selected-item cursor-pointer rounded-sm "
						onClick={() => setModalOpen(true)}
					>
						Tambah <span className="hidden sm:inline">Supplier</span>{" "}
					</div>
				</div>
				<div className="flex">
					<ReactPaginate
						pageCount={countPage}
						// pageCount={Math.ceil(suppliers.pageCount)}
						// initialPage={suppliers.currentPage+1}
						pageRangeDisplayed={2}
						activeLinkClassName="py-1  px-2 rounded-sm border-main bg-main text-white hover:bg-main hover:text-black text-md"
						pageLinkClassName="py-1  px-2 rounded-sm  border-forth bg-grey hover:bg-third text-md"
						breakClassName="py-2"
						nextLabel="Next &#x276F;"
						previousLabel="&#x276E; Previous"
						previousLinkClassName="hover:bg-third mr-2 py-2 px-3 rounded-sm bg-grey hidden md:flex"
						nextLinkClassName="hover:bg-third ml-2 py-2 px-3 rounded-sm bg-grey hidden md:flex"
						containerClassName="flex flex-row gap-1 text-sm items-center"
						onPageChange={handlePaginationClick}
					/>
				</div>
			</div> */}
			{/* BOTTOM BUTTON END*/}

			{/* MODAL START*/}
			<AnimatePresence>
				{modalOpen && (
					<SupplierForm
						closeModal={closeModal}
						// handleSubmit={onSubmit}
						sup={sup}
						setSup={setSup}
						getSuppliers={getSuppliers}
					/>
				)}

				{deleteModal && (
					<SupplierDeleteModal
						closeDeleteModal={closeDeleteModal}
						handleDelete={handleDeleteClick}
						sup={sup}
					/>
				)}
			</AnimatePresence>
			{/* MODAL END*/}
		</FadeInPage>
	);
}
