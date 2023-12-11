import React from "react";
import ValidatorModal from "./ValidatorModal";

export default function PaidOffModal({ onYesClick, closeModal }) {
	return (
		<ValidatorModal
			onYesClick={onYesClick}
			closeModal={closeModal}
      text={"Apakah Anda yakin menyatakan transaksi ini LUNAS?"}
      />
	);
}
