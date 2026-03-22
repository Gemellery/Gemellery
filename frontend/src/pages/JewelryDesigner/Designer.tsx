import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gem, Camera, Sparkles, Wand2,
    ChevronLeft, ChevronRight, Crown,
    AlertTriangle, Check,
} from 'lucide-react';
import { gemFormSchema, type GemFormValues } from '../../lib/jewelry-designer/validation';
import { GemTypeSelector } from '../../components/jewelry-designer/forms/GemTypeSelector';
import { GemCutSelector } from '../../components/jewelry-designer/forms/GemCutSelector';
import { GemSizeInput } from '../../components/jewelry-designer/forms/GemSizeInput';
import { GemColorSelector } from '../../components/jewelry-designer/forms/GemColorSelector';
import { TransparencySelector } from '../../components/jewelry-designer/forms/TransparencySelector';
import { ImageUpload } from '../../components/jewelry-designer/forms/ImageUpload';
import { DesignPromptInput } from '../../components/jewelry-designer/forms/DesignPromptInput';
import { MaterialSelector } from '../../components/jewelry-designer/forms/MaterialSelector';

// Step definitions
const STEPS = [
    { id: 1, name: 'Gem Details', description: 'Describe your gemstone', icon: Gem },
    { id: 2, name: 'Reference', description: 'Add a photo', icon: Camera },
    { id: 3, name: 'Vision', description: 'Your dream design', icon: Sparkles },
    { id: 4, name: 'Create', description: 'Generate magic', icon: Wand2 },
];

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
};

const staggerChildren = {
    animate: { transition: { staggerChildren: 0.1 } },
};

