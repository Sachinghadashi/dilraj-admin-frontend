import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  Filter,
  Search,
  ChevronDown,
  PackageSearch
} from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    
    // UI State for expanded order details
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const statusOptions = ['All', 'Placed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/orders');
            setOrders(data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders", error);
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const { data } = await api.put(`/orders/${orderId}/status`, 
                { status: newStatus }
            );
            
            // Update local state without hard-refetching
            setOrders(orders.map(order => {
                if (order._id === orderId) {
                    return data.data; // Server returns the fully updated order doc
                }
                return order;
            }));
            setUpdatingId(null);
            
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update order status");
            setUpdatingId(null);
        }
    };

    const toggleOrderDetails = (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
        }
    };

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'All' || order.orderStatus === filterStatus;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
            order.orderId.toLowerCase().includes(searchLower) ||
            order.customerId.name.toLowerCase().includes(searchLower) ||
            order.deliveryAddress.area.toLowerCase().includes(searchLower) ||
            order.deliveryAddress.contactNumber.includes(searchTerm);
            
        return matchesStatus && matchesSearch;
    });

    // Helper component for Status Badges
    const StatusBadge = ({ status }) => {
        // Icon mapping
        const icons = {
            'Placed': <Clock size={14} />,
            'Processing': <PackageSearch size={14} />,
            'Out for Delivery': <Truck size={14} />,
            'Delivered': <CheckCircle size={14} />,
            'Cancelled': <XCircle size={14} />
        };
        
        // Color mapping
        const colors = {
            'Placed': 'bg-blue-50 text-blue-700 border-blue-200',
            'Processing': 'bg-orange-50 text-orange-700 border-orange-200',
            'Out for Delivery': 'bg-purple-50 text-purple-700 border-purple-200',
            'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'Cancelled': 'bg-red-50 text-red-700 border-red-200'
        };

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${colors[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                {icons[status]} {status}
            </span>
        );
    };

    return (
        <div className="h-full flex flex-col space-y-6 animate-fade-in-up">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                   <h1 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-3">
                       <ShoppingBag className="text-emerald-500 w-8 h-8" /> 
                       E-Commerce Orders
                   </h1>
                   <p className="text-slate-500 mt-1 font-medium">Track local deliveries and manage Blinkit-style incoming requests.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative group w-full sm:w-64">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                            <Search className="h-5 w-5" />
                         </div>
                         <input
                            type="text"
                            placeholder="Search order ID, name, phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
                         />
                    </div>
                    
                    {/* Status Filter */}
                    <div className="relative">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full sm:w-48 appearance-none pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer shadow-sm"
                        >
                            {statusOptions.map(status => (
                                <option key={status} value={status}>{status === 'All' ? 'All Orders' : status}</option>
                            ))}
                        </select>
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Orders Feed */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 pb-10">
                {loading ? (
                    // Loading Skeletons
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 border-l-4 border-l-slate-300 p-6 animate-pulse">
                            <div className="flex justify-between items-start mb-4">
                                <div><div className="h-5 bg-slate-200 rounded w-48 mb-2"></div><div className="h-4 bg-slate-100 rounded w-32"></div></div>
                                <div className="h-8 bg-slate-200 rounded-full w-24"></div>
                            </div>
                            <div className="border-t border-slate-100 pt-4 flex gap-6">
                                <div className="h-10 bg-slate-100 rounded w-32"></div>
                                <div className="h-10 bg-slate-100 rounded w-32"></div>
                            </div>
                        </div>
                    ))
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-16 text-slate-400">
                        <ShoppingBag className="w-16 h-16 mb-4 text-slate-300" />
                        <h3 className="text-xl font-bold text-slate-700 mb-1">No Orders Found</h3>
                        <p className="font-medium">No online orders match your current filters.</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => {
                        const date = new Date(order.createdAt).toLocaleString('en-IN', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        });
                        
                        // Status mapping for dropdown logic
                        const isTerminalState = order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled';
                        const statusFlow = ['Placed', 'Processing', 'Out for Delivery', 'Delivered'];
                        const nextStatus = statusFlow[statusFlow.indexOf(order.orderStatus) + 1];

                        return (
                            <div key={order._id} className={`bg-white rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden ${
                                expandedOrder === order._id ? 'border-emerald-300 border-l-4 border-l-emerald-500' : 'border-slate-200 hover:border-slate-300 border-l-4 border-l-slate-400'
                            }`}>
                                {/* Order List Header Summary (Always Visible) */}
                                <div 
                                    className="p-5 sm:p-6 cursor-pointer flex flex-col lg:flex-row justify-between lg:items-center gap-4"
                                    onClick={() => toggleOrderDetails(order._id)}
                                >
                                    {/* Left Info: ID, Date, Customer */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                                            <ShoppingBag className="text-slate-500" size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-extrabold text-slate-800 text-lg">{order.orderId}</h3>
                                                <span className="text-xs font-semibold text-slate-400">({date})</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
                                                <span>{order.customerId.name}</span>
                                                <span className="flex items-center gap-1"><MapPin size={14} className="text-emerald-500"/> {order.deliveryAddress.area}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Info: Financials & Status */}
                                    <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                                        <div className="flex flex-col lg:items-end">
                                            <span className="font-black text-xl text-slate-800">₹{order.totalPrice.toFixed(2)}</span>
                                            <span className={`text-xs font-bold flex items-center gap-1 ${order.paymentStatus === 'Completed' ? 'text-emerald-600' : 'text-orange-500'}`}>
                                                {order.paymentMethod} {order.paymentStatus === 'Completed' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <StatusBadge status={order.orderStatus} />
                                            <ChevronDown className={`text-slate-400 transition-transform duration-300 ${expandedOrder === order._id ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Order Details Drawer (Expands on click) */}
                                {expandedOrder === order._id && (
                                    <div className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-6 animate-fade-in-up">
                                        
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            
                                            {/* Column 1: Items List */}
                                            <div className="lg:col-span-2">
                                                <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Item Breakdown</h4>
                                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                                                        <thead className="bg-slate-50">
                                                            <tr>
                                                                <th className="px-4 py-3 text-left font-semibold text-slate-500">Item</th>
                                                                <th className="px-4 py-3 text-center font-semibold text-slate-500">Qty</th>
                                                                <th className="px-4 py-3 text-right font-semibold text-slate-500">Price/Unit</th>
                                                                <th className="px-4 py-3 text-right font-semibold text-slate-500 shadow-xl">Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {order.products.map((item, idx) => (
                                                                <tr key={idx}>
                                                                    <td className="px-4 py-3 font-medium text-slate-800">{item.productName}</td>
                                                                    <td className="px-4 py-3 text-center text-slate-600 font-bold">{item.quantity}</td>
                                                                    <td className="px-4 py-3 text-right text-slate-500">₹{item.price}</td>
                                                                    <td className="px-4 py-3 text-right font-bold text-slate-700">₹{item.total}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot className="bg-slate-50/80">
                                                            <tr>
                                                                <td colSpan="3" className="px-4 py-3 text-right font-bold text-slate-500">Grand Total</td>
                                                                <td className="px-4 py-3 text-right font-black text-emerald-600 text-base">₹{order.totalPrice.toFixed(2)}</td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* Column 2: Logistics & Status Control */}
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">Delivery Details</h4>
                                                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-sm text-slate-600">
                                                        <p className="font-bold text-slate-800">{order.customerId.name}</p>
                                                        <p className="flex items-start gap-2"><MapPin size={16} className="text-slate-400 mt-0.5 shrink-0"/> {order.deliveryAddress.addressLine1},<br/>{order.deliveryAddress.area}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}</p>
                                                        <p className="pt-2 border-t border-slate-100 font-medium">📞 {order.deliveryAddress.contactNumber}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">Update Order Status</h4>
                                                    
                                                    {isTerminalState ? (
                                                        <div className={`p-4 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 ${order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                            {order.orderStatus === 'Delivered' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                                            Order {order.orderStatus}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col gap-2">
                                                            {/* Primary progression button */}
                                                            {nextStatus && (
                                                                <button
                                                                    onClick={() => updateStatus(order._id, nextStatus)}
                                                                    disabled={updatingId === order._id}
                                                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-70"
                                                                >
                                                                    {updatingId === order._id ? (
                                                                        <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                                                    ) : (
                                                                        <>Mark as {nextStatus}</>
                                                                    )}
                                                                </button>
                                                            )}
                                                            
                                                            {/* Cancel Button */}
                                                            <button
                                                                onClick={() => {
                                                                    if(window.confirm('Are you sure you want to cancel this order?')) {
                                                                        updateStatus(order._id, 'Cancelled');
                                                                    }
                                                                }}
                                                                disabled={updatingId === order._id}
                                                                className="w-full bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 font-bold py-2.5 px-4 rounded-xl transition-all text-sm mt-1"
                                                            >
                                                                Cancel Order
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Orders;
