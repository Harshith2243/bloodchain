import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  padding = true, 
  animate = true,
  ...props 
}) => {
  const Component = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <Component
      className={`
        bg-white border border-slate-100 rounded-2xl shadow-sm
        ${padding ? 'p-6' : ''}
        ${className}
      `}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
