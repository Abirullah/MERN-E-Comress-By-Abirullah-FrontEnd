import { useState } from "react";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useActivateUserMutation,
  useDeactivateUserMutation,
  useGetAdminUsersQuery,
  useLazyGetAdminUserByIdQuery,
} from "../../redux/api/adminApiSlice";
import Message from "../../components/Message";
import Modal from "../../components/Modal";
import { formatDate } from "../../utils/formatters";

const UserList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { data: users = [], refetch, isLoading, error } = useGetAdminUsersQuery();
  const [activateUser, { isLoading: isActivating }] = useActivateUserMutation();
  const [deactivateUser, { isLoading: isDeactivating }] =
    useDeactivateUserMutation();
  const [fetchUserDetails, { data: selectedUser, isFetching: isLoadingUser }] =
    useLazyGetAdminUserByIdQuery();

  const handleUserAction = async (action, id) => {
    const mutation = action === "activate" ? activateUser : deactivateUser;

    try {
      const response = await mutation(id).unwrap();
      toast.success(
        response?.message ||
          `User ${action === "activate" ? "activated" : "deactivated"} successfully`
      );
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || `User ${action} request failed`
      );
    }
  };

  const openUserDetails = async (id) => {
    setSelectedUserId(id);
    setIsModalOpen(true);

    try {
      await fetchUserDetails(id).unwrap();
    } catch (requestError) {
      toast.error(
        requestError?.data?.message ||
          requestError?.message ||
          "User details could not be loaded"
      );
    }
  };

  return (
    <div className="space-y-6">
      <section className="app-card p-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <span className="muted-chip">Admin user management</span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
              Review preview users and test admin actions locally
            </h1>
            <p className="mt-4 section-copy max-w-2xl">
              The admin dashboard reads from local preview data so you can keep
              iterating on the management experience before backend hookup.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-700">Users</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {users.length}
              </p>
            </div>
            <div className="rounded-3xl bg-sky-50 p-4">
              <p className="text-sm font-semibold text-sky-700">Profiles</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {users.filter((user) => user.Profile).length}
              </p>
            </div>
            <div className="rounded-3xl bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-700">Admins</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {users.filter((user) => user.isAdmin).length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : error ? (
        <div className="app-card p-6">
          <Message variant="error">
            {error?.data?.message || error?.message || "Users could not be loaded."}
          </Message>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <article key={user._id} className="app-card p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {user.username}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{user.email}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    user.isAdmin
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {user.isAdmin ? "Admin" : "Customer"}
                </span>
              </div>

              <div className="mt-6 space-y-3 rounded-[1.75rem] bg-slate-50 p-4 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Profile:</span>{" "}
                  {user.Profile ? "On file" : "Not added yet"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Joined:</span>{" "}
                  {formatDate(user.createdAt)}
                </p>
                <p className="truncate">
                  <span className="font-semibold text-slate-900">ID:</span>{" "}
                  {user._id}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => openUserDetails(user._id)}
                >
                  View details
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  disabled={isActivating || isDeactivating}
                  onClick={() => handleUserAction("activate", user._id)}
                >
                  Activate
                </button>
                <button
                  type="button"
                  className="danger-button"
                  disabled={isActivating || isDeactivating}
                  onClick={() => handleUserAction("deactivate", user._id)}
                >
                  Deactivate
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {isLoadingUser ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : selectedUser ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                User details
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
                {selectedUser.username}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{selectedUser.email}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Joined</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {formatDate(selectedUser.createdAt)}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Account type</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {selectedUser.isAdmin ? "Admin" : "Customer"}
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 p-5">
              <p className="text-lg font-bold text-slate-900">Profile payload</p>
              {selectedUser.Profile ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-900">First name:</span>{" "}
                    {selectedUser.Profile.firstName}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Last name:</span>{" "}
                    {selectedUser.Profile.lastName}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Phone:</span>{" "}
                    {selectedUser.Profile.phoneNumber}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Picture:</span>{" "}
                    {selectedUser.Profile.profilePicture || "Not provided"}
                  </p>
                  <p className="sm:col-span-2">
                    <span className="font-semibold text-slate-900">Address:</span>{" "}
                    {selectedUser.Profile.address}
                  </p>
                  <p className="sm:col-span-2">
                    <span className="font-semibold text-slate-900">Account details:</span>{" "}
                    {selectedUser.Profile.accountDetails || "Not provided"}
                  </p>
                  <p className="sm:col-span-2">
                    <span className="font-semibold text-slate-900">Preferences:</span>{" "}
                    {selectedUser.Profile.preferences || "Not provided"}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  This user does not currently have a profile object saved in
                  local preview data.
                </p>
              )}
            </div>

            <div className="rounded-[1.75rem] bg-slate-50 p-4 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">User ID:</span>{" "}
                {selectedUserId}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Select a user to review their details.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default UserList;
