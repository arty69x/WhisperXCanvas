'use client'

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';

const Petal = ({ delay, duration, left, size, xOffset }: { delay: number, duration: number, left: string, size: number, xOffset: string }) => (
  <motion.div
    initial={{ y: -50, x: 0, rotate: 0, opacity: 0 }}
    animate={{ 
      y: ['0vh', '110vh'],
      x: ['0vw', xOffset],
      rotate: [0, 360],
      opacity: [0, 0.8, 0]
    }}
    transition={{ 
      duration, 
      repeat: Infinity, 
      delay,
      ease: "linear"
    }}
    className="absolute pointer-events-none z-0"
    style={{ left, width: size, height: size }}
  >
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-300 opacity-20 drop-shadow-[0_0_8px_rgba(255,126,179,0.3)]">
      <path d="M12 21.5C12 21.5 18 17.5 18 12C18 6.5 12 2.5 12 2.5C12 2.5 6 6.5 6 12C6 17.5 12 21.5 12 21.5Z" fill="currentColor" />
    </svg>
  </motion.div>
);

const FlowerSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="15" fill="currentColor" />
    <path d="M50 0C55 15 75 15 85 25C95 35 95 55 85 65C75 75 55 75 50 90C45 75 25 75 15 65C5 55 5 35 15 25C25 15 45 15 50 0Z" fill="currentColor" opacity="0.3" />
  </svg>
);

export default function PetalsBackground() {
  const [petals, setPetals] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const generated = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 10,
        left: `${Math.random() * 100}vw`,
        size: 10 + Math.random() * 20,
        xOffset: `${Math.random() * 20 - 10}vw`
      }));
      setPetals(generated);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Flowers */}
      <FlowerSVG className="absolute -top-20 -left-20 w-80 h-80 text-pink-500/5 blur-3xl animate-pulse" />
      <FlowerSVG className="absolute bottom-20 -right-20 w-96 h-96 text-purple-600/5 blur-3xl animate-pulse" />
      <FlowerSVG className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] text-pink-300/3 blur-[100px] pointer-events-none" />

      {/* Floating Petals */}
      {petals.map(p => (
        <Petal key={p.id} {...p} />
      ))}
    </div>
  );
}
