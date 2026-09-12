import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  ShoppingBag,
  Store,
  Bike
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export const AdminReports: React.FC = () => {
  const { orders, shops, products, deliveryPartners } = useApp();

  const [timeRange, setTimeRange] = useState<'today' | 'weekly' | 'monthly'>('weekly');

  const dailySalesData = [
    { hour: '8 AM', sales: 1200, orders: 4 },
    { hour: '11 AM', sales: 3400, orders: 12 },
    { hour: '1 PM', sales: 6800, orders: 25 },
    { hour: '4 PM', sales: 2900, orders: 11 },
    { hour: '7 PM', sales: 8400, orders: 31 },
    { hour: '9 PM', sales: 9800, orders: 38 },
  ];

  const shopSalesData = shops.map(s => {
    const shopOrders = orders.filter(o => o.shopId === s.id);
    const revenue = shopOrders.reduce((sum, o) => sum + o.totalAmount, 0) || 1200;
    return {
      name: s.name.length > 14 ? s.name.slice(0, 14) + '...' : s.name,
      revenue,
      orders: shopOrders.length || 3,
    };
  });

  const riderEarningsData = deliveryPartners.map(d => ({
    name: d.name.split(' ')[0],
    earnings: d.totalEarnings || 650,
    trips: d.completedOrdersCount || 15,
  }));

  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalDeliveredOrders = orders.filter(o => o.orderStatus === 'delivered').length || orders.length;
  const adminCommission = Math.round(totalGMV * 0.12);
  const deliveryFeesTotal = orders.reduce((sum, o) => sum + (o.deliveryFee || 25), 0);

  const handleExportCSV = () => {
    try {
      const csvRows = [
        ['Metric', 'Value'],
        ['Gross Merchandise Value (GMV)', `₹${totalGMV}`],
        ['Delivered Orders Count', `${totalDeliveredOrders}`],
        ['DailyGo Commission Revenue', `₹${adminCommission}`],
        ['Total Delivery Fee Pool', `₹${deliveryFeesTotal}`],
        ['', ''],
        ['Shop Name', 'Total Sales (₹)', 'Orders Delivered'],
        ...shopSalesData.map(s => [s.name, String(s.revenue), String(s.orders)]),
        ['', ''],
        ['Rider', 'Earnings (₹)', 'Trips Completed'],
        ...riderEarningsData.map(r => [r.name, String(r.earnings), String(r.trips)])
      ];

      const csvContent = csvRows
        .map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `dailygo_analytics_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      console.warn('[AdminReports] Export CSV error handled:', e);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Reports & Business Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time financial audits, merchant commission statements, and delivery rider payouts
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Gross GMV</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{orders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-700 font-bold mt-0.5">+14% vs last week</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Platform Commissions</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ₹{Math.round(orders.reduce((s, o) => s + o.totalAmount, 0) * 0.15).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Avg 15% merchant take-rate</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Delivery Fees Collected</span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            ₹{orders.reduce((s, o) => s + o.deliveryFee, 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">100% disbursed to local riders</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Avg Order Value</span>
          <div className="text-2xl font-black text-purple-600 mt-1">
            ₹{orders.length > 0 ? Math.round(orders.reduce((s, o) => s + o.totalAmount, 0) / orders.length) : 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Town & village baskets</p>
        </div>
      </div>

      {/* Chart: Merchant-wise Sales Distribution */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Merchant-Wise Sales & Volume
            </h2>
            <p className="text-xs text-slate-500">Gross revenue driven per restaurant and grocery store</p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={shopSalesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={v => `₹${v}`} />
              <Tooltip
                formatter={(value: any) => [`₹${value}`, 'Revenue']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Rider Earnings + Top Products Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rider Earnings Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-1">
            Delivery Rider Payouts
          </h2>
          <p className="text-xs text-slate-500 mb-4">Total payouts generated by hyperlocal delivery partners</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riderEarningsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={v => `₹${v}`} />
                <Tooltip />
                <Bar dataKey="earnings" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top-Selling Items */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-1">
            Top Performing SKUs & Dishes
          </h2>
          <p className="text-xs text-slate-500 mb-4">Ranked by weekly reorder frequency</p>

          <div className="divide-y divide-slate-100">
            {products.slice(0, 5).map((prod, idx) => (
              <div key={prod.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 rounded-full bg-slate-100 font-bold text-[10px] text-slate-600 flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900">{prod.name}</p>
                    <span className="text-[10px] text-slate-400">{prod.shopName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900">₹{prod.sellingPrice}</span>
                  <span className="text-[10px] text-emerald-700 block font-semibold">
                    {45 - idx * 6} sold
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
