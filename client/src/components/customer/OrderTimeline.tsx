import React from 'react';
import { CheckCircle2, Clock, CookingPot, PackageCheck, Bike, Home, AlertCircle, XCircle } from 'lucide-react';
import { OrderState, StatusHistoryItem } from '../../types/index.ts';

interface OrderTimelineProps {
  currentStatus: OrderState;
  statusHistory: StatusHistoryItem[];
  deliveryOtp?: string;
}

const LIFECYCLE_STEPS: Array<{ key: OrderState; label: string; icon: any; note: string }> = [
  { key: 'PLACED', label: 'Order Placed', icon: Clock, note: 'Order sent to restaurant' },
  { key: 'RESTAURANT_CONFIRMED', label: 'Restaurant Confirmed', icon: CheckCircle2, note: 'Kitchen accepted the order' },
  { key: 'PREPARING', label: 'Food Preparation', icon: CookingPot, note: 'Chefs are crafting your dish' },
  { key: 'FOOD_READY', label: 'Food Ready', icon: PackageCheck, note: 'Meal is packed fresh' },
  { key: 'DELIVERY_ASSIGNED', label: 'Delivery Assigned', icon: Bike, note: 'Delivery partner heading to restaurant' },
  { key: 'PICKED_UP', label: 'Order Picked Up', icon: Bike, note: 'Order picked up in thermal container' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Bike, note: 'Delivery partner is on the way' },
  { key: 'DELIVERED', label: 'Delivered', icon: Home, note: 'Delivered! Enjoy your meal' },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  currentStatus,
  statusHistory = [],
  deliveryOtp,
}) => {
  const isCancelled = currentStatus === 'CANCELLED' || currentStatus === 'REJECTED';

  if (isCancelled) {
    return (
      <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-start gap-3">
        <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-red-900 dark:text-red-200">
            Order {currentStatus === 'CANCELLED' ? 'Cancelled' : 'Rejected'}
          </h4>
          <p className="text-xs text-red-700 dark:text-red-300 mt-1">
            {statusHistory[statusHistory.length - 1]?.note || 'This order was not fulfilled.'}
          </p>
        </div>
      </div>
    );
  }

  // Find index of current status in the lifecycle
  const currentIndex = LIFECYCLE_STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100/80 dark:border-charcoal-700 shadow-soft">
      {/* OTP Callout banner if order is out for delivery or preparing */}
      {deliveryOtp && currentStatus !== 'DELIVERED' && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-200 dark:border-orange-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-charcoal-500 dark:text-gray-400 uppercase tracking-wider">
              Delivery Handover OTP
            </p>
            <p className="text-xs text-charcoal-700 dark:text-gray-200 mt-0.5">
              Share this 4-digit code with your delivery partner on arrival
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-primary text-white font-mono font-extrabold text-xl tracking-widest shadow-md">
            {deliveryOtp}
          </div>
        </div>
      )}

      {/* Vertical Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-charcoal-700">
        {LIFECYCLE_STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const StepIcon = step.icon;

          // Find timestamp from history
          const histItem = statusHistory.find((h) => h.status === step.key);
          const timeString = histItem?.timestamp
            ? new Date(histItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : null;

          return (
            <div key={step.key} className="relative group">
              {/* Dot / Icon */}
              <div
                className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-primary text-white ring-4 ring-orange-200 dark:ring-orange-950 animate-pulse'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 dark:bg-charcoal-700 text-gray-400 border border-gray-300 dark:border-charcoal-600'
                }`}
              >
                {isCompleted && !isCurrent ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <StepIcon className="w-3 h-3" />
                )}
              </div>

              {/* Text info */}
              <div className="ml-3">
                <div className="flex items-center justify-between">
                  <h5
                    className={`font-display font-bold text-xs ${
                      isCurrent
                        ? 'text-primary'
                        : isCompleted
                        ? 'text-charcoal-800 dark:text-white'
                        : 'text-charcoal-400 dark:text-gray-500'
                    }`}
                  >
                    {step.label}
                  </h5>
                  {timeString && (
                    <span className="text-[10px] text-charcoal-400 font-medium">{timeString}</span>
                  )}
                </div>
                <p className="text-[11px] text-charcoal-500 dark:text-gray-400 mt-0.5">
                  {histItem?.note || step.note}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
