import { X } from "lucide-react";

export default function DeleteUserModal() {

  return (
    <section>
      <div>
        <header>
          <h2>Delete User</h2>
          <button>
            <X size={22} />
          </button>
        </header>

        <div>
          <p>
            Are you sure you want to delete
          </p>
        </div>

        <footer>
          <button>
            Cancel
          </button>
          <button>
            Delete User
          </button>
        </footer>
      </div>
    </section>
  );
}
