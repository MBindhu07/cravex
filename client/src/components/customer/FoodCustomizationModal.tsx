import React, { useState } from 'react';
import { X, Plus, Minus, Check, Flame } from 'lucide-react';
import { FoodItem, CustomizationOption } from '../../types/index.ts';
import { useCart } from '../../context/CartContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';

interface FoodCustomizationModalProps {
  food: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FoodCustomizationModal: React.FC<FoodCustomizationModalProps> = ({
  food,
  isOpen,
  onClose,
}) => {
  const { addItem } = useCart();
  const { addToast } = useNotifications();

  if (!isOpen || !food) return null;

  const defaultSizes = food.customizations?.sizes || [
    { name: 'Regular', price: 0 },
    { name: 'Large', price: 60 },
  ];

  const defaultSpiceLevels = food.customizations?.spiceLevels || [
    'Mild',
    'Medium',
    'Hot',
  ];

  const defaultAddOns = food.customizations?.addOns || [
    { name: 'Extra Cheese', price: 40 },
    { name: 'Spicy Dip', price: 30 },
    { name: 'Herb Seasoning', price: 20 },
  ];

  const [selectedSize, setSelectedSize] = useState<CustomizationOption>(defaultSizes[0]);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<string>(defaultSpiceLevels[0]);
  const [selectedAddOns, setSelectedAddOns] = useState<CustomizationOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  const toggleAddOn = (addOn: CustomizationOption) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.name === addOn.name);
      if (exists) return prev.filter((a) => a.name !== addOn.name);
      return [...prev, addOn];
    });
  };

  // Calculate dynamic unit price
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = food.price + (selectedSize.price || 0) + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(
      food,
      {
        size: selectedSize,
        spiceLevel: selectedSpiceLevel,
        addOns: selectedAddOns,
        specialInstructions,
      },
      quantity
    );

    addToast(
      'Added to Cart! 🛒',
      `${quantity}x ${food.name} (${selectedSize.name}) added to your feast.`,
      'success'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-orange-100 dark:border-charcoal-700 animate-in zoom-in-95">
        {/* Header & Image */}
        <div className="relative h-44 w-full bg-gray-100 dark:bg-charcoal-700 shrink-0">
          <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 border flex items-center justify-center rounded-sm ${food.isVeg ? 'border-emerald-500' : 'border-red-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${food.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
              </span>
              <h3 className="font-display font-bold text-lg leading-tight">{food.name}</h3>
            </div>
            <p className="text-xs text-gray-300 mt-0.5 line-clamp-1">{food.description}</p>
          </div>
        </div>

        {/* Customization Options Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          {/* Size Selection */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal-800 dark:text-gray-200 mb-2 flex items-center justify-between">
              <span>Choose Portion Size</span>
              <span className="text-[10px] text-primary lowercase font-medium">required</span>
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {defaultSizes.map((size) => {
                const isSelected = selectedSize.name === size.name;
                return (
                  <button
                    key={size.name}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-primary bg-orange-50/70 dark:bg-charcoal-700 shadow-sm'
                        : 'border-gray-200 dark:border-charcoal-700 hover:border-orange-200'
                    }`}
                  >
                    <div>
                      <p className={`text-xs font-semibold ${isSelected ? 'text-primary' : 'text-charcoal-800 dark:text-gray-200'}`}>
                        {size.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {size.price === 0 ? 'Included' : `+₹${size.price}`}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spice Level */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal-800 dark:text-gray-200 mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Select Spice Level</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {defaultSpiceLevels.map((spice) => {
                const isSelected = selectedSpiceLevel === spice;
                return (
                  <button
                    key={spice}
                    type="button"
                    onClick={() => setSelectedSpiceLevel(spice)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-gray-50 dark:bg-charcoal-700 text-charcoal-700 dark:text-gray-300 border-gray-200 dark:border-charcoal-600 hover:border-primary/40'
                    }`}
                  >
                    {spice}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal-800 dark:text-gray-200 mb-2 flex items-center justify-between">
              <span>Delicious Add-Ons</span>
              <span className="text-[10px] text-charcoal-400">optional</span>
            </h4>
            <div className="space-y-2">
              {defaultAddOns.map((addOn) => {
                const isChecked = selectedAddOns.some((a) => a.name === addOn.name);
                return (
                  <button
                    key={addOn.name}
                    type="button"
                    onClick={() => toggleAddOn(addOn)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                      isChecked
                        ? 'border-primary/60 bg-orange-50/50 dark:bg-charcoal-700'
                        : 'border-gray-100 dark:border-charcoal-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs font-medium text-charcoal-700 dark:text-gray-300">
                      {addOn.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">+₹{addOn.price}</span>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${isChecked ? 'bg-primary border-primary text-white' : 'border-gray-300'}`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal-800 dark:text-gray-200 mb-1.5">
              Cooking Instructions
            </h4>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less oil, extra cutlery, separate dip..."
              rows={2}
              className="w-full text-xs p-3 rounded-2xl border border-gray-200 dark:border-charcoal-700 bg-gray-50/50 dark:bg-charcoal-900 focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add to Cart button */}
        <div className="p-4 bg-gray-50 dark:bg-charcoal-900 border-t border-gray-100 dark:border-charcoal-700 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center bg-white dark:bg-charcoal-800 rounded-2xl border border-gray-200 dark:border-charcoal-700 p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-charcoal-700 text-charcoal-600 dark:text-gray-300"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-extrabold text-charcoal-800 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-charcoal-700 text-charcoal-600 dark:text-gray-300"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-grow py-3 px-6 rounded-2xl bg-primary hover:bg-primary-600 text-white font-bold text-xs transition-all shadow-md shadow-orange-500/25 flex items-center justify-between active:scale-98"
          >
            <span>Add Item</span>
            <span className="font-extrabold text-sm">₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCustomizationModal;
