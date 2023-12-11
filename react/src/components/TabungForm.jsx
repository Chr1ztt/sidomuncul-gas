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

export default function TabungForm({
	closeModal,
	detail,
	setDetail,
	getTubes,
	edit,
}) {
	const [tubeId, setTubeId] = useState(detail.id);
	const [title, setTitle] = useState(
		detail.id ? `Edit Tabung No. ${detail.id}` : "Tambah Tabung"
	);
	const size = ["1 m³", "6 m³"];
	const [openSize, setOpenSize] = useState(false);
	const [gases, setGases] = useState([]);
	const [gasInputValue, setGasInputValue] = useState("");
	const [openGas, setOpenGas] = useState(false);
	const status = ["Ready", "Di Pembeli", "Di Supplier", "Kosong"];
	const [openStatus, setOpenStatus] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);
	const { setNotification } = useStateContext();
	//   const onSubmit = (e) => {
	//     e.preventDefault();
	//     setLoading(true);
	//     handleSubmit(detail);
	//     // console.log(`loading : ${loading}`)
	//   };

	const onSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);
		if (edit) {
			axiosClient
				.put(`/tube/${tubeId}`, detail)
				.then(() => {
					getTubes();
					setNotification("Tabung berhasil diupdate");
					closeModal();
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
				.post("/tube", detail)
				.then(() => {
					getTubes();
					setNotification("Tabung berhasil ditambahkan");
					closeModal();
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
		}
	};

	useEffect(() => {
		axiosClient
			.get("/gas/all")
			.then(({ data }) => {
				setGases(data.data);
			})
			.catch((err) => console.log(err));
	}, []);


	return (
		<Backdrop onClick={(ev) => closeModal()}>
			<motion.div
				variants={animation}
				initial="hidden"
				animate="show"
				exit="exit"
				className="flex flex-col m-auto w-[90%] md:max-w-2xl bg-main justify-center rounded p-2"
				onClick={(e) => {
					e.stopPropagation();
					setOpenSize(false);
					setOpenGas(false);
					setOpenStatus(false);
				}}
			>
				{/* CLOSE BUTTON */}
				<div className="relative flex flex-row w-full justify-center items-center text-sm sm:text-lg py-2 px-8">
					<div>{title}</div>
					<div
						onClick={(ev) => closeModal()}
						className="absolute flex items-center justify-center top-0 right-0 sm:right-1 sm:top-1 cursor-pointer rounded-full p-2 hover:bg-forth text-forth hover:text-white "
					>
						<AiOutlineClose size={23} className="min-w-max " />
					</div>
				</div>
				{/* CLOSE BUTTON */}
				<div className="flex items-center justify-center sm:px-5 py-2 ">
					<hr className="w-full bg-black h-[0.1rem]" />
				</div>
				{/* FORM */}
				<form
					onSubmit={onSubmit}
					className="flex flex-col justify-center gap-1 text-xs md:text-sm sm:px-5"
				>
					<label htmlFor="">Nomor Tabung</label>
					<input
						type="text"
						placeholder="Masukkan nomor"
						className="px-2 py-2 border-2 border-main bg-white/80 rounded outline-none"
						value={detail.id}
						// value={detail && detail.name}
						onChange={(ev) => {
							setDetail({ ...detail, id: Number(ev.target.value) });
						}}
					/>
					<div className="flex flex-col my-2">
						<div className="flex flex-row gap-x-2">
							<div className="w-4/12">Ukuran</div>
							<div className="w-8/12">Isi Tabung</div>
						</div>
						<div className="flex flex-row gap-x-2">
							<div
								className="relative w-4/12 overflow-y-visible"
								onClick={(ev) => ev.stopPropagation()}
							>
								<div
									onClick={(ev) => {
										setOpenSize(!openSize);
									}}
									className={`w-full bg-secondary p-2 flex justify-between rounded cursor-pointer hover:bg-opacity-70 ${
										!detail.size ? `text-black/50` : ``
									}`}
								>
									{detail.size
										? detail.size?.length > 25
											? detail.size?.substring(0, 25) + "..."
											: detail.size
										: "Select Size"}
									<IoIosArrowDown
										size={20}
										className={`${
											openSize && `rotate-180`
										} transition text-black`}
									/>
								</div>
								<ul
									className={`bg-secondary mt-1 scrollbar-thin absolute rounded z-[90] w-full ${
										openSize ? `max-h-60` : `max-h-0`
									} overflow-y-auto`}
								>
									{size.map((s, i) => (
										<li
											key={i}
											className={`w-full  p-2 cursor-default
                      ${
												s.toLowerCase() === detail.size?.toLowerCase()
													? `text-black/50`
													: `hover:bg-gray-400/10`
											}
                      block `}
											onClick={() => {
												if (s.toLowerCase() !== detail.size?.toLowerCase()) {
													setDetail({ ...detail, size: s });
													setOpenSize(false);
												}
											}}
										>
											{s}
										</li>
									))}
								</ul>
							</div>

							<div
								className="relative w-8/12 overflow-y-visible"
								onClick={(ev) => ev.stopPropagation()}
							>
								<div
									onClick={(ev) => {
										setOpenGas(!openGas);
									}}
									className={`w-full bg-secondary p-2 flex justify-between rounded  cursor-pointer hover:bg-opacity-70 `}
								>
									{detail.name
										? detail.name?.length > 25
											? detail.name?.substring(0, 25) + "..."
											: detail.name
										: "Kosong"}
									<IoIosArrowDown
										size={20}
										className={`${openGas && `rotate-180`} transition`}
									/>
								</div>
								<ul
									className={`bg-secondary mt-1 scrollbar-thin absolute rounded z-[90] w-full ${
										openGas ? `max-h-60` : `max-h-0`
									} overflow-y-auto`}
								>
									<div className="sticky flex w-full items-center p-2 top-0  bg-secondary ">
										<AiOutlineSearch size={20} className="min-w-max" />
										<input
											type="text"
											value={gasInputValue}
											onChange={(e) => setGasInputValue(e.target.value)}
											placeholder="Enter gas name"
											className="w-full bg-secondary pl-2 outline-none"
										/>
									</div>
									{gases.map((g) => (
										<li
											key={g.id}
											className={`w-full   p-2 cursor-default
                ${
									g.name.toLowerCase() === detail?.name?.toLowerCase()
										? `text-black/50`
										: `hover:bg-gray-400/10`
								}
                ${
									g.name.toLowerCase().startsWith(gasInputValue.toLowerCase())
										? `block`
										: `hidden`
								}`}
											onClick={() => {
												if (
													g.name.toLowerCase() !== detail?.name?.toLowerCase()
												) {
													setDetail({ ...detail, name: g.name, gas_id: g.id });
													setOpenGas(false);
													setGasInputValue("");
												}
											}}
										>
											{g.name}
										</li>
									))}
									<li
										className={`w-full   p-2 cursor-default
                    ${
											"kosong" === detail?.name?.toLowerCase()
												? `text-black/50`
												: `hover:bg-gray-400/10`
										}
                    ${
											"kosong".startsWith(gasInputValue.toLowerCase())
												? `block`
												: `hidden`
										}`}
										onClick={() => {
											if ("kosong" !== detail?.name?.toLowerCase()) {
												setDetail({
													...detail,
													name: null,
													gas_id: null,
													status: "Kosong",
												});
												setOpenGas(false);
												setGasInputValue("");
											}
										}}
									>
										Kosong
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="flex">Status</div>
					<div
						className="relative w-full overflow-y-visible"
						onClick={(ev) => ev.stopPropagation()}
					>
						<div
							onClick={(e) => {
								setOpenStatus(!openStatus);
							}}
							className={`w-full bg-secondary p-2 flex justify-between rounded cursor-pointer hover:bg-opacity-70 ${
								!detail.status ? `text-black/50` : ``
							}`}
						>
							{detail.status
								? detail.status?.length > 50
									? detail.status?.substring(0, 50) + "..."
									: detail.status
								: "Select Status"}
							<IoIosArrowDown
								size={20}
								className={`${
									openStatus && `rotate-180`
								} transition text-black`}
							/>
						</div>
						<ul
							className={`bg-secondary mt-1 scrollbar-thin absolute rounded z-[90] w-full ${
								openStatus ? `max-h-60` : `max-h-0`
							} overflow-y-auto`}
						>
							{status.map((s, i) => (
								<li
									key={i}
									className={`w-full  p-2 cursor-default
                      ${
												s.toLowerCase() === detail.status?.toLowerCase()
													? `text-black/50`
													: `hover:bg-gray-400/10`
											}
                      block `}
									onClick={() => {
										if (s.toLowerCase() !== detail.status?.toLowerCase()) {
											if (s.toLowerCase() === "kosong") {
												setDetail({
													...detail,
													name: null,
													gas_id: null,
													status: s,
												});
											} else {
												setDetail({ ...detail, status: s });
											}
											setOpenStatus(false);
										}
									}}
								>
									{s}
								</li>
							))}
						</ul>
					</div>

					{message && (
						<div className="text-red-600">
							{Object.keys(message).map((key) => (
								<p key={key} className="leading-tight tracking-tight">
									{message[key][0]}
								</p>
							))}
						</div>
					)}

					<button className="flex itemns-center justify-center py-2 px-5 bg-forth w-fit mx-auto mt-2 mb-3 rounded-sm text-white hover:bg-opacity-80">
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
