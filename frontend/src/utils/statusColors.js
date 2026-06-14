export const STATUS_MAP = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const STATUS_STYLES = {
  pending: "bg-orange-50 text-orange-600 border-orange-200",
  confirmed: "bg-blue-50 text-blue-600 border-blue-200",
  preparing: "bg-yellow-50 text-yellow-600 border-yellow-200",
  out_for_delivery: "bg-purple-50 text-purple-600 border-purple-200",
  delivered: "bg-green-50 text-green-600 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
  refunded: "bg-gray-50 text-gray-600 border-gray-200",
};

export const getStatusColor = (statusKey) => {
  return STATUS_STYLES[statusKey] || "bg-gray-50 text-gray-600 border-gray-200";
};
