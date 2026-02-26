// TypeScript interface for a single product row from Supabase
export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock_quantity: number;
    created_at: string;
}
