'use client';

import { useState } from 'react';
import { apiFetch } from '@/services/api';
import { PurchaseRequest } from '@/types';

interface Props {
  request: PurchaseRequest | null;
  onClose: () => void;
  onUpdated: (updated: PurchaseRequest) => void;
}

export default function RequestModal({ request, onClose, onUpdated }: Props) {
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  if (!request) return null;

  const latestAiReview = request.ai_reviews && request.ai_reviews.length > 0
    ? request.ai_reviews[request.ai_reviews.length - 1]
    : null;

  async function handleGenerateAi() {
    if (!request) return;
    setLoadingAi(true);
    try {
      await apiFetch(`/purchase-requests/${request.id}/review`, { method: 'POST' });
      const refreshed = await apiFetch<PurchaseRequest>(`/purchase-requests/${request.id}`);
      onUpdated(refreshed);
    } catch (err: any) {
      alert(err.message || 'Erro ao gerar parecer de IA');
    } finally {
      setLoadingAi(false);
    }
  }

  async function handleStatusChange(status: string) {
    if (!request) return;
    setLoadingStatus(true);
    try {
      const updated = await apiFetch<PurchaseRequest>(`/purchase-requests/${request.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      onUpdated(updated);
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar status');
    } finally {
      setLoadingStatus(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">{request.item_name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>

        <div className="space-y-3 text-sm text-gray-700">
          <div><span className="font-semibold">Quantidade:</span> {request.quantity}</div>
          <div><span className="font-semibold">Solicitante:</span> {request.requester_name}</div>
          <div><span className="font-semibold">Justificativa:</span> {request.justification}</div>
          <div><span className="font-semibold">Status:</span> <span className="capitalize">{request.status}</span></div>

          {request.supplier && (
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <div className="font-semibold text-gray-900 mb-1">Fornecedor Vinculado:</div>
              <div>{request.supplier.name} ({request.supplier.email})</div>
              {request.supplier.category && <div>Categoria: {request.supplier.category}</div>}
            </div>
          )}

          <div className="border-t pt-3">
            <div className="font-semibold text-gray-900 mb-2">Parecer de IA:</div>
            {latestAiReview ? (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase text-blue-900">Prioridade:</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-blue-200 text-blue-800">
                    {latestAiReview.priority}
                  </span>
                </div>
                <p className="text-xs text-blue-950 mt-1">{latestAiReview.summary_text}</p>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">Nenhum parecer gerado até ao momento.</p>
            )}

            <button
              onClick={handleGenerateAi}
              disabled={loadingAi}
              className="mt-3 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-semibold disabled:opacity-50"
            >
              {loadingAi ? 'A processar com IA...' : 'Gerar parecer com IA'}
            </button>
          </div>

          <div className="border-t pt-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Alterar Status:</label>
            <div className="flex gap-2">
              {(['pendente', 'aprovado', 'rejeitado'] as const).map((st) => (
                <button
                  key={st}
                  disabled={loadingStatus || request.status === st}
                  onClick={() => handleStatusChange(st)}
                  className={`px-3 py-1 rounded text-xs capitalize border ${
                    request.status === st ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}