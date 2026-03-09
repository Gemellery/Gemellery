import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden px-6">
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full border border-indigo-700/10 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[550px] h-[550px] rounded-full border border-indigo-700/10 pointer-events-none" />
      <div className="absolute top-[12%] left-[6%] w-12 h-12 border border-indigo-700/10 rotate-45 pointer-events-none" />
      <div className="absolute bottom-[14%] right-[7%] w-9 h-9 border border-indigo-700/10 rotate-45 pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg w-full py-16">
        {/* Lock Gem SVG Icon */}
        <div className="flex justify-center mb-8">
          <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
            <polygon points="40,8 72,28 72,52 40,72 8,52 8,28" fill="rgba(99,102,241,0.10)" stroke="#6366f1" strokeWidth="1.5" />
            <rect x="30" y="38" width="20" height="16" rx="2" fill="none" stroke="#6366f1" strokeWidth="1.5" />
            <path d="M33 38 V33 Q40 25 47 33 V38" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="40" cy="45" r="2.5" fill="#6366f1" opacity="0.7" />
            <line x1="40" y1="47.5" x2="40" y2="51" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <p className="text-8xl font-light tracking-[0.2em] text-indigo-500 leading-none mb-4">403</p>
        <div className="w-14 h-px bg-indigo-500/60 mx-auto mb-6" />
        <h1 className="text-2xl font-normal tracking-[0.2em] uppercase text-foreground mb-5">Access Denied</h1>
        <p className="text-muted-foreground leading-relaxed mb-10 text-sm">
          This area of our collection is reserved for exclusive members. You
          don't have the necessary permissions to view this page.
        </p>

        <div className="flex gap-4 justify-center flex-wrap mb-8">
          <button
            onClick={() => navigate("/signin")}
            className="px-8 py-3 bg-indigo-500 text-white text-xs font-semibold tracking-[0.15em] uppercase hover:bg-indigo-600 transition-colors duration-200 cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-transparent text-indigo-500 border border-indigo-500 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-indigo-500/10 transition-colors duration-200 cursor-pointer"
          >
            Return Home
          </button>
        </div>

        <div className="border-t border-border pt-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            If you believe this is an error, please contact your administrator or{" "}
            <a href="mailto:support@gemellery.com" className="text-indigo-500 hover:underline">
              reach out to our support team
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
