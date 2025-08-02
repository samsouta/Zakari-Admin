import  { useState } from "react";
import { X } from "lucide-react";

type MessageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
  title?: string;
  placeholder?: string;
  confirmText?: string;
  isLoading?: boolean;
};

export default function BlockMessage({
  isOpen,
  onClose,
  onSubmit,
  title = "Enter message",
  placeholder = "Type something...",
  confirmText = "Confirm",
  isLoading = false,
}: MessageModalProps) {
  const [message, setMessage] = useState("");

  const handleConfirm = () => {
    if (!message.trim()) return alert("Please enter a reason.");
    onSubmit(message);
    setMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-600 dark:text-white" />
          </button>
        </div>

        <textarea
          className="w-full h-24 p-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-sm rounded-md dark:bg-gray-700 dark:text-white"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
