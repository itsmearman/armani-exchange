import React from "react";
import { useTranslations } from "next-intl";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function Modal({ isOpen, onClose, message }:ModalProps) {
  if (!isOpen) return null;
  const t = useTranslations();

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-4">
        <p className="text-lg text-center text-gray-800">{message}</p>
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

