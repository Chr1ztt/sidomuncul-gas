import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import { useState } from "react";
import { AiOutlineClose, AiOutlineLoading3Quarters } from "react-icons/ai";

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

export default function ValidatorModal({
	closeModal,
	onYesClick,
	text
}) {
	const [loading, setLoading] = useState(false);

	const onSubmitClick = (ev) => {
		ev.preventDefault();
		setLoading(true);
		onYesClick();
	};


	return (
		<Backdrop onClick={(ev) => closeModal()}>
			<motion.div
				variants={animation}
				initial="hidden"
				animate="show"
				exit="exit"
				className="flex flex-col m-auto w-[90%] sm:max-w-md bg-main justify-center rounded-md p-2"
				onClick={(ev) => ev.stopPropagation()}
			>
				<div className="relative flex flex-row w-full justify-center items-center text-sm sm:text-lg py-2 px-8">
					<div>Peringatan</div>
					<div
						onClick={(ev) => closeModal()}
						className="absolute flex items-center justify-center top-0 right-0 sm:right-1 sm:top-1 cursor-pointer rounded-full p-2 hover:bg-forth text-forth hover:text-white "
					>
						<AiOutlineClose size={23} className="min-w-max " />
					</div>
				</div>
				<div className=" flex justify-center items-center w-full sm:px-5 py-2">
					<hr className="w-full bg-black h-[0.1rem]" />
				</div>

				<div className="w-full justify-center items-center text-center py-2 text-sm sm:text-md ">
					{text}
				</div>

				<div className="flex w-full flex-row justify-center gap-10 items-center py-2 ">
					<button
						className="py-2 px-4 w-24 bg-forth text-white hover:bg-opacity-70 rounded-sm"
						onClick={closeModal}
					>
						Tidak
					</button>
					<button
						className="flex flex-row justify-center items-center py-2 px-4 w-24  bg-forth text-white hover:bg-opacity-70 rounded-sm"
						onClick={onSubmitClick}
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
						Ya
					</button>
				</div>
			</motion.div>
		</Backdrop>
	);
}
