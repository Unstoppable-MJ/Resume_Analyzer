import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle className="text-green-400" />,
        error: <AlertCircle className="text-red-400" />,
        info: <Info className="text-blue-400" />
    };

    const colors = {
        success: 'border-green-500/50 bg-green-500/10',
        error: 'border-red-500/50 bg-red-500/10',
        info: 'border-blue-500/50 bg-blue-500/10'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed bottom-8 right-8 z-[100] glass px-6 py-4 rounded-xl border flex items-center gap-4 shadow-2xl ${colors[type]}`}
        >
            {icons[type]}
            <p className="text-sm font-medium">{message}</p>
            <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default Toast;
