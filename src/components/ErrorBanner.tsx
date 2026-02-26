import { AlertCircle } from 'lucide-react';

interface ErrorBannerProps {
    error: string;
    onRetry: () => void;
}

/**
 * ErrorBanner — displayed when a Supabase query fails.
 * Shows a user-friendly message and a Retry button.
 */
export default function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
    return (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
            <button
                onClick={onRetry}
                className="ml-auto text-sm font-medium underline hover:text-red-900"
            >
                Retry
            </button>
        </div>
    );
}
