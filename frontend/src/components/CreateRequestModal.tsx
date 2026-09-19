'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';
import { Supplier } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateRequestModal({ isOpen, onClose, onSuccess }: Props) {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [requesterName, setRequesterName] = useState('');
  const [justification, setJustification] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      apiFetch<Supplier[]>('/suppliers')
        .then(setSuppliers)
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiFetch('/purchase-requests', {
        method: 'POST',
        body: JSON.stringify({
          item_name: itemName,
          quantity: Number(quantity),
          requester_name: requesterName,
          justification,
          supplier_id: supplierId || undefined,
        }),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar solicitação');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Nova Solicitação de Compra</h2>
        {error && <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700">Item *</label>
            <input
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full border rounded p-2 text-sm text-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700">Quantidade *</label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border rounded p-2 text-sm text-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700">Solicitante *</label>
            <input
              required
              value={requesterName}
              onChange={(e) => setRequesterName(e.target.value)}
              className="w-full border rounded p-2 text-sm text-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700">Justificativa *</label>
            <textarea
              required
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="w-full border rounded p-2 text-sm text-gray-900"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700">Fornecedor (Opcional)</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full border rounded p-2 text-sm text-gray-900"
            >
              <option value="">Selecione um fornecedor</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category || 'Geral'})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 text-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'A gravar...' : 'Criar Solicitação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}