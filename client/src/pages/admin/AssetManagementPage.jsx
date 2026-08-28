import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import {
  Package,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  BookOpen,
  Tag,
  Building,
} from 'lucide-react';

const AssetManagementPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    assetName: '',
    category: 'Textbook',
    assetCode: '',
    quantity: 50,
    assignedLocation: 'Main Textbook Store',
    condition: 'Good',
    unitCost: 180,
  });

  const loadAssets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/modules/assets');
      if (res.data?.success) setAssets(res.data.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/modules/assets', formData);
      if (res.data?.success) {
        setMessage('Asset recorded successfully in school inventory!');
        setModalOpen(false);
        setFormData({
          assetName: '',
          category: 'Textbook',
          assetCode: '',
          quantity: 50,
          assignedLocation: 'Main Textbook Store',
          condition: 'Good',
          unitCost: 180,
        });
        await loadAssets();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record asset.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Asset & Textbook Inventory (የትምህርት ቤት ንብረት አስተዳደር)"
      subtitle="School property, curriculum textbook distribution, and furniture tracking"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Institutional Inventory</h2>
              <span className="text-xs text-slate-500">{assets.length} Item Categories</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Asset Item</span>
          </button>
        </div>

        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Loading inventory...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold uppercase tracking-wider font-mono">
                      {item.assetCode}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {item.condition} Condition
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{item.assetName}</h3>
                  <div className="text-xs font-semibold text-slate-500">
                    Category: <strong className="text-slate-800">{item.category}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-1 border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">In Stock:</span>
                      <span className="font-bold text-slate-900">{item.quantity} Units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-medium text-slate-800">{item.assignedLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Estimated Unit Cost:</span>
                      <span className="font-semibold text-blue-700">{item.unitCost} ETB</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  Registered: {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Add Asset */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Record Asset / Textbook</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAsset} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Asset / Book Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grade 7 English Textbooks"
                    value={formData.assetName}
                    onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Asset Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TXT-G7-ENG-01"
                      value={formData.assetCode}
                      onChange={(e) =>
                        setFormData({ ...formData, assetCode: e.target.value.toUpperCase() })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Textbook">Textbook</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Laboratory">Laboratory</option>
                      <option value="Sports">Sports</option>
                      <option value="IT Equipment">IT Equipment</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Quantity (Units)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.assignedLocation}
                      onChange={(e) =>
                        setFormData({ ...formData, assignedLocation: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold"
                  >
                    Save Asset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AssetManagementPage;
