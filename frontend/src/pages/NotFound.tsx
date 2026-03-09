import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden px-6">
      {/* Decorative background rings */}
      <div className="absolute -top-31 -right-32 w-[500px] h-[500px] rounded-full border border-yellow-700/10 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full border border-yellow-700/10 pointer-events-none" />
      <div className="absolute top-1/2 left-[6%] -translate-y-1/2 w-14 h-14 border border-yellow-700/15 rotate-45 pointer-events-none" />
      <div className="absolute top-[12%] right-[8%] w-8 h-8 border border-yellow-700/10 rotate-45 pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg w-full py-16">
        <div className="flex justify-center mb-8">
            <img
                src="/src/assets/logos/Elegance Jewelry.png"
                alt="Gemellery"
                className="h-16 w-auto object-contain"
            />
        </div>
       

        <p className="text-8xl font-light tracking-[0.2em] text-yellow-700 leading-none mb-4">404</p>
        <div className="w-14 h-px bg-yellow-700/60 mx-auto mb-6" />
        <h1 className="text-2xl font-normal tracking-[0.2em] uppercase text-foreground mb-5">Page Not Found</h1>
        <p className="text-muted-foreground leading-relaxed mb-12 text-sm">
          The gem you're searching for seems to have gone missing from our
          collection. It may have been moved, renamed, or simply doesn't exist.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-yellow-700 text-white text-xs font-semibold tracking-[0.15em] uppercase hover:bg-yellow-800 transition-colors duration-200 cursor-pointer"
          >
            Return Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-transparent text-yellow-700 border border-yellow-700 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-yellow-700/10 transition-colors duration-200 cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
