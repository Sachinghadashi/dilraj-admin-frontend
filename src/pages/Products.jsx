import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { 
  PackageSearch, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowUpDown,
  Search,
  X,
  Save,
  Barcode
} from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    
    // Form State
    const [formData, setFormData] = useState({
        _id: '',
        productName: '',
        barcode: '',
        price: '',
        mrp: '',
        stock: '',
        category: 'Other',
        description: ''
    });

    const [message, setMessage] = useState({ type: '', text: '' }); // success or error
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = ['Groceries', 'Beverages', 'Personal Care', 'Household', 'Snacks', 'Dairy', 'Other'];

    // Initial Load - Mocking a network request for demo purposes if backend isn't populated
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/products');
            setProducts(data.data);
            setProducts(data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products", error);
            setMessage({ type: 'error', text: 'Failed to load products.' });
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const openModal = (mode, product = null) => {
        setMessage({ type: '', text: '' });
        setModalMode(mode);
        if (mode === 'edit' && product) {
            setFormData(product);
        } else {
            // Reset for Add
            setFormData({
                _id: '', productName: '', barcode: '', price: '', mrp: '', stock: '', category: 'Other', description: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            // Validation
            if (Number(formData.price) > Number(formData.mrp)) {
                setMessage({ type: 'error', text: 'Selling price cannot be higher than MRP' });
                setIsSubmitting(false);
                return;
            }

            if (modalMode === 'add') {
                const { data } = await api.post('/products', formData);
                setProducts([data.data, ...products]);
                setMessage({ type: 'success', text: 'Product added successfully!' });
                setIsSubmitting(false);
                setTimeout(() => setIsModalOpen(false), 1000);
            } else {
                const { data } = await api.put(`/products/${formData._id}`, formData);
                setProducts(products.map(p => p._id === formData._id ? data.data : p));
                setMessage({ type: 'success', text: 'Product updated successfully!' });
                setIsSubmitting(false);
                setTimeout(() => setIsModalOpen(false), 1000);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Operation failed' });
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
             try {
                 await api.delete(`/products/${id}`);
                 setProducts(products.filter(p => p._id !== id));
             } catch (error) {
                 alert('Failed to delete product');
             }
        }
    };

    // Filter logic for search bar
    const filteredProducts = products.filter(p => 
        p.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.barcode.includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col space-y-6 animate-fade-in-up">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                   <h1 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-3">
                       <PackageSearch className="text-blue-600 w-8 h-8" /> 
                       Inventory Master
                   </h1>
                   <p className="text-slate-500 mt-1 font-medium">Manage your {products.length} store items, pricing, and stock limits.</p>
                </div>
                
                <div className="flex gap-4">
                    <div className="relative group w-full md:w-64">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <Search className="h-5 w-5" />
                         </div>
                         <input
                            type="text"
                            placeholder="Search name, barcode, category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                         />
                    </div>
                    
                    <button 
                        onClick={() => openModal('add')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={20} />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Inventory Table Container */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left font-bold text-slate-500 uppercase tracking-wider text-xs flex items-center gap-2 cursor-pointer hover:text-slate-700 group">
                                    Product Info <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </th>
                                <th scope="col" className="px-6 py-4 text-left font-bold text-slate-500 uppercase tracking-wider text-xs">Stock</th>
                                <th scope="col" className="px-6 py-4 text-left font-bold text-slate-500 uppercase tracking-wider text-xs">Price</th>
                                <th scope="col" className="px-6 py-4 text-right font-bold text-slate-500 uppercase tracking-wider text-xs">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {loading ? (
                                // Loading Skeletons
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-5 whitespace-nowrap"><div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div><div className="h-3 bg-slate-100 rounded w-1/2"></div></td>
                                        <td className="px-6 py-5 whitespace-nowrap"><div className="h-4 bg-slate-200 rounded w-12"></div></td>
                                        <td className="px-6 py-5 whitespace-nowrap"><div className="h-4 bg-slate-200 rounded w-16 mb-1"></div><div className="h-3 bg-slate-100 rounded w-10"></div></td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right"><div className="h-8 bg-slate-200 rounded w-20 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <PackageSearch className="w-12 h-12 mb-3 text-slate-300" />
                                            <p className="text-lg font-medium text-slate-500">No products found</p>
                                            <p className="text-sm">Try adjusting your search or add a new product.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 text-sm md:text-base">{product.productName}</span>
                                                <div className="flex items-center gap-3 mt-1 text-xs">
                                                    <span className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                                                        <Barcode size={10} /> {product.barcode}
                                                    </span>
                                                    <span className="text-blue-500 font-medium">{product.category}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                                product.stock <= 10 
                                                    ? 'bg-red-50 text-red-700 border-red-200' 
                                                    : product.stock <= 25 
                                                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            }`}>
                                                {product.stock} units
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-800">₹{product.price}</span>
                                                <span className="text-xs text-slate-400 line-through">MRP: ₹{product.mrp}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => openModal('edit', product)}
                                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800 border border-blue-200 p-2 rounded-lg transition-colors"
                                                    title="Edit Product"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product._id, product.productName)}
                                                    className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 border border-red-200 p-2 rounded-lg transition-colors"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Unified Add/Edit Modal overlaying the screen securely */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    
                    {/* Background Backdrop */}
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        
                        {/* Modal Panel */}
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl shadow-blue-900/20 transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full border border-slate-200">
                            
                            {/* Modal Header */}
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="text-xl leading-6 font-bold text-slate-800" id="modal-title">
                                    {modalMode === 'add' ? 'Add New Product' : 'Edit Product Details'}
                                </h3>
                                <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-100 rounded-lg p-1" onClick={() => setIsModalOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body / Form */}
                            <form onSubmit={handleSubmit} className="px-6 py-6 overflow-hidden">
                                
                                {message.text && (
                                    <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
                                        message.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    }`}>
                                        <div className="mt-0.5">{message.type === 'error' ? <X size={18} /> : <Save size={18}/>}</div>
                                        <p className="font-medium text-sm">{message.text}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    {/* Product Name */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="productName" className="block text-sm font-semibold text-slate-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                                        <input type="text" name="productName" id="productName" required
                                            value={formData.productName} onChange={handleInputChange}
                                            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="e.g. Parle-G Original 800g"
                                        />
                                    </div>

                                    {/* Barcode */}
                                    <div>
                                        <label htmlFor="barcode" className="block text-sm font-semibold text-slate-700 mb-1">Barcode / SKU <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input type="text" name="barcode" id="barcode" required
                                                value={formData.barcode} onChange={handleInputChange}
                                                className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                                                placeholder="Scan or type..."
                                            />
                                            <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-1">Category <span className="text-red-500">*</span></label>
                                        <select name="category" id="category" required
                                            value={formData.category} onChange={handleInputChange}
                                            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all appearance-none"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-1">Selling Price (₹) <span className="text-red-500">*</span></label>
                                        <input type="number" name="price" id="price" required min="0" step="0.01"
                                            value={formData.price} onChange={handleInputChange}
                                            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                                        />
                                    </div>

                                    {/* MRP */}
                                    <div>
                                        <label htmlFor="mrp" className="block text-sm font-semibold text-slate-700 mb-1">M.R.P (₹) <span className="text-red-500">*</span></label>
                                        <input type="number" name="mrp" id="mrp" required min="0" step="0.01"
                                            value={formData.mrp} onChange={handleInputChange}
                                            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                                        />
                                    </div>

                                    {/* Stock */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="stock" className="block text-sm font-semibold text-slate-700 mb-1">Initial Stock Quantity <span className="text-red-500">*</span></label>
                                        <input type="number" name="stock" id="stock" required min="0"
                                            value={formData.stock} onChange={handleInputChange}
                                            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                                            placeholder="Number of units in warehouse"
                                        />
                                    </div>

                                </div>

                                {/* Modal Actions */}
                                <div className="mt-8 pt-5 border-t border-slate-200 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-white text-slate-600 hover:bg-slate-50 border border-slate-300 px-5 py-2.5 rounded-xl font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                 <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                                 Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                {modalMode === 'add' ? 'Save Product' : 'Update Record'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
