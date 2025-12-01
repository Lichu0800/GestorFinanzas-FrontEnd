declare module 'jspdf-autotable' {
    import { jsPDF } from 'jspdf';

    interface UserOptions {
        head?: RowInput[];
        body?: RowInput[];
        foot?: RowInput[];
        startY?: number;
        margin?: MarginPadding;
        pageBreak?: 'auto' | 'avoid' | 'always';
        tableWidth?: 'auto' | 'wrap' | number;
        showHead?: 'everyPage' | 'firstPage' | 'never';
        showFoot?: 'everyPage' | 'lastPage' | 'never';
        theme?: 'striped' | 'grid' | 'plain';
        styles?: Partial<Styles>;
        headStyles?: Partial<Styles>;
        bodyStyles?: Partial<Styles>;
        footStyles?: Partial<Styles>;
        alternateRowStyles?: Partial<Styles>;
        columnStyles?: { [key: string]: Partial<Styles> };
        didParseCell?: (data: CellHookData) => void;
        willDrawCell?: (data: CellHookData) => void;
        didDrawCell?: (data: CellHookData) => void;
        didDrawPage?: (data: any) => void;
    }

    type RowInput = string[] | { [key: string]: any };

    interface MarginPadding {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
        horizontal?: number;
        vertical?: number;
    }

    interface Styles {
        font?: string;
        fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic';
        overflow?: 'linebreak' | 'ellipsize' | 'visible' | 'hidden';
        fillColor?: number[] | string | false;
        textColor?: number[] | string;
        cellPadding?: number | MarginPadding;
        fontSize?: number;
        halign?: 'left' | 'center' | 'right' | 'justify';
        valign?: 'top' | 'middle' | 'bottom';
        lineColor?: number[] | string;
        lineWidth?: number;
        cellWidth?: 'auto' | 'wrap' | number;
        minCellHeight?: number;
    }

    interface CellHookData {
        cell: Cell;
        row: Row;
        column: Column;
        section: 'head' | 'body' | 'foot';
    }

    interface Cell {
        raw: string | number;
        text: string[];
        styles: Styles;
        x: number;
        y: number;
        width: number;
        height: number;
    }

    interface Row {
        index: number;
        raw: any;
        cells: { [key: string]: Cell };
        section: 'head' | 'body' | 'foot';
        height: number;
    }

    interface Column {
        index: number;
        dataKey: string | number;
        width: number;
    }

    export default function autoTable(doc: jsPDF, options: UserOptions): jsPDF;
}
