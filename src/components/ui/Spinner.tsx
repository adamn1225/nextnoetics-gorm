import React from 'react';
import { motion } from 'framer-motion';

const Spinner = () => {
    return (
        <motion.div
            className="w-24 h-24 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
    );
};

export default Spinner;