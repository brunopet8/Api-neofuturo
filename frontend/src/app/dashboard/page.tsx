'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { apiFetch } from '@/services/api';
import { PurchaseRequest } from '@/types';
import CreateRequestModal from '@/components/CreateRequestModal';
import SupplierModal from '@/components/SupplierModal';
import RequestModal from '@/components/RequestModal';

export default function DashboardPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [openSupplierModal, setOpenSupplierModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const query = statusFilter ? `?status=${statusFilter}` : '';
      const data = await apiFetch<PurchaseRequest[]>(`/purchase-requests${query}`);
      setRequests(data);
    } catch {
      Cookies.remove('token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, router]);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadRequests();
  }, [loadRequests, router]);

  function handleLogout() {
    Cookies.remove('token');
    router.push('/login');
  }

  function getPriorityBadge(req: PurchaseRequest) {
    const review = req.ai_reviews && req.ai_reviews.length > 0
      ? req.ai_reviews[req.ai_reviews.length - 1]
      : null;

    if (!review) return null;

    const colors: Record<string, string> = {
      alta: 'bg-red-100 text-red-700 border-red-200',
      media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      baixa: 'bg-green-100 text-green-700 border-green-200',
    };

    return (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${colors[review.priority] || 'bg-gray-100'}`}>
        Prioridade {review.priority}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Gestão de Compras</h1>
        <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
          Sair
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filtrar status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm bg-white text-gray-900"
            >
              <option value="">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="aprovado">Aprovado</option>
              <option value="rejeitado">Rejeitado</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setOpenSupplierModal(true)}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm font-medium"
            >
              + Novo Fornecedor
            </button>
            <button
              onClick={() => setOpenRequestModal(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
            >
              + Nova Solicitação
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">A carregar solicitações...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-10 bg-white border rounded text-gray-500">
            Nenhuma solicitação encontrada.
          </div>
        ) : (
          <div className="bg-white border rounded overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Item</th>
                  <th className="px-4 py-3 text-left font-semibold">Qtd</th>
                  <th className="px-4 py-3 text-left font-semibold">Solicitante</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">IA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800">
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{req.item_name}</td>
                    <td className="px-4 py-3">{req.quantity}</td>
                    <td className="px-4 py-3">{req.requester_name}</td>
                    <td className="px-4 py-3 capitalize">{req.status}</td>
                    <td className="px-4 py-3">{getPriorityBadge(req) || <span className="text-xs text-gray-400">-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <CreateRequestModal
        isOpen={openRequestModal}
        onClose={() => setOpenRequestModal(false)}
        onSuccess={loadRequests}
      />

      <SupplierModal
        isOpen={openSupplierModal}
        onClose={() => setOpenSupplierModal(false)}
        onSuccess={loadRequests}
      />

      <RequestModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onUpdated={(updated) => {
          setSelectedRequest(updated);
          loadRequests();
        }}
      />
    </div>
  );
}