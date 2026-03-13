import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden px-6">
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full border border-stone-300/60 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[550px] h-[550px] rounded-full border border-stone-300/60 pointer-events-none" />
      <div className="absolute top-[12%] left-[6%] w-12 h-12 border border-stone-300/60 rotate-45 pointer-events-none" />
      <div className="absolute bottom-[14%] right-[7%] w-9 h-9 border border-stone-300/60 rotate-45 pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg w-full py-16">
        <div className="flex justify-center mb-8">
            <img
                src="/src/assets/logos/Elegance Jewelry.png"
                alt="Gemellery"
                className="h-18 w-auto object-contain"
            />
          
        </div>

        <p className="text-8xl font-light tracking-[0.2em] text-yellow-700 leading-none mb-4">403</p>
        <div className="w-14 h-px bg-yellow-700/60 mx-auto mb-6" />
        <h1 className="text-2xl font-normal tracking-[0.2em] uppercase text-foreground mb-5">Access Denied</h1>
        <p className="text-muted-foreground leading-relaxed mb-10 text-sm">
          This area of our collection is reserved for exclusive members. You
          don't have the necessary permissions to view this page.
        </p>

        <div className="flex gap-4 justify-center flex-wrap mb-8">
          <button
            onClick={() => navigate("/signin")}
            className="px-8 py-3 bg-yellow-700 text-white text-xs font-semibold tracking-[0.15em] uppercase hover:bg-yellow-800 transition-colors duration-200 cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-transparent text-yellow-700 border border-yellow-700 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-yellow-700/10 transition-colors duration-200 cursor-pointer"
          >
            Return Home
          </button>
        </div>

        <div className="border-t border-border pt-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            If you believe this is an error, please contact your administrator or{" "}
            <a href="mailto:support@gemellery.com" className="text-yellow-700 hover:underline">
              reach out to our support team
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
