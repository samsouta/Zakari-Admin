import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

type EditServiceProductModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  error?: string | null;
  initialData: {
    name: string;
    description: string;
    img_url: string;
    is_hot: boolean;
  };
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    img_url: string;
    is_hot: boolean;
  }) => void;
};

export const EditServiceProductModal: React.FC<EditServiceProductModalProps> = ({
  isOpen,
  isLoading,
  error,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [formError, setFormError] = useState<string | null>(null);

  // Reset form when modal opens/closes or when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormError(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, is_hot: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Name is required");
      return;
    }
    if (!formData.img_url.trim()) {
      setFormError("Image URL is required");
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-[99999] text-black dark:text-white"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-lg font-semibold">
              Edit Service Product
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-lg p-2 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Image URL *
              </label>
              <input
                name="img_url"
                value={formData.img_url}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 dark:bg-gray-800"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_hot"
                checked={formData.is_hot}
                onChange={handleCheckboxChange}
              />
              <label className="text-sm font-medium">Mark as Hot</label>
            </div>

            {(error || formError) && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-300">
                {formError || error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
