import { X, ChevronDown, PlusCircle } from "lucide-react";

export default function AddProductModal() {
  return (
    <section>
      <div>
        <header>
          <div>
            <h2>Add New Product</h2>
            <p>Fill in the information below to add a new dish.</p>
          </div>
          <button type="button">
            <X size={22} />
          </button>
        </header>

        <form>
          <fieldset>
            <div>
              <label htmlFor="product-name">Product Name</label>
              <input
                type="text"
                id="product-name"
                placeholder="e.g. Truffle Mushroom Risotto"
                required
              />
            </div>

            <div>
              <label htmlFor="category">Category</label>
              <div>
                <select id="category" required>
                  <option value="">Select category</option>
                  <option value="burgers">Burgers</option>
                  <option value="pizza">Pizza</option>
                </select>
                <ChevronDown size={18} />
              </div>
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="3"
                placeholder="Describe your dish..."
              ></textarea>
            </div>

            <div>
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                placeholder="0.00"
                step="0.5"
                required
              />
            </div>

            <div>
              <label htmlFor="prep-time">Prep Time (min)</label>
              <input
                type="number"
                id="prep-time"
                placeholder="0"
                required
              />
            </div>

            <div>
              <label htmlFor="product-image">Product Image</label>
              <div>
                <PlusCircle size={30} />
                <p>Click to upload or drag and drop</p>
                <input
                  type="file"
                  id="product-image"
                  accept="image/*"
                />
              </div>
            </div>

          </fieldset>

          <footer>
            <button type="button">
              Cancel
            </button>
            <button type="submit">
              Save Product
            </button>
          </footer>
        </form>
      </div>
    </section>
  );
}
