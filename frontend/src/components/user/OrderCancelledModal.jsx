import { useState } from "react";
import { X } from "lucide-react";
import { formatOrderId } from "../../utils/formatters";

export default function OrderCancelledModal({ isOpen, onClose, orderId, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !orderId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-2xl rounded-2xl p-5 shadow-2xl my-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">Cancel Order</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors duration-300">
            <X size={22} />
          </button>
        </div>
        <div>
          <p className="text-lg">Are you sure you want to cancel this order <span className="font-bold text-red-500">({formatOrderId(orderId)})</span>?</p>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="px-8 py-3 text-gray-500 font-bold bg-gray-200 hover:bg-gray-300 rounded-2xl transition">
            No, Keep my order
          </button>
          <button
            disabled={isSubmitting}
            onClick={async () => {
              setIsSubmitting(true);
              try {
                await onCancel(orderId);
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-orange-100 transition-all duration-300 flex items-center gap-2"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isSubmitting ? 'Cancelling...' : 'Yes, Cancel my order'}
          </button>
        </div>
      </div>
    </div>
  );
}
