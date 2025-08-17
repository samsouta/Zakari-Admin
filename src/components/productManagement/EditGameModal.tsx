import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useGetServicesQuery } from "../../services/api/productApi";

type Service = {
  id: number;
  name: string;
};

type GameProductFormData = {
  id?: number;
  service_id: number;
  slug: string;
  name: string;
  logo_url: string;
  is_hot: boolean;
};

type EditGameModalProps = {
  error: string | null;
  isLoading: boolean;
  isOpen: boolean;
  gameProduct: GameProductFormData | null; // The game product to edit
  onClose: () => void;
  onSubmit: (gameProduct: GameProductFormData) => void;
};

const EditGameModal: React.FC<EditGameModalProps> = ({ 
  error, 
  isLoading, 
  isOpen, 
  gameProduct,
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<GameProductFormData>({
    service_id: 0,
    slug: "",
    name: "",
    logo_url: "",
    is_hot: false,
  });

  const [services, setServices] = useState<Service[]>([]);
  const [errorsms, setErrorsms] = useState<string | null>(null);
  const { data: servicesData, isLoading: servicesLoading } = useGetServicesQuery();

  // Initialize form data when gameProduct changes or modal opens
  useEffect(() => {
    if (isOpen && gameProduct) {
      setFormData({
        id: gameProduct.id,
        service_id: gameProduct.service_id || 0,
        slug: gameProduct.slug || "",
        name: gameProduct.name || "",
        logo_url: gameProduct.logo_url || "",
        is_hot: gameProduct.is_hot || false,
      });
      setErrorsms(null);
    }
  }, [isOpen, gameProduct]);

  // Fetch services on component mount
  useEffect(() => {
    if (!isOpen) return;
    if (!servicesData?.data) return;

    // Map services data to required format
    const mappedServices = servicesData.data.map(service => ({
      id: Number(service.id),
      name: service.name
    }));

    setServices(mappedServices);
  }, [isOpen, servicesData]);

  // Form validation
  const validateForm = () => {
    if (!formData.service_id) {
      setErrorsms("Please select a service");
      return false;
    }
    if (!formData.name.trim()) {
      setErrorsms("Game product name is required");
      return false;
    }
    if (!formData.slug.trim()) {
      setErrorsms("Slug is required");
      return false;
    }
    if (!formData.logo_url.trim()) {
      setErrorsms("Logo URL is required");
      return false;
    }
    // Validate slug format (should be lowercase, no spaces, use hyphens)
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugPattern.test(formData.slug)) {
      setErrorsms("Slug should be lowercase letters, numbers, and hyphens only (e.g., mobile-legends)");
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setErrorsms(null); // Clear error message on change

    // Handle numeric fields
    if (name === 'service_id') {
      setFormData({ ...formData, [name]: value ? parseInt(value) : 0 });
    } else if (name === 'slug') {
      // Auto-format slug: lowercase and replace spaces with hyphens
      const formattedSlug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData({ ...formData, [name]: formattedSlug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
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
    // Reset form to original gameProduct data when closing
    if (gameProduct) {
      setFormData({
        id: gameProduct.id,
        service_id: gameProduct.service_id || 0,
        slug: gameProduct.slug || "",
        name: gameProduct.name || "",
        logo_url: gameProduct.logo_url || "",
        is_hot: gameProduct.is_hot || false,
      });
    }
    setErrorsms(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-[99999] text-black dark:text-white">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
        <Dialog.Panel className="mx-auto w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] rounded-lg bg-white dark:bg-gray-900 shadow-xl overflow-hidden flex flex-col">
          {/* Fixed Header */}
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <Dialog.Title className="text-lg sm:text-xl font-semibold">Edit Game Product</Dialog.Title>
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
              {/* Service Selection */}
              <div>
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

              {/* Game Product Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Game Product Name *</label>
                <input
                  name="name"
                  placeholder="e.g., Mobile Legends Acc"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Slug *</label>
                <input
                  name="slug"
                  placeholder="e.g., mobile-legends"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  URL-friendly version (lowercase, hyphens for spaces)
                </p>
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Logo URL *</label>
                <input
                  name="logo_url"
                  placeholder="https://example.com/logo.jpg"
                  value={formData.logo_url}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {formData.logo_url && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Logo Preview:</p>
                    <img
                      src={formData.logo_url}
                      alt="Logo preview"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Is Hot Checkbox */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <input
                  type="checkbox"
                  name="is_hot"
                  checked={formData.is_hot}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mark as Hot Game 🔥
                </label>
              </div>

              {/* Error Messages */}
              {error && (
                <div className="animate-fade-in bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                      <div className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</div>
                    </div>
                  </div>
                </div>
              )}

              {errorsms && (
                <div className="animate-fade-in bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Form Error</h3>
                      <div className="mt-1 text-sm text-red-700 dark:text-red-300">{errorsms}</div>
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
                  'Update Game Product'
                )}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditGameModal;