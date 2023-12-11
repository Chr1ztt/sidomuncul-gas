import React from "react";
import ValidatorModal from "./ValidatorModal";

export default function TubeReturnedModal({ onYesClick, closeModal }) {
	return (
		<ValidatorModal
			onYesClick={onYesClick}
			closeModal={closeModal}
			text={"Apakah Anda yakin menyatakan tabung telah dikembalikan?"}
		/>
	);
}
