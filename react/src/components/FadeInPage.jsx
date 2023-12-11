import { AnimatePresence, motion } from "framer-motion";
import { Children } from "react";

const pageTransition = {
	initial: {
		y: 100,
		opacity: 0,
	},
	animate: {
		y: 0,
		opacity: 1,
	},
	exit: {
		y: -100,
		opacity: 0,
	},
};

export default function FadeInPage({ children, scrollable = false }) {
	return (
		<motion.div
			variants={pageTransition}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{
				// type : "spring",
				// duration: 0.3,
				// damping: 60,
				// stiffness: 500,
				type: "tween",
				duration: 0.25,
				ease: "easeOut",
			}}
			className={`absolute flex flex-col w-full items-center bg-main px-6 font-semibold ${
				scrollable
					? `overflow-y-auto scrollbar-thin scrollbar-thumb-main/20 scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-track-selected-item/20`
					: `h-full`
			}`}
		>
			{children}
		</motion.div>
	);
}
