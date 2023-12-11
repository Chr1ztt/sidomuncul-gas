export const rupiahFormat = (value) =>
	new Intl.NumberFormat("id-ID").format(value);

export const fullRupiahFormat = (value) =>
	new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
	}).format(value);
