import { Trash2 } from "lucide-react";

export default function UserRow({ name, email, role, handleClickDelete }) {
  const roleStyles = role === "Admin" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-400";

  return (
    <tr className="border-b border-ui-border text-center hover:bg-ui-mainBg">
      <td className="py-4 px-6 text-content-paragraph text-sm font-medium">{name}</td>
      <td className="py-4 px-6 text-content-paragraph text-sm font-medium">{email}</td>
      <td className="py-4 px-6">
        <span
          className={`px-4 py-1 rounded-lg text-sm font-bold ${roleStyles}`}
        >
          {role}
        </span>
      </td>
      <td className="py-4 px-6 text-center">
        {
          role !== "Admin" && <button onClick={handleClickDelete} className="text-content-subtitle hover:text-status-cancelled transition-colors duration-300">
            <Trash2 size={18} />
          </button>
        }
      </td>
    </tr>
  );
}
