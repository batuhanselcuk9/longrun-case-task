import { Search, FilterX } from 'lucide-react';

interface FilterPanelProps {
    search: string;
    setSearch: (v: string) => void;
    category: string;
    setCategory: (v: string) => void;
    minPrice: string;
    setMinPrice: (v: string) => void;
    maxPrice: string;
    setMaxPrice: (v: string) => void;
    inStockOnly: boolean;
    setInStockOnly: (v: boolean) => void;
    categories: string[];       // Dynamic list fetched from Supabase
    setPage: (page: number) => void;
    clearFilters: () => void;
}

/**
 * FilterPanel — renders all filter controls:
 * name search, category dropdown, price range, stock toggle, and clear button.
 */
export default function FilterPanel({
    search, setSearch,
    category, setCategory,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    inStockOnly, setInStockOnly,
    categories,
    setPage, clearFilters,
}: FilterPanelProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Name search */}
            <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
            </div>

            {/* Category dropdown — options fetched dynamically from Supabase */}
            <select
                className="p-2 border rounded-lg outline-none"
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

            {/* Price range filter */}
            <div className="flex gap-2">
                <input
                    type="number"
                    placeholder="Min $"
                    className="w-1/2 p-2 border rounded-lg"
                    min="0"
                    onKeyDown={(e) => e.key === '-' && e.preventDefault()}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max $"
                    className="w-1/2 p-2 border rounded-lg"
                    min="0"
                    onKeyDown={(e) => e.key === '-' && e.preventDefault()}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
            </div>

            {/* Stock filter & clear button */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="stock"
                    className="cursor-pointer"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <label htmlFor="stock" className="text-sm text-gray-600">In Stock Only</label>
                <button
                    onClick={clearFilters}
                    className="ml-auto text-red-500 flex items-center gap-1 text-sm hover:underline cursor-pointer"
                >
                    <FilterX className="w-4 h-4" /> Clear
                </button>
            </div>

        </div>
    );
}
