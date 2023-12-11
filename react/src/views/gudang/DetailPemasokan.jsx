import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import FadeInPage from "../../components/FadeInPage";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AnimatePresence } from "framer-motion";
import PemasokanDeleteModal from "../../components/PemasokanDeleteModal";
import { MdArrowBack } from "react-icons/md";

export default function DetailPemasokan() {
	const { user, setNotification } = useStateContext();
	const navigate = useNavigate();
	const location = useLocation();
	const { supply } = location.state;
	const [deleteModal, setDeleteModal] = useState(false);

	const fullRupiahFormat = (value) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
		}).format(value);

	const closeDeleteModal = () => {
		setDeleteModal(false);
	};
	return (
		<FadeInPage scrollable={true}>
			<div className="flex flex-row w-full justify-center md:justify-start py-2 md:py-4 mt-2">
				<h2 className="flex items-center text-2xl font-bold">
					<NavLink
						to={-1}
						className={
							" p-2 mr-1 rounded-md text-forth hover:bg-forth hover:text-white flex"
						}
					>
						<MdArrowBack size={23} className="min-w-max" />
					</NavLink>
					Detail Pemasokan
				</h2>
			</div>
			<div
				className={`printable flex flex-col w-full max-w-screen-sm p-5 sm:p-7 m-1 shadow-md bg-white rounded-md`}
				id="transaction_invoice"
			>
				<div className="flex mx-auto font-extrabold text-2xl pb-5 justify-self-center items-center">
					NOTA PEMASOKAN
				</div>
				<div className={`flex flex-row w-full text-[0.5rem] gap-2 sm:text-xs `}>
					<div className={`flex flex-col w-6/12 justify-start`}>
						<div className={`font-bold text-sm md:text-base `}>Pembeli</div>
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
					<div className="flex flex-col w-6/12">
						<div className={`font-bold text-sm md:text-base `}>Supplier</div>
						<div className="">{supply?.supplier?.name}</div>
						<div className="">{supply?.supplier?.address}</div>
						<div className="">{supply?.supplier?.phone_number}</div>
					</div>
				</div>
				<div className="flex flex-col w-full my-5 text-[0.5rem] sm:text-xs">
					{/* TABLE WITH COL LAYOUT START*/}
					<hr className="bg-main w-full h-[2px]" />

					<div
						className="flex flex-row w-full gap-2 py-1 justify-between cursor-default"
						style={{ scrollbarGutter: "stable" }}
					>
						<div className="w-1/12 flex lg:w-[4%] justify-center  text-center truncate">
							No.
						</div>
						<div className="flex w-5/12 text-left truncate">Item</div>
						<div className="flex w-3/12  justify-center truncate">
							No. Tabung
						</div>
						{/* <div className="flex w-3/12  justify-end truncate">
							Price &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						</div> */}
						{/* <div className="flex w-14 sm:w-16 lg:w-28  text-center justify-center">
						Status
					</div> */}
					</div>
					<hr className="bg-main w-full h-[1.2px]" />

					{/* DATA TABEL START*/}
					<div className="flex-col w-full overflow-y-auto  scrollbar-thin scrollbar-thumb-main/20 scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-track-selected-item/20 overflow-x-hidden  ">
						{supply?.supply_lines?.length ? (
							supply?.supply_lines?.map((s, index) => (
								<div key={s.id}>
									<hr className="bg-main w-full h-[0.8px]" />
									<div
										className="flex flex-row w-full gap-2 py-2 items-center cursor-default justify-between"
										key={s.id}
										style={{ scrollbarGutter: "stable" }}
									>
										<div className="w-1/12 flex lg:w-[4%] justify-center  text-center truncate">
											{index + 1}.
										</div>
										<div className="flex w-5/12 text-left truncate">
											{s.gas.name}
										</div>
										<div className="flex w-3/12 justify-center truncate">
											{s.tube_id}
										</div>
										{/* <div className="flex w-3/12 justify-end   truncate">
											{fullRupiahFormat(s.gas.selling_price)}
											&nbsp;
										</div> */}
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

					<div className="flex flex-col w-full mt-5">
						<hr className="bg-main w-6/12 ms-auto h-[0.09rem]" />
						<div className="flex flex-row w-full justify-end gap-2 font-extrabold  items-center">
							<div className="w-1/12 flex lg:w-[4%] justify-center  text-center truncate"></div>
							<div className="flex w-5/12 text-left truncate"></div>
							<div className="w-3/12 text-center bg-grey z-0 py-2">
								Total Tabung
							</div>
							<div className="w-3/12 text-end flex justify-center items-center">
								{supply.tube_count} &nbsp;
							</div>
						</div>
						<hr className="bg-main w-6/12 ms-auto h-[0.09rem]" />
					</div>
				</div>

				<div className="flex flex-row text-[0.5rem] gap-2 sm:text-xs ">
					<div className="flex w-6/12 flex-col">
						{/* <div className="flex flex-row">
							Tabung yang dipinjam :&nbsp;
							{loading ? (
								<span className="w-14 lg:w-28 mt-1 h-1 sm:h-2 bg-slate-200 rounded-full" />
							) : (
								supply?.transaction_lines
									?.reduce((r, t) => r + (t.tube_id + ", "), "")
									.slice(0, -2)
								// tubeList
							)}
						</div> */}
						<div className="pt-3 text-sm">Catatan Tambahan : </div>
						<div className="h-28 w-full">{supply?.note}</div>
						{/* <div className="font-extrabold text-3xl py-3">Terima Kasih</div> */}
					</div>
					<div className="flex w-6/12 flex-col items-center justify-end">
						<div className="font-bold text-base">{`Salatiga, ${supply.created}`}</div>
						<hr className="mt-20 bg-main w-60 max-w-full h-[2px]" />
						<div className="font-semibold text-sm pt-2">
							{supply.supplier?.name}
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-row flex-wrap w-full justify-center gap-2 py-4">
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
				{deleteModal && (
					<PemasokanDeleteModal
						closeDeleteModal={closeDeleteModal}
						detail={supply}
					/>
				)}
			</AnimatePresence>
			{/* MODAL END */}
		</FadeInPage>
	);
}
