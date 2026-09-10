import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4500 }) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newToast = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (title, message) => addToast({ type: 'success', title, message }),
    error: (title, message) => addToast({ type: 'error', title, message }),
    warning: (title, message) => addToast({ type: 'warning', title, message }),
    info: (title, message) => addToast({ type: 'info', title, message })
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      {/* Toast Render Portal */}
      <div className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((t) => {
          const typeConfig = {
            success: {
              icon: CheckCircle,
              color: '#059669',
              bg: '#FFFFFF',
              border: '#E2E8F0',
              accent: '#10B981'
            },
            error: {
              icon: AlertCircle,
              color: '#E11D48',
              bg: '#FFFFFF',
              border: '#E2E8F0',
              accent: '#E11D48'
            },
            warning: {
              icon: AlertTriangle,
              color: '#D97706',
              bg: '#FFFFFF',
              border: '#E2E8F0',
              accent: '#F59E0B'
            },
            info: {
              icon: Info,
              color: '#7C3AED',
              bg: '#FFFFFF',
              border: '#E2E8F0',
              accent: '#7C3AED'
            }
          }[t.type] || {
            icon: Info,
            color: '#7C3AED',
            bg: '#FFFFFF',
            border: '#E2E8F0',
            accent: '#7C3AED'
          };

          const IconComponent = typeConfig.icon;

          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 animate-slide-up"
              style={{
                backgroundColor: typeConfig.bg,
                borderColor: typeConfig.border,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
                borderLeft: `4px solid ${typeConfig.accent}`
              }}
              role="alert"
            >
              <IconComponent className="w-5 h-5 shrink-0 mt-0.5" style={{ color: typeConfig.color }} />
              <div className="flex-1 min-w-0">
                {t.title && (
                  <h5 className="font-sans font-semibold text-xs text-slate-900 leading-tight mb-0.5">
                    {t.title}
                  </h5>
                )}
                {t.message && (
                  <p className="font-sans text-[11px] text-slate-600 leading-relaxed">
                    {t.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}
