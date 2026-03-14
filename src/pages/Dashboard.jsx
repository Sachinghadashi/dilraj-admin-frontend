import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { 
    TrendingUp, 
    CreditCard, 
    Users, 
    BarChart3, 
    ArrowUpRight,
    ShoppingBag
} from 'lucide-react';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    todayRevenue: 0,
    todayBills: 0,
    totalRevenue: 0,
    totalBills: 0
  });
  const [topCashiers, setTopCashiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, cashiersRes] = await Promise.all([
            api.get('/reports/summary'),
            api.get('/reports/cashier-performance')
        ]);

        setSummary(summaryRes.data.data);
        setTopCashiers(cashiersRes.data.data.slice(0, 3)); // Display top 3
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { 
      title: "Today's Revenue", 
      value: `₹${summary.todayRevenue.toLocaleString()}`, 
      icon: <TrendingUp className="text-blue-500 w-6 h-6" />, 
      change: "+12.5%",
      color: "bg-blue-50" 
    },
    { 
      title: "Today's Bills", 
      value: summary.todayBills, 
      icon: <CreditCard className="text-emerald-500 w-6 h-6" />, 
      change: "+5.2%",
      color: "bg-emerald-50" 
    },
    { 
      title: "Total Lifetime Revenue", 
      value: `₹${(summary.totalRevenue / 1000).toFixed(1)}K`, 
      icon: <BarChart3 className="text-purple-500 w-6 h-6" />, 
      change: "+2.1%",
      color: "bg-purple-50" 
    },
    { 
      title: "Total Lifetime Bills", 
      value: summary.totalBills.toLocaleString(), 
      icon: <ShoppingBag className="text-orange-500 w-6 h-6" />, 
      change: "+1.9%",
      color: "bg-orange-50" 
    },
  ];

  const handleExportReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add Summary Section
    csvContent += "Admin Dashboard Summary\n";
    csvContent += "Metric,Value\n";
    csvContent += `Today's Revenue,${summary.todayRevenue}\n`;
    csvContent += `Today's Bills,${summary.todayBills}\n`;
    csvContent += `Total Revenue,${summary.totalRevenue}\n`;
    csvContent += `Total Bills,${summary.totalBills}\n\n`;

    // Add Top Cashiers Section
    csvContent += "Top Performing Cashiers\n";
    csvContent += "Cashier Name,Revenue Generated\n";
    topCashiers.forEach(c => {
        csvContent += `"${c.cashierName}",${c.totalRevenueGenerated}\n`;
    });

    // Create Download Link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `store_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-800">Admin Overview</h1>
           <p className="text-slate-500 mt-1 font-medium">Welcome back, check your store's performance metrics.</p>
        </div>
        <button 
            onClick={handleExportReport}
            className="bg-white border shadow-sm px-4 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition flex items-center gap-2 active:scale-95"
        >
            <ArrowUpRight size={18} />
            Export Report
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse h-36"></div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start">
                        <div className={`p-3 rounded-xl ${stat.color} bg-opacity-80`}>
                            {stat.icon}
                        </div>
                        <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                            {stat.change}
                        </span>
                    </div>
                    <div className="mt-5">
                        <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{stat.value}</h3>
                        <p className="text-slate-500 text-sm font-medium mt-1">{stat.title}</p>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* Decorative Chart Area Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-2xl shadow-sm p-6 relative overflow-hidden h-96">
              <h3 className="text-lg font-bold text-slate-800 mb-6 font-display">Revenue Analytics</h3>
              {/* Dummy decorative elements simulating a graph curve */}
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-blue-50 to-transparent flex items-end opacity-50">
                  <svg viewBox="0 0 1000 200" className="w-full text-blue-500 drop-shadow-lg" preserveAspectRatio="none" style={{height: '100px'}}>
                      <path d="M0,50 C150,150 250,0 400,80 C600,160 800,20 1000,100 L1000,200 L0,200 Z" stroke="currentColor" fill="currentColor" strokeWidth="4"></path>
                  </svg>
              </div>
          </div>
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-6 h-96">
              <h3 className="text-lg font-bold text-slate-800 mb-6 font-display">Top Cashiers</h3>
              <div className="space-y-4">
                  {topCashiers.length > 0 ? topCashiers.map((c, i) => (
                      <div key={c._id} className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${['bg-blue-500', 'bg-emerald-500', 'bg-orange-500'][i] || 'bg-slate-500'}`}>
                              {c.cashierName ? c.cashierName.charAt(0) : '?'}
                          </div>
                          <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                  <span className="font-semibold text-sm text-slate-700">{c.cashierName}</span>
                                  <span className="font-bold text-sm text-slate-900">₹{c.totalRevenueGenerated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                  <div className={`h-2 rounded-full ${['bg-blue-500', 'bg-emerald-500', 'bg-orange-500'][i] || 'bg-slate-500'}`} style={{width: `${(Math.max(10, (topCashiers[0].totalRevenueGenerated ? (c.totalRevenueGenerated / topCashiers[0].totalRevenueGenerated) * 100 : 0)))}%`}}></div>
                              </div>
                          </div>
                      </div>
                  )) : (
                      <div className="text-slate-400 text-sm text-center py-6">No cashier data yet.</div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
