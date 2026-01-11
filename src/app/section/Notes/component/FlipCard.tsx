"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { SoundOutlined } from '@ant-design/icons';
import { Card } from 'antd';

interface FlipCardProps {
  term: string;
  definition: string;
  related?: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export const FlipCard: React.FC<FlipCardProps> = ({ 
  term, 
  definition, 
  related, 
  isFlipped, 
  onFlip 
}) => {
  return (
    <div 
      className="w-full h-[400px] cursor-pointer perspective-1000 group"
      onClick={onFlip}
    >
      <motion.div
        className="relative w-full h-full transition-all duration-500 transform-style-3d shadow-xl rounded-2xl"
        initial={false}
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 w-full h-full bg-card rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden">
          <div className="absolute top-4 left-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Term
          </div>
          <div className="absolute top-4 right-4">
             <SoundOutlined className="text-gray-400 hover:text-indigo-600 text-lg transition-colors p-2" onClick={(e) => e.stopPropagation()} />
          </div>
          
          <h3 className="text-3xl md:text-4xl font-bold text-white text-center select-none">
            {term}
          </h3>
        </div>

        <div 
          className="absolute inset-0 w-full h-ful bg-card rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden"
          style={{ transform: "rotateX(180deg)" }}
        >
          <div className="absolute top-4 left-4 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Definition
          </div>
          
          <div className="text-center space-y-4 overflow-y-auto max-h-full w-full px-4 scrollbar-hide">
            <p className="text-2xl font-medium text-white select-none">
              {definition}
            </p>
            
            {related && (
              <div className="pt-4 border-t border-indigo-200 mt-4">
                <p className="text-indigo-600 italic text-lg">
                  &quot;{related}&quot;
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};