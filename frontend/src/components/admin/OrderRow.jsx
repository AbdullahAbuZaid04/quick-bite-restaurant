import { memo } from "react";
import { Loader2 } from "lucide-react";
import { STATUS_STYLES } from "../../utils/statusColors";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

const ALLOWED_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
};

const OrderRow = memo(function OrderRow({ OrderID, Customer, Amount, Status, statusKey, Date, onStatusChange, updating }) {

  const availableOptions = STATUS_OPTIONS.filter(opt =>
    opt.value === statusKey || (ALLOWED_TRANSITIONS[statusKey] && ALLOWED_TRANSITIONS[statusKey].includes(opt.value))
  );

  return (
    <tr className="border-b border-ui-border text-center hover:bg-ui-mainBg transition-all duration-300">
      <td className="py-5 px-6 text-content-subtitle text-sm">{OrderID}</td>
      <td className="py-5 px-6 font-bold text-content-paragraph">{Customer}</td>
      <td className="py-5 px-6 font-bold text-content-paragraph">{Amount}</td>
      <td className="py-5 px-6">
        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${STATUS_STYLES[statusKey] || "bg-gray-50 text-gray-500 border-gray-200"}`}>
          {Status}
        </span>
      </td>
      <td className="py-5 px-6 text-content-subtitle text-sm">{Date}</td>
      <td className="py-5 px-6">
        <div className="flex items-center justify-center gap-4">
          {updating ? (
            <Loader2 size={18} className="animate-spin text-gray-400" />
          ) : availableOptions.length > 1 ? (
            <select
              className="bg-ui-mainBg px-3 py-1.5 rounded-lg text-xs font-bold text-content-paragraph hover:bg-ui-border transition cursor-pointer"
              value={statusKey}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              {availableOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-gray-400 font-medium">Final State</span>
          )}
        </div>
      </td>
    </tr>
  );
});

export default OrderRow;
