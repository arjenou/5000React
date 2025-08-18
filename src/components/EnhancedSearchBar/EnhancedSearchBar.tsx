import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, SortAsc, SortDesc } from 'lucide-react';
import { debounce } from '../../utils/helpers';
import './EnhancedSearchBar.css';

interface SearchFilters {
  category: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  dateRange: {
    start: string;
    end: string;
  };
}

interface EnhancedSearchBarProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: SearchFilters) => void;
  placeholder?: string;
  showFilters?: boolean;
  categories?: Array<{ value: string; label: string }>;
  statuses?: Array<{ value: string; label: string }>;
  sortOptions?: Array<{ value: string; label: string }>;
}

export const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  onSearch,
  onFiltersChange,
  placeholder = '搜索项目...',
  showFilters = true,
  categories = [],
  statuses = [],
  sortOptions = []
}) => {
  const [query, setQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    status: 'all',
    sortBy: 'updated_at',
    sortOrder: 'desc',
    dateRange: {
      start: '',
      end: ''
    }
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  // 防抖搜索
  const debouncedSearch = debounce((searchQuery: string) => {
    onSearch(searchQuery);
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  // 点击外部关闭过滤面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target as Node)) {
        setShowFilterPanel(false);
      }
    };

    if (showFilterPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterPanel]);

  const handleClearSearch = () => {
    setQuery('');
    searchInputRef.current?.focus();
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      status: 'all',
      sortBy: 'updated_at',
      sortOrder: 'desc',
      dateRange: {
        start: '',
        end: ''
      }
    });
  };

  const hasActiveFilters = () => {
    return filters.category !== 'all' || 
           filters.status !== 'all' || 
           filters.sortBy !== 'updated_at' || 
           filters.sortOrder !== 'desc' ||
           filters.dateRange.start || 
           filters.dateRange.end;
  };

  return (
    <div className="enhanced-search-bar">
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="search-input"
          />
          {query && (
            <button
              onClick={handleClearSearch}
              className="clear-search-btn"
              title="清除搜索"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {showFilters && (
          <div className="filter-controls" ref={filterPanelRef}>
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`filter-toggle-btn ${hasActiveFilters() ? 'has-filters' : ''}`}
              title="筛选选项"
            >
              <Filter size={20} />
              {hasActiveFilters() && <span className="filter-indicator" />}
            </button>

            {showFilterPanel && (
              <div className="filter-panel">
                <div className="filter-header">
                  <h3>筛选选项</h3>
                  <button
                    onClick={handleClearFilters}
                    className="clear-filters-btn"
                    disabled={!hasActiveFilters()}
                  >
                    清除筛选
                  </button>
                </div>

                <div className="filter-grid">
                  {/* 分类筛选 */}
                  {categories.length > 0 && (
                    <div className="filter-group">
                      <label>分类</label>
                      <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                      >
                        <option value="all">全部分类</option>
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* 状态筛选 */}
                  {statuses.length > 0 && (
                    <div className="filter-group">
                      <label>状态</label>
                      <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <option value="all">全部状态</option>
                        {statuses.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* 排序选项 */}
                  {sortOptions.length > 0 && (
                    <div className="filter-group">
                      <label>排序</label>
                      <div className="sort-controls">
                        <select
                          value={filters.sortBy}
                          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        >
                          {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                          className="sort-order-btn"
                          title={filters.sortOrder === 'asc' ? '降序' : '升序'}
                        >
                          {filters.sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 日期范围筛选 */}
                  <div className="filter-group date-range">
                    <label>日期范围</label>
                    <div className="date-inputs">
                      <input
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) => handleFilterChange('dateRange', {
                          ...filters.dateRange,
                          start: e.target.value
                        })}
                        placeholder="开始日期"
                      />
                      <span>至</span>
                      <input
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) => handleFilterChange('dateRange', {
                          ...filters.dateRange,
                          end: e.target.value
                        })}
                        placeholder="结束日期"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 活动筛选标签显示 */}
      {hasActiveFilters() && (
        <div className="active-filters">
          {filters.category !== 'all' && (
            <span className="filter-tag">
              分类: {categories.find(c => c.value === filters.category)?.label}
              <button onClick={() => handleFilterChange('category', 'all')}>
                <X size={12} />
              </button>
            </span>
          )}
          {filters.status !== 'all' && (
            <span className="filter-tag">
              状态: {statuses.find(s => s.value === filters.status)?.label}
              <button onClick={() => handleFilterChange('status', 'all')}>
                <X size={12} />
              </button>
            </span>
          )}
          {filters.dateRange.start && (
            <span className="filter-tag">
              开始: {filters.dateRange.start}
              <button onClick={() => handleFilterChange('dateRange', { ...filters.dateRange, start: '' })}>
                <X size={12} />
              </button>
            </span>
          )}
          {filters.dateRange.end && (
            <span className="filter-tag">
              结束: {filters.dateRange.end}
              <button onClick={() => handleFilterChange('dateRange', { ...filters.dateRange, end: '' })}>
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
