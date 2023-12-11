import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import { useState } from "react";
import { AiOutlineClose, AiOutlineLoading3Quarters } from "react-icons/ai";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client";

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

export default function SupplierForm({
	closeModal,
	sup,
	setSup,
	getSuppliers,
}) {
	const [title, setTitle] = useState(sup.name);
	const [loading, setLoading] = useState(false);
	const { setNotification } = useStateContext();
	const [message, setMessage] = useState(null);

	// const onSubmit = (e) => {
	//   e.preventDefault();
	//   setLoading(true);
	//   handleSubmit(sup);
	//   // console.log(`loading : ${loading}`)
	// };

	const onSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);
		if (sup.id) {
			axiosClient
				.put(`/supplier/${sup.id}`, sup)
				.then(() => {
					getSuppliers();
					setNotification("Supplier berhasil diupdate");
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
				.post("/supplier", sup)
				.then(() => {
					getSuppliers();
					setNotification("Supplier berhasil ditambahkan");
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

	return (
		<Backdrop onClick={(ev) => closeModal()}>
			<motion.div
				variants={animation}
				initial="hidden"
				animate="show"
				exit="exit"
				className="flex flex-col m-auto w-[90%] md:max-w-2xl bg-main justify-center rounded-md p-2"
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				{/* CLOSE BUTTON */}
				<div className="relative flex flex-row w-full justify-center items-center text-sm sm:text-lg py-2 px-8">
					<div>{sup.id ? `Edit Data : ${title}` : "Tambah Supplier"}</div>
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
					<label htmlFor="">Nama</label>
					<input
						type="text"
						placeholder="Masukkan nama"
						className="px-2 py-2 border-2 border-main bg-white/80 rounded outline-none"
						value={sup.name}
						// value={sup && sup.name}
						onChange={(ev) => {
							setSup({ ...sup, name: ev.target.value });
						}}
					/>
					<label htmlFor="">Alamat</label>
					<input
						type="text"
						placeholder="Masukkan alamat"
						className="px-2 py-2 border-2 border-main bg-white/80 rounded outline-none mb-2"
						value={sup.address}
						// value={sup && sup.address}
						onChange={(ev) => {
							setSup({ ...sup, address: ev.target.value });
						}}
					/>
					<label htmlFor="">Nomor telepon</label>
					<input
						type="text"
						placeholder="Masukkan nomor telepon"
						className="px-2 py-2 border-2 border-main bg-white/80 rounded outline-none mb-2"
						value={sup.phone_number}
						// value={sup && sup.address}
						onChange={(ev) => {
							setSup({ ...sup, phone_number: ev.target.value });
						}}
					/>

					{message && (
						<div className="text-red-600">
							{Object.keys(message).map((key) => (
								<p key={key} className="leading-tight tracking-tight">
									{message[key][0]}
								</p>
							))}
						</div>
					)}
					<button className="flex itemns-center justify-center py-2 px-5 bg-forth w-fit mx-auto mt-2 mb-3 rounded-sm text-white hover:opacity-70">
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
						Submit
					</button>
				</form>
				{/* FORM */}
			</motion.div>
		</Backdrop>
	);
}
