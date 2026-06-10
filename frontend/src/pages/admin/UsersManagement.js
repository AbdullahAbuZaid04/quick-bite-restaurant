import { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import UserRow from "../../components/admin/UserRow";
import Pagination from "../../components/common/Pagination";
import { useUsers } from "../../hooks/useUsers";
import DeleteModal from "../../components/admin/DeleteModal";

const TABLE_HEADERS = ["User Name", "Email Address", "Role", "Actions"];

export default function UsersManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const { isUserDeleteModalOpen, setIsUserDeleteModalOpen, selectedUser, users, usersError, handleDeleteUser, handleClickDeleteUser, isLoadingUsers, refetchUsers } = useUsers();

  const handlePageChange = (page) => {
    setCurrentPage(page);
    refetchUsers(page);
  };

  const meta = users?.meta || {};
  const totalPages = meta.total ? Math.ceil(meta.total / (meta.limit || 10)) : 1;

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

      <div className="bg-ui-white rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-brand-primary text-white text-center text-sm font-bold uppercase">
              <tr>
                {TABLE_HEADERS.map((th, index) => (
                  <th key={index} className="py-5 px-6">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoadingUsers ? (
                <tr>
                  <td colSpan={4} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-400 text-sm font-medium">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : usersError ? (
                <tr>
                  <td colSpan={4} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="bg-red-50 p-3 rounded-full">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <span className="text-red-500 text-sm font-medium">{usersError}</span>
                      <button
                        onClick={() => refetchUsers(currentPage)}
                        className="flex items-center gap-2 mt-2 px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-gray-400 text-sm font-medium">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <UserRow
                    key={user.id || index}
                    avatar={user.avatar}
                    name={user.name}
                    email={user.email}
                    role={user.role}
                    handleClickDelete={() => handleClickDeleteUser(user)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {users.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={meta.total || users.length}
            itemsPerPage={meta.limit || 10}
            itemName="users"
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <DeleteModal isOpen={isUserDeleteModalOpen} onClose={() => setIsUserDeleteModalOpen(false)} itemSelected={selectedUser} onDelete={handleDeleteUser} type="user" />
    </>
  );
}
