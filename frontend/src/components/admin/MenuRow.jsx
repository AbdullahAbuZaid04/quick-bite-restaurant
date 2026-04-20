import { PencilLine, Trash2 } from "lucide-react";

export default function MenuRow({ image, name, category, price, prepTime, onEdit, onDelete }) {
  return (
    <tr>
      <td>
        <div>
          <img src={image} alt={name} />
        </div>
      </td>

      <td>
        {name}
      </td>

      <td>
        <span>
          {category}
        </span>
      </td>

      <td>${price}</td>

      <td>{prepTime} min</td>

      <td>
        <div>
          <button onClick={onEdit}>
            <PencilLine size={18} />
          </button>
          <button onClick={onDelete}>
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
