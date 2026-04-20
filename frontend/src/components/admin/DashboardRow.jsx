export default function DashboardRow({ OrderID, Customer, Amount, Status }) {
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
    </tr>
  );
}
