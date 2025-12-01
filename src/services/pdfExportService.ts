import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TransactionForExport {
    id: string;
    date: string;
    description: string;
    category: string;
    amount: number;
    type: 'income' | 'expense';
    account: string;
    currency: string;
}

export const exportTransactionsToPDF = (transactions: TransactionForExport[]) => {
    const doc = new jsPDF();
    
    // Título del documento
    doc.setFontSize(18);
    doc.setTextColor(34, 197, 94); // verde
    doc.text('Historial de Transacciones', 14, 22);
    
    // Información adicional
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-AR')}`, 14, 30);
    doc.text(`Total de transacciones: ${transactions.length}`, 14, 36);
    
    // Calcular totales
    const totalIngresos = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalEgresos = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIngresos - totalEgresos;
    
    // Mostrar resumen financiero
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Resumen Financiero:', 14, 46);
    
    doc.setFontSize(10);
    doc.setTextColor(34, 197, 94); // verde para ingresos
    doc.text(`Ingresos: ${formatCurrency(totalIngresos)}`, 14, 53);
    
    doc.setTextColor(239, 68, 68); // rojo para egresos
    doc.text(`Egresos: ${formatCurrency(totalEgresos)}`, 14, 59);
    
    doc.setTextColor(balance >= 0 ? 34 : 239, balance >= 0 ? 197 : 68, balance >= 0 ? 94 : 68);
    doc.text(`Balance: ${formatCurrency(balance)}`, 14, 65);
    
    // Preparar datos para la tabla
    const tableData = transactions.map(t => {
        // Remover emojis de la categoría
        const categoryWithoutEmoji = t.category.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
        
        return [
            formatDate(t.date),
            t.description,
            categoryWithoutEmoji,
            t.account,
            formatCurrency(t.amount),
            t.type === 'income' ? 'Ingreso' : 'Egreso'
        ];
    });
    
    // Crear tabla con autoTable
    autoTable(doc, {
        startY: 75,
        head: [['Fecha', 'Descripción', 'Categoría', 'Referencia', 'Monto', 'Tipo']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [34, 197, 94], // verde
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10
        },
        bodyStyles: {
            fontSize: 9
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251]
        },
        columnStyles: {
            0: { cellWidth: 25 }, // Fecha
            1: { cellWidth: 45 }, // Descripción
            2: { cellWidth: 35 }, // Categoría
            3: { cellWidth: 30 }, // Referencia
            4: { cellWidth: 30, halign: 'right' }, // Monto
            5: { cellWidth: 25, halign: 'center' } // Tipo
        },
        didParseCell: function(data) {
            // Colorear la columna de monto según el tipo
            if (data.column.index === 4 && data.section === 'body') {
                const rowIndex = data.row.index;
                const transaction = transactions[rowIndex];
                if (transaction.type === 'income') {
                    data.cell.styles.textColor = [34, 197, 94]; // verde
                } else {
                    data.cell.styles.textColor = [239, 68, 68]; // rojo
                }
                data.cell.styles.fontStyle = 'bold';
            }
            
            // Colorear la columna de tipo
            if (data.column.index === 5 && data.section === 'body') {
                const rowIndex = data.row.index;
                const transaction = transactions[rowIndex];
                if (transaction.type === 'income') {
                    data.cell.styles.fillColor = [220, 252, 231]; // verde claro
                    data.cell.styles.textColor = [21, 128, 61];
                } else {
                    data.cell.styles.fillColor = [254, 226, 226]; // rojo claro
                    data.cell.styles.textColor = [185, 28, 28];
                }
            }
        },
        margin: { top: 75, left: 14, right: 14 }
    });
    
    // Agregar pie de página
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Página ${i} de ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }
    
    // Guardar el PDF
    const fileName = `transacciones_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
};

// Funciones auxiliares
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(amount);
};

export default {
    exportTransactionsToPDF
};
