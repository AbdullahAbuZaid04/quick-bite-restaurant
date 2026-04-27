import { statusStyles } from "../../data/mockData";

export default function OrderRow({ OrderID, Customer, Amount, Status, Date }) {

  return (
    <tr className="border-b border-ui-border text-center hover:bg-ui-mainBg transition-all duration-300">
      <td className="py-5 px-6 text-content-subtitle text-sm">{OrderID}</td>
      <td className="py-5 px-6 font-bold text-content-paragraph">{Customer}</td>
      <td className="py-5 px-6 font-bold text-content-paragraph">${Amount}</td>
      <td className="py-5 px-6">
        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${statusStyles[Status]}`}>
          {Status}
        </span>
      </td>
      <td className="py-5 px-6 text-content-subtitle text-sm">{Date}</td>
      <td className="py-5 px-6">
        <div className="flex items-center justify-center gap-4">
          <select className="bg-ui-mainBg px-3 py-1.5 rounded-lg text-xs font-bold text-content-paragraph hover:bg-ui-border transition" name="status" id="status">
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </td>
    </tr>
  );
}
