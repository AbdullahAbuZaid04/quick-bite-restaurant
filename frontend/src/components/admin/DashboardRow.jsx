import { memo } from "react";
import { STATUS_STYLES } from "../../utils/statusColors";

const DashboardRow = memo(function DashboardRow({ OrderID, Customer, Amount, Status, statusKey }) {

  return (
    <tr className="border-b border-ui-border last:border-0 hover:bg-ui-mainBg">
      <td className="py-4 px-6 text-content-subtitle text-sm">{OrderID}</td>
      <td className="py-4 px-6 font-bold text-content-paragraph">{Customer}</td>
      <td className="py-4 px-6 font-bold text-content-paragraph">{Amount}</td>
      <td className="py-4 px-6">
        <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${STATUS_STYLES[statusKey] || "bg-gray-50 text-gray-500 border-gray-200"}`}>
          {Status}
        </span>
      </td>
    </tr>
  );
});

export default DashboardRow;
