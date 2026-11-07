import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Heart } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1E1B18] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-white/10"
        >
          {message.includes('❤️') || message.includes('Favourite') ? (
            <Heart className="w-5 h-5 text-red-500 fill-red-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#FF7043] shrink-0" />
          )}
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
