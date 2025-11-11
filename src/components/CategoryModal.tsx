import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import categoryService from '../services/categoryService';
import type { Category } from '../types';

interface CategoryModalProps {
    category: Category | null;
    onClose: () => void;
    onSave: () => void;
}

const CategoryModal = ({ category, onClose, onSave }: CategoryModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        emoji: '📁'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const availableIcons = [
        '💰', '💸', '🏠', '🚗', '🍔', '🎮', '📱', '💊', '✈️', '🎓',
        '🛒', '⚡', '💡', '🎬', '🏋️', '👕', '🎨', '📚', '🎵', '☕',
        '🍕', '🚌', '⛽', '🏥', '🎁', '💻', '📞', '🌐', '🔧', '📁'
    ];

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description || '',
                emoji: category.emoji || '📁'
            });
        }
    }, [category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let response;
            
            if (category) {
                // Editar categoría existente
                response = await categoryService.updateCategory(category.id, formData);
            } else {
                // Crear nueva categoría
                response = await categoryService.createCategory(formData);
            }

            if (response.success) {
                onSave();
            } else {
                setError(response.error || 'Error al guardar la categoría');
            }
        } catch (err: any) {
            setError(err.message || 'Error inesperado');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const modalContent = (
        <div className="fixed inset-0 bg-gradient-to-br from-primary-900/50 via-secondary-900/50 to-accent-900/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[10000]">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
                    <h2 className="text-2xl font-bold">
                        {category ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-red-800">{error}</span>
                        </div>
                    )}

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder="Ej: Alimentación, Transporte, Salario..."
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                            placeholder="Descripción opcional de la categoría..."
                        />
                    </div>

                    {/* Emoji */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Emoji
                        </label>
                        <div className="grid grid-cols-10 gap-2">
                            {availableIcons.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, emoji: icon }))}
                                    className={`p-3 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                                        formData.emoji === icon
                                            ? 'border-primary-600 bg-primary-50 shadow-lg'
                                            : 'border-gray-200 hover:border-primary-300'
                                    }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Vista Previa */}
                    <div className="bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 rounded-xl p-6 border border-primary-200">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Vista Previa:</p>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-xs">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg mb-4">
                                {formData.emoji}
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">
                                {formData.name || 'Nombre de la categoría'}
                            </h3>
                            {formData.description && (
                                <p className="text-sm text-gray-600 mb-3">
                                    {formData.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </span>
                            ) : (
                                category ? '💾 Guardar Cambios' : '➕ Crear Categoría'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default CategoryModal;
