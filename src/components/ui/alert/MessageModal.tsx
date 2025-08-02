type MessageModalProps = {
  message: string;
  onClose: () => void;
  title?: string;
};

export const MessageModal = ({
  message,
  onClose,
  title = 'Message',
}: MessageModalProps) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 text-center transition-all">
        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};
