import React, { useState } from 'react';
import { Product, ProductVariation, ProductAddOn } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Plus, Minus, Check, Sparkles, ShieldCheck } from 'lucide-react';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<Props> = ({ product, onClose }) => {
  const { addToCart } = useApp();

  if (!product) return null;

  const [selectedVariationId, setSelectedVariationId] = useState<string | undefined>(
    product.variations?.[0]?.id
  );
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  const selectedVariation = product.variations?.find(v => v.id === selectedVariationId);
  const addOnsTotal = (product.addOns || [])
    .filter(a => selectedAddOnIds.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);

  const unitPrice =
    product.sellingPrice + (selectedVariation ? selectedVariation.priceModifier : 0) + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddOn = (id: string) => {
    if (selectedAddOnIds.includes(id)) {
      setSelectedAddOnIds(selectedAddOnIds.filter(item => item !== id));
    } else {
      setSelectedAddOnIds([...selectedAddOnIds, id]);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedVariationId, selectedAddOnIds, specialInstructions.trim() || undefined);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header Image */}
        <div className="relative h-56 sm:h-64 bg-slate-100 overflow-hidden shrink-0">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            id="close-product-modal-btn"
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Veg / Non-Veg badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-xs flex items-center space-x-1.5 text-xs font-bold">
            <span
              className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                product.isVeg ? 'border-emerald-600' : 'border-rose-600'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  product.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              />
            </span>
            <span className={product.isVeg ? 'text-emerald-800' : 'text-rose-800'}>
              {product.isVeg ? '100% Veg' : 'Non-Veg'}
            </span>
          </div>

          {product.discountPercentage > 0 && (
            <div className="absolute bottom-3 left-3 bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
              {product.discountPercentage}% OFF
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto flex-1 divide-y divide-slate-100 space-y-4">
          {/* Title & Price Info */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h3>
                <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                  from {product.shopName}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-slate-900">
                  ₹{product.sellingPrice}
                </div>
                {product.mrp > product.sellingPrice && (
                  <div className="text-xs text-slate-400 line-through">
                    MRP ₹{product.mrp}
                  </div>
                )}
                <span className="text-[11px] text-slate-500 font-medium block">
                  Per {product.unit}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center space-x-2 mt-2.5 text-[11px] text-slate-500 font-medium">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                SKU: {product.sku}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                In Stock: {product.stockQuantity} {product.unit}
              </span>
            </div>
          </div>

          {/* Variations Section */}
          {product.variations && product.variations.length > 0 && (
            <div className="pt-4">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Select Option / Portion size
              </label>
              <div className="space-y-2">
                {product.variations.map(variation => {
                  const isChecked = selectedVariationId === variation.id;
                  return (
                    <button
                      key={variation.id}
                      onClick={() => setSelectedVariationId(variation.id)}
                      className={`w-full p-3 rounded-2xl flex items-center justify-between text-left border transition-all ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/50 text-slate-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isChecked
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold">
                          {variation.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        {variation.priceModifier > 0
                          ? `+₹${variation.priceModifier}`
                          : 'Standard'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons Section */}
          {product.addOns && product.addOns.length > 0 && (
            <div className="pt-4">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Customize with Add-ons
              </label>
              <div className="space-y-2">
                {product.addOns.map(addon => {
                  const isChecked = selectedAddOnIds.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={`w-full p-3 rounded-2xl flex items-center justify-between text-left border transition-all ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/50 text-slate-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                            isChecked
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">
                          {addon.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-emerald-800">
                        +₹{addon.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="pt-4">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              Special Instructions
            </label>
            <input
              type="text"
              id="product-special-instructions-input"
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder="e.g., Make it mild spicy, pack chutney separately..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Modal Footer with Quantity and Add Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 bg-white border border-slate-200 p-1 rounded-2xl shadow-xs">
            <button
              id="decrease-modal-qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center text-xs font-bold text-slate-900">
              {quantity}
            </span>
            <button
              id="increase-modal-qty-btn"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            id="add-customized-product-btn"
            onClick={handleAddToCart}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-5 rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-between transition-all hover:scale-[1.01]"
          >
            <span>Add to Cart</span>
            <span>₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
