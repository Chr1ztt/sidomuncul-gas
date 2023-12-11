import { NavLink, useNavigate } from "react-router-dom";
import FadeInPage from "../../components/FadeInPage";
import {
	AiOutlineArrowLeft,
	AiOutlineLoading3Quarters,
	AiOutlineSearch,
} from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../../axios-client";
import { IoIosArrowDown } from "react-icons/io";
import { useStateContext } from "../../context/ContextProvider";
import DropdownMenu from "../../general_components/DropdownMenu";
import { MdOutlineCancel } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";

export default function PemasokanForm() {
	const navigate = useNavigate();
	const [list, setList] = useState([]);
	const [totalPrice, setTotalPrice] = useState(null);
	const [note, setNote] = useState("");
	const [loading, setLoading] = useState(false);

	const [isDebt, setIsDebt] = useState(false);

	const [suppliers, setSuppliers] = useState([]);
	const [loadingSupplier, setLoadingSupplier] = useState(false);
	const [supplier, setSupplier] = useState({
		id: null,
		name: "",
	});

	const [gases, setGases] = useState([]);
	const [loadingGas, setLoadingGas] = useState(false);
	const [message, setMessage] = useState(null);

	const [tubes, setTubes] = useState([]);
	const [loadingTube, setLoadingTube] = useState(false);
	const { setNotification } = useStateContext();
	let payload = {};

	const fullRupiahFormat = (value) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
		}).format(value);

	const [supplyLine, setSupplyLine] = useState({
		id: null, //CUMA SEBAGAI PENANDA AJA, TIDAK DIPAKE DI BACKERND
		tube_id: null,
		tube_gas_id: null,
		gas_id: null,
		gas_name: "",
		gas_price: null,
	});

	const onAddClick = () => {
		setList((prev) => {
			const newLine = { ...supplyLine, id: prev.length + 1 };
			return [...list, newLine];
		});
		setTotalPrice((prev) => prev + supplyLine.gas_price);
		onClearClick();
	};

	const onClearClick = () => {
		setSupplyLine({
			...supplyLine,
			id: null, //CUMA SEBAGAI PENANDA AJA, TIDAK DIPAKE DI BACKERND
			tube_id: null,
			tube_gas_id: null,
			gas_id: null,
			gas_name: "",
			gas_price: null,
		});
	};

	const onClearListClick = (id) => (ev) => {
		setList(list.filter((l) => l.id !== id));
	};

	const onSaveClick = () => {
		setLoading(true);
		setMessage(null);
		payload = {
			supplier_id: supplier.id,
			tube_count: list.length,
			note: note || "-",
			list: list,
		};
		axiosClient
			.post(`/supply`, payload)
			.then(({ data }) => {
				setNotification("Pemasokan berhasil dibuat");
				navigate(-1);
			})
			.catch((err) => {
				const { response } = err;
				if (response.data.errors) {
					setMessage(response.data.errors);
				} else {
					setMessage({
						error: [response.data.message],
					});
				}
			})
			.finally(() => setLoading(false));
	};

	const onCustomerEmptyValueDropdownClick = () => {
		if (supplier.name) {
			setSupplier({
				id: null,
				name: "",
			});
		}
	};

	const onCustomerValueDropdownClick = (c) => {
		if (c.name.toLowerCase() !== supplier.name?.toLowerCase()) {
			setSupplier({
				id: c.id,
				name: c.name,
			});
		}
	};

	const onGasEmptyValueDropdownClick = () => {
		if (supplyLine.gas_name) {
			setSupplyLine({
				...supplyLine,
				tube_id: null,
				gas_id: null,
				gas_name: "",
				gas_price: null,
			});
		}
	};

	const onGasValueDropdownClick = (g) => {
		if (g.name.toLowerCase() !== supplyLine.gas_name?.toLowerCase()) {
			setSupplyLine({
				...supplyLine,
				tube_id: g.id === supplyLine.tube_gas_id ? supplyLine.tube_id : null,
				gas_id: g.id,
				gas_name: g.name,
				gas_price: g.selling_price,
			});
		}
	};

	const onTubeEmptyValueDropdownClick = () => {
		if (supplyLine.tube_id) {
			setSupplyLine({
				...supplyLine,
				tube_id: null,
				gas_id: null,
				gas_name: "",
				gas_price: null,
			});
		}
	};

	const onTubeValueDropdownClick = (t) => {
		if (t.id !== supplyLine.tube_id) {
			setSupplyLine({
				...supplyLine,
				tube_id: t.id,
				gas_id: t.gas_id,
				gas_name: t.gas.name,
				gas_price: t.gas.selling_price,
			});
		}
	};

	const getSuppliers = () => {
		setLoadingSupplier(true);
		axiosClient
			.get(`/supplier/all`)
			.then(({ data }) => {
				setSuppliers(data.data);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoadingSupplier(false);
			});
	};

	const getGases = () => {
		setLoadingGas(true);
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
		setLoadingTube(true);
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
		getSuppliers();
		getGases();
		getTubes();
	}, []);

	return (
		<FadeInPage>
			{/* HEADER START */}
			<div className="flex flex-col w-full overflow-y-hidden pb-4">
				<div className="flex flex-row w-full justify-center md:justify-start bg-main py-2 md:py-4 mt-2">
					<h2 className="flex items-center text-2xl font-bold ">
						<NavLink
							to={-1}
							className={
								"p-2 mr-1 rounded-md text-forth hover:bg-forth hover:text-white flex"
							}
						>
							<IoArrowBack size={23} className="min-w-max" />
						</NavLink>
						Tambah Pemasokan Baru
					</h2>
				</div>
				{/* HEADER END*/}

				{/* ADD CONTENT START*/}
				<div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-2 mb-3">
					<div className="flex w-full sm:w-3/12 ">
						{/* CUSTOMER DROPDOWN START */}
						<DropdownMenu
							data={suppliers}
							loading={loadingSupplier}
							isSearchable={true}
							view={["name"]}
							valueToBeSend={supplier.name}
							placeholder="Pilih Supplier"
							searchPlaceholder="Cari Supplier"
							onEmptyOptionClick={onCustomerEmptyValueDropdownClick}
							onOptionClick={onCustomerValueDropdownClick}
						/>
						{/* CUSTOMER DROPDOWN END */}
					</div>
					<div className="flex flex-row w-full  sm:w-6/12  gap-2 ">
						<div className="flex w-6/12 ">
							{/* GAS DROPDOWN START */}
							<DropdownMenu
								data={gases}
								loading={loadingGas}
								isSearchable={true}
								valueToBeSend={supplyLine.gas_name}
								// check={["gas_id", supplyLine.gas_id]}
								view={["name"]}
								placeholder="Pilih Gas"
								searchPlaceholder="Cari gas"
								onEmptyOptionClick={onGasEmptyValueDropdownClick}
								onOptionClick={onGasValueDropdownClick}
							/>
							{/* GAS DROPDOWN END */}
						</div>
						<div className="flex w-6/12 ">
							{/* TUBE DROPDOWN START */}
							<DropdownMenu
								data={tubes}
								loading={loadingTube}
								isSearchable={true}
								valueToBeSend={supplyLine.tube_id}
								check={["gas_id", supplyLine.gas_id]}
								view={["id", "gas.name"]}
								placeholder="Pilih Tabung"
								searchPlaceholder="Cari nomor tabung"
								onEmptyOptionClick={onTubeEmptyValueDropdownClick}
								onOptionClick={onTubeValueDropdownClick}
							/>
							{/* TUBE DROPDOWN END */}
						</div>
					</div>
					<div className="flex flex-row w-full sm:w-3/12 justify-between gap-2">
						<button
							onClick={onClearClick}
							className="bg-forth text-white hover:opacity-70 w-full max-w-[6rem]  py-1 sm:order-2 rounded"
						>
							Clear
						</button>
						<button
							onClick={onAddClick}
							className="bg-forth text-white hover:opacity-70 w-full max-w-[6rem] py-1 sm:ms-auto sm:order-1 rounded"
						>
							Tambah
						</button>
					</div>
				</div>
				{/* ADD CONTENT END*/}

				{message && (
					<div className="text-red-600">
						{Object.keys(message).map((key) => (
							<p key={key} className="leading-tight tracking-tight">
								{message[key][0]}
							</p>
						))}
					</div>
				)}

				{/* TABLE START*/}
				{/* <hr className="bg-main w-full h-[2px] mt-5" /> */}
				<div className="flex w-full flex-col  mb-6 mt-3 flex-initial overflow-y-hidden rounded-md bg-white/80">
					<div
						className="flex flex-row w-full md:gap-2 py-3 bg-black/10 justify-between cursor-default text-[0.6rem] lg:text-xs  text-gray-400 font-bold uppercase"
						style={{ scrollbarGutter: "stable" }}
					>
						<div className="w-1/12 flex lg:w-[4%] justify-center  text-center truncate">
							No.
						</div>
						<div className="flex w-6/12 text-left truncate">Item</div>
						<div className="flex w-4/12  justify-center truncate">
							No. Tabung
						</div>
						{/* <div className="flex w-3/12  justify-end truncate">Price</div> */}
						<div className="w-1/12 flex justify-center  text-center truncate">
							Action
						</div>
						{/* <div className="flex w-14 sm:w-16 lg:w-28  text-center justify-center">
						Status
					</div> */}
					</div>
					{/* <hr className="bg-main w-full h-[1.2px]" /> */}

					<div className="flex flex-col w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-track-gray-100 overflow-x-hidden">
						{list?.length ? (
							list?.map((li, index) => (
								<div key={li.id}>
									<hr className="bg-main w-full h-[0.8px]" />
									<div
										className="flex flex-row w-full md:gap-2 py-3 items-center cursor-default justify-between text-[0.7rem] sm:text-xs lg:text-sm"
										key={li.id}
										style={{ scrollbarGutter: "stable" }}
									>
										<div className="w-1/12 flex lg:w-[4%] justify-center  text-center truncate">
											{index + 1}.
										</div>
										<div className="flex w-6/12 justify-start truncate">
											{li.gas_name}
										</div>
										<div className="flex w-4/12 justify-center truncate">
											{li.tube_id}
										</div>
										{/* <div className="flex w-3/12 justify-end   truncate">
											{fullRupiahFormat(li.gas_price)}
											&nbsp;
										</div> */}
										<div className="w-1/12 flex justify-center  text-center truncate ">
											<MdOutlineCancel
												size={30}
												className="min-w-max fill-forth cursor-pointer hover:fill-forth/70 rounded-full "
												onClick={onClearListClick(li.id)}
											/>
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
				</div>

				{/* <hr className="bg-main w-full h-[1.5px]" /> */}
				{/* TABLE END */}

				<div className="flex flex-col w-full">
					<div className="flex flex-row w-full justify-end font-extrabold  items-center">
						<div className="w-1/12 flex lg:w-[4%] justify-center  text-center truncate"></div>
						<div className="flex w-5/12 text-left truncate"></div>
						<div className="w-3/12 text-center bg-[#E1E2DE] rounded z-0 py-2">
							Total
						</div>
						<div className="w-3/12 text-end flex justify-end items-center bg-white/80 py-2">
							{list.length}&nbsp;&nbsp;&nbsp;
						</div>
					</div>
					{/* <hr className="bg-main w-6/12 ms-auto h-[0.09rem]" /> */}
				</div>

				<div className="flex flex-row w-full justify-between mt-3 gap-2 items-center">
					<div className=" w-full max-w-[40%] rounded-sm self-end">
						<input
							type="text"
							onChange={(ev) => setNote(ev.target.value)}
							value={note}
							className="w-full bg-secondary rounded px-2 py-1 outline-none"
							placeholder="Catatan Tambahan..."
						/>
					</div>
					{/* <div className=" w-full max-w-[15rem] rounded">
						<div className="">Bayar Sekarang ? </div>
						<div className="flex flex-row gap-x-3 ">
							<label
								htmlFor=""
								className={`cursor-pointer ${
									!isDebt ? `bg-forth text-white` : ``
								} border-2 border-forth  p-1 rounded flex justify-center w-20 hover:bg-forth hover:text-white`}
								onClick={() => setIsDebt(false)}
							>
								<input
									type="radio"
									className="mr-1 cursor-pointer appearance-none"
									name="update?"
									checked={!isDebt}
								/>
								Ya
							</label>
							<label
								htmlFor=""
								className={`cursor-pointer ${
									isDebt ? `bg-forth text-white` : ``
								} border-2 border-forth  p-1 rounded flex justify-center w-20 hover:bg-forth hover:text-white`}
								onClick={() => setIsDebt(true)}
							>
								<input
									type="radio"
									className="mr-1 cursor-pointer appearance-none"
									name="update?"
									checked={isDebt}
								/>
								Tidak
							</label>
						</div>
					</div> */}
					<div className="w-full max-w-[6rem] flex flex-row self-end">
						<button
							onClick={onSaveClick}
							className="bg-forth hover:opacity-70 text-white  py-2 w-full max-w-[6rem] text-center rounded"
						>
							<div className="flex w-full text-center justify-center items-center whitespace-pre ">
								{loading && (
									<svg
										className="animate-spin flex items-center w-5 h-5 mr-2 "
										viewBox="0 0 30 30"
									>
										<AiOutlineLoading3Quarters
											size={30}
											className="fill-white min-w-max "
										/>
									</svg>
								)}
								Save
							</div>
						</button>
					</div>
				</div>
			</div>
		</FadeInPage>
	);
}
