import { X, AlertTriangle } from 'lucide-react';
import { FC, MouseEvent } from 'react';

interface DeleteProductModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  isDeleting?: boolean;
  title?: string;
  message?: string;
}

const DeleteProductModal: FC<DeleteProductModalProps> = ({ 
  isOpen = false, 
  onClose = () => {}, 
  onConfirm = () => {}, 
  isDeleting = false,
  title = "Delete Product",
  message = "Are you sure you want to delete this product? This action cannot be undone."
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-200 scale-100 sm:mx-4 animate-modal-enter">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center transition-colors">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={isDeleting}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-base">
            {message}
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-300">
              <strong>Warning:</strong> This action is permanent and cannot be reversed.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 font-medium"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </div>
            ) : (
              'Delete Product'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
