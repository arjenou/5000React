import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import './Toast.css';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  defaultDuration?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  maxToasts = 5,
  defaultDuration = 5000 
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = generateId();
    const toast: Toast = {
      ...toastData,
      id,
      duration: toastData.duration ?? defaultDuration,
    };

    setToasts(prevToasts => {
      const newToasts = [toast, ...prevToasts];
      // 限制最大数量
      return newToasts.slice(0, maxToasts);
    });

    // 自动移除
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }
  }, [defaultDuration, maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={`toast toast-${toast.type}`}>
      <div className="toast-content">
        <div className="toast-icon">
          {getIcon()}
        </div>
        
        <div className="toast-body">
          <div className="toast-title">{toast.title}</div>
          {toast.message && (
            <div className="toast-message">{toast.message}</div>
          )}
          
          {toast.actions && toast.actions.length > 0 && (
            <div className="toast-actions">
              {toast.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`toast-action ${action.variant || 'secondary'}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={() => onRemove(toast.id)}
          className="toast-close"
          aria-label="关闭通知"
        >
          <X size={16} />
        </button>
      </div>
      
      {toast.duration && toast.duration > 0 && (
        <div 
          className="toast-progress" 
          style={{ 
            animationDuration: `${toast.duration}ms`,
            animationName: 'toast-progress'
          }} 
        />
      )}
    </div>
  );
};

// 便捷的hook方法
export const useToastHelpers = () => {
  const { addToast } = useToast();

  const success = useCallback((title: string, message?: string, actions?: Toast['actions']) => {
    addToast({ type: 'success', title, message, actions });
  }, [addToast]);

  const error = useCallback((title: string, message?: string, actions?: Toast['actions']) => {
    addToast({ type: 'error', title, message, actions, duration: 8000 }); // 错误消息显示更长时间
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, actions?: Toast['actions']) => {
    addToast({ type: 'warning', title, message, actions });
  }, [addToast]);

  const info = useCallback((title: string, message?: string, actions?: Toast['actions']) => {
    addToast({ type: 'info', title, message, actions });
  }, [addToast]);

  return { success, error, warning, info };
};
