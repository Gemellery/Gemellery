import { X, User } from "lucide-react";

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: any | null;
}

function AdminProfileModal({ isOpen, onClose, admin }: AdminProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-lg w-[420px] p-6 relative">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">

          <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>

          <h2 className="text-lg font-semibold mt-3">
            {admin?.full_name}
          </h2>

          <p className="text-sm text-gray-500">
            {admin?.email}
          </p>

        </div>

        {/* Profile Details */}
        <div className="space-y-3 text-sm">

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Mobile</span>
            <span className="font-medium">{admin?.mobile || "-"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Role</span>
            <span className="font-medium">{admin?.role}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Status</span>
            <span className="font-medium capitalize">{admin?.status}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Country</span>
            <span className="font-medium">{admin?.country}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Joined</span>
            <span className="font-medium">
              {admin?.joined_date
                ? new Date(admin.joined_date).toLocaleDateString()
                : "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Last Updated</span>
            <span className="font-medium">
              {admin?.updated_at
                ? new Date(admin.updated_at).toLocaleDateString()
                : "-"}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminProfileModal;