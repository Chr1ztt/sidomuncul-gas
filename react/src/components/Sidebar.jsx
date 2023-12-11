import { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

//icons
import { IoIosArrowBack } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoAnalyticsSharp } from "react-icons/io5";
import { BiNotepad, BiLogOut } from "react-icons/bi";
import { MdOutlineWarehouse } from "react-icons/md";
import { TbUsers, TbTruckDelivery } from "react-icons/tb";
import { HiBars3 } from "react-icons/hi2";
import { FaRegUserCircle } from "react-icons/fa";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function SideBar() {
	let isUnderMd = useMediaQuery({ query: "(max-width: 768px)" });
	const [isOpen, setIsOpen] = useState(isUnderMd ? false : true);
	const { pathname } = useLocation();
	const [menuName, setMenuName] = useState("");
	const { user, setUser, setToken } = useStateContext();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getUsers();
	}, []);

	const getUsers = () => {
		// setLoading(true);
		axiosClient
			.get(`/user`)
			.then(({ data }) => {
				// setLoading(false);
				setUser(data);
			})
			.catch(() => {
				// setLoading(false);
			});
	};

	// const navAnimation = isTablet?{
	//     open : {

	//     },
	//     closed : {

	//     },
	// }
	useEffect(() => {
		// console.log  (isUnderMd);
		if (isUnderMd) {
			setIsOpen(false);
		} else {
			setIsOpen(true);
		}
	}, [isUnderMd]);

	const onLogout = (ev) => {
		ev.preventDefault();
		setLoading(true);
		axiosClient.post("/logout").then(() => {
			setLoading(false);
			setUser({});
			setToken(null);
		});
	};

	useEffect(() => {
		// console.log(pathname);
		if (pathname.includes("/gudang/dashboard")) {
			setMenuName("Dashboard");
		} else if (pathname.includes("/gudang/analisis")) {
			setMenuName("Analisis");
		} else if (pathname.includes("/gudang/transaksi")) {
			setMenuName("Transaksi");
		} else if (pathname.includes("/gudang/stokbarang")) {
			setMenuName("Stok Barang");
		} else if (pathname.includes("/gudang/pemasokan")) {
			setMenuName("Pemasokan");
		} else if (pathname.includes("/gudang/pelanggan")) {
			setMenuName("Pelanggan");
		} else if (pathname.includes("/gudang/supplier")) {
			setMenuName("Supplier");
		}
		isUnderMd && setIsOpen(false);
	}, [pathname]);

	const navAnimation = isUnderMd
		? {
				open: {
					x: 0,
					width: "14rem",
					transition: {
						damping: 40,
					},
				},
				closed: {
					x: -250,
					width: "14rem",
					transition: {
						damping: 40,
					},
				},
		  }
		: {
				open: {
					width: "14rem",
					transition: {
						damping: 40,
					},
				},
				closed: {
					width: "4rem",
					transition: {
						damping: 40,
					},
				},
		  };

	return (
		<div>
			{/* BACKDROP */}
			<div
				onClick={() => {
					setIsOpen(false);
				}}
				className={`fixed md:hidden inset-0 h-screen bg-black/50 cursor-pointer z-40 ${
					isOpen ? "block" : "hidden"
				}`}
			></div>
			{/* {isOpen && <Backdrop/>} */}
			{/* BACKDROP */}

			<motion.div
				variants={navAnimation}
				// initial={{ x: isUnderMd ? -250 : 0 ,}}
				initial={
					isUnderMd
						? {
								x: -250,
								transitionDuration: 0,
						  }
						: {
								x: 0,
						  }
				}
				animate={isOpen ? "open" : "closed"}
				transition={{ bounce: 0 }}
				className={`fixed md:relative  z-40 w-[14rem] max-w-[14rem] h-screen text-sm bg-forth text-white rounded-r-2xl shadow`}
			>
				<div className="h-screen w-full  ">
					{/* HEADER */}
					<div className="whitespace-pre flex items-center first-letter:py-5  py-4 pl-5 pb-6 overflow-x-hidden">
						<motion.span
							animate={
								isOpen
									? {
											x: 0,
									  }
									: {
											x: 80,
									  }
							}
							transition={{
								type: "tween",
								duration: 0.3,
							}}
							className="  text-lg font-bold text-center overflow-hidden"
						>
							SidoMuncul Gas
						</motion.span>
						<div className="flex flex-grow text-transparent">
							<div className="p-3"></div>
						</div>
						<motion.div
							onClick={() => {
								setIsOpen(!isOpen);
							}}
							animate={
								isOpen
									? {
											rotate: 0,
									  }
									: {
											rotate: 180,
									  }
							}
							transition={{
								duration: 0,
							}}
							className="absolute top-4 p-1 right-3.5  cursor-pointer "
						>
							<IoIosArrowBack size={23} />
						</motion.div>
					</div>

					{/* LIST BAR */}
					<div className="h-full flex flex-col justify-between">
						<ul className="whitespace-pre space-y-2 font-bold overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-track-white/10">
							<li>
								<NavLink
									to={"/gudang/dashboard"}
									className="flex items-center p-2 mx-3 rounded-lg  group overflow-x-hidden "
								>
									<LuLayoutDashboard size={23} className="min-w-max" />
									<span className="ml-3 font-sans ">Dashboard</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to={"/gudang/analisis"}
									className="flex items-center p-2 mx-3 rounded-lg  group overflow-x-hidden "
								>
									<IoAnalyticsSharp size={23} className="min-w-max" />
									<span className="ml-3 font-sans ">Analisis</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to={"/gudang/transaksi"}
									className="flex items-center p-2 mx-3 rounded-lg  group overflow-x-hidden "
								>
									<BiNotepad size={23} className="min-w-max" />
									<span className="ml-3 font-sans ">Transaksi</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to={"/gudang/stokbarang"}
									className="flex items-center p-2 mx-3 rounded-lg  group overflow-x-hidden "
								>
									<MdOutlineWarehouse size={23} className="min-w-max" />
									<span className="ml-3 font-sans ">Stok Barang</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to={"/gudang/pemasokan"}
									className="flex items-center p-2 mx-3 rounded-lg  group overflow-x-hidden "
								>
									<BiNotepad size={23} className="min-w-max" />
									<span className="ml-3 font-sans ">Pemasokan</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to={"/gudang/pelanggan"}
									className="flex items-center p-2 mx-3 rounded-lg  group overflow-x-hidden "
								>
									<TbUsers size={23} className="min-w-max" />
									<span className="ml-3 font-sans ">Pelanggan</span>
								</NavLink>
							</li>
							<li>
								<NavLink
									to={"/gudang/supplier"}
									className="flex items-center p-2 mx-3 rounded-lg  group overflow-x-hidden "
								>
									<TbTruckDelivery size={23} className="min-w-max" />
									<span className="ml-3 font-sans ">Supplier</span>
								</NavLink>
							</li>
						</ul>
						<div className="flex flex-none h-[200px] bg-forth"></div>

						<div className="absolute flex bg-second-one items-center gap-3 bottom-16 left-3 right-0  p-2 mr-3 rounded-lg  overflow-x-hidden font-sans font-bold ">
							<FaRegUserCircle size={23} className="min-w-max" />
							<span>
								<div className="text-lg ">{user.username}</div>
								<div className="text-[0.70rem] font-extralight">Admin</div>
							</span>
						</div>
						<div
							onClick={onLogout}
							className="whitespace-pre bg-second-one absolute flex items-center gap-3 bottom-5 left-3 right-0   hover:bg-selected-item/50  p-2 mr-3 rounded-sm  group overflow-x-hidden cursor-pointer font-bold"
						>
							<BiLogOut size={23} className="min-w-max" />
							<span>Logout</span>
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
						</div>
					</div>
				</div>
			</motion.div>
			<div className="flex fixed top-0 left-0 right-0 h-min bg-second-one text-white md:hidden items-center  space-x-1">
				<motion.div
					onClick={() => setIsOpen(true)}
					className="hover:bg-white/10 p-2"
				>
					<HiBars3 size={23} className="" />
				</motion.div>
				<span>{menuName}</span>
			</div>
			<div
				className={`${isUnderMd ? "flex" : "hidden"} w-screen h-11 bg-forth`}
			></div>
		</div>
	);
}
