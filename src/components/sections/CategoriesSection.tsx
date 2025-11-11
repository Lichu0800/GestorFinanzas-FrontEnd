import { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';
import type { Category } from '../../types';
import CategoryModal from '../CategoryModal';


const CategoriesSection = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setIsLoading(true);
        setError(null);
        
        const response = await categoryService.getCategories();
        
        if (response.success && response.data) {
            setCategories(response.data);
        } else {
            setError(response.error || 'Error al cargar las categorías');
        }
        
        setIsLoading(false);
    };

    const handleCreateCategory = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
            return;
        }

        const response = await categoryService.deleteCategory(id);
        
        if (response.success) {
            await loadCategories();
        } else {
            alert(response.error || 'Error al eliminar la categoría');
        }
    };

    const handleSaveCategory = async () => {
        await loadCategories();
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                        Categorías
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Gestiona las categorías de tus transacciones
                    </p>
                </div>
                <button
                    onClick={handleCreateCategory}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                    ➕ Nueva Categoría
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-red-800">{error}</span>
                </div>
            )}

            {/* Categories Grid */}
            {categories.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-200">
                    <div className="text-6xl mb-4">📂</div>
                    <p className="text-gray-500 text-lg mb-4">No hay categorías para mostrar</p>
                    <button
                        onClick={handleCreateCategory}
                        className="px-6 py-3 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        Crear primera categoría
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-2xl shadow-lg border border-primary-100 p-6 hover:shadow-xl hover:border-primary-300 transition-all duration-200 transform hover:scale-105"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 via-accent-500 to-secondary-500 flex items-center justify-center text-2xl shadow-lg">
                                    {category.emoji || '📁'}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditCategory(category)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(category.id)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <h3 className="font-bold text-lg text-gray-900 mb-2">
                                {category.name}
                            </h3>
                            
                            {category.description && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {category.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <CategoryModal
                    category={editingCategory}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingCategory(null);
                    }}
                    onSave={handleSaveCategory}
                />
            )}
        </div>
    );
};

export default CategoriesSection;
