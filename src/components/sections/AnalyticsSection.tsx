import { BarChart3, TrendingUp, TrendingDown, PieChart, Activity } from 'lucide-react';

const AnalyticsSection = () => {
    return (
        <div className="space-y-8">
            {/* Título de la sección */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                    <BarChart3 className="h-6 w-6 mr-3 text-purple-600" />
                    Análisis Avanzado
                </h2>
                <p className="text-gray-600">
                    Insights profundos sobre tus patrones financieros y tendencias de gasto
                </p>
            </div>

            {/* Métricas destacadas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Tendencia Mensual</p>
                            <p className="text-2xl font-bold">+12.5%</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-purple-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">Eficiencia de Gasto</p>
                            <p className="text-2xl font-bold">87%</p>
                        </div>
                        <Activity className="h-8 w-8 text-blue-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">Ahorro Promedio</p>
                            <p className="text-2xl font-bold">$45,230</p>
                        </div>
                        <PieChart className="h-8 w-8 text-green-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm">Gastos Variables</p>
                            <p className="text-2xl font-bold">-3.2%</p>
                        </div>
                        <TrendingDown className="h-8 w-8 text-orange-200" />
                    </div>
                </div>
            </div>

            {/* Gráficos avanzados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Tendencias</h3>
                    <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Gráfico de tendencias interactivo</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Categoría</h3>
                    <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Gráfico de pastel avanzado</p>
                    </div>
                </div>
            </div>

            {/* Tabla de análisis detallado */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Análisis Detallado por Período</h3>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gastos</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variación</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Octubre 2024</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">$200,000</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">$140,000</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$60,000</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+12.5%</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Septiembre 2024</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">$180,000</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">$126,500</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$53,500</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+8.2%</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Agosto 2024</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">$165,000</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">$115,500</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$49,500</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-2.1%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsSection;