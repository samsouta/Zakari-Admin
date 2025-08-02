import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { ProductData } from "../../types/productType";


type AddProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Partial<ProductData>) => void;
};

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<ProductData>>({
    product_type: "account",
    is_sold: false,
    preview_img: [],
    data: {},
    credentials: {},
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 text-black dark:text-white">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-lg rounded-lg bg-white dark:bg-gray-900 p-6 shadow-xl overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">Add Product</Dialog.Title>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid gap-4">
            <select
              name="product_type"
              value={formData.product_type}
              onChange={handleChange}
              className="border rounded p-2"
            >
              <option value="account">Account</option>
              <option value="coin">Coin</option>
            </select>

            <input name="name" placeholder="Name" onChange={handleChange} className="border rounded p-2" />

            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              className="border rounded p-2"
            />

            <input name="img_url" placeholder="Image URL" onChange={handleChange} className="border rounded p-2" />

            <input
              name="price"
              placeholder="Price"
              type="number"
              onChange={handleChange}
              className="border rounded p-2"
            />

            <input
              name="fake_price"
              placeholder="Fake Price"
              type="number"
              onChange={handleChange}
              className="border rounded p-2"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_sold"
                checked={formData.is_sold}
                onChange={handleCheckboxChange}
              />
              Mark as Sold
            </label>

            {/* Future: Add inputs for preview_img, data, credentials as needed */}

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Save Product
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
