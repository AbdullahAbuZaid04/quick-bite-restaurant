import { statusStyles } from "../../data/mockData";

export default function DashboardRow({ OrderID, Customer, Amount, Status }) {

  return (
    <tr className="border-b border-ui-border last:border-0 hover:bg-ui-mainBg">
      <td className="py-4 px-6 text-content-subtitle text-sm">{OrderID}</td>
      <td className="py-4 px-6 font-bold text-content-paragraph">{Customer}</td>
      <td className="py-4 px-6 font-bold text-content-paragraph">${(Amount).toFixed(2)}</td>
      <td className="py-4 px-6"><span className={`px-3 py-1 rounded-lg text-sm font-bold ${statusStyles[Status]}`}>{Status}</span></td>
    </tr>
  );
}
