import { motion } from "framer-motion";
import React from "react";

const pageTransition = {
	initial: {
		x: 100,
		opacity: 1,
	},
	animate: {
		x: 0,
		opacity: 1,
	},
	exit: {
		x: 100,
		opacity: 1,
	},
};

export default function AnalisisStok() {
	return (
		<motion.div
			variants={pageTransition}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{
				type: "tween",
				duration: 2,
				ease: "easeOut",
			}}
			className="w-full bg-forth mx-auto flex flex-row justify-content-center text-center flex-wrap"
		>
			tes
		</motion.div>
	);
}
