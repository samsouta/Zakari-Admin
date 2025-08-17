import { useEffect, useState } from "react";
import { PlusCircleIcon, Settings2, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import { useGetServicesQuery } from "../../services/api/productApi";
import { ServicesType } from "../../types/productType";
import { AddServiceFormData, AddServiceProductModal } from "./AddServiceProductModal";
import { useAddServiceMutation, useDeleteServiceMutation, useGetServiceByIdQuery, useUpdateServiceMutation } from "../../services/api/gameApi";
import { EditServiceProductModal } from "./EditServiceProductModal";
import DeleteProductModal from "./DeleteProductModal";

export const ServiceTable = () => {
    const token = Cookies.get("token");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredServices, setFilteredServices] = useState<ServicesType[]>([])
    const [editingService, setEditingService] = useState<AddServiceFormData | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [addServiceModalOpen, setAddServiceModalOpen] = useState(false)
    const [editServiceModalOpen, setEditServiceModalOpen] = useState(false)
    const [deleteServiceModalOpen, setDeleteServiceModalOpen] = useState(false)
    const { data: allServices, isLoading } = useGetServicesQuery();
    const { data: services, isLoading: isServiceLoading } = useGetServiceByIdQuery(selectedProduct);
    const [addService, { isLoading: addServiceLoading }] = useAddServiceMutation();
    const [updateService, { isLoading: updateServiceLoading }] = useUpdateServiceMutation();
    const [deleteService, { isLoading: deleteServiceLoading }] = useDeleteServiceMutation();
    /**
 * @UseEffect setup editingProduct
 */
    useEffect(() => {
        if (!editServiceModalOpen) return;
        if (!services?.data) return;
        const service = services?.data;
        setEditingService({
            name: service.name,
            description: service.description,
            img_url: service.img_url,
            is_hot: service.is_hot,
        });
    }, [editServiceModalOpen, services?.data]);


    // Filter + Search
    useEffect(() => {
        let result = allServices?.data || [];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (service) =>
                    service.name?.toLowerCase().includes(query) ||
                    service.id?.toString().includes(query)
            );
        }
        setFilteredServices(result)
    }, [allServices, searchQuery]);
    // reset serach input 
    const clearSearch = () => setSearchQuery("");


    /**
     * @Post Add service product 
     */

    const handleAddService = async (formData: AddServiceFormData) => {
        if (!formData) {
            return;
        }
        try {
            const res = await addService({
                token: token || "",
                data: formData,
            }).unwrap();

            if (res?.success) {
                setAddServiceModalOpen(false);
                setError(null);
            } else {
                setError(res?.message);
            }
        } catch (error) {
            console.error("Error adding service:", error);
            setError("Failed to add service. Please try again.");
        }

        // Reset modal state
        setAddServiceModalOpen(false);
    }

    /**
     * @PUT Edit service product 
     */

    const handleEditService = async (formData: AddServiceFormData) => {
        if (!formData && !selectedProduct) {
            return;
        }

        try {
            const res = await updateService({
                token: token || "",
                id: Number(selectedProduct),
                data: formData,
            }).unwrap();

            if (res?.success) {
                setEditServiceModalOpen(false);
                setError(null);
            } else {
                setError(res?.message);
            }
        } catch (error) {
            console.error("Error edit service :", error);
            setError("Failed to edit service. Please try again.");
        }

        // Reset modal state
        setEditServiceModalOpen(false);
    }

    /**
     * @DELETE service 
     */

    const handleDeleteService = async () => {
        if (!selectedProduct) {
            return;
        }

        try {
            const res = await deleteService({
                token: token || "",
                id: Number(selectedProduct)
            }).unwrap();

            if (res?.success) {
                setDeleteServiceModalOpen(false);
                console.log(res?.message)
            } else {
                console.log(res?.message)
            }
        } catch (error) {
            console.error("Error delete product:", error);
        }

        // Reset modal state
        setDeleteServiceModalOpen(false);
    }


    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm px-3 pb-3 pt-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Service Management
                </h3>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search service..."
                        className="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-400"
                    />
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 dark:text-gray-500 dark:hover:text-gray-300"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Add Service */}
                <button
                    onClick={() => setAddServiceModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors duration-200 shadow-sm"
                >
                    <PlusCircleIcon className="w-4 h-4" />
                    Add Service
                </button>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-700">
                <table className="min-w-[600px] w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3.5 text-left font-semibold text-gray-900 dark:text-white">SID</th>
                            <th className="px-4 py-3.5 text-left font-semibold text-gray-900 dark:text-white">Name</th>
                            <th className="px-4 py-3.5 text-left font-semibold text-gray-900 dark:text-white">Slug</th>
                            <th className="px-4 py-3.5 text-left font-semibold text-gray-900 dark:text-white">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                    Loading services...
                                </td>
                            </tr>
                        ) : filteredServices.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                    No services found
                                </td>
                            </tr>
                        ) : (
                            filteredServices.map((service) => (
                                <tr key={service.id} className="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-4 py-4 text-gray-900 dark:text-gray-200">{service.id}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-start gap-3">
                                            <img
                                                src={service?.img_url}
                                                alt={service?.name}
                                                className="h-[50px] w-[50px] rounded-md object-cover shrink-0"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {service?.description}
                                                </p>

                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                    {new Date(service?.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="font-medium text-gray-800 dark:text-white">
                                            {service?.name}
                                        </p>
                                    </td>

                                    <td className="px-4 py-4 flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedProduct(Number(service.id));
                                                setEditServiceModalOpen(true);
                                            }}
                                            disabled={isServiceLoading}
                                            className={`p-1.5 rounded-lg transition-all duration-200 
                                                ${isServiceLoading
                                                    ? 'bg-gray-100 cursor-not-allowed opacity-50'
                                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                                                }`}
                                        >
                                            {isServiceLoading ? (
                                                <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                                            ) : (
                                                <Settings2 className="w-5 h-5" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedProduct(Number(service.id));
                                                setDeleteServiceModalOpen(true);
                                            }}
                                            className="p-1.5 text-red-500 rounded-lg transition-colors duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add product modal box  */}
            <AddServiceProductModal
                isOpen={addServiceModalOpen}
                isLoading={addServiceLoading}
                error={error}
                onClose={() => setAddServiceModalOpen(false)}
                onSubmit={handleAddService}
            />

            {/* Edit product Modal */}
            <EditServiceProductModal
                isOpen={editServiceModalOpen}
                isLoading={updateServiceLoading}
                error={error}
                initialData={editingService || { name: '', description: '', img_url: '', is_hot: false }}
                onClose={() => setEditServiceModalOpen(false)}
                onSubmit={handleEditService}
            />

            {/* Delete product modal */}
            <DeleteProductModal
                isOpen={deleteServiceModalOpen}
                onClose={() => setDeleteServiceModalOpen(false)}
                onConfirm={handleDeleteService}
                isDeleting={deleteServiceLoading}
                title="Delete service"
                message={`Are you sure you want to delete? This action cannot be undone.`}
            />

        </div>
    );
};
