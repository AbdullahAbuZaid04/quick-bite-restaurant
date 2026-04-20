export default function OrdersCard({ icon, title, value }) {
  return (
    <article>
      <div>
        {icon}
      </div>

      <div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
    </article>
  );
}
