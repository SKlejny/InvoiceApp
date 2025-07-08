// src/components/SearchAndSort.js
import React from 'react';
import { Search, ListFilter } from 'lucide-react';

const SearchAndSort = ({ searchTerm, setSearchTerm, sortCriteria, setSortCriteria }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-xs">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" />
        <input
          type="text"
          placeholder="Search files by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-light-bg-card border border-border-subtle-light 
                     text-text-primary-light focus:outline-none focus:ring-2 focus:ring-brand-orange-light 
                     dark:bg-dark-bg-card dark:border-border-subtle-dark dark:text-text-primary-dark dark:focus:ring-brand-orange-dark"
        />
      </div>

      {/* Sort Dropdown */}
      <div className="relative w-full sm:w-auto">
        <ListFilter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark pointer-events-none" />
        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          className="appearance-none w-full sm:w-52 pl-10 pr-8 py-2 rounded-lg bg-light-bg-card border border-border-subtle-light 
                     text-text-primary-light focus:outline-none focus:ring-2 focus:ring-brand-orange-light 
                     dark:bg-dark-bg-card dark:border-border-subtle-dark dark:text-text-primary-dark dark:focus:ring-brand-orange-dark"
        >
          <option value="newest">Sort by: Newest</option>
          <option value="oldest">Sort by: Oldest</option>
          <option value="name-asc">Sort by: Name (A-Z)</option>
          <option value="name-desc">Sort by: Name (Z-A)</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndSort;