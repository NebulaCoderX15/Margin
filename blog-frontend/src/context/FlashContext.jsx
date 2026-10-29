import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

const FlashContext = createContext(null);

export function FlashProvider({ children }) {
  const [notice, setNotice] = useState(null);
  const timerRef = useRef(null);

  const showFlash = useCallback((message, type = 'success') => {
    window.clearTimeout(timerRef.current);
    setNotice({ message, type, id: Date.now() });
    timerRef.current = window.setTimeout(() => setNotice(null), 4200);
  }, []);

  const dismiss = useCallback(() => {
    window.clearTimeout(timerRef.current);
    setNotice(null);
  }, []);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return (
    <FlashContext.Provider value={showFlash}>
      {children}
      {notice && (
        <div className={`toast toast-${notice.type}`} role="status" aria-live="polite" key={notice.id}>
          <span className="toast-icon">
            {notice.type === 'error' ? <TriangleAlert size={18} /> : notice.type === 'info' ? <Info size={18} /> : <CheckCircle2 size={18} />}
          </span>
          <p>{notice.message}</p>
          <button type="button" onClick={dismiss} aria-label="Dismiss notification"><X size={17} /></button>
        </div>
      )}
    </FlashContext.Provider>
  );
}

export function useFlash() {
  const context = useContext(FlashContext);
  if (!context) throw new Error('useFlash must be used inside FlashProvider');
  return context;
}
