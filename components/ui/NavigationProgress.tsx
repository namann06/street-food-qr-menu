'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';


export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevHref = useRef(`${pathname}?${searchParams}`);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(0);
    setLoading(false);
  }, []);

  useEffect(() => {
    const href = `${pathname}?${searchParams}`;
    if (href === prevHref.current) return;
    prevHref.current = href;

    // Route changed — play the bar
    setLoading(true);
    setProgress(20);

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 90;
        }
        return prev + Math.random() * 12;
      });
    }, 200);

    
    const finish = setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      setProgress(100);
      setTimeout(reset, 300);
    }, 150);

    return () => {
      clearTimeout(finish);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pathname, searchParams, reset]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="nav-progress"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed top-0 inset-x-0 z-[110] h-[3px]"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-sage-400 via-sage-500 to-sage-400 rounded-r-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: [0.22, 1, 0.36, 1] as [number, number, number, number], duration: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
