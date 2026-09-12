import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductType } from '../../types';
import {
  Package,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Power,
  Edit2,
  X,
  UploadCloud,
  FileSpreadsheet,
  Trash2,
  Upload,
  Image as ImageIcon,
  AlertTriangle
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, shops, addProduct, updateProduct, deleteProduct } = useApp();

  const toggleProductStock = (id: string) => {
    const p = products.find(prod => prod.id === id);
    if (p) {
      updateProduct(id, { inStock: !p.inStock, stockQuantity: p.inStock ? 0 : 50 });
    }
  };

  const [typeFilter, setTypeFilter] = useState<'all' | 'food' | 'grocery'>('all');
  const [selectedShopFilter, setSelectedShopFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState('');
  const [shopId, setShopId] = useState(shops[0]?.id || '');
  const [type, setType] = useState<ProductType>('food');
  const [category, setCategory] = useState('Biryani');
  const [description, setDescription] = useState('');
  const [sellingPrice, setSellingPrice] = useState(199);
  const [mrp, setMrp] = useState(249);
  const [unit, setUnit] = useState('1 plate');
  const [isVeg, setIsVeg] = useState(true);
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800'
  );
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [variationsStr, setVariationsStr] = useState('Half:120, Full:220');
  const [addOnsStr, setAddOnsStr] = useState('Extra Raita:30, Salad:20');
  const [statusToast, setStatusToast] = useState<string | null>(null);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setName('');
    setShopId(shops[0]?.id || '');
    setType('food');
    setCategory('Biryani');
    setDescription('');
    setSellingPrice(199);
    setMrp(249);
    setUnit('1 plate');
    setIsVeg(true);
    setImage('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800');
    setIsBestSeller(false);
    setVariationsStr('');
    setAddOnsStr('');
    setEditingProduct(null);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setShopId(p.shopId);
    setType(p.type);
    setCategory(p.category);
    setDescription(p.description);
    setSellingPrice(p.sellingPrice);
    setMrp(p.mrp);
    setUnit(p.unit);
    setIsVeg(p.isVeg);
    setImage(p.image);
    setIsBestSeller(p.isBestSeller || false);

    if (p.variations && p.variations.length > 0) {
      setVariationsStr(p.variations.map(v => `${v.name}:${v.priceModifier ?? v.price ?? 0}`).join(', '));
    } else {
      setVariationsStr('');
    }

    if (p.addOns && p.addOns.length > 0) {
      setAddOnsStr(p.addOns.map(a => `${a.name}:${a.price}`).join(', '));
    } else {
      setAddOnsStr('');
    }

    setShowAddModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedShop = shops.find(s => s.id === shopId) || shops[0];

    // parse variations
    const parsedVariations = variationsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map((item, idx) => {
        const [vName, vPrice] = item.split(':');
        const priceVal = Number(vPrice?.trim() || sellingPrice);
        return {
          id: `var-${idx}-${Date.now()}`,
          name: vName.trim(),
          priceModifier: priceVal,
          price: priceVal,
          isDefault: idx === 0,
        };
      });

    // parse addOns
    const parsedAddOns = addOnsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map((item, idx) => {
        const [aName, aPrice] = item.split(':');
        return {
          id: `addon-${idx}-${Date.now()}`,
          name: aName.trim(),
          price: Number(aPrice?.trim() || 20),
        };
      });

    const discountPercentage = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        shopId: selectedShop.id,
        shopName: selectedShop.name,
        type,
        category,
        description,
        sellingPrice: Number(sellingPrice),
        mrp: Number(mrp),
        discountPercentage,
        unit,
        isVeg,
        image,
        isBestSeller,
        variations: parsedVariations.length > 0 ? parsedVariations : undefined,
        addOns: parsedAddOns.length > 0 ? parsedAddOns : undefined,
      });
    } else {
      addProduct({
        name,
        sku: `TD-${Date.now().toString().slice(-6)}`,
        stockQuantity: 100,
        shopId: selectedShop.id,
        shopName: selectedShop.name,
        type,
        category,
        description,
        sellingPrice: Number(sellingPrice),
        mrp: Number(mrp),
        discountPercentage,
        unit,
        isVeg,
        inStock: true,
        isActive: true,
        image,
        isBestSeller,
        isRecommended: true,
        variations: parsedVariations.length > 0 ? parsedVariations : undefined,
        addOns: parsedAddOns.length > 0 ? parsedAddOns : undefined,
      });
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleBulkUploadSimulation = () => {
    setStatusToast('Bulk CSV processed! 4 new products have been imported into your catalog.');
    setShowBulkUploadModal(false);
    setTimeout(() => {
      setStatusToast(null);
    }, 4000);
  };

  const filteredProducts = products.filter(p => {
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;
    if (selectedShopFilter !== 'all' && p.shopId !== selectedShopFilter) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.shopName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {statusToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
          <span>{statusToast}</span>
          <button onClick={() => setStatusToast(null)} className="text-emerald-600 hover:text-emerald-800 font-black ml-2">×</button>
        </div>
      )}
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Product & Menu Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage food dishes, grocery SKU items, variations, add-ons & stock availability
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowBulkUploadModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Bulk CSV Import</span>
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products by title, category..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Shop Selector */}
          <select
            value={selectedShopFilter}
            onChange={e => setSelectedShopFilter(e.target.value)}
            className="text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Merchant Stores</option>
            {shops.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.type})
              </option>
            ))}
          </select>

          {/* Type Selector */}
          <div className="flex items-center space-x-1">
            {(['all', 'food', 'grocery'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  typeFilter === t
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t === 'all' ? 'All' : t === 'food' ? 'Food' : 'Grocery'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table/Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] text-slate-400 font-extrabold uppercase">
                <th className="p-4">Item & Details</th>
                <th className="p-4">Store / Category</th>
                <th className="p-4">Price / MRP</th>
                <th className="p-4">Customizations</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(prod => (
                <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={prod.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              prod.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                          />
                          <p className="font-extrabold text-sm text-slate-900">
                            {prod.name}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400">{prod.unit}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-slate-800">{prod.shopName}</p>
                    <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                      {prod.category}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-baseline space-x-1">
                      <strong className="text-sm font-black text-slate-900">
                        ₹{prod.sellingPrice}
                      </strong>
                      {prod.mrp > prod.sellingPrice && (
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{prod.mrp}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="text-[11px] space-y-0.5">
                      {prod.variations && prod.variations.length > 0 ? (
                        <span className="text-emerald-700 font-semibold block">
                          {prod.variations.length} Variations
                        </span>
                      ) : (
                        <span className="text-slate-400 block">No variations</span>
                      )}
                      {prod.addOns && prod.addOns.length > 0 && (
                        <span className="text-blue-600 font-semibold block">
                          {prod.addOns.length} Add-ons
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => toggleProductStock(prod.id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                        prod.inStock
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      {prod.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setProductToDelete(prod)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center space-x-1"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingProduct ? `Edit ${editingProduct.name}` : 'Add New Product to Catalog'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Product / Dish Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Special Chicken Dum Biryani"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Merchant Shop
                  </label>
                  <select
                    value={shopId}
                    onChange={e => setShopId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:outline-hidden"
                  >
                    {shops.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Type (Food or Grocery)
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as ProductType)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:outline-hidden"
                  >
                    <option value="food">Food Delivery</option>
                    <option value="grocery">Grocery & Mandi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder="e.g. Biryani, Atta, Pizza"
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Portion / Unit
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    placeholder="e.g. 1 plate, 1 kg, 500 ml"
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={e => setSellingPrice(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    MRP / Cross Price (₹)
                  </label>
                  <input
                    type="number"
                    value={mrp}
                    onChange={e => setMrp(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Product Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Ingredients, taste, freshness guarantee..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Variations (format: Name:Price, Name:Price)
                </label>
                <input
                  type="text"
                  value={variationsStr}
                  onChange={e => setVariationsStr(e.target.value)}
                  placeholder="e.g. Regular:150, Medium:250, Large:350"
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Add-ons (format: Name:Price, Name:Price)
                </label>
                <input
                  type="text"
                  value={addOnsStr}
                  onChange={e => setAddOnsStr(e.target.value)}
                  placeholder="e.g. Extra Cheese:40, Soft Drink:30"
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                />
              </div>

              {/* Product Image Section (Upload file or URL) */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-800 flex items-center space-x-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>Product Image</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Upload photo or paste URL</span>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Image Preview Thumbnail */}
                  <div className="w-16 h-16 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                    {image ? (
                      <img
                        src={image}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* File Upload Button */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Image File</span>
                      </button>
                      {image && (
                        <button
                          type="button"
                          onClick={() => setImage('')}
                          className="text-[11px] font-bold text-rose-600 hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Image URL text input */}
                    <input
                      type="text"
                      value={image}
                      onChange={e => setImage(e.target.value)}
                      placeholder="Or paste direct image URL (https://...)"
                      className="w-full p-1.5 text-[11px] rounded-lg border border-slate-200 bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVeg}
                    onChange={e => setIsVeg(e.target.checked)}
                    className="w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-800">Is Vegetarian (Veg)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={e => setIsBestSeller(e.target.checked)}
                    className="w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-800">Tag as Best-Seller</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setProductToDelete(editingProduct);
                      setShowAddModal(false);
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center space-x-1"
                    title="Delete this product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  {editingProduct ? 'Save Product Changes' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Delete Product?
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to delete <strong>{productToDelete.name}</strong> from {productToDelete.shopName}? Customers will no longer be able to order this item.
            </p>

            <div className="mt-5 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal Simulation */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                Bulk CSV / Excel Product Import
              </h3>
              <button
                onClick={() => setShowBulkUploadModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                Upload products.csv or menu.xlsx
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Columns supported: Name, ShopName, Category, SellingPrice, MRP, Unit, IsVeg.
              </p>

              <div className="mt-4 p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <span className="text-xs font-semibold text-emerald-700">
                  village_grocery_catalog.csv (14.2 KB)
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowBulkUploadModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUploadSimulation}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                Execute Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
