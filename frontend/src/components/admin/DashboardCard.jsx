export default function DashboardCard({ icon: Icon, title, number, rate }) {
  return (
    <article>
      <div>
        <div>
          {Icon && <Icon />}
        </div>
        {rate && (
          <span>+{rate}%</span>
        )}
      </div>

      <div>
        <p>{title}</p>
        <h3>
          {title.includes("Revenue") && "$"}
          {number.toLocaleString()}
          {title.includes("Products") && (
            <span>Active</span>
          )}
        </h3>
      </div>
    </article>
  );
}
