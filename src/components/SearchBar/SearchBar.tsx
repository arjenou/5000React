import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="search-section">
      <div className="search-container-main">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="搜索 ArchDaily"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input-main"
        />
      </div>
    </div>
  );
};

export default SearchBar;
