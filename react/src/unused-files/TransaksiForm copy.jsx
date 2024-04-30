import { NavLink, useNavigate } from "react-router-dom";
import FadeInPage from "../components/FadeInPage";
import {
	AiOutlineArrowLeft,
	AiOutlineLoading3Quarters,
	AiOutlineSearch,
} from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../axios-client";
import { IoIosArrowDown } from "react-icons/io";
import { useStateContext } from "../context/ContextProvider";

export default function TransaksiForm() {
	const navigate = useNavigate();
	const [list, setList] = useState([]);
	const [totalPrice, setTotalPrice] = useState(null);
	const [note, setNote] = useState("");
	const [loading, setLoading] = useState(false);

	const [isDebt, setIsDebt] = useState(false);

	const customerRef = useRef(null);
	const [customers, setCustomers] = useState([]);
	const [customerInput, setCustomerInput] = useState("");
	const [loadingCustomer, setLoadingCustomer] = useState(false);
	const [openCustomer, setOpenCustomer] = useState(false);
	const [customer, setCustomer] = useState({
		id: null,
		name: "",
	});

	const gasRef = useRef(null);
	const [gases, setGases] = useState([]);
	const [gasInput, setGasInput] = useState("");
	const [loadingGas, setLoadingGas] = useState(false);
	const [openGas, setOpenGas] = useState(false);

	const tubeRef = useRef(null);
	const [tubes, setTubes] = useState([]);
	const [tubeInput, setTubeInput] = useState("");
	const [loadingTube, setLoadingTube] = useState(false);
	const [openTube, setOpenTube] = useState(false);
	const { setNotification } = useStateContext();
	let payload = {};

	const fullRupiahFormat = (value) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
		}).format(value);

	const [transactionLine, setTransactionLine] = useState({
		// customer_id: null,
		// customer_name: "",
		tube_id: null,
		tube_gas_id: null,
		gas_id: null,
		gas_name: "",
		gas_price: null,
	});

	const onAddClick = () => {
		setList([...list, transactionLine]);
		setTotalPrice((prev) => prev + transactionLine.gas_price);
		onClearClick();
	};

	const onClearClick = () => {
		setTransactionLine({
			...transactionLine,
			// customer_id: null,
			// customer_name: "",
			tube_id: null,
			tube_gas_id: null,
			gas_id: null,
			gas_name: "",
			gas_price: null,
		});
	};

	const onClearListClick = (id) => {
		setList(list.filter((l) => l.id !== id));
	};

	const onCustomerDropdownClick = (ev) => {
		setCustomerInput("");
		setOpenCustomer(!openCustomer);
		setOpenTube(false);
		setOpenGas(false);
		customerRef.current.focus();
	};

	const onSaveClick = () => {
		setLoading(true);
		payload = {
			customer_id: customer.id,
			total_price: totalPrice,
			is_tube_returned: false,
			is_debt: isDebt,
			note: note,
			list: list,
		};
		axiosClient
			.post(`/transaction`, payload)
			.then(({ data }) => {
				console.log(data);
				setNotification("Transaki berhasil dibuat");
				navigate(-1);
				// list.forEach((li) => {
				// 	payload = {
				// 		transaction_id: data.id,
				// 		tube_id: li.tube_id,
				// 		gas_id: li.gas_id,
				// 	};
				// 	axiosClient
				// 		.post(`/transaction_line`, payload)
				// 		.then(({ data }) => {
				// 			console.log(data);
				// 		})
				// 		.catch((err) => {
				// 			console.log(err);
				// 		});
				// });
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => setLoading(false));
	};

	const onGasDropdownClick = (ev) => {
		setGasInput("");
		setOpenCustomer(false);
		setOpenGas(!openGas);
		setOpenTube(false);
		gasRef.current.focus();
	};
	const onTubeDropdownClick = (ev) => {
		setTubeInput("");
		setOpenCustomer(false);
		setOpenGas(false);
		setOpenTube(!openTube);
		tubeRef.current.focus();
	};

	const onClickOutside = (ev) => {
		setOpenCustomer(false);
		setOpenGas(false);
		setOpenTube(false);
	};

	const getCustomers = () => {
		setLoadingCustomer(false);
		axiosClient
			.get(`/customer/all`)
			.then(({ data }) => {
				setCustomers(data.data);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoadingCustomer(false);
			});
	};
	const getGases = () => {
		setLoadingGas(false);
		axiosClient
			.get(`/gas/filled`)
			.then(({ data }) => {
				setGases(data.data);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoadingGas(false);
			});
	};
	const getTubes = () => {
		setLoadingTube(false);
		axiosClient
			.get(`/tube/filled`)
			.then(({ data }) => {
				setTubes(data.data);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoadingTube(false);
			});
	};

	useEffect(() => {
		getCustomers();
		getGases();
		getTubes();
	}, []);

	return (
		<FadeInPage>
			{/* HEADER START */}
			<div className="flex flex-col w-full" onClick={onClickOutside}>
				<div
					className="flex flex-row w-full justify-center md:justify-start bg-secondary pb-5"
					onClick={onClickOutside}
				>
					<h2 className="flex items-center text-2xl font-bold md:pt-2">
						<NavLink
							to={"/gudang/transaksi"}
							className={
								"text-black p-2 mr-2 rounded-lg hover:bg-main hover:text-white hidden md:flex"
							}
						>
							<AiOutlineArrowLeft size={23} className="min-w-max" />
						</NavLink>
						Tambah Transaksi Baru
					</h2>
				</div>
				{/* HEADER END*/}

				{/* ADD CONTENT START*/}
				<div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-2">
					<div className="flex w-full sm:w-3/12 ">
						{/* CUSTOMER DROPDOWN START */}
						<div
							className="relative w-full overflow-y-visible"
							onClick={(ev) => ev.stopPropagation()}
						>
							<div
								className={`w-full bg-empty p-2 flex justify-between rounded-md cursor-pointer hover:bg-empty/70 ${
									customer.name ? `text-black` : `text-black/50`
								}`}
								onClick={onCustomerDropdownClick}
							>
								{customer.name
									? customer.name?.length > 50
										? customer.name.substring(0, 50) + "..."
										: customer.name
									: "Pilih Pelanggan"}
								<IoIosArrowDown
									size={20}
									className={`${
										openCustomer && `rotate-180`
									} transition text-black`}
								/>
							</div>

							<ul
								className={`bg-empty overflow-y-auto mt-1 scrollbar-thin absolute rounded-md z-[90] w-full ${
									openCustomer ? `max-h-80` : `max-h-0`
								}`}
							>
								<div className="sticky flex flex-row w-full items-center p-2 top-0 bg-empty">
									<AiOutlineSearch size={20} className="min-w-max" />
									<input
										ref={customerRef}
										type="text"
										value={customerInput}
										onChange={(e) => setCustomerInput(e.target.value)}
										placeholder="Cari Pelanggan"
										className="w-full bg-empty pl-2 outline-none"
									/>
								</div>

								{loadingCustomer ? (
									<li className="w-full flex justify-start p-2 cursor-default">
										<svg
											className="animate-spin flex items-center w-5 h-5 mr-2 "
											viewBox="0 0 30 30"
										>
											<AiOutlineLoading3Quarters
												size={30}
												className="fill-black min-w-max "
											/>
										</svg>
									</li>
								) : !customers?.length ? (
									<li className="w-full flex justify-start p-2 cursor-default">
										Maaf, tidak ada data
									</li>
								) : (
									customers?.map((c) => (
										<li
											className={`w-full p-2 cursor-default ${
												customer.id === c.id
													? `text-black/50`
													: `hover:bg-black/10`
											} ${
												c.name
													.toLowerCase()
													.includes(customerInput.toLowerCase())
													? `block`
													: `hidden`
											} `}
											onClick={() => {
												if (
													c.name.toLowerCase() !== customer.name?.toLowerCase()
												) {
													setCustomer({
														id: c.id,
														name: c.name,
													});
													setOpenCustomer(false);
												}
											}}
										>
											{c.name}
										</li>
									))
								)}
							</ul>
						</div>
						{/* CUSTOMER DROPDOWN END */}
					</div>
					<div className="flex flex-row w-full  sm:w-6/12  gap-2 ">
						<div className="flex w-6/12 ">
							{/* GAS DROPDOWN START */}
							<div
								className="relative w-full overflow-y-visible"
								onClick={(ev) => ev.stopPropagation()}
							>
								<div
									className={`w-full bg-empty p-2 flex justify-between rounded-md cursor-pointer hover:bg-empty/70 ${
										transactionLine.gas_name ? `text-black` : `text-black/50`
									}`}
									onClick={onGasDropdownClick}
								>
									{transactionLine.gas_name
										? transactionLine.gas_name?.length > 50
											? transactionLine.gas_name.substring(0, 50) + "..."
											: transactionLine.gas_name
										: "Pilih Gas"}
									<IoIosArrowDown
										size={20}
										className={`${
											openGas && `rotate-180`
										} transition text-black`}
									/>
								</div>

								<ul
									className={`bg-empty overflow-y-auto mt-1 scrollbar-thin absolute rounded-md z-[90] w-full ${
										openGas ? `max-h-80` : `max-h-0`
									}`}
								>
									<div className="sticky flex flex-row w-full items-center p-2 top-0 bg-empty">
										<AiOutlineSearch size={20} className="min-w-max" />
										<input
											ref={gasRef}
											type="text"
											value={gasInput}
											onChange={(e) => setGasInput(e.target.value)}
											placeholder="Cari Gas"
											className="w-full bg-empty pl-2 outline-none"
										/>
									</div>

									{loadingGas ? (
										<li className="w-full flex justify-start p-2 cursor-default">
											<svg
												className="animate-spin flex items-center w-5 h-5 mr-2 "
												viewBox="0 0 30 30"
											>
												<AiOutlineLoading3Quarters
													size={30}
													className="fill-black min-w-max "
												/>
											</svg>
										</li>
									) : !gases?.length ? (
										<li className="w-full flex justify-start p-2 cursor-default">
											Maaf, tidak ada data
										</li>
									) : (
										gases?.map((g) => (
											<li
												className={`w-full p-2 cursor-default ${
													transactionLine.gas_id === g.id
														? `text-black/50`
														: `hover:bg-black/10`
												} ${
													g.name.toLowerCase().includes(gasInput.toLowerCase())
														? `block`
														: `hidden`
												} `}
												onClick={() => {
													if (
														g.name.toLowerCase() !==
														transactionLine.gas_name?.toLowerCase()
													) {
														setTransactionLine({
															...transactionLine,
															tube_id:
																g.id === transactionLine.tube_gas_id
																	? transactionLine.tube_id
																	: null,
															gas_id: g.id,
															gas_name: g.name,
															gas_price: g.selling_price,
														});
														setOpenGas(false);
													}
												}}
											>
												{g.name}
											</li>
										))
									)}
								</ul>
							</div>
							{/* GAS DROPDOWN END */}
						</div>
						<div className="flex w-6/12 ">
							{/* TUBE DROPDOWN START */}
							<div
								className="relative w-full overflow-y-visible"
								onClick={(ev) => ev.stopPropagation()}
							>
								<div
									className={`w-full bg-empty p-2 flex justify-between rounded-md cursor-pointer hover:bg-empty/70 ${
										transactionLine.tube_id ? `text-black` : `text-black/50`
									}`}
									onClick={onTubeDropdownClick}
								>
									{transactionLine.tube_id
										? transactionLine.tube_id?.length > 50
											? transactionLine.tube_id.substring(0, 50) + "..."
											: transactionLine.tube_id
										: "Pilih Tabung"}
									<IoIosArrowDown
										size={20}
										className={`${
											openTube && `rotate-180`
										} transition text-black`}
									/>
								</div>

								<ul
									className={`bg-empty overflow-y-auto mt-1 scrollbar-thin absolute rounded-md z-[90] w-full ${
										openTube ? `max-h-80` : `max-h-0`
									}`}
								>
									<div className="sticky flex flex-row w-full items-center p-2 top-0 bg-empty">
										<AiOutlineSearch size={20} className="min-w-max" />
										<input
											ref={tubeRef}
											type="text"
											value={tubeInput}
											onChange={(e) => setTubeInput(e.target.value)}
											placeholder="Cari nomor tabung"
											className="w-full bg-empty pl-2 outline-none"
										/>
									</div>

									{loadingTube ? (
										<li className="w-full flex justify-start p-2 cursor-default">
											<svg
												className="animate-spin flex items-center w-5 h-5 mr-2 "
												viewBox="0 0 30 30"
											>
												<AiOutlineLoading3Quarters
													size={30}
													className="fill-black min-w-max "
												/>
											</svg>
										</li>
									) : !tubes?.length ? (
										<li className="w-full flex justify-start p-2 cursor-default">
											Maaf, tidak ada data
										</li>
									) : (
										tubes?.map((t) => (
											<li
												className={`w-full p-2 cursor-default ${
													transactionLine.tube_id === t.id
														? `text-black/50`
														: `hover:bg-black/10`
												} ${
													t.id
														.toString()
														.toLowerCase()
														.includes(tubeInput.toLowerCase())
														? transactionLine.gas_id
															? transactionLine.gas_id === t.gas_id
																? `block`
																: `hidden`
															: `block`
														: `hidden`
												} `}
												onClick={() => {
													if (t.id !== transactionLine.tube_id) {
														setTransactionLine({
															...transactionLine,
															tube_id: t.id,
															gas_id: t.gas_id,
															gas_name: t.gas.name,
															gas_price: t.gas.selling_price,
														});
														setOpenTube(false);
													}
												}}
											>
												{t.id + " - " + t.gas.name}
											</li>
										))
									)}
								</ul>
							</div>
							{/* TUBE DROPDOWN END */}
						</div>
					</div>
					<div className="flex flex-row w-full sm:w-3/12 justify-between gap-2">
						<button
							onClick={onClearClick}
							className="bg-red-700 text-white hover:bg-red-500 w-full max-w-[6rem]  py-1 sm:order-2 rounded-sm"
						>
							Clear
						</button>
						<button
							onClick={onAddClick}
							className="bg-second text-white hover:bg-second/70 w-full max-w-[6rem] py-1 sm:ms-auto sm:order-1 rounded-sm"
						>
							Tambah
						</button>
					</div>
				</div>
				{/* ADD CONTENT END*/}

				{/* TABLE START*/}
				<hr className="bg-main w-full h-[2px] mt-5" />

				<div
					className="flex flex-row w-full gap-2 py-1 justify-around cursor-default"
					style={{ scrollbarGutter: "stable" }}
				>
					<div className="w-1/12 flex lg:w-[4%] justify-center  text-center truncate">
						No.
					</div>
					<div className="flex w-4/12 text-left truncate">Item</div>
					<div className="flex w-3/12  justify-center truncate">No. Tabung</div>
					<div className="flex w-3/12  justify-end truncate">
						Price &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					</div>
					{/* <div className="flex w-14 sm:w-16 lg:w-28  text-center justify-center">
						Status
					</div> */}
				</div>
				<hr className="bg-main w-full h-[1.2px]" />

				<div className="flex-col w-full max-h-[80%] overflow-y-auto scrollbar-thin scrollbar-thumb-main/20 scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-track-selected-item/20 overflow-x-hidden  ">
					{list?.length ? (
						list?.map((li, index) => (
							<div key={li.id}>
								<hr className="bg-main w-full h-[0.8px]" />
								<div
									className="flex flex-row w-full gap-2 py-2 hover:bg-empty items-center cursor-default justify-around"
									key={li.id}
									style={{ scrollbarGutter: "stable" }}
								>
									<div className="w-1/12 flex lg:w-[4%] justify-center  text-center truncate">
										{index + 1}.
									</div>
									<div className="flex w-4/12 justify-start truncate">
										{li.gas_name}
									</div>
									<div className="flex w-3/12 justify-center truncate">
										{li.tube_id}
									</div>
									<div className="flex w-3/12 justify-end   truncate">
										{/* <span>Rp&nbsp;</span> */}
										{fullRupiahFormat(li.gas_price)}
										{/* <span>,00</span> */}
										&nbsp;
									</div>
								</div>
							</div>
						))
					) : (
						<div className="flex w-full text-center justify-center items-center py-4 whitespace-pre text-black/50">
							silahkan tambahkan data untuk melihat hasilnya di sini
						</div>
					)}
				</div>

				<hr className="bg-main w-full h-[1.5px]" />

				<div className="flex flex-col w-full">
					<div className="flex flex-row w-full justify-end gap-2 font-extrabold  items-center">
						<div className="w-1/12 flex lg:w-[4%] justify-center  text-center truncate"></div>
						<div className="flex w-5/12 text-left truncate"></div>
						<div className="w-3/12 text-center bg-empty z-0 py-2">Total</div>
						<div className="w-3/12 text-end flex justify-end items-center">
							{fullRupiahFormat(totalPrice)}&nbsp;
						</div>
					</div>
					<hr className="bg-main w-6/12 ms-auto h-[0.09rem]" />
				</div>

				<div className="flex flex-row w-full justify-between mt-3 gap-2 items-center">
					<div className=" w-full max-w-[40%] rounded-sm">
						<input
							type="text"
							onChange={(ev) => setNote(ev.target.value)}
							value={note}
							className="w-full bg-empty rounded-md px-2 py-1 outline-none"
							placeholder="Catatan Tambahan..."
						/>
					</div>
					<div className=" w-full max-w-[15rem] rounded-sm">
						<div className="">Bayar Sekarang ? </div>
						<div className="flex flex-row gap-x-3 ">
							<label
								htmlFor=""
								className={`cursor-pointer ${
									!isDebt ? `bg-empty` : ``
								} border-2 p-2 rounded-md flex justify-center w-20 hover:bg-empty`}
								onClick={() => setIsDebt(false)}
							>
								<input
									type="radio"
									className="mr-1 cursor-pointer"
									name="update?"
									checked={!isDebt}
								/>
								Ya
							</label>
							<label
								htmlFor=""
								className={`cursor-pointer ${
									isDebt ? `bg-empty` : ``
								} border-2 p-2 rounded-md flex justify-center w-20 hover:bg-empty`}
								onClick={() => setIsDebt(true)}
							>
								<input
									type="radio"
									className="mr-1 cursor-pointer"
									name="update?"
									checked={isDebt}
								/>
								Tidak
							</label>
						</div>
					</div>
					<div className="w-full max-w-[6rem] flex items-center">
						<button
							onClick={onSaveClick}
							className="bg-second hover:bg-second/70 text-white  py-2 w-full max-w-[6rem] text-center rounded-sm"
						>
							<div className="flex w-full text-center justify-center items-center whitespace-pre ">
								{loading && (
									<svg
										className="animate-spin flex items-center w-5 h-5 mr-2 "
										viewBox="0 0 30 30"
									>
										<AiOutlineLoading3Quarters
											size={30}
											className="fill-black min-w-max "
										/>
									</svg>
								)}
								Save
							</div>
						</button>
					</div>
				</div>

				{/* TABLE END*/}
			</div>
		</FadeInPage>
	);
}
