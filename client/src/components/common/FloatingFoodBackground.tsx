import React from 'react';

export const FloatingFoodBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20 dark:opacity-10 select-none">
      <span className="absolute top-[10%] left-[5%] text-4xl animate-float" style={{ animationDelay: '0s' }}>🍕</span>
      <span className="absolute top-[25%] right-[8%] text-3xl animate-float" style={{ animationDelay: '1.2s' }}>🍔</span>
      <span className="absolute top-[50%] left-[12%] text-4xl animate-float" style={{ animationDelay: '2.4s' }}>🍲</span>
      <span className="absolute top-[70%] right-[15%] text-3xl animate-float" style={{ animationDelay: '0.8s' }}>🌮</span>
      <span className="absolute top-[85%] left-[20%] text-4xl animate-float" style={{ animationDelay: '3s' }}>🥟</span>
      <span className="absolute top-[40%] right-[25%] text-3xl animate-float" style={{ animationDelay: '1.8s' }}>🍰</span>
      <span className="absolute top-[65%] left-[45%] text-3xl animate-float" style={{ animationDelay: '2s' }}>🥗</span>
      <span className="absolute top-[15%] right-[40%] text-3xl animate-float" style={{ animationDelay: '2.7s' }}>🍣</span>
    </div>
  );
};

export default FloatingFoodBackground;
