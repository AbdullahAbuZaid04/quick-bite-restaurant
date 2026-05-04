import { useRef } from "react";
import { UploadCloud } from "lucide-react";

export default function ImageUpload({ image, setImage }) {
  const fileInputRef = useRef(null);

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="md:col-span-2 space-y-2">
      <label className="text-xs font-bold text-gray-400 uppercase ml-1">
        Product Image
      </label>
      <div
        onClick={handleDivClick}
        className="border-2 border-dashed border-red-100 bg-red-50/20 rounded-3xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-red-50/40 transition-all duration-300"
      >
        <div className="bg-white p-3 rounded-full shadow-sm text-red-400">
          <UploadCloud size={28} />
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-gray-700">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-1 uppercase">
            PNG, JPG or WebP (Recommended: 1200 x 800 px)
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setImage(e.target.files[0])}
          className="hidden"
          accept="image/*"
        />
      </div>
      {image && (
        <div className="flex items-center gap-3">
          <img
            src={typeof image === "string" ? image : URL.createObjectURL(image)}
            alt="Preview"
            className="w-16 h-16 rounded-2xl object-cover"
          />
        </div>
      )}
    </div>
  );
}
