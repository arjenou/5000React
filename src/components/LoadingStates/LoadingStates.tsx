import React from 'react';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import './LoadingStates.css';

// 骨架屏加载组件
export const SkeletonLoader: React.FC<{ 
  type?: 'card' | 'list' | 'detail' | 'table';
  count?: number;
}> = ({ type = 'card', count = 3 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-subtitle"></div>
              <div className="skeleton-line skeleton-text"></div>
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className="skeleton-list-item">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-subtitle"></div>
            </div>
          </div>
        );
      
      case 'detail':
        return (
          <div className="skeleton-detail">
            <div className="skeleton-line skeleton-title large"></div>
            <div className="skeleton-line skeleton-subtitle"></div>
            <div className="skeleton-image large"></div>
            <div className="skeleton-content">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className="skeleton-table-row">
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
          </div>
        );
      
      default:
        return <div className="skeleton-line"></div>;
    }
  };

  return (
    <div className="skeleton-container">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="skeleton-wrapper">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

// 加载中组件
export const LoadingSpinner: React.FC<{
  size?: 'small' | 'medium' | 'large';
  text?: string;
  overlay?: boolean;
}> = ({ size = 'medium', text, overlay = false }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const Component = (
    <div className={`loading-spinner ${size}`}>
      <Loader2 className={`spinning ${sizeClasses[size]}`} />
      {text && <span className="loading-text">{text}</span>}
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        {Component}
      </div>
    );
  }

  return Component;
};

// 重试按钮组件
export const RetryButton: React.FC<{
  onRetry: () => void;
  loading?: boolean;
  text?: string;
}> = ({ onRetry, loading = false, text = '重试' }) => {
  return (
    <button 
      onClick={onRetry}
      disabled={loading}
      className="retry-button"
    >
      <RefreshCw className={`retry-icon ${loading ? 'spinning' : ''}`} size={16} />
      {text}
    </button>
  );
};

// 错误状态组件
export const ErrorState: React.FC<{
  error: string;
  onRetry?: () => void;
  showIcon?: boolean;
}> = ({ error, onRetry, showIcon = true }) => {
  return (
    <div className="error-state">
      {showIcon && <AlertCircle className="error-icon" size={48} />}
      <h3 className="error-title">出现错误</h3>
      <p className="error-message">{error}</p>
      {onRetry && <RetryButton onRetry={onRetry} />}
    </div>
  );
};

// 空状态组件
export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}> = ({ 
  title = '暂无数据', 
  description = '当前没有找到任何内容',
  action,
  icon
}) => {
  return (
    <div className="empty-state">
      {icon && <div className="empty-icon">{icon}</div>}
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
};

// 进度条组件
export const ProgressBar: React.FC<{
  progress: number;
  text?: string;
  showPercentage?: boolean;
}> = ({ progress, text, showPercentage = true }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="progress-container">
      {text && <div className="progress-text">{text}</div>}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="progress-percentage">{Math.round(clampedProgress)}%</div>
      )}
    </div>
  );
};
