import { UploadCloud } from "lucide-react";

export default function ImageUpload({ image }) {
  return (
    <div>
      <label>Product Image</label>

      {/* منطقة الرفع */}
      <div>
        <div>
          <UploadCloud size={28} />
        </div>

        <div>
          <p>Click to upload or drag and drop</p>
          <p>PNG, JPG or WebP (Recommended: 1200 x 800 px)</p>
        </div>

        <input
          type="file"
          accept="image/*"
        />
      </div>

      {/* عرض صورة مصغرة في حال وجودها */}
      {image && (
        <div>
          <img
            src={typeof image === "string" ? image : ""}
            alt="Preview"
          />
        </div>
      )}
    </div>
  );
}
