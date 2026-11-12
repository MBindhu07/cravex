import React, { useEffect, useState } from 'react';
import { Bike, MapPin, Store, Navigation } from 'lucide-react';
import { OrderState } from '../../types/index.ts';

interface InteractiveMapSimProps {
  status: OrderState;
  restaurantName: string;
  customerAddress: string;
  partnerLocation?: { lat: number; lng: number };
}

export const InteractiveMapSim: React.FC<InteractiveMapSimProps> = ({
  status,
  restaurantName,
  customerAddress,
  partnerLocation,
}) => {
  // Smooth animated scooter progress along curve (0% to 100%)
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    if (status === 'OUT_FOR_DELIVERY') {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 30 : prev + 1.5));
      }, 800);
      return () => clearInterval(interval);
    } else if (status === 'DELIVERED') {
      setProgress(100);
    } else if (status === 'PICKED_UP') {
      setProgress(20);
    } else {
      setProgress(10);
    }
  }, [status]);

  // Coordinates calculation along an SVG quadratic bezier curve
  // Path: M 50,150 Q 200,40 350,150
  const t = progress / 100;
  // B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
  const p0 = { x: 60, y: 150 };
  const p1 = { x: 200, y: 30 };
  const p2 = { x: 340, y: 150 };

  const currentX = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const currentY = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;

  return (
    <div className="bg-white dark:bg-charcoal-800 rounded-3xl overflow-hidden border border-orange-100 dark:border-charcoal-700 shadow-soft">
      {/* Top Map Status Bar */}
      <div className="p-4 bg-orange-50/70 dark:bg-charcoal-900 border-b border-orange-100 dark:border-charcoal-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-primary animate-pulse" />
          <span className="font-display font-bold text-xs text-charcoal-800 dark:text-white">
            Live GPS Route Simulation
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px]">
          ● Real-time Socket Connected
        </span>
      </div>

      {/* Map Graphic Canvas */}
      <div className="relative h-56 w-full bg-[#f4f7f6] dark:bg-[#1a1c20] overflow-hidden flex items-center justify-center p-4">
        {/* Street Grid Graphic Pattern */}
        <div className="absolute inset-0 opacity-15 dark:opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:28px_28px]" />

        {/* SVG Route Curve */}
        <svg className="w-full h-full max-w-[400px] overflow-visible" viewBox="0 0 400 200">
          {/* Base Road Track */}
          <path
            d="M 60,150 Q 200,30 340,150"
            fill="none"
            stroke="#DADCE0"
            strokeWidth="10"
            strokeLinecap="round"
            className="dark:stroke-charcoal-600"
          />

          {/* Glowing Animated Active Transit Line */}
          <path
            d="M 60,150 Q 200,30 340,150"
            fill="none"
            stroke="#FF6B35"
            strokeWidth="6"
            strokeDasharray="8 6"
            strokeLinecap="round"
            className="animate-pulse"
          />

          {/* Restaurant Origin Node */}
          <g transform="translate(60, 150)">
            <circle r="18" fill="#FF6B35" opacity="0.2" className="animate-ping" />
            <circle r="12" fill="#FF6B35" />
            <text y="4" textAnchor="middle" fill="white" fontSize="11">🏪</text>
          </g>

          {/* Customer Destination Node */}
          <g transform="translate(340, 150)">
            <circle r="16" fill="#28A745" opacity="0.2" />
            <circle r="12" fill="#28A745" />
            <text y="4" textAnchor="middle" fill="white" fontSize="11">📍</text>
          </g>

          {/* Moving Delivery Scooter Marker */}
          <g transform={`translate(${currentX}, ${currentY})`} className="transition-all duration-300">
            <circle r="16" fill="#202124" opacity="0.3" className="animate-ping" />
            <circle r="14" fill="#202124" stroke="#FF6B35" strokeWidth="2.5" />
            <text y="4" textAnchor="middle" fill="white" fontSize="11">🛵</text>
          </g>
        </svg>

        {/* Floating ETA Badge */}
        <div className="absolute top-4 right-4 bg-white/95 dark:bg-charcoal-800/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-orange-200 dark:border-charcoal-600 shadow-md text-right">
          <p className="text-[10px] text-gray-500 uppercase font-semibold">Estimated Arrival</p>
          <p className="font-extrabold text-sm text-primary">12-15 mins</p>
        </div>
      </div>

      {/* Route Legs Description */}
      <div className="p-4 bg-white dark:bg-charcoal-800 flex items-center justify-between text-xs text-charcoal-700 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-primary shrink-0" />
          <span className="font-semibold truncate max-w-[140px]">{restaurantName}</span>
        </div>
        <span className="text-gray-400">⟶</span>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-semibold truncate max-w-[140px]">{customerAddress}</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapSim;