const JewelryDesigner: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Automatically extract prefilled gem data if navigating from the Marketplace
    const prefilledGem = location.state?.prefilledGem;

    const [currentStep, setCurrentStep] = useState(prefilledGem ? 2 : 1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<GemFormValues>({
        resolver: zodResolver(gemFormSchema),
        defaultValues: {
            gemType: (() => {
                if (!prefilledGem) return '';
                const title = prefilledGem.name.toLowerCase();
                const types = [
                    'Sapphire', 'Ruby', 'Emerald', 'Diamond', 'Alexandrite', 
                    'Aquamarine', 'Amethyst', 'Spinel', 'Tourmaline', 'Garnet', 
                    'Topaz', 'Opal', 'Pearl'
                ];
                for (const t of types) {
                    if (title.includes(t.toLowerCase())) return t;
                }
                return 'Other'; 
            })(),
            gemTypeOther: prefilledGem ? prefilledGem.name : '',
            gemCut: (() => {
                if (!prefilledGem) return '';
                const cut = prefilledGem.cut.toLowerCase();
                if (cut.includes('round')) return 'round-brilliant';
                if (cut.includes('emerald')) return 'emerald-cut';
                if (cut.includes('oval')) return 'oval';
                if (cut.includes('cushion')) return 'cushion';
                if (cut.includes('pear')) return 'pear';
                if (cut.includes('marquise')) return 'marquise';
                if (cut.includes('asscher')) return 'asscher';
                if (cut.includes('princess')) return 'princess';
                if (cut.includes('radiant')) return 'radiant';
                if (cut.includes('heart')) return 'heart';
                return 'round-brilliant';
            })(),
            gemSizeMode: 'simple',
            gemSizeSimple: (() => {
                if (!prefilledGem) return '';
                const ctMatch = prefilledGem.weight.match(/([\d.]+)/);
                if (ctMatch) {
                    const ct = parseFloat(ctMatch[1]);
                    if (ct >= 4) return 'large';
                    if (ct >= 1.5) return 'medium';
                    return 'small';
                }
                return 'medium';
            })(),
            gemColor: (() => {
                if (!prefilledGem) return '';
                const type = prefilledGem.name.toLowerCase();
                if (type.includes('sapphire')) return 'blue-medium';
                if (type.includes('ruby')) return 'red-medium';
                if (type.includes('emerald')) return 'green-medium';
                if (type.includes('diamond')) return 'colorless';
                if (type.includes('amethyst')) return 'purple-violet';
                if (type.includes('garnet')) return 'red-dark';
                if (type.includes('topaz') || type.includes('aquamarine')) return 'blue-light';
                if (type.includes('alexandrite')) return 'green-dark';
                if (type.includes('opal') || type.includes('tourmaline')) return 'multi-color';
                if (type.includes('pearl')) return 'colorless';
                return 'colorless'; // Fallback so validation passes
            })(),
            gemTransparency: (() => {
                if (!prefilledGem) return '';
                const type = prefilledGem.name.toLowerCase();
                if (type.includes('pearl') || type.includes('opal') || type.includes('jade') || type.includes('moonstone')) {
                    return 'opaque';
                }
                return 'transparent'; // Fallback
            })(),
            gemImageUrl: prefilledGem ? prefilledGem.image : '',
            designPrompt: '',
            materials: { metals: [], finish: undefined },
            numImages: 3,
        },
    });

    const gemType = watch('gemType');
    const gemCut = watch('gemCut');
    const gemSizeMode = watch('gemSizeMode');
    const gemSizeSimple = watch('gemSizeSimple');
    const gemColor = watch('gemColor');
    const gemTransparency = watch('gemTransparency');
    const gemImageUrl = watch('gemImageUrl');
    const designPrompt = watch('designPrompt');
    const materials = watch('materials');
    const numImages = watch('numImages');

    const canProceedStep1 = gemType && gemCut && (gemSizeMode === 'simple' ? gemSizeSimple : true) && gemColor && gemTransparency;
    const canProceedStep2 = true;
    const canProceedStep3 = designPrompt && designPrompt.length >= 10;

    const canProceed = () => {
        switch (currentStep) {
            case 1: return canProceedStep1;
            case 2: return canProceedStep2;
            case 3: return canProceedStep3;
            default: return true;
        }
    };

    const handleNext = () => {
        if (currentStep < 4 && canProceed()) {
            if (currentStep === 3) {
                // Prevent aggressive double-clicks from instantly traversing through Step 4
                setIsTransitioning(true);
                setTimeout(() => setIsTransitioning(false), 600);
            }
            setCurrentStep(currentStep + 1);
            // Scroll to top of form implicitly on mobile
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const onSubmit = (data: GemFormValues) => {
        // Navigate IMMEDIATELY — do NOT await the API here.
        // The Results page will call the API itself so the sidebar can
        // load concurrently rather than being blocked by the long AI generation.
        setError('');
        navigate('/jewelry-designer/results', {
            state: { pendingData: data },
        });
    };

    return (
        <div className="min-h-screen relative bg-[#FAFAF8] overflow-x-hidden selection:bg-[#D4AF37]/30 flex flex-col items-center">
            {/* Cinematic Background Atmosphere */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-[#D4AF37]/10 to-transparent blur-[120px] mix-blend-multiply opacity-60" />
                <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[80vw] rounded-full bg-gradient-to-bl from-slate-200/50 to-[#F5D061]/10 blur-[130px] mix-blend-multiply opacity-50" />
                <div className="absolute -bottom-[20%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-[#D4AF37]/5 to-transparent blur-[100px] mix-blend-multiply opacity-40" />
            </div>

            <div className="w-full max-w-[1400px] px-6 lg:px-16 py-12 md:py-24 relative z-10 min-h-screen flex flex-col" style={{ fontFamily: "'Market Sans', sans-serif" }}>
                {(
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative flex-1">
                        {/* Left Column: Fixed Header & Progressive Tracker */}
                        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                                <span className="flex items-center text-[#B8860B] text-xs font-bold tracking-[0.2em] uppercase mb-6">
                                    <Crown className="w-4 h-4 mr-2" />
                                    Bespoke Studio
                                </span>
                                <h1 className="text-5xl lg:text-7xl text-gray-900 tracking-tight leading-[1.1] mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    <span className="block">Design</span>
                                    <span className="block italic text-slate-400">Brilliance.</span>
                                </h1>
                                
                                <p className="text-gray-500 leading-relaxed mb-12 max-w-sm">
                                    Step into our digital atelier. Configure your gemstone, map your vision, and allow our AI artisan to forge concept masterpieces in seconds.
                                </p>

                                {/* Premium Step Indicator (Desktop) */}
                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent hidden lg:block">
                                    {STEPS.map((step) => {
                                        const isCompleted = currentStep > step.id;
                                        const isCurrent = currentStep === step.id;
                                        
                                        return (
                                            <div key={step.id} className="relative flex items-center gap-6">
                                                <div className={`relative z-10 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-500
                                                    ${isCompleted ? 'bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/30 border-none' : isCurrent ? 'bg-gray-900 ring-4 ring-gray-900/10 border-none' : 'bg-white border-2 border-slate-200'}`}
                                                >
                                                    {isCompleted && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                                    {isCurrent && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                                                </div>
                                                <div className={`transition-all duration-300 ${isCurrent ? 'opacity-100 translate-x-1' : isCompleted ? 'opacity-70' : 'opacity-40'}`}>
                                                    <p className={`text-sm tracking-wide uppercase font-bold ${isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>{step.name}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {/* Mobile Mobile Step Indicator */}
                                <div className="lg:hidden flex items-center gap-2 mb-8 pr-4">
                                     {STEPS.map((step) => (
                                          <div key={step.id} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${currentStep >= step.id ? 'bg-[#D4AF37]' : 'bg-slate-200'}`} />
                                     ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column: Form Canvas */}
                        <div className="lg:col-span-8 lg:mt-16 w-full max-w-3xl">
                            <form onSubmit={handleSubmit(onSubmit)} className="relative h-full flex flex-col">
                                <div className="flex-1 min-h-[400px]">
                                    <AnimatePresence mode="wait">
                                        
                                        {/* Step 1: Gem Details */}
                                        {currentStep === 1 && (
                                            <motion.div key="step1" variants={staggerChildren} {...fadeInUp} className="space-y-12">
                                                <div className="mb-4 border-b border-slate-200 pb-6">
                                                    <h2 className="text-3xl md:text-4xl text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>01. The Gemstone</h2>
                                                    <p className="text-sm md:text-base text-gray-500">Every profound piece begins with the perfect stone. Detail your centerpiece below.</p>
                                                </div>
                                                <div className="space-y-10">
                                                    <GemTypeSelector register={register} errors={errors} value={gemType} onChange={(v) => setValue('gemType', v)} />
                                                    <GemCutSelector register={register} errors={errors} value={gemCut} onChange={(v) => setValue('gemCut', v)} />
                                                    <GemSizeInput register={register} errors={errors} sizeMode={gemSizeMode} selectedSize={gemSizeSimple || ''} onSizeModeChange={(m) => setValue('gemSizeMode', m)} onSizeChange={(s) => setValue('gemSizeSimple', s)} />
                                                    <GemColorSelector register={register} errors={errors} value={gemColor} onChange={(v) => setValue('gemColor', v)} />
                                                    <TransparencySelector register={register} errors={errors} value={gemTransparency} onChange={(v) => setValue('gemTransparency', v)} />
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Step 2: Reference Image */}
                                        {currentStep === 2 && (
                                            <motion.div key="step2" {...fadeInUp} className="space-y-12">
                                                <div className="mb-4 border-b border-slate-200 pb-6">
                                                    <h2 className="text-3xl md:text-4xl text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>02. Visual Anchor</h2>
                                                    <p className="text-sm md:text-base text-gray-500">Attach an inspiration photo or a direct capture of your stone to guide our AI.</p>
                                                </div>
                                                <ImageUpload value={gemImageUrl} onChange={(url) => setValue('gemImageUrl', url)} />
                                            </motion.div>
                                        )}

                                        {/* Step 3: Design Vision */}
                                        {currentStep === 3 && (
                                            <motion.div key="step3" {...fadeInUp} className="space-y-12">
                                                <div className="mb-4 border-b border-slate-200 pb-6">
                                                    <h2 className="text-3xl md:text-4xl text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>03. The Vision</h2>
                                                    <p className="text-sm md:text-base text-gray-500">Translate your imagination into words. The more precise the prompt, the more breathtaking the result.</p>
                                                </div>
                                                <div className="space-y-10">
                                                    <DesignPromptInput register={register} errors={errors} value={designPrompt} />
                                                    <MaterialSelector selectedMetals={materials?.metals || []} selectedFinish={materials?.finish} onMetalsChange={(m) => setValue('materials.metals', m)} onFinishChange={(f) => setValue('materials.finish', f)} />
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Step 4: Ready to Create */}
                                        {currentStep === 4 && (
                                            <motion.div key="step4" {...fadeInUp} className="space-y-6">
                                                <div className="mb-2 border-b border-slate-200 pb-4">
                                                    <h2 className="text-3xl md:text-4xl text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>04. The Manifest</h2>
                                                    <p className="text-sm md:text-base text-gray-500">Review your bespoke parameters before initializing the artisan AI.</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-md border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                                        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#B8860B] mb-4 flex items-center">
                                                            <Gem className="w-4 h-4 mr-3" />
                                                            Stone Specs
                                                        </h3>
                                                        <div className="space-y-3 text-sm">
                                                            <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400">Type</span><span className="text-gray-900 font-semibold capitalize">{gemType}</span></div>
                                                            <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400">Cut</span><span className="text-gray-900 font-semibold">{gemCut}</span></div>
                                                            <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400">Color</span><span className="text-gray-900 font-semibold">{gemColor}</span></div>
                                                            <div className="flex justify-between"><span className="text-slate-400">Clarity</span><span className="text-gray-900 font-semibold">{gemTransparency}</span></div>
                                                        </div>
                                                    </div>

                                                    <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-md border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-left">
                                                        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#B8860B] mb-4 flex items-center">
                                                            <Sparkles className="w-4 h-4 mr-3" />
                                                            Prompt
                                                        </h3>
                                                        <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-[#D4AF37] pl-4 whitespace-pre-wrap">{designPrompt}</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-slate-50/80 rounded-2xl border border-slate-200 gap-4">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">Variations</p>
                                                        <p className="text-xs text-slate-500 mt-1">Select the volume of concepts to generate</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {[2, 3, 4].map((num) => (
                                                            <button
                                                                key={num}
                                                                type="button"
                                                                onClick={() => setValue('numImages', num)}
                                                                className={`w-12 h-12 rounded-full font-bold text-sm transition-all duration-300
                                                                    ${numImages === num
                                                                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                                                                        : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400 hover:text-gray-900'
                                                                    }`}
                                                            >
                                                                {num}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="p-5 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-start gap-4">
                                                    <AlertTriangle className="w-5 h-5 text-[#B8860B] shrink-0 mt-0.5" />
                                                    <p className="text-xs text-[#8B6914] leading-relaxed">
                                                        These are conceptual renderings designed to inspire. Final production jewelry may require structural adaptations by a master jeweler.
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-5 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200">
                                            <p className="text-sm text-red-600 font-medium">{error}</p>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Floating Master Navigation Bar */}
                                <div className="mt-12 pt-8 border-t border-slate-200 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        disabled={currentStep === 1}
                                        className={`flex items-center px-1 py-3 text-sm tracking-widest uppercase font-bold transition-all duration-300
                                            ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:text-gray-900 hover:-translate-x-2'}`}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        Back
                                    </button>

                                    {currentStep < 4 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            disabled={!canProceed()}
                                            className={`flex items-center px-8 py-4 rounded-full text-sm tracking-widest uppercase font-bold transition-all duration-500
                                                ${canProceed()
                                                    ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-gray-900/40 hover:scale-[1.02] cursor-pointer'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            Next Phase
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isTransitioning}
                                            className={`flex items-center px-8 md:px-10 py-4 rounded-full text-sm tracking-widest uppercase font-bold transition-all duration-500
                                                ${isTransitioning 
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50' 
                                                    : 'bg-gradient-to-r from-[#D4AF37] via-[#F5D061] to-[#D4AF37] text-gray-900 shadow-xl shadow-[#D4AF37]/30 hover:shadow-2xl hover:shadow-[#D4AF37]/50 hover:scale-[1.02] cursor-pointer'
                                                }
                                            `}
                                        >
                                            <Wand2 className="w-4 h-4 mr-2 md:mr-3" />
                                            Forge Masterpiece
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JewelryDesigner;
