import { Sparkles, MessageCircle } from "lucide-react";

export default function AiHelpCard() {
    return (
        <div className="relative w-50 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-300 p-[1px] shadow-lg mt-8">
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/90 px-6 py-5 backdrop-blur">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                </div>

                <div className="text-center">
                    <h3 className="text-sm font-semibold text-gray-800">
                        Need help?
                    </h3>
                    <p className="text-xs text-gray-500">
                        Talk to our AI assistant
                    </p>
                </div>

                <button
                    className="flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white
                     transition-all hover:bg-amber-600 hover:scale-105 active:scale-95"
                >
                    <MessageCircle className="h-4 w-4" />
                    Chat with AI
                </button>
            </div>
        </div>
    );
}
