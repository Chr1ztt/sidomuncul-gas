import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import { useEffect, useRef, useState } from "react";
import {
	AiOutlineClose,
	AiOutlineLoading3Quarters,
	AiOutlineSearch,
} from "react-icons/ai";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";
import { IoIosArrowDown } from "react-icons/io";

const animation = {
	hidden: {
		y: "100vh",
		opacity: 0,
	},
	show: {
		y: 0,
		opacity: 1,
		transition: {
			type: "spring",
			duration: 0.1,
			damping: 100,
			stiffness: 1000,
		},
	},
	exit: {
		y: "-100vh",
		opacity: 0,
	},
};

export default function SupplyForm({
	closeModal,
	detail,
	setDetail,
	getSupplies,
	edit,
}) {
	const [prevGas, setPrevGas] = useState(detail.gas_id);
	const [prevTube, setPrevTube] = useState(detail.tube_id);
	const [title, setTitle] = useState(
		detail.id ? `Edit Pemasokan` : "Tambah Pemasokan"
	);
	const [suppliers, setSuppliers] = useState([]);
	const [tubes, setTubes] = useState([]);
	const [gases, setGases] = useState([]);
	const [tube, setTube] = useState({});
	const [supplierInputValue, setSupplierInputValue] = useState("");
	const [tubeInputValue, setTubeInputValue] = useState("");
	const [gasInputValue, setGasInputValue] = useState("");
	const [openSupplier, setOpenSupplier] = useState(false);
	const [openTube, setOpenTube] = useState(false);
	const [openGas, setOpenGas] = useState(false);
	const [loadingSupplier, setLoadingSupplier] = useState(false);
	const [loadingTube, setLoadingTube] = useState(false);
	const [loadingGas, setLoadingGas] = useState(false);
	const [loading, setLoading] = useState(false);
	const [updateTabung, setUpdateTabung] = useState(true);
	const [message, setMessage] = useState(null);
	const { setNotification } = useStateContext();
	//   const onSubmit = (e) => {
	//     e.preventDefault();
	//     setLoading(true);
	//     handleSubmit(detail);
	//     // console.log(`loading : ${loading}`)
	//   };

	const updateTube = (tube) => {
		axiosClient
			.put(`/tube/${tube.id}`, tube)
			.then(() => {
				getSupplies();
				setNotification("Data pemasokan berhasil ditambahkan");
				closeModal();
			})
			.catch((err) =>
				setMessage({
					error: [response.data.message],
				})
			);
	};

	const onSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		const supplyPayload = {
			id: detail.id,
			supplier_id: detail.supplier_id,
			tube_id: detail.tube_id,
			gas_id: detail.gas_id,
		};
		const { updated_at, ...tubePayload } = tube;
		tubePayload.gas_id = detail.gas_id;
		setMessage(null);
		if (edit) {
			axiosClient
				.put(`/supply/${supplyPayload.id}`, supplyPayload)
				.then(() => {
					if (updateTabung) {
						if (prevTube !== detail.tube_id) {
							const { updated_at, ...updateTubePrevious } = tubes.find(
								(t) => t.id === prevTube
							);
							debugger;
							updateTubePrevious.gas_id = null;
							updateTubePrevious.status = "Kosong";
							updateTube(updateTubePrevious);
						}
						debugger;
						updateTube(tubePayload);
					} else {
						getSupplies();
						setNotification("Tabung berhasil diupdate");
						closeModal();
					}
				})
				.catch((err) => {
					const response = err.response;
					if (response && response.status === 422) {
						if (response.data.errors) {
							setMessage(response.data.errors);
						} else {
							setMessage({
								error: [response.data.message],
							});
						}
						//TODO HANDLING ERROR
					}
				})
				.finally(() => setLoading(false));
		} else {
			axiosClient
				.post("/supply", supplyPayload)
				.then(() => {
					updateTube(tubePayload);
				})
				.catch((err) => {
					const response = err.response;
					if (response && response.status === 422) {
						if (response.data.errors) {
							setMessage(response.data.errors);
						} else {
							setMessage((prevMessage) => ({
								error: [...(prevMessage?.error || []), response.data.message],
							}));
						}
						//TODO HANDLING ERROR
					}
				})
				.finally(() => setLoading(false));
		}
	};

	useEffect(() => {
		setLoadingSupplier(true);
		setLoadingTube(true);
		setLoadingGas(true);
		axiosClient
			.get("/supplier/all")
			.then(({ data }) => {
				setSuppliers(data.data);
			})
			.catch((err) => console.log(err))
			.finally(() => setLoadingSupplier(false));
		axiosClient
			.get("/tube/all")
			.then(({ data }) => {
				const { updated_at, ...result } = data.data;
				if (detail.tube_id) {
					setTube({
						...data.data.find((t) => t.id === detail.tube_id),
						status: "Di Supplier",
					});
				}
				setTubes(data.data);
			})
			.catch((err) => console.log(err))
			.finally(() => setLoadingTube(false));
		axiosClient
			.get("/gas/all")
			.then(({ data }) => {
				setGases(data.data);
			})
			.catch((err) => console.log(err))
			.finally(() => setLoadingGas(false));
	}, []);


	return (
		<Backdrop onClick={(ev) => closeModal()}>
			<motion.div
				variants={animation}
				initial="hidden"
				animate="show"
				exit="exit"
				className="flex flex-col m-auto w-[90%] md:max-w-2xl bg-white justify-center rounded-md p-2"
				onClick={(e) => {
					e.stopPropagation();
					setOpenTube(false);
					setOpenGas(false);
					setOpenSupplier(false);
				}}
			>
				{/* CLOSE BUTTON */}
				<div className="relative flex flex-row w-full justify-center items-center text-sm sm:text-lg py-2 px-8">
					<div>{title}</div>
					<div
						onClick={(ev) => closeModal()}
						className="absolute flex items-center justify-center top-0 right-0 sm:right-1 sm:top-1 cursor-pointer rounded-full p-2 hover:bg-main text-black hover:text-white "
					>
						<AiOutlineClose size={23} className="min-w-max " />
					</div>
				</div>
				{/* CLOSE BUTTON */}
				<div className="flex items-center justify-center sm:px-5 py-2 ">
					<hr className="w-full bg-main h-[0.1rem]" />
				</div>
				{/* FORM */}
				<form
					onSubmit={onSubmit}
					className="flex flex-col justify-center gap-1 text-xs md:text-sm sm:px-5"
				>
					<div className="flex">Supplier</div>
					<div
						className="relative w-full overflow-y-visible"
						onClick={(ev) => ev.stopPropagation()}
					>
						<div
							onClick={(e) => {
								setSupplierInputValue("");
								setOpenSupplier(!openSupplier);
								setOpenTube(false);
								setOpenGas(false);
							}}
							className={`w-full bg-grey p-2 flex justify-between rounded-md cursor-pointer hover:bg-grey/70 ${
								!detail.supplier_name ? `text-black/50` : ``
							}`}
						>
							{detail.supplier_name
								? detail.supplier_name?.length > 50
									? detail.supplier_name?.substring(0, 50) + "..."
									: detail.supplier_name
								: "Pilih Supplier"}
							<IoIosArrowDown
								size={20}
								className={`${
									openSupplier && `rotate-180`
								} transition text-black`}
							/>
						</div>
						<ul
							className={`bg-grey mt-1 scrollbar-thin absolute rounded-md z-[90] w-full ${
								openSupplier ? `max-h-60` : `max-h-0`
							} overflow-y-auto`}
						>
							<div className="sticky flex w-full items-center p-2 top-0  bg-grey ">
								<AiOutlineSearch size={20} className="min-w-max" />
								<input
									type="text"
									value={supplierInputValue}
									onChange={(e) => setSupplierInputValue(e.target.value)}
									placeholder="Enter gas name"
									className="w-full bg-grey pl-2 outline-none"
								/>
							</div>
							{loadingSupplier ? (
								<li
									key={"loading"}
									className={`w-full flex justify-start  p-2 cursor-default`}
								>
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
								</li>
							) : !suppliers.length ? (
								<li
									key={"loading"}
									className={`w-full flex justify-start  p-2 cursor-default`}
								>
									Maaf, tidak ada data
								</li>
							) : (
								suppliers?.map((s) => (
									<li
										key={s.id}
										className={`w-full  p-2 cursor-default
										${s.id === detail?.supplier_id ? `text-black/50` : `hover:bg-black/10`}
										${
											s.name
												.toLowerCase()
												.includes(supplierInputValue.toLowerCase())
												? // detail.supplier_name?.toLowerCase()
												  `block`
												: `hidden`
										}
                      block `}
										onClick={() => {
											if (
												s.name.toLowerCase() !==
												detail.supplier_name?.toLowerCase()
											) {
												setDetail({
													...detail,
													supplier_name: s.name,
													supplier_id: s.id,
												});
												setOpenSupplier(false);
											}
										}}
									>
										{s.name}
									</li>
								))
							)}
						</ul>
					</div>

					<div className="flex flex-col my-2">
						<div className="flex flex-row gap-x-2">
							<div className="w-4/12">No. Tabung</div>
							<div className="w-8/12">Isi Tabung dengan</div>
						</div>
						<div className="flex flex-row gap-x-2">
							<div
								className="relative w-4/12 overflow-y-visible"
								onClick={(ev) => ev.stopPropagation()}
							>
								<div
									onClick={(ev) => {
										setTubeInputValue("");
										setOpenTube(!openTube);
										setOpenSupplier(false);
										setOpenGas(false);
									}}
									className={`w-full bg-grey p-2 flex justify-between rounded-md cursor-pointer hover:bg-grey/70 ${
										!detail.tube_id ? `text-black/50` : ``
									}`}
								>
									{/* {tubes.find((t) => t.id === detail.tube_id) ? setTube({ ...(detail.tube_id ? tubes.find((t) => t.id === detail.tube_id) : tube), status: "Di Supplier" }) : null} */}
									{detail.tube_id
										? detail.tube_id?.length > 25
											? detail.tube_id?.substring(0, 25) + "..."
											: detail.tube_id
										: "Pilih Nomor"}
									<IoIosArrowDown
										size={20}
										className={`${
											openTube && `rotate-180`
										} transition text-black`}
									/>
								</div>
								<ul
									className={`bg-grey mt-1 scrollbar-thin absolute rounded-md z-[90] w-full ${
										openTube ? `max-h-60` : `max-h-0`
									} overflow-y-auto`}
								>
									<div className="sticky flex w-full items-center p-2 top-0  bg-grey ">
										<AiOutlineSearch size={20} className="min-w-max" />
										<input
											type="text"
											value={tubeInputValue}
											onChange={(e) => setTubeInputValue(e.target.value)}
											placeholder="Enter gas name"
											className="w-full bg-grey pl-2 outline-none"
										/>
									</div>
									{loadingTube ? (
										<li
											key={"loading"}
											className={`w-full flex justify-start  p-2 cursor-default`}
										>
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
										</li>
									) : !tubes.length ? (
										<li
											key={"loading"}
											className={`w-full flex justify-start  p-2 cursor-default`}
										>
											Tidak ada data
										</li>
									) : (
										tubes
											.filter((t) => !t.gas_id || t.id === prevTube)
											.map((t) => (
												<li
													key={t.id}
													className={`w-full   p-2 cursor-default ${
														t.id === detail?.tube_id
															? `text-black/50`
															: `hover:bg-black/10`
													} ${
														t.id
															.toString()
															.toLowerCase()
															.includes(tubeInputValue.toLowerCase())
															? `block`
															: `hidden`
													}`}
													onClick={() => {
														if (t.id !== detail?.tube_id) {
															setDetail({ ...detail, tube_id: t.id });
															setTube({ ...t, status: "Di Supplier" });
															setOpenTube(false);
															setTubeInputValue("");
														}
													}}
												>
													{t.id}
												</li>
											))
									)}
								</ul>
							</div>

							<div
								className="relative w-8/12 overflow-y-visible"
								onClick={(ev) => ev.stopPropagation()}
							>
								<div
									onClick={(ev) => {
										setGasInputValue("");
										setOpenGas(!openGas);
										setOpenSupplier(false);
										setOpenTube(false);
									}}
									className={`w-full bg-grey p-2 flex justify-between rounded-md  cursor-pointer hover:bg-grey/70 ${
										!detail.gas_name ? `text-black/50` : ``
									}`}
								>
									{detail.gas_name
										? detail.gas_name?.length > 25
											? detail.gas_name?.substring(0, 25) + "..."
											: detail.gas_name
										: "Pilih jenis gas"}
									<IoIosArrowDown
										size={20}
										className={`${
											openGas && `rotate-180`
										} transition text-black`}
									/>
								</div>
								<ul
									className={`bg-grey mt-1 scrollbar-thin absolute rounded-md z-[90] w-full ${
										openGas ? `max-h-60` : `max-h-0`
									} overflow-y-auto`}
								>
									<div className="sticky flex w-full items-center p-2 top-0  bg-grey ">
										<AiOutlineSearch size={20} className="min-w-max" />
										<input
											type="text"
											value={gasInputValue}
											onChange={(e) => setGasInputValue(e.target.value)}
											placeholder="Enter gas name"
											className="w-full bg-grey pl-2 outline-none"
										/>
									</div>
									{loadingGas ? (
										<li
											key={"loading"}
											className={`w-full flex justify-start  p-2 cursor-default`}
										>
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
										</li>
									) : !gases.length ? (
										<li
											key={"loading"}
											className={`w-full flex justify-start  p-2 cursor-default`}
										>
											Tidak ada data
										</li>
									) : (
										gases.map((g) => (
											<li
												key={g.id}
												className={`w-full   p-2 cursor-default ${
													g.name.toLowerCase() ===
													detail?.gas_name?.toLowerCase()
														? `text-black/50`
														: `hover:bg-black/10`
												} ${
													g.name
														.toLowerCase()
														.includes(gasInputValue.toLowerCase())
														? `block`
														: `hidden`
												}`}
												onClick={() => {
													if (
														g.name.toLowerCase() !==
														detail?.gas_name?.toLowerCase()
													) {
														setDetail({
															...detail,
															gas_id: g.id,
															gas_name: g.name,
														});
														setTube({
															...tube,
															status: "Di Supplier",
															gas_id: g.id,
														});
														setOpenGas(false);
														setGasInputValue("");
													}
												}}
											>
												{g.name}
											</li>
										))
									)}
								</ul>
							</div>
						</div>
					</div>

					{edit &&
					(prevGas !== detail.gas_id || prevTube !== detail.tube_id) ? (
						<>
							<div className="">Update Tabung ? </div>
							<div className="flex flex-row gap-x-3 ">
								<label
									htmlFor=""
									className={`cursor-pointer ${
										updateTabung ? `bg-grey` : ``
									} border-2 p-2 rounded-md flex justify-center w-20 hover:bg-grey`}
									onClick={() => setUpdateTabung(true)}
								>
									<input
										type="radio"
										className="mr-1 cursor-pointer"
										name="update?"
										checked={updateTabung}
									/>
									Ya
								</label>
								<label
									htmlFor=""
									className={`cursor-pointer ${
										!updateTabung ? `bg-grey` : ``
									} border-2 p-2 rounded-md flex justify-center w-20 hover:bg-grey`}
									onClick={() => setUpdateTabung(false)}
								>
									<input
										type="radio"
										className="mr-1 cursor-pointer"
										name="update?"
										checked={!updateTabung}
									/>
									Tidak
								</label>
							</div>
						</>
					) : null}

					{message && (
						<div className="text-red-600">
							{Object.keys(message).map((key) => (
								<p key={key} className="leading-tight tracking-tight">
									{message[key][0]}
								</p>
							))}
						</div>
					)}

					<button className="flex itemns-center justify-center py-2 px-5 bg-blue-400 w-fit mx-auto mt-2 mb-3 rounded-sm text-white hover:bg-blue-500">
						{loading && (
							<svg
								className="animate-spin flex items-center w-5 h-5 mr-2 "
								viewBox="0 0 30 30"
							>
								<AiOutlineLoading3Quarters
									size={30}
									className="fill-second min-w-max "
								/>
							</svg>
						)}
						Submit
					</button>
				</form>
				{/* FORM */}
			</motion.div>
		</Backdrop>
	);
}
