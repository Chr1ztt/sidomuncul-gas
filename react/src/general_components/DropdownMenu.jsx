import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters, AiOutlineSearch } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";

export default function DropdownMenu({
	view = [""],
	placeholder = "Pilih",
	searchPlaceholder = "Search",
	loading = false,
	valueToBeSend = null,
	check = [null, null],
	isSearchable = true,
	data = [],
	onEmptyOptionClick = () => {},
	onOptionClick = () => {},
}) {
	// if (check[0] !== "1") check[0] = "d." + check[0];
	const searchRef = useRef(null);
	const elementRef = useRef(null);
	const [searchInput, setSearchInput] = useState("");
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const handleOutsideClick = (ev) => {
			if (elementRef.current && !elementRef.current.contains(ev.target)) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.addEventListener("mousedown", handleOutsideClick);
	}, []);

	const onMenuClick = (ev) => {
		setOpen(!open);
		setSearchInput("");
		searchRef.current.focus();
	};

	const onValueOptionClick = (d) => (ev) => {
		if (valueToBeSend?.toString() != d[view[0]]?.toString()) {
			onOptionClick(d);
			setOpen(false);
		}
	};

	const onEmptyValueOptionClick = (ev) => {
		if (valueToBeSend) {
			onEmptyOptionClick();
			setOpen(false);
		}
	};

	return (
		<div ref={elementRef} className="relative w-full overflow-y-visible  z-20">
			<button
				className={`flex w-full justify-between p-2 rounded-md bg-secondary shadow-sm hover:bg-secondary/60 ${
					valueToBeSend ? `text-black` : `text-black/50`
				}`}
				onClick={onMenuClick}
			>
				{valueToBeSend
					? valueToBeSend?.length > 25
						? valueToBeSend + "..."
						: valueToBeSend
					: placeholder}
				<IoIosArrowDown
					size={20}
					className={`min-w-max transition text-black ${open && `rotate-180`}`}
				/>
			</button>
			<ul
				className={`w-full  mt-1 absolute rounded-md  overflow-y-auto bg-secondary transition-all ${
					open ? "max-h-80" : "max-h-0"
				} scrollbar-thin`}
				// style={{scrollbarGutter: "stable"}}
			>
				{isSearchable && (
					<div className="sticky flex flex-col top-0 w-full z-50 bg-secondary ">
						<div className={` flex flex-row w-full p-2 items-center`}>
							<AiOutlineSearch
								size={20}
								className="min-w-max"
								onClick={() => searchRef.current.focus()}
							/>
							<input
								type="text"
								ref={searchRef}
								onChange={(ev) => setSearchInput(ev.target.value)}
								value={searchInput}
								placeholder={searchPlaceholder}
								className="flex w-full bg-secondary pl-2 outline-none"
							/>
							<hr />
						</div>
						<hr className="w-full bg-black h-[2px]" />
					</div>
				)}

				{loading ? (
					<li className="w-full flex justify-start items-center p-2 cursor-default">
						<svg
							className="animate-spin flex items-center w-5 h-5 mr-2 "
							viewBox="0 0 30 30"
						>
							<AiOutlineLoading3Quarters
								size={30}
								className="fill-black min-w-max "
							/>
						</svg>
						Loading...
					</li>
				) : !data.length ? (
					<div className="flex w-full p-2">Maaf, tidak ada data</div>
				) : (
					<>
						<li
							className={`w-full p-2 ${
								valueToBeSend
									? `hover:bg-gray-400/20 cursor-pointer`
									: `text-[#aaaaaa] cursor-default`
							}${
								"kosong".includes(searchInput.toLowerCase())
									? `block`
									: `hidden`
							}`}
							onClick={onEmptyValueOptionClick}
						>
							Kosong
						</li>
						{data.map((d, i) => {
							let match = true;
							if ((check[0] !==null && check[1]!==null) &&  !(eval("d." + check[0])?.toString() === check[1]?.toString())) {
								match=false;
							}

							return match && (
								<li
									key={d?.id ? d.id : i}
									className={`flex w-full p-2   ${
										valueToBeSend?.toString().toLowerCase() ===
										d[view[0]]?.toString()?.toLowerCase()
											? `text-[#aaaaaa] cursor-default`
											: `hover:bg-gray-400/20 cursor-pointer`
									}
						${
							d[view[0]]
								.toString()
								.toLowerCase()
								.includes(searchInput.toLowerCase())
								? `block`
								: `hidden`
						}`}
									onClick={onValueOptionClick(d)}
								>
									{view
										?.reduce(
											(acc, v) => acc + " - " + eval("d." + v)?.toString(),
											""
										)
										.substring(2)}
								</li>
							);
						})}
					</>
				)}
			</ul>
		</div>
	);
}
