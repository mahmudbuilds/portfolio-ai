"use client";

import { useState, FormEvent } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  onSearch: (username: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function SearchBar({
  onSearch,
  isLoading = false,
  error,
}: SearchBarProps) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim() && !isLoading) {
      onSearch(username.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="w-full max-w-xl"
    >
      <form onSubmit={handleSubmit} className="relative group">
        {/* Glow effect container */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 group-focus-within:opacity-60 transition-opacity duration-500" />

        {/* Main input container */}
        <div className="relative flex items-center bg-white/70 dark:bg-black/40 backdrop-blur-2xl border border-primary/20 dark:border-white/10 group-focus-within:border-primary/40 dark:group-focus-within:border-white/20 rounded-2xl overflow-hidden transition-all duration-500 shadow-xl shadow-primary/5 dark:shadow-none">
          <div className="pl-3 sm:pl-5 text-foreground/60 dark:text-foreground/40">
            {isLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </div>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="GitHub username..."
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 sm:px-4 py-4 sm:py-5 text-base sm:text-lg text-foreground placeholder-muted-foreground/60 font-medium !outline-none focus:ring-0 disabled:opacity-50 min-w-0"
          />

          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="mr-1.5 sm:mr-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary via-violet-600 to-indigo-600 dark:from-primary dark:to-indigo-500 text-white text-sm sm:text-base font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-lg shadow-primary/25"
          >
            {isLoading ? (
              <span className="hidden sm:inline">Searching...</span>
            ) : (
              "Generate"
            )}
            {isLoading && <span className="sm:hidden">...</span>}
          </button>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
