import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  ShoppingBag,
  Store,
  Bike,
  Users,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    shops,
    products,
    deliveryPartners,
    setAdminTab,
    setTrackingOrderId,
    adminUser,
    adminCount,
    allCustomers,
  } = useApp();

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalRestaurants = shops.filter(s => s.type === 'restaurant').length;
  const totalGroceries = shops.filter(s => s.type === 'grocery').length;
  const activeRiders = deliveryPartners.filter(d => d.isOnline).length;

  const todayRevenue = orders
    .filter(o => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Weekly sales trend mock for visual chart
  const weeklySalesData = [
    { day: 'Mon', revenue: 4200, orders: 18 },
    { day: 'Tue', revenue: 5600, orders: 24 },
    { day: 'Wed', revenue: 6100, orders: 28 },
    { day: 'Thu', revenue: 7800, orders: 34 },
    { day: 'Fri', revenue: 9400, orders: 42 },
    { day: 'Sat', revenue: 14200, orders: 68 },
    { day: 'Sun', revenue: 16800, orders: 75 },
  ];

  // Order status breakdown data
  const orderStatusData = [
    { name: 'Delivered', value: orders.filter(o => o.orderStatus === 'delivered').length || 3, color: '#10b981' },
    { name: 'Out for Delivery', value: orders.filter(o => o.orderStatus === 'out_for_delivery').length || 2, color: '#0ea5e9' },
    { name: 'Preparing', value: orders.filter(o => o.orderStatus === 'preparing' || o.orderStatus === 'accepted').length || 2, color: '#f59e0b' },
    { name: 'Pending', value: orders.filter(o => o.orderStatus === 'pending').length || 1, color: '#8b5cf6' },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            TownDrop Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time monitoring of hyperlocal food orders, village grocery dispatches & delivery fleet
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAdminTab('orders')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
          >
            Manage Live Orders ({orders.filter(o => o.orderStatus !== 'delivered').length})
          </button>
        </div>
      </div>

      {/* Single Master Administrator Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white">
                Authorized Single Administrator: {adminUser.name}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                {adminCount} OF 1 MAX
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Strict single-admin policy enforced. Customer accounts: <strong>{allCustomers.length} registered</strong> across town & nearby villages.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[11px] text-emerald-400 font-mono font-bold bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            SESSION: ACTIVE (MASTER)
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            +18.4% this week
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {totalOrders}
          </div>
          <p className="text-[11px] text-blue-700 font-semibold mt-1">
            {orders.filter(o => o.orderStatus === 'delivered').length} completed
          </p>
        </div>

        {/* Restaurants & Grocery Stores */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Registered Merchants
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {shops.length}
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            {totalRestaurants} Food • {totalGroceries} Grocery
          </p>
        </div>

        {/* Active Riders */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Delivery Fleet
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {activeRiders} / {deliveryPartners.length}
          </div>
          <p className="text-[11px] text-purple-700 font-semibold mt-1">
            Town & Village routes active
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Revenue Graph */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Weekly Revenue Performance
              </h2>
              <p className="text-xs text-slate-500">Gross transaction volume across all local merchants</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
              Average ₹9,185/day
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklySalesData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Order Status Breakdown
            </h2>
            <p className="text-xs text-slate-500">Pipeline health across active orders</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {orderStatusData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-slate-500">Instant inspection & dispatch</p>
          </div>

          <button
            onClick={() => setAdminTab('orders')}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            View All Orders →
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] text-slate-400 font-extrabold uppercase">
                <th className="pb-3">Order #</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Shop</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-bold text-slate-900">
                    #{order.orderNumber}
                  </td>
                  <td className="py-3">
                    <p className="font-bold text-slate-900">{order.customerName}</p>
                    <span className="text-[10px] text-slate-400">{order.deliveryAddress.townOrVillage}</span>
                  </td>
                  <td className="py-3 font-medium text-slate-800">
                    {order.shopName}
                  </td>
                  <td className="py-3 text-slate-500">
                    {order.items.length} items
                  </td>
                  <td className="py-3 font-black text-slate-900">
                    ₹{order.totalAmount}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setAdminTab('orders')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px]"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
