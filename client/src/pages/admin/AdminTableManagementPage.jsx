import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI, tablesAPI, restaurantsAPI } from '../../services/api';
import { getSocket } from '../../services/socket';
import TableBadge from '../../components/TableBadge';
import {
  Plus,
  Trash2,
  Edit,
  RotateCw,
  Users,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

export const AdminTableManagementPage = () => {
  const [tables, setTables] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [activeFloor, setActiveFloor] = useState('all');

  // Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('4');
  const [floor, setFloor] = useState('Main Dining');
  const [shape, setShape] = useState('square');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchTables = useCallback(async () => {
    try {
      const res = await adminAPI.getDashboard();
      if (res.data.success) {
        setTables(res.data.tables || []);
        setRestaurant(res.data.restaurant || null);
      }
    } catch (err) {
      console.error('Failed to load tables:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();

    const socket = getSocket();
    const handleTablesUpdate = () => {
      fetchTables();
    };

    socket.on('tables:updated', handleTablesUpdate);
    return () => {
      socket.off('tables:updated', handleTablesUpdate);
    };
  }, [fetchTables]);

  const handleStatusChange = async (tableId, status) => {
    try {
      const res = await tablesAPI.updateStatus(tableId, status);
      if (res.data.success) {
        setStatusMessage(`Table status updated to '${status}'.`);
        fetchTables();
        setTimeout(() => setStatusMessage(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleDeleteTable = async (table) => {
    if (
      !window.confirm(
        `Are you sure you want to delete Table ${table.tableNumber}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const res = await tablesAPI.delete(table._id);
      if (res.data.success) {
        setStatusMessage(`Table ${table.tableNumber} deleted successfully.`);
        fetchTables();
        setTimeout(() => setStatusMessage(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete table.');
    }
  };

  const handleOpenAddModal = () => {
    setEditingTable(null);
    setTableNumber(`T-${String(tables.length + 1).padStart(2, '0')}`);
    setCapacity('4');
    setFloor('Main Dining');
    setShape('square');
    setModalError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (table) => {
    setEditingTable(table);
    setTableNumber(table.tableNumber);
    setCapacity(String(table.capacity));
    setFloor(table.floor);
    setShape(table.position?.shape || 'square');
    setModalError('');
    setModalOpen(true);
  };

  const handleSaveTable = async (e) => {
    e.preventDefault();
    if (!restaurant) return;

    setModalLoading(true);
    setModalError('');

    try {
      if (editingTable) {
        const res = await tablesAPI.update(editingTable._id, {
          tableNumber,
          capacity: parseInt(capacity, 10),
          floor,
          position: { ...editingTable.position, shape },
        });
        if (res.data.success) {
          setStatusMessage(`Table ${tableNumber} updated successfully.`);
          setModalOpen(false);
          fetchTables();
          setTimeout(() => setStatusMessage(''), 4000);
        }
      } else {
        const res = await tablesAPI.create({
          restaurantId: restaurant._id || restaurant.id,
          tableNumber,
          capacity: parseInt(capacity, 10),
          floor,
          position: { x: 50, y: 50, shape },
        });
        if (res.data.success) {
          setStatusMessage(`Table ${tableNumber} created successfully.`);
          setModalOpen(false);
          fetchTables();
          setTimeout(() => setStatusMessage(''), 4000);
        }
      }
    } catch (err) {
      setModalError(err.response?.data?.message || err.message || 'Failed to save table.');
    } finally {
      setModalLoading(false);
    }
  };

  const filteredTables =
    activeFloor === 'all' ? tables : tables.filter((t) => t.floor === activeFloor);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-forest-700 dark:text-emerald-400">
            Restaurant Floor Plan & Seating
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mt-1">Table Management</h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Configure floor tables, seat capacities, zones, and real-time statuses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchTables}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-stone-50 dark:hover:bg-forest-950/60 text-stone-700 dark:text-stone-300 shadow-xs transition-colors"
            title="Refresh tables"
          >
            <RotateCw className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            Add Table
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-forest-950/70 border border-emerald-300 dark:border-emerald-600 rounded-2xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Floor Zone Filters */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-4 border border-stone-200 dark:border-dark-border shadow-card dark:shadow-dark-card flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 pr-1">Zone Filter:</span>
          {['all', 'Main Dining', 'VIP Bay', 'Outdoor Terrace'].map((z) => (
            <button
              key={z}
              onClick={() => setActiveFloor(z)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                activeFloor === z
                  ? 'bg-forest-900 dark:bg-forest-700 text-white font-semibold shadow-xs'
                  : 'bg-stone-100 dark:bg-dark-base text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-forest-950/60 border border-transparent dark:border-dark-border'
              }`}
            >
              {z === 'all' ? 'All Tables' : z}
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
          Showing {filteredTables.length} of {tables.length} tables
        </span>
      </div>

      {/* Table Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-44 bg-stone-200 dark:bg-dark-surface rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTables.map((table) => {
            return (
              <div
                key={table._id}
                className="bg-white dark:bg-dark-surface rounded-3xl border border-stone-200 dark:border-dark-border p-5 shadow-card dark:shadow-dark-card hover:shadow-elevated dark:hover:shadow-dark-glow transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-forest-900 dark:bg-forest-950 text-white flex items-center justify-center font-mono font-bold text-sm shadow-sm border border-transparent dark:border-forest-800">
                      {table.tableNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 dark:text-white text-sm">{table.tableNumber}</h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">{table.floor}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(table)}
                      className="p-1.5 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-forest-950/60 transition-colors"
                      title="Edit table"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTable(table)}
                      className="p-1.5 text-stone-400 dark:text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete table"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="flex items-center gap-1 text-stone-600 dark:text-stone-300">
                    <Users className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
                    {table.capacity} Seats ({table.position?.shape || 'square'})
                  </span>
                  <TableBadge status={table.status} size="sm" />
                </div>

                {/* Instant Status Switch Buttons */}
                <div className="pt-2 border-t border-stone-100 dark:border-dark-border grid grid-cols-4 gap-1 text-[10px] font-semibold">
                  <button
                    onClick={() => handleStatusChange(table._id, 'available')}
                    className={`py-1 rounded-md transition-colors ${
                      table.status === 'available'
                        ? 'bg-emerald-600 dark:bg-emerald-500 text-white font-bold'
                        : 'bg-stone-50 dark:bg-dark-base hover:bg-emerald-50 dark:hover:bg-forest-950 text-emerald-800 dark:text-emerald-300 border border-stone-200 dark:border-dark-border'
                    }`}
                  >
                    Avail
                  </button>
                  <button
                    onClick={() => handleStatusChange(table._id, 'held')}
                    className={`py-1 rounded-md transition-colors ${
                      table.status === 'held'
                        ? 'bg-amber-600 dark:bg-amber-500 text-white font-bold'
                        : 'bg-stone-50 dark:bg-dark-base hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-stone-200 dark:border-dark-border'
                    }`}
                  >
                    Held
                  </button>
                  <button
                    onClick={() => handleStatusChange(table._id, 'occupied')}
                    className={`py-1 rounded-md transition-colors ${
                      table.status === 'occupied'
                        ? 'bg-rose-600 dark:bg-rose-500 text-white font-bold'
                        : 'bg-stone-50 dark:bg-dark-base hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-stone-200 dark:border-dark-border'
                    }`}
                  >
                    Occ
                  </button>
                  <button
                    onClick={() => handleStatusChange(table._id, 'reserved')}
                    className={`py-1 rounded-md transition-colors ${
                      table.status === 'reserved'
                        ? 'bg-indigo-600 dark:bg-indigo-500 text-white font-bold'
                        : 'bg-stone-50 dark:bg-dark-base hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-stone-200 dark:border-dark-border'
                    }`}
                  >
                    Res
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Table Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-dark-surface rounded-3xl max-w-md w-full p-6 shadow-2xl dark:shadow-dark-card border border-stone-200 dark:border-dark-border space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-dark-border">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
                {editingTable ? `Edit Table ${editingTable.tableNumber}` : 'Add New Table'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveTable} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Table Number / Identifier
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. T-11"
                  required
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Seating Capacity (Guests)
                </label>
                <select
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="2" className="dark:bg-dark-surface">2 Guests (Small Table)</option>
                  <option value="4" className="dark:bg-dark-surface">4 Guests (Standard Table)</option>
                  <option value="6" className="dark:bg-dark-surface">6 Guests (Family Table)</option>
                  <option value="8" className="dark:bg-dark-surface">8 Guests (Large Table)</option>
                  <option value="12" className="dark:bg-dark-surface">12 Guests (Banquet Table)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">Floor Zone</label>
                <select
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Main Dining" className="dark:bg-dark-surface">Main Dining</option>
                  <option value="VIP Bay" className="dark:bg-dark-surface">VIP Bay</option>
                  <option value="Outdoor Terrace" className="dark:bg-dark-surface">Outdoor Terrace</option>
                  <option value="Window Bay" className="dark:bg-dark-surface">Window Bay</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Visual Shape
                </label>
                <select
                  value={shape}
                  onChange={(e) => setShape(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-dark-base border border-stone-300 dark:border-dark-border rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-forest-600 dark:focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="square" className="dark:bg-dark-surface">Square</option>
                  <option value="round" className="dark:bg-dark-surface">Round</option>
                  <option value="rect" className="dark:bg-dark-surface">Rectangle</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-dark-border text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-forest-950/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
                >
                  {modalLoading ? 'Saving...' : editingTable ? 'Update Table' : 'Add Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTableManagementPage;
