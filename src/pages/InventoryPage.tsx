import { useEffect, useState, useCallback } from 'react';
import { Package } from 'lucide-react';

import { supabase } from '../lib/supabaseClient';
import useDebounce from '../hooks/useDebounce';
import { ITEMS_PER_PAGE } from '../constants';
import type { Product } from '../interface/product_interface';

import FilterPanel from '../components/FilterPanel';
import ErrorBanner from '../components/ErrorBanner';
import ProductTable from '../components/ProductTable';
import Pagination from '../components/Pagination';

export default function InventoryPage() {
    // --- Data state ---
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);

    // Distinct category list fetched from Supabase on mount
    const [categories, setCategories] = useState<string[]>([]);

    // --- Filter state ---
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [inStockOnly, setInStockOnly] = useState(false);

    // --- Sort state ---
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Debounced filter values — prevent a Supabase request on every keystroke
    const debouncedSearch = useDebounce(search, 400);
    const debouncedMinPrice = useDebounce(minPrice, 400);
    const debouncedMaxPrice = useDebounce(maxPrice, 400);

    /**
     * Fetches products from Supabase using a single optimized query
     * that combines all active filters, sorting, and pagination (server-side).
     * Only the current page slice is fetched — no over-fetching.
     */
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);

        let query = supabase.from('products').select('*', { count: 'exact' });

        if (debouncedSearch) query = query.ilike('name', `%${debouncedSearch}%`);
        if (category !== 'All') query = query.eq('category', category);
        if (debouncedMinPrice) query = query.gte('price', parseFloat(debouncedMinPrice));
        if (debouncedMaxPrice) query = query.lte('price', parseFloat(debouncedMaxPrice));
        if (inStockOnly) query = query.gt('stock_quantity', 0);

        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        const from = (page - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        query = query.range(from, to);

        const { data, count, error } = await query;

        if (error) {
            setError('Failed to load products. Please check your connection and try again.');
            console.error('Supabase fetch error:', error.message);
        } else {
            setProducts(data || []);
            setTotalCount(count || 0);
        }

        setLoading(false);
    }, [page, debouncedSearch, category, debouncedMinPrice, debouncedMaxPrice, inStockOnly, sortBy, sortOrder]);

    /**
     * Fetches all distinct category values from Supabase once on mount.
     * Deduplicates using a Set so the dropdown always reflects the real data.
     */
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase
                .from('products')
                .select('category')
                .order('category');
            if (data) {
                const unique = [...new Set(data.map((d) => d.category))] as string[];
                setCategories(unique);
            }
        };
        fetchCategories();
    }, []);

    // Re-fetch products whenever any filter, sort, or page dependency changes
    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    /** Resets all filters and returns to the first page. */
    const clearFilters = () => {
        setSearch('');
        setCategory('All');
        setMinPrice('');
        setMaxPrice('');
        setInStockOnly(false);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                    <Package className="text-blue-600" /> Product Inventory
                </h1>

                <FilterPanel
                    search={search} setSearch={setSearch}
                    category={category} setCategory={setCategory}
                    minPrice={minPrice} setMinPrice={setMinPrice}
                    maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                    inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
                    categories={categories}
                    setPage={setPage}
                    clearFilters={clearFilters}
                />

                {error && <ErrorBanner error={error} onRetry={fetchProducts} />}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <ProductTable
                        products={products}
                        loading={loading}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        setSortBy={setSortBy}
                        setSortOrder={setSortOrder}
                    />
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        totalCount={totalCount}
                        setPage={setPage}
                    />
                </div>

            </div>
        </div>
    );
}
