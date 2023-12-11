import React from "react";
import IncomeAnalysis from "./IncomeAnalysis";

export const AnalysisMenu = [
	{
		name: "Keuangan",
		menuTransition: {
			initial: {
				x: "-200vh",
				opacity: 0,
			},
			animate: {
				x: 0,
				opacity: 1,
				transition: {
					type: "spring",
					duration: 0.1,
					damping: 100,
					stiffness: 600,
				},
			},
			exit: {
				x: "-200vh",
				opacity: 0,
			},
		},
		activeLink: `rounded-l-md bg-forth text-white border-2 border-forth`,
		disabledLink: `rounded-l-md bg-main/60 border-2 border-forth  hover:bg-black/10 hover:text-whte transition`,
		element: 0,
	},
	{
		name: "Persediaan",
		menuTransition: {
			initial: {
				x: "200vh",
				opacity: 0,
			},
			animate: {
				x: 0,
				opacity: 1,
				transition: {
					type: "spring",
					duration: 0.1,
					damping: 100,
					stiffness: 600,
				},
			},
			exit: {
				x: "200vh",
				opacity: 0,
			},
		},
		activeLink: `rounded-r-md bg-forth text-white border-2 border-forth`,
		disabledLink: `rounded-r-md bg-main/60 border-2 border-forth  hover:bg-black/10 hover:text-whte transition`,
		element: 1,
	},
];
