import React from "react";
import { useTranslations } from "next-intl";
import Modal from "@mui/material/Modal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function CustomModal({ isOpen, onClose, message }: ModalProps) {
  const t = useTranslations();

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-xs bg-white shadow-2xl p-4 rounded-lg">
        <p className="text-center text-black">
          {message}
        </p>
        <div className="flex justify-center mt-14" >
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg border-none cursor-pointer transition-colors duration-300 ease-in-out hover:bg-blue-700">
            {t("close")}
          </button>
        </div>
      </div>
    </Modal>
  );
}
