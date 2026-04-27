export default function Card({ icon, title, number, rate, color }) {
  const colors = {
    orange: "bg-brand-light text-brand-primary",
    purple: "bg-purple-50 text-purple-500",
    blue: "bg-blue-50 text-blue-500",
    gray: "bg-ui-mainBg text-content-subtitle",
  };

  return (
    <div className="bg-ui-white p-5 rounded-2xl border border-ui-border">
      <div className="flex items-center justify-between mb-4">
        <span className={`p-2.5 rounded-xl ${colors[color]}`}>{icon}</span>
        {rate && (
          <span className="text-green-500 bg-green-100 px-2 py-1 rounded-full text-xs font-bold">+{rate}%</span>
        )}
      </div>
      <p className="text-content-subtitle text-sm">{title}</p>
      <h3 className="text-2xl font-bold text-content-paragraph">
        {title.includes("Revenue") ? "$" : ""}
        {number.toLocaleString()}
        {title.includes("Products") && (
          <span className="text-lg ml-1">Active</span>
        )}
      </h3>
    </div>
  );
}
