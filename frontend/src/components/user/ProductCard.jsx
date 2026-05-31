import { memo } from "react";
import { Plus, Clock } from "lucide-react";

const ProductCard = memo(function ProductCard({ item, addToCart }) {
  return (
    <div className="group relative bg-ui-white p-3 rounded-2xl border border-ui-border transition-all duration-300 hover:shadow-xl hover:border-brand-primary/40 flex flex-col h-full justify-between">

      <div className="flex flex-col flex-1">
        <div className="overflow-hidden rounded-xl mb-3 aspect-[4/3] relative">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"
          />
        </div>

        <div className="flex flex-col flex-1 px-1">
          <span className="text-[10px] uppercase tracking-widest text-brand-primary font-black mb-1 block">
            {item.category_name || item.category}
          </span>

          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3 className="text-base font-bold text-content-title line-clamp-2 leading-snug flex-1">
              {item.name}
            </h3>
            <span className="text-brand-primary font-black text-base whitespace-nowrap">
              ${item.price}
            </span>
          </div>

          <p className="text-xs text-content-subtitle line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-ui-border/60 mt-auto px-1">
        <div className="flex items-center gap-1.5 text-content-subtitle text-xs font-medium">
          <Clock size={14} className="text-content-subtitle/70" />
          <span>{item.prepare_time} min</span>
        </div>

        <button
          onClick={() => addToCart({ ...item, quantity: 1 })}
          className="bg-brand-primary text-white p-2.5 rounded-xl hover:bg-brand-hover transition-all active:scale-95 shadow-md shadow-brand-primary/10 flex items-center justify-center"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
      </div>

    </div>
  );
});

export default ProductCard;
