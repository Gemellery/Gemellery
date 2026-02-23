import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import toast from "react-hot-toast";
import { Menu } from "lucide-react";

interface Seller {
  seller_id: number;
  business_name: string;
  email: string;
  ngja_registration_no: string;
  seller_license_url?: string;
  verification_status: "pending" | "approved" | "rejected" | "suspended";
}

type Status = Seller["verification_status"];

const ROWS_PER_PAGE = 10;

const getStatusStyle = (status: Status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "suspended":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

function StatusCard({ title, count }: any) {
  return (
    <div className="bg-white p-5 rounded-lg shadow border">
      <h2 className="text-gray-500 text-sm">{title}</h2>
      <p className="text-2xl font-semibold mt-2">{count}</p>
    </div>
  );
}

function VerifySellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewSeller, setReviewSeller] = useState<Seller | null>(null);
  const [verifiedCheck, setVerifiedCheck] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadSellers();
  }, []);

  // ESC close modal
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setReviewSeller(null);
        setVerifiedCheck(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const loadSellers = async () => {
    const res = await fetch("http://localhost:5001/api/admin/pending-sellers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    setSellers(Array.isArray(data) ? data : []);
  };

  let filtered = sellers.filter(
    (s) =>
      s.business_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.ngja_registration_no.toLowerCase().includes(search.toLowerCase())
  );

  if (statusFilter !== "all") {
    filtered = filtered.filter(
      (s) => s.verification_status === statusFilter
    );
  }

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const countBy = (status: Status) =>
    sellers.filter((s) => s.verification_status === status).length;

  const updateStatus = async (id: number, status: Status) => {
    setLoadingId(id);

    await fetch(`http://localhost:5001/api/admin/seller/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    toast.success(`Seller ${status}`);
    setReviewSeller(null);
    setVerifiedCheck(false);
    setLoadingId(null);
    loadSellers();
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
            Seller Verification Dashboard
          </h1>
        </div>

        {/* Summary */}
        <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
          <div>Total Sellers: {sellers.length}</div>
          <div>Pending Review: {countBy("pending")}</div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search sellers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-lg w-72"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as Status | "all");
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatusCard title="Pending" count={countBy("pending")} />
          <StatusCard title="Approved" count={countBy("approved")} />
          <StatusCard title="Rejected" count={countBy("rejected")} />
          <StatusCard title="Suspended" count={countBy("suspended")} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Business</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">NGJA No</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((s) => (
                <tr
                  key={s.seller_id}
                  className={`border-t hover:bg-gray-50 ${s.verification_status === "pending"
                    ? "bg-yellow-50"
                    : ""
                    }`}
                >
                  <td className="p-4 font-medium text-teal-700">
                    {s.business_name}
                  </td>
                  <td className="p-4">{s.email}</td>
                  <td className="p-4">{s.ngja_registration_no}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                        s.verification_status
                      )}`}
                    >
                      {s.verification_status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setReviewSeller(s)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {reviewSeller && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-[1100px] max-w-[95vw] h-[85vh] rounded-xl shadow-xl flex overflow-hidden">

              {/* Left */}
              <div className="w-1/2 p-6 overflow-y-auto border-r">
                <h2 className="text-xl font-semibold mb-6">
                  Seller Review Panel
                </h2>

                <div className="space-y-3 text-sm">
                  <div><strong>Business:</strong> {reviewSeller.business_name}</div>
                  <div><strong>Email:</strong> {reviewSeller.email}</div>
                  <div><strong>NGJA No:</strong> {reviewSeller.ngja_registration_no}</div>
                  <div><strong>Status:</strong> {reviewSeller.verification_status}</div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={verifiedCheck}
                    onChange={() => setVerifiedCheck(!verifiedCheck)}
                  />
                  <span className="text-sm">
                    I have reviewed and verified the documents
                  </span>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    disabled={!verifiedCheck}
                    onClick={() =>
                      updateStatus(reviewSeller.seller_id, "approved")
                    }
                    className="px-5 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      window.confirm("Reject this seller?") &&
                      updateStatus(reviewSeller.seller_id, "rejected")
                    }
                    className="px-5 py-2 bg-red-600 text-white rounded"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() =>
                      window.confirm("Suspend this seller?") &&
                      updateStatus(reviewSeller.seller_id, "suspended")
                    }
                    className="px-5 py-2 bg-orange-600 text-white rounded"
                  >
                    Suspend
                  </button>

                  <button
                    onClick={() => {
                      setReviewSeller(null);
                      setVerifiedCheck(false);
                    }}
                    className="px-5 py-2 bg-gray-300 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Right */}
              <div className="w-1/2 bg-gray-50 p-4 flex flex-col">
                <h3 className="text-sm font-medium mb-3">
                  License Preview
                </h3>

                <div className="flex-1 border rounded bg-white overflow-hidden">
                  {reviewSeller.seller_license_url ? (
                    <iframe
                      src={`http://localhost:5001${reviewSeller.seller_license_url}`}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No License Uploaded
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifySellers;