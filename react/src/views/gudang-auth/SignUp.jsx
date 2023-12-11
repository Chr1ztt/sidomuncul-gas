import { useRef, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { NavLink, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	AiOutlineEyeInvisible,
	AiOutlineEye,
	AiOutlineLoading3Quarters,
} from "react-icons/ai";
import axiosClient from "../../axios-client";

const pageAnimation = {
	hidden: {
		x: "-100%",
		// width: "102%",
	},
	show: {
		x: 0,
		// width: "100%",
		transition: {
			type: "spring",
			duration: 0.5,
			damping: 95,
			stiffness: 500,
		},
	},
	exit: {
		x: "-100%",
		transition: {
			type: "spring",
			duration: 0.5,
			damping: 100,
			stiffness: 500,
		},
	},
};

export default function SignUp() {
	const nameRef = useRef();
	const usernameRef = useRef();
	const passwordRef = useRef();
	const passwordConfirmationRef = useRef();
	const { setUser, token, setToken } = useStateContext();
	const [message, setMessage] = useState(null);
	const [isShow, setIsShow] = useState(false);
	const [isShowPc, setIsShowPc] = useState(false);
	const [loading, setLoading] = useState(false);

	if (token) {
		return <Navigate to={"/gudang/dashboard"} />;
	}

	const onSubmit = (ev) => {
		ev.preventDefault();
		setLoading(true);

		const payload = {
			name: nameRef.current.value,
			username: usernameRef.current.value,
			password: passwordRef.current.value,
			password_confirmation: passwordConfirmationRef.current.value,
		};

		setMessage(null);
		axiosClient
			.post("/signup", payload)
			.then(({ data }) => {
				setUser(data.user);
				setToken(data.token);
			})
			.catch((err) => {
				const response = err.response;
				if (response && response.status === 422) {
					if (response.data.errors) {
						setMessage(response.data.errors);
					} else {
						setMessage({
							username: [response.data.message],
						});
					}
					setLoading(false);
				}
			});
	};

	const handleCopyPaste = (ev) => {
		ev.preventDefault();
		return false;
	};

	const showPassword = () => {
		setIsShow(!isShow);
	};
	const showPasswordConfirmation = () => {
		setIsShowPc(!isShowPc);
	};

	return (
		<motion.div
			variants={pageAnimation}
			initial="hidden"
			animate="show"
			exit="exit"
			className="absolute flex-auto w-full  mx-auto flex h-screen overflow-x-hidden justify-center"
		>
			{/* <div className="absolute w-1/2 top-0 h-full -right-1/3 bg-main overflow-visible"></div> */}

			{/* HALAMAN KIRI */}
			<div className="flex w-full flex-col lg:w-6/12 lg:flex-wrap bg-main text-black shadow p-10 md:p-20 lg:px-10 justify-center space-y-5 content-center z-40">
				{/* HEADER */}
				<motion.form
					initial={{
						y: -100,
						opacity: 0,
					}}
					animate={{
						y: 0,
						opacity: 1,
						transition: {
							type: "tween",
							duration: 0.5,
							delay: 0.6,
							ease: "easeOut",
						},
					}}
					onSubmit={onSubmit}
					className=" container flex mx-auto max-w-lg py-8 md:py-10 flex-col lg:flex-wrap bg-secondary text-black px-3 justify-center space-y-5 content-center border-2 rounded-md border-main"
				>
					<div className="text-center text-2xl">Create New Account</div>

					{/* CONYTAINER LOGIN FORM */}
					<div className="container flex flex-col mx-auto w-11/12 sm:w-10/12 md:w-9/12 lg:w-8/12">
						{message && (
							<div className="text-red-600 mb-2">
								{Object.keys(message).map((key) => (
									<p key={key} className="leading-tight tracking-tight">
										{message[key][0]}
									</p>
								))}
							</div>
						)}

						<input
							ref={nameRef}
							className="p-2 border border-forth outline-forth bg-white my-2 rounded-md "
							type="text"
							placeholder="Full Name"
						/>
						<input
							ref={usernameRef}
							className="p-2 border border-forth outline-forth bg-white my-2 rounded-md "
							type="text"
							placeholder="Username"
						/>
						<div className="relative">
							<input
								ref={passwordRef}
								onCopy={handleCopyPaste}
								onPaste={handleCopyPaste}
								className="p-2 border w-full border-forth outline-forth bg-white my-2 rounded-md "
								type={`${isShow ? "text" : "password"}`}
								placeholder="Password"
							/>
							<div
								className="absolute top-1/4  right-3 cursor-pointer hover:opacity-70 text-selected-item"
								onClick={showPassword}
							>
								{isShow ? (
									<AiOutlineEye size={25} />
								) : (
									<AiOutlineEyeInvisible size={25} />
								)}
							</div>
						</div>

						<div className="relative">
							<input
								ref={passwordConfirmationRef}
								onCopy={handleCopyPaste}
								onPaste={handleCopyPaste}
								className="p-2 border w-full border-forth outline-forth bg-white my-2 rounded-md "
								type={`${isShowPc ? "text" : "password"}`}
								placeholder="Password Confirmation"
							/>
							<div
								className="absolute top-1/4  right-3 cursor-pointer hover:opacity-70 text-selected-item"
								onClick={showPasswordConfirmation}
							>
								{isShowPc ? (
									<AiOutlineEye size={25} />
								) : (
									<AiOutlineEyeInvisible size={25} />
								)}
							</div>
						</div>
					</div>

					<button
						type="submit"
						className="flex bg-gradient-to-r w-11/12 sm:w-10/12 md:w-9/12 lg:w-8/12 max from-forth/70 to-forth shadow-md mx-auto h-fit p-2  rounded-lg text-xl hover:opacity-75 justify-center items-center text-white cursor-pointer"
					>
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
						Sign Up
					</button>
					{/* FOOTER */}
					<div className="container flex mx-auto max-w-lg text-center justify-center text-sm">
						Already have Account? &nbsp;
						<NavLink
							to="/gudang-auth/login"
							className="text-forth hover:opacity-70"
						>
							{"Login"}
						</NavLink>
					</div>
				</motion.form>
			</div>

			{/* HALAMAN KANAN */}
			<motion.div
				// initial={{
				//   opacity: 0,
				// }}
				// animate={{
				//   opacity: 1,
				//   transition: {
				//     duration: 0.5,
				//   },
				// }}
				// initial={{
				//   x: -250,
				// }}
				// animate={{
				//   x: 0,
				//   transition:{
				//     type: "tween",
				//     duration : 2
				//   }
				// }}
				className="hidden lg:flex w-full flex-col lg:w-6/12 lg:flex-wrap bg-gradient-to-r from-third to-forth shadow-2xl text-white items-center justify-center space-y-4"
			>
				<motion.div
					initial={{
						y: 100,
						opacity: 0,
					}}
					animate={{
						y: 0,
						opacity: 1,
						transition: {
							type: "tween",
							ease: "easeOut",
							duration: 0.5,
							delay: 0.6,
						},
					}}
					className="w-8/12"
				>
					<div className="  text-left text-2xl font-bold mb-5">
						Manajemen Barang dengan Mudah
					</div>
					<div className=" text-justify">
						Sistem inventori untuk membantu kegiatan pengelolaan produk gas Sidomuncul dengan lebih efisien serta menyediakan Analisis keuangan dan persediaan
					</div>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}
