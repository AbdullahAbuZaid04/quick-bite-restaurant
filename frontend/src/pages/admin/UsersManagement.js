import { TheadTabels } from "../../data/mockData";
import UserRow from "../../components/admin/UserRow";
import Pagination from "../../components/common/Pagination";
import { useAdmin } from "../../hooks/useAdmin";
import DeleteUserModal from "../../components/admin/DeleteUserModal";

export default function UsersManagement() {
  const { isUserDeleteModalOpen, setIsUserDeleteModalOpen, selectedUser, users, handleDeleteUser, handleClickDeleteUser } = useAdmin();

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-content-paragraph">
          Users Management
        </h1>
        <p className="text-content-subtitle text-sm mt-2">
          Manage platform access, monitor user activity, and maintain
          administrative control over the Quick Bite ecosystem.
        </p>
      </div>

      <div className="bg-ui-white rounded-2xl  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-brand-primary text-white text-center text-sm font-bold uppercase">
              <tr>
                {TheadTabels.Users.map((th, index) => (
                  <th key={index} className="py-5 px-6">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <UserRow
                  key={index}
                  avatar={user.avatar}
                  name={user.name}
                  email={user.email}
                  role={user.role}
                  handleClickDelete={() => handleClickDeleteUser(user)}
                />
              ))}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={1} totalPages={6} totalItems={24} itemsPerPage={5} itemName="users" />
      </div>
      <DeleteUserModal isOpen={isUserDeleteModalOpen} onClose={() => setIsUserDeleteModalOpen(false)} user={selectedUser} onDelete={handleDeleteUser} />
    </>
  );
}
