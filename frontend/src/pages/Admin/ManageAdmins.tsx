import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import toast from "react-hot-toast";
import { Edit, Lock, Power, Menu } from "lucide-react";

interface Admin {
    user_id: number;
    email: string;
    full_name: string;
    mobile: string;
    country_id: number;
    country_name: string;
    joined_date: string | null;
    status: "active" | "inactive" | "frozen";
}

interface Country {
    country_id: number;
    country_name: string;
}

type StatusFilter = "active" | "inactive" | "frozen" | "all";
type ActionType = "toInactive" | "toActive" | "toFrozen" | null;

function ManageAdmins() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

    const [confirmAction, setConfirmAction] = useState<{
        type: ActionType;
        admin: Admin | null;
    }>({ type: null, admin: null });

    const [form, setForm] = useState({
        email: "",
        password: "",
        full_name: "",
        mobile: "",
        country_id: 0,
    });

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    /* ================= LOAD DATA ================= */

    useEffect(() => {
        loadAdmins();
    }, [statusFilter]);

    useEffect(() => {
        loadCountries();
    }, []);

    const loadAdmins = async () => {
        try {
            const res = await fetch(
                `http://localhost:5001/api/super-admin/admins?status=${statusFilter}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = await res.json();
            setAdmins(data.success ? data.data : []);
        } catch {
            toast.error("Failed to load admins");
        }
    };

    const loadCountries = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/countries");
            const data = await res.json();
            setCountries(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load countries");
        }
    };

    /* ================= CREATE / EDIT ================= */

    const openCreate = () => {
        setEditingAdmin(null);
        setForm({
            email: "",
            password: "",
            full_name: "",
            mobile: "",
            country_id: 0,
        });
        setModalOpen(true);
    };

    const openEdit = (admin: Admin) => {
        setEditingAdmin(admin);
        setForm({
            email: admin.email,
            password: "",
            full_name: admin.full_name,
            mobile: admin.mobile,
            country_id: admin.country_id,
        });
        setModalOpen(true);
    };

    const saveAdmin = async () => {
        if (!form.email || !form.full_name || !form.country_id) {
            toast.error("Please complete required fields");
            return;
        }

        const url = editingAdmin
            ? `http://localhost:5001/api/super-admin/admins/${editingAdmin.user_id}`
            : `http://localhost:5001/api/super-admin/admins`;

        const method = editingAdmin ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Operation failed");
                return;
            }

            toast.success(editingAdmin ? "Admin updated" : "Admin created");
            setModalOpen(false);
            loadAdmins();
        } catch {
            toast.error("Something went wrong");
        }
    };

    /* ================= STATUS UPDATE ================= */

    const executeStatusChange = async (
        admin: Admin,
        newStatus: "active" | "inactive" | "frozen"
    ) => {
        try {
            const res = await fetch(
                `http://localhost:5001/api/super-admin/admins/${admin.user_id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Status update failed");
                return;
            }

            toast.success("Status updated");

            // Update UI instantly (no reload needed)
            setAdmins((prev) =>
                prev.map((a) =>
                    a.user_id === admin.user_id ? { ...a, status: newStatus } : a
                )
            );
        } catch {
            toast.error("Server error");
        }
    };

    /* ================= UI ================= */

    const filtered = admins.filter(
        (a) =>
            a.email.toLowerCase().includes(search.toLowerCase()) ||
            a.full_name.toLowerCase().includes(search.toLowerCase())
    );

    const badge = (status: string) => {
        if (status === "active")
            return "bg-green-100 text-green-800";
        if (status === "inactive")
            return "bg-gray-200 text-gray-600";
        return "bg-red-100 text-red-800";
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar
                adminName={user.full_name || user.email}
                role={user.role}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />

            <div className="flex-1 overflow-y-auto p-6 md:ml-64">

                {/* Mobile Header */}
                <div className="flex items-center gap-4 mb-6 md:hidden">
                    <button onClick={() => setIsOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-semibold">
                        Admin Management
                    </h1>
                </div>
                

                {/* Desktop Header */}
                <div className="hidden md:flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">
                        Admin Management
                    </h1>

                    <button
                        type="button"
                        onClick={openCreate}
                        className="bg-teal-600 text-white px-5 py-2 rounded shadow hover:bg-teal-700 transition"
                    >
                        + Create Admin
                    </button>
                </div>

                {/* FILTER + SEARCH */}
                <div className="flex justify-between mb-6">
                    <input
                        placeholder="Search..."
                        className="border px-4 py-2 rounded w-72"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value as StatusFilter)
                        }
                        className="border px-4 py-2 rounded"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="frozen">Frozen</option>
                        <option value="all">All</option>
                    </select>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-xl shadow border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-left">Mobile</th>
                                <th className="p-4 text-left">Country</th>
                                <th className="p-4 text-left">Joined</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((a) => (
                                <tr key={a.user_id} className="border-t hover:bg-gray-50">
                                    <td className="p-4">{a.full_name}</td>
                                    <td className="p-4">{a.email}</td>
                                    <td className="p-4">{a.mobile}</td>
                                    <td className="p-4">{a.country_name || "-"}</td>
                                    <td className="p-4">
                                        {a.joined_date
                                            ? new Date(a.joined_date).toLocaleDateString("en-GB")
                                            : "-"}
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${badge(
                                                a.status
                                            )}`}
                                        >
                                            {a.status}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        {a.status === "active" && (
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(a)}
                                                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                >
                                                    <Edit size={14} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => executeStatusChange(a, "inactive")}
                                                    className="p-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                                                >
                                                    <Power size={14} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => executeStatusChange(a, "frozen")}
                                                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                                                >
                                                    <Lock size={14} />
                                                </button>
                                            </div>
                                        )}

                                        {a.status === "frozen" && (
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => executeStatusChange(a, "active")}
                                                    className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                                                >
                                                    Activate
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => executeStatusChange(a, "inactive")}
                                                    className="px-3 py-1 bg-yellow-600 text-white rounded text-xs"
                                                >
                                                    Deactivate
                                                </button>
                                            </div>
                                        )}

                                        {a.status === "inactive" && (
                                            <span className="text-gray-400 text-xs">
                                                No actions
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* CREATE / EDIT MODAL */}
                {modalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
                        <div className="bg-white w-96 p-6 rounded-xl shadow-2xl">
                            <h2 className="text-lg font-semibold mb-4">
                                {editingAdmin ? "Edit Admin" : "Create Admin"}
                            </h2>

                            <div className="space-y-3">
                                <input
                                    placeholder="Email"
                                    className="border w-full p-2 rounded"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({ ...form, email: e.target.value })
                                    }
                                />

                                <input
                                    type="password"
                                    placeholder={
                                        editingAdmin
                                            ? "New Password (optional)"
                                            : "Password"
                                    }
                                    className="border w-full p-2 rounded"
                                    onChange={(e) =>
                                        setForm({ ...form, password: e.target.value })
                                    }
                                />

                                <input
                                    placeholder="Full Name"
                                    className="border w-full p-2 rounded"
                                    value={form.full_name}
                                    onChange={(e) =>
                                        setForm({ ...form, full_name: e.target.value })
                                    }
                                />

                                <input
                                    placeholder="Mobile"
                                    className="border w-full p-2 rounded"
                                    value={form.mobile}
                                    onChange={(e) =>
                                        setForm({ ...form, mobile: e.target.value })
                                    }
                                />

                                <select
                                    className="border w-full p-2 rounded"
                                    value={form.country_id}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            country_id: Number(e.target.value),
                                        })
                                    }
                                >
                                    <option value={0}>Select Country</option>
                                    {countries.map((c) => (
                                        <option key={c.country_id} value={c.country_id}>
                                            {c.country_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={saveAdmin}
                                    className="px-4 py-2 bg-teal-600 text-white rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ManageAdmins;