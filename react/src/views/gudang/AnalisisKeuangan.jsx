import { motion } from "framer-motion";
import React from "react";

const pageTransition = {
	initial: {
		x: -100,
		opacity: 1,
	},
	animate: {
		x: 0,
		opacity: 1,
	},
	exit: {
		x: -100,
		opacity: 1,
	},
};

export default function AnalisisKeuangan() {
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
			className="w-full mx-auto flex flex-row justify-content-center text-center flex-wrap bg-second"
		>
			<div className="w-4/12 py-2">1. Oksigen</div>
			<div className="w-4/12 py-2">2. Karbon Dioksida</div>
			<div className="w-4/12 py-2">3. Nitrogen</div>
			<div className="w-6/12 py-2">4. Argon</div>
			<div className="w-6/12 py-2">5. C2H2</div>
		</motion.div>
	);
}
