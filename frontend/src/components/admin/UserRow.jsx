import { Trash2 } from "lucide-react";

export default function UserRow({ name, email, role, onOpenDeleteModal }) {
  return (
    <tr>
      <td>{name}</td>
      <td>{email}</td>
      <td>
        <span>
          {role}
        </span>
      </td>
      <td>
        {role !== "Admin" && (
          <button onClick={onOpenDeleteModal}>
            <Trash2 size={18} />
          </button>
        )}
      </td>
    </tr>
  );
}
