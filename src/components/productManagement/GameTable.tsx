import { useEffect, useState } from "react";
import { PlusCircleIcon, Settings2, Trash2 } from "lucide-react";
import Badge from "../ui/badge/Badge";
import Cookies from "js-cookie";
import { useDeleteGameMutation, useGetGameListQuery, useUpdateGameMutation } from "../../services/api/gameApi";
import {
    useAddGameMutation,
    useGetGameByIdQuery,
} from "../../services/api/gameApi";
import { AddGameProductModal, GameProductFormData } from "./AddGameProductModal";
import { GameType } from "../../types/productType";
import EditGameModal from "./EditGameModal";
import DeleteProductModal from "./DeleteProductModal";

export const GameTable = () => {
    const token = Cookies.get("token");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredGames, setFilteredGames] = useState<GameType[]>([]);
    const [editingGame, setEditingGame] = useState<GameProductFormData | null>(null);
    const [selectedGame, setSelectedGame] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [addGameModalOpen, setAddGameModalOpen] = useState(false);
    const [editGameModalOpen, setEditGameModalOpen] = useState(false);
    const [deleteGameModalOpen, setDeleteGameModalOpen] = useState(false);

    const { data: allGames, isLoading } = useGetGameListQuery();
    const { data: game, isLoading: isGameLoading } = useGetGameByIdQuery(selectedGame);
    const [addGame, { isLoading: addGameLoading }] = useAddGameMutation();
    const [updateGame, { isLoading: updateGameLoading }] = useUpdateGameMutation();
      const [deleteGame, { isLoading: deleteGameLoading }] = useDeleteGameMutation();

    // Fill edit form when opening edit modal
    useEffect(() => {
        if (!editGameModalOpen || !game) return;
        setEditingGame({
            service_id: game?.service_id,
            slug: game?.slug,
            name: game?.name,
            logo_url: game?.logo_url,
            is_hot: game?.is_hot,
        });
    }, [editGameModalOpen, game]);

    // Search filter
    useEffect(() => {
        let result = allGames?.data || [];
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (g) =>
                    g.name?.toLowerCase().includes(query) ||
                    g.id?.toString().includes(query)
            );
        }
        setFilteredGames(result);
    }, [allGames, searchQuery]);

    const clearSearch = () => setSearchQuery("");

    /**
     * Handle Add Game 
     */
    const handleAddGame = async (formData: GameProductFormData) => {
        if (!formData) return;
        try {
            const res = await addGame({ token: token || "", data: formData }).unwrap();
            if (res?.success) {
                setAddGameModalOpen(false);
                setError(null);
            } else {
                setError(res?.message);
            }
        } catch {
            setError("Failed to add game. Please try again.");
        }
    };

    const handleEditGame = async (formData: GameProductFormData) => {
        if (!formData || !selectedGame) return;
        try {
            const res = await updateGame({
                token: token || "",
                id: Number(selectedGame),
                data: formData,
            }).unwrap();
            if (res?.success) {
                setEditGameModalOpen(false);
                setError(null);
            } else {
                setError(res?.message);
            }
        } catch {
            setError("Failed to edit game. Please try again.");
        }
    };

      const handleDeleteGame = async () => {
        if (!selectedGame) return;
        try {
          const res = await deleteGame({
            token: token || "",
            id: Number(selectedGame),
          }).unwrap();
          if (res?.success) {
            setDeleteGameModalOpen(false);
          }
        } catch {
          console.error("Error deleting game");
        }
      };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm px-3 pb-3 pt-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Game Management
                </h3>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search game..."
                        className="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm transition-colors focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400"
                    />
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Add Game */}
                <button
                    onClick={() => setAddGameModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
                >
                    <PlusCircleIcon className="w-4 h-4" />
                    Add Game
                </button>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-700">
                <table className="min-w-[600px] w-full text-sm text-gray-900 dark:text-gray-100">
                    <thead className="bg-gray-50 dark:bg-gray-800/60 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3.5 text-left font-semibold">GID</th>
                            <th className="px-4 py-3.5 text-left font-semibold">Name</th>
                            <th className="px-4 py-3.5 text-left font-semibold">Slug</th>
                            <th className="px-4 py-3.5 text-left font-semibold">Popular</th>
                            <th className="px-4 py-3.5 text-left font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    Loading games...
                                </td>
                            </tr>
                        ) : filteredGames.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No games found
                                </td>
                            </tr>
                        ) : (
                            filteredGames.map((g) => (
                                <tr key={g.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-4 py-4">{g.id}</td>
                                    <td className="px-4 py-4 flex items-center gap-3">
                                        <img
                                            src={g?.logo_url}
                                            alt={g.name}
                                            className="h-[50px] w-[50px] rounded-md object-cover bg-gray-100 dark:bg-gray-800"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{g.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(g.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="max-w-[200px] break-words">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                                {g?.slug ? (
                                                    <span className="truncate" title={g.slug}>
                                                        {g.slug}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500">
                                                        No slug
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <Badge color={g?.is_hot ? "success" : "error"}>
                                            {g?.is_hot ? "Featured" : "Normal"}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-4 flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedGame(Number(g.id));
                                                setEditGameModalOpen(true);
                                            }}
                                            disabled={isGameLoading}
                                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50"
                                        >
                                            <Settings2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedGame(Number(g.id));
                                                setDeleteGameModalOpen(true);
                                            }}
                                            className="p-1.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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

            {/* Modals */}
            <AddGameProductModal
                isOpen={addGameModalOpen}
                isLoading={addGameLoading}
                error={error}
                onClose={() => setAddGameModalOpen(false)}
                onSubmit={handleAddGame}
            />

            <EditGameModal
                isOpen={editGameModalOpen}
                gameProduct={editingGame}
                onClose={() => setEditGameModalOpen(false)}
                onSubmit={handleEditGame}
                error={error}
                isLoading={updateGameLoading}
            />
            {/* Delete product modal */}
            <DeleteProductModal
                isOpen={deleteGameModalOpen}
                onClose={() => setDeleteGameModalOpen(false)}
                onConfirm={handleDeleteGame}
                isDeleting={deleteGameLoading}
                title="Delete game"
                message={`Are you sure you want to delete? This action cannot be undone.`}
            />

        </div>
    );
};
