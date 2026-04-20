import UserRow from "../../components/admin/UserRow";
import DeleteUserModal from "../../components/admin/DeleteUserModal";

export default function UsersManagement() {
  return (
    <>
      <header>
        <h1>Users Management</h1>
        <p>
          Manage platform access, monitor user activity, and maintain
          administrative control over the Quick Bite ecosystem.
        </p>
      </header>

      <section>
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <UserRow name="John Doe" email="[EMAIL_ADDRESS]" role="Admin" />
              <UserRow name="John Doe" email="[EMAIL_ADDRESS]" role="User" />
              <UserRow name="John Doe" email="[EMAIL_ADDRESS]" role="User" />
              <UserRow name="John Doe" email="[EMAIL_ADDRESS]" role="User" />
              <UserRow name="John Doe" email="[EMAIL_ADDRESS]" role="User" />
            </tbody>
          </table>
        </div>
      </section>

      <DeleteUserModal />
    </>
  );
}
