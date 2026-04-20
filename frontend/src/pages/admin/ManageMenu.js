import { Plus } from "lucide-react";
import MenuRow from "../../components/admin/MenuRow";
import AddProductModal from "../../components/admin/AddProductModal";
import EditProductModal from "../../components/admin/EditProductModal";
import DeleteProductModal from "../../components/admin/DeleteProductModal";
import ImgManageMenu1 from "../../assets/ManageMenu1.png";
import ImgManageMenu2 from "../../assets/ManageMenu2.png";

export default function ManageMenu() {
  return (
    <>
      <header>
        <div>
          <h1>Manage Menu</h1>
          <p>
            Manage all restaurant products, categories, pricing, and availability.
          </p>
        </div>
        <button type="button">
          <Plus size={20} /> Add Product
        </button>
      </header>

      <section>
        <div>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Prep Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <MenuRow image={ImgManageMenu1} name="Classic Beef Burger" category="Main Course" price="$12.99" prepTime="20-25 min" />
              <MenuRow image={ImgManageMenu2} name="Spicy Chicken Wings" category="Appetizer" price="$8.99" prepTime="15-20 min" />
            </tbody>
          </table>
        </div>
        <AddProductModal />
        <EditProductModal />
        <DeleteProductModal />
      </section>
    </>
  );
}
