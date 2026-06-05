import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  /** Unique key per view (usually the route pathname) — drives enter/exit. */
  transitionKey: string;
  /** When false, children render immediately with no animation. */
  enabled?: boolean;
  children: ReactNode;
}

/**
 * Generic route/view transition wrapper. Fades + slides content on key change.
 * Motion is opt-out via `enabled` so it can be governed by user settings.
 */
export function PageTransition({ transitionKey, enabled = true, children }: PageTransitionProps) {
  if (!enabled) return <>{children}</>;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
