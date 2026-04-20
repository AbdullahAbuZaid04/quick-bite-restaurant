import { X, ChevronDown } from "lucide-react";

export default function EditProductModal() {

  return (
    <section>
      <div>
        <header>
          <div>
            <h2>Edit Product</h2>
            <p>Fill in the information below to edit the dish.</p>
          </div>
          <button>
            <X size={22} />
          </button>
        </header>

        <form>
          <fieldset>
            <div>
              <label htmlFor="edit-name">Product Name</label>
              <input
                type="text"
                id="edit-name"
                required
              />
            </div>

            <div>
              <label htmlFor="edit-category">Category</label>
              <div>
                <select id="edit-category" required>
                  <option value="burgers">Burgers</option>
                  <option value="pizza">Pizza</option>
                </select>
                <ChevronDown size={18} />
              </div>
            </div>

            <div>
              <label htmlFor="edit-description">Description</label>
              <textarea
                id="edit-description"
                rows="2"
              ></textarea>
            </div>

            <div>
              <label htmlFor="edit-price">Price ($)</label>
              <input
                type="number"
                id="edit-price"
                required
              />
            </div>

            <div>
              <label htmlFor="edit-prep-time">Prep Time (min)</label>
              <input
                type="number"
                id="edit-prep-time"
                required
              />
            </div>

            <div>
              <label>Product Image</label>
              <input type="file" accept="image/*" />
            </div>
          </fieldset>

          <footer>
            <button type="button">
              Cancel
            </button>
            <button type="submit">
              Update Product
            </button>
          </footer>
        </form>
      </div>
    </section>
  );
}
