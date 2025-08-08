import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X, Plus, Trash2 } from "lucide-react";
import { FormProps } from "../../types/productType";
import { useGetGamesTypeQuery, useGetServicesQuery } from "../../services/api/productApi";

type Service = {
  id: number;
  name: string;
};

type Game = {
  id: number;
  name: string;
};

type EditProductModalProps = {
  error: string | null;
  isLoading: boolean;
  isOpen: boolean;
  product: FormProps | null; // The product to edit
  onClose: () => void;
  onSubmit: (product: FormProps) => void;
};

export const EditProductModal: React.FC<EditProductModalProps> = ({ 
  error, 
  isLoading, 
  isOpen, 
  product,
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<FormProps>({
    service_id: 0,
    game_id: 0,
    product_type: "account",
    name: "",
    description: "",
    img_url: "",
    preview_img: [],
    price: 0,
    fake_price: 0,
    is_popular: false,
    data: {},
    credentials: {},
  });

  const [services, setServices] = useState<Service[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const { data: servicesData, isLoading: servicesLoading } = useGetServicesQuery();
  const { data: gamesData, isLoading: gamesLoading } = useGetGamesTypeQuery();
  const [errorsms, setErrorsms] = useState<string | null>(null);

  // Initialize form data when product changes or modal opens
  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        service_id: product.service_id || 0,
        game_id: product.game_id || 0,
        product_type: product.product_type || "account",
        name: product.name || "",
        description: product.description || "",
        img_url: product.img_url || "",
        preview_img: product.preview_img || [],
        price: product.price || 0,
        fake_price: product.fake_price || 0,
        is_popular: product.is_popular || false,
        data: product.data || {},
        credentials: product.credentials || {},
      });
      setPreviewImages(product.preview_img || []);
      setErrorsms(null);
    }
  }, [isOpen, product]);

  // Fetch services and games on component mount
  useEffect(() => {
    if (!isOpen) return;
    if (!servicesData?.data || !gamesData?.data) return;

    // Map services data to required format
    const mappedServices = servicesData.data.map(service => ({
      id: Number(service.id),
      name: service.name
    }));
    // Map games data to required format
    const mappedGames = gamesData.data.map(game => ({
      id: Number(game.id),
      name: game.name
    }));

    setServices(mappedServices);
    setGames(mappedGames);

  }, [isOpen, servicesData, gamesData]);

  // form validation 
  const validateForm = () => {
    if (!formData.service_id) {
      setErrorsms("Please select a service");
      return false;
    }
    if (!formData.game_id) {
      setErrorsms("Please select a game");
      return false;
    }
    if (!formData.name.trim()) {
      setErrorsms("Product name is required");
      return false;
    }
    if (formData.price <= 0) {
      setErrorsms("Price must be greater than 0");
      return false;
    }
    if (formData.fake_price && formData.fake_price <= formData.price) {
      setErrorsms("Original price must be greater than selling price");
      return false;
    }
  
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setErrorsms(null); // Clear error message on change

    // Handle numeric fields
    if (name === 'price' || name === 'fake_price' || name === 'service_id' || name === 'game_id') {
      setFormData({ ...formData, [name]: value ? parseInt(value) : undefined });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  // Handle preview images
  const addPreviewImage = () => {
    setPreviewImages([...previewImages, ""]);
  };

  const removePreviewImage = (index: number) => {
    const newImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newImages);
    setFormData({ ...formData, preview_img: newImages.filter(img => img.trim()) });
  };

  const handlePreviewImageChange = (index: number, value: string) => {
    const newImages = [...previewImages];
    newImages[index] = value;
    setPreviewImages(newImages);
    setFormData({ ...formData, preview_img: newImages.filter(img => img.trim()) });
  };

  // Handle data object fields
  const handleDataChange = (field: string, value: string) => {
    setErrorsms(null);
    setFormData({
      ...formData,
      data: { ...formData.data, [field]: value }
    });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
    onClose();
  };

  const handleClose = () => {
    // Reset form to original product data when closing
    if (product) {
      setFormData({
        service_id: product.service_id || 0,
        game_id: product.game_id || 0,
        product_type: product.product_type || "account",
        name: product.name || "",
        description: product.description || "",
        img_url: product.img_url || "",
        preview_img: product.preview_img || [],
        price: product.price || 0,
        fake_price: product.fake_price || 0,
        is_popular: product.is_popular || false,
        data: product.data || {},
        credentials: product.credentials || {},
      });
      setPreviewImages(product.preview_img || []);
    }
    setErrorsms(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-[99999] text-black dark:text-white">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
        <Dialog.Panel className="mx-auto w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] rounded-lg bg-white dark:bg-gray-900 shadow-xl overflow-hidden flex flex-col">
          {/* Fixed Header */}
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <Dialog.Title className="text-lg sm:text-xl font-semibold">Edit Product</Dialog.Title>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Selection Fields - 2 columns on desktop, 1 on mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Service Selection */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Service *</label>
                  <select
                    name="service_id"
                    value={formData.service_id || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={servicesLoading}
                  >
                    <option value="">Select a service</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Game Selection */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Game *</label>
                  <select
                    name="game_id"
                    value={formData.game_id || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={gamesLoading}
                  >
                    <option value="">Select a game</option>
                    {games.map(game => (
                      <option key={game.id} value={game.id}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Product Type</label>
                <select
                  name="product_type"
                  value={formData.product_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="account">Account</option>
                  <option value="coin">Coin</option>
                </select>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Product Name *</label>
                  <input
                    name="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    name="description"
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Main Image URL</label>
                  <input
                    name="img_url"
                    placeholder="Enter main image URL"
                    value={formData.img_url}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Preview Images */}
              {formData?.service_id === 1 &&
                (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6">
                    <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Preview Images</label>
                    <div className="space-y-3">
                      {previewImages.map((img, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-2">
                          <input
                            placeholder="Preview image URL"
                            value={img}
                            onChange={(e) => handlePreviewImageChange(index, e.target.value)}
                            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => removePreviewImage(index)}
                            className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center sm:w-auto w-full"
                          >
                            <Trash2 className="w-4 h-4 sm:mr-0 mr-2" />
                            <span className="sm:hidden">Remove</span>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addPreviewImage}
                        className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Preview Image
                      </button>
                    </div>
                  </div>
                )
              }

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Price *</label>
                  <input
                    name="price"
                    placeholder="0"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Original Price</label>
                  <input
                    name="fake_price"
                    placeholder="0"
                    type="number"
                    value={formData.fake_price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Game Data */}
              {formData.service_id === 1 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 sm:p-6">
                  <label className="block text-sm font-medium mb-4 text-gray-700 dark:text-gray-300">Game Data</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Rank</label>
                      <input
                        placeholder="Mythic V"
                        value={(formData.data)?.rank || ""}
                        onChange={(e) => handleDataChange('rank', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Skin Count</label>
                      <input
                        placeholder="92"
                        type="number"
                        value={(formData.data)?.skin_count || ""}
                        onChange={(e) => handleDataChange('skin_count', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Hero Count</label>
                      <input
                        placeholder="85"
                        type="number"
                        value={(formData.data)?.hero_count || ""}
                        onChange={(e) => handleDataChange('hero_count', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.service_id === 2 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 sm:p-6">
                  <label className="block text-sm font-medium mb-4 text-gray-700 dark:text-gray-300">Amount</label>
                  <div>
                    <input
                      placeholder="Enter amount"
                      type="number"
                      value={(formData.data)?.amount || ""}
                      onChange={(e) => handleDataChange('amount', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}

             

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <input
                  type="checkbox"
                  name="is_popular"
                  checked={formData.is_popular}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as Popular</label>
              </div>

              {error && (
                <div className="animate-fade-in bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Error
                      </h3>
                      <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                        {error}
                      </div>
                    </div>
                    <div className="ml-auto pl-3">
                      <div className="-mx-1.5 -my-1.5">

                      </div>
                    </div>
                  </div>
                </div>
              )}
              {errorsms && (
                <div className="animate-fade-in bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Form Error
                      </h3>
                      <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                        {errorsms}
                      </div>
                    </div>
                    <div className="ml-auto pl-3">
                      <div className="-mx-1.5 -my-1.5">

                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  'Update Product'
                )}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};