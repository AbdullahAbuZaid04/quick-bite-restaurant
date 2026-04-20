export default function OrderRow({ OrderID, Customer, Amount, Status, Date, onChangeStatus }) {
  return (
    <tr>
      <td>{OrderID}</td>
      <td>{Customer}</td>
      <td>${Amount}</td>
      <td>
        <span>
          {Status}
        </span>
      </td>
      <td>{Date}</td>
      <td>
        <div>
          <select
            value={Status}
            onChange={(e) => onChangeStatus(OrderID, e.target.value)}
            name="status"
          >
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
