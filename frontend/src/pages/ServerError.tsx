import { useNavigate } from "react-router-dom";

export default function ServerError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden px-6">
      <div className="absolute -top-24 -left-24 w-[450px] h-[450px] rounded-full border border-stone-300/60 pointer-events-none" />
      <div className="absolute -bottom-44 -right-44 w-[650px] h-[650px] rounded-full border border-stone-300/60 pointer-events-none" />
      <div className="absolute top-0 right-[15%] w-px h-full bg-stone-200/60 pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg w-full py-16">
        <div className="flex justify-center mb-8">
         
        </div>

        <p className="text-8xl font-light tracking-[0.2em] text-yellow-700 leading-none mb-4">500</p>
        <div className="w-14 h-px bg-yellow-700/60 mx-auto mb-6" />
        <h1 className="text-2xl font-normal tracking-[0.2em] uppercase text-foreground mb-5">Server Error</h1>
        <p className="text-muted-foreground leading-relaxed mb-10 text-sm">
          Something has fractured on our end. Our craftsmen are working to
          restore everything to its polished state. Please try again in a moment.
        </p>

        <div className="flex gap-4 justify-center flex-wrap mb-8">
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-yellow-700 text-white text-xs font-semibold tracking-[0.15em] uppercase hover:bg-yellow-800 transition-colors duration-200 cursor-pointer"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-transparent text-yellow-700 border border-yellow-700 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-yellow-700/10 transition-colors duration-200 cursor-pointer"
          >
            Return Home
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          If the issue persists, please contact{" "}
          <a href="mailto:support@gemellery.com" className="text-yellow-700 hover:underline">
            support@gemellery.com
          </a>
        </p>
      </div>
    </div>
  );
}