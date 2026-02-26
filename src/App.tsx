import { useEffect, useState, useCallback } from 'react';
import { supabase } from './lib/supabaseClient';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  FilterX,
  Package,
  ArrowUpDown,
  AlertCircle
} from 'lucide-react';

// TypeScript interface for a product row from Supabase
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_quantity: number;
  created_at: string;
}

// Number of products to display per page
const ITEMS_PER_PAGE = 10;

function App() {
  // --- State ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Stores error message for UI display
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Sorting states
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  /**
   * Fetches products from Supabase using a single optimized query that
   * combines all active filters, sorting, and pagination (server-side).
   * Only the current page of data is fetched — no over-fetching.
   */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset any previous error before each fetch

    // Start building the Supabase query with an exact count for pagination
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    // Apply filters conditionally using Supabase query methods
    if (search) query = query.ilike('name', `%${search}%`);           // Case-insensitive name search
    if (category !== 'All') query = query.eq('category', category);   // Exact category match
    if (minPrice) query = query.gte('price', parseFloat(minPrice));    // Minimum price filter
    if (maxPrice) query = query.lte('price', parseFloat(maxPrice));    // Maximum price filter
    if (inStockOnly) query = query.gt('stock_quantity', 0);            // Only in-stock products

    // Apply server-side sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply server-side pagination — fetch only the current page slice
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      // Display a user-friendly error message in the UI instead of silently logging
      setError('Failed to load products. Please check your connection and try again.');
      console.error('Supabase fetch error:', error.message);
    } else {
      setProducts(data || []);
      setTotalCount(count || 0);
    }

    setLoading(false);
  }, [page, search, category, minPrice, maxPrice, inStockOnly, sortBy, sortOrder]);

  // Re-fetch whenever any filter, sort, or page dependency changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Total number of pages based on filtered result count
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  /**
   * Resets all filter and sort states back to their defaults
   * and returns the user to the first page.
   */
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

        {/* --- Filter Panel --- */}
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

          {/* Category dropdown */}
          <select
            className="p-2 border rounded-lg outline-none"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home & Garden">Home & Garden</option>
            <option value="Sports">Sports</option>
            <option value="Books">Books</option>
            <option value="Beauty & Personal Care">Beauty & Personal Care</option>
            <option value="Toys & Games">Toys & Games</option>
          </select>

          {/* Price range filter */}
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min $"
              className="w-1/2 p-2 border rounded-lg"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max $"
              className="w-1/2 p-2 border rounded-lg"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          {/* Stock filter & clear button */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="stock"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            <label htmlFor="stock" className="text-sm text-gray-600">In Stock Only</label>
            <button
              onClick={clearFilters}
              className="ml-auto text-red-500 flex items-center gap-1 text-sm hover:underline"
            >
              <FilterX className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>

        {/* --- Error Banner --- */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
            <button
              onClick={fetchProducts}
              className="ml-auto text-sm font-medium underline hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* --- Product Table --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              {/* Sortable column headers */}
              <thead className="bg-gray-50 border-bottom border-gray-200">
                <tr>
                  {['Name', 'Category', 'Price', 'Stock', 'Created At'].map((header) => (
                    <th
                      key={header}
                      className="p-4 text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        // Map header label to DB column name
                        const col = header.toLowerCase().replace(' ', '_');
                        setSortOrder(sortBy === col && sortOrder === 'asc' ? 'desc' : 'asc');
                        setSortBy(col === 'stock' ? 'stock_quantity' : col === 'name' ? 'name' : col);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {header} <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table body: shows loading, empty, or product rows */}
              <tbody className="divide-y divide-gray-200">
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
                        {/* Stock badge: green if available, red if out */}
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

          {/* --- Pagination Controls --- */}
          <div className="p-4 border-t flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50">
            {/* Total count display */}
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold text-gray-900">{products.length}</span> of {totalCount} products
            </p>
            <div className="flex items-center gap-2">
              {/* Previous page */}
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium">Page {page} of {totalPages}</span>
              {/* Next page */}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;