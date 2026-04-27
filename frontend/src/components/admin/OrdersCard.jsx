export default function OrdersCard({ icon, title, value, color }) {
  return (
    <div className="bg-ui-white p-6 rounded-2xl border border-ui-border flex items-center gap-5">
      <div className={`p-4 rounded-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-content-subtitle text-[10px] font-bold uppercase tracking-widest mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-content-title tracking-tight">{value}</p>
      </div>
    </div>
  );
}