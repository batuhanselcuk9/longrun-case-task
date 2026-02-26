import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import type { Product } from '../interface/product_interface';

interface ProductTableProps {
    products: Product[];
    loading: boolean;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    setSortBy: (col: string) => void;
    setSortOrder: (order: 'asc' | 'desc') => void;
}

// Column display labels mapped to Supabase column names
const COLUMNS: { label: string; colKey: string }[] = [
    { label: 'Name', colKey: 'name' },
    { label: 'Category', colKey: 'category' },
    { label: 'Price', colKey: 'price' },
    { label: 'Stock', colKey: 'stock_quantity' },
    { label: 'Created At', colKey: 'created_at' },
];

/**
 * ProductTable — renders the sortable table header and product rows.
 * Handles loading and empty states inline.
 */
export default function ProductTable({
    products, loading, sortBy, sortOrder, setSortBy, setSortOrder,
}: ProductTableProps) {

    const handleSort = (colKey: string) => {
        setSortOrder(sortBy === colKey && sortOrder === 'asc' ? 'desc' : 'asc');
        setSortBy(colKey);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">

                {/* Sortable column headers */}
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        {COLUMNS.map(({ label, colKey }) => {
                            const isActive = sortBy === colKey;
                            return (
                                <th
                                    key={colKey}
                                    className={`p-4 text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600'
                                        }`}
                                    onClick={() => handleSort(colKey)}
                                >
                                    <div className="flex items-center gap-2">
                                        {label}
                                        {/* Directional icon for active column, neutral for others */}
                                        {isActive
                                            ? sortOrder === 'asc'
                                                ? <ArrowUp className="w-3 h-3" />
                                                : <ArrowDown className="w-3 h-3" />
                                            : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>

                {/* Table body: loading / empty / product rows */}
                <tbody className="divide-y divide-gray-200 min-h-[420px]">
                    {loading ? (
                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading products...</td></tr>
                    ) : products.length === 0 ? (
                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">No products found.</td></tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-900">{product.name}</td>
                                <td className="p-4 text-gray-600">{product.category}</td>
                                <td className="p-4 text-gray-900 font-semibold">${product.price.toFixed(2)}</td>
                                <td className="p-4">
                                    {/* Stock badge: green if available, red if out of stock */}
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock_quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 text-sm">
                                    {new Date(product.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>

            </table>
        </div>
    );
}
