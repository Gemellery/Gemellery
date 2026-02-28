import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gem, Camera, Sparkles, Wand2,
    ChevronLeft, ChevronRight, Crown,
    AlertTriangle, Check,
} from 'lucide-react';
import { gemFormSchema, type GemFormValues } from '../../lib/jewelry-designer/validation';
import { generateDesign } from '../../lib/jewelry-designer/api';
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
    animate: { transition: { staggerChildren: 0.08 } },
};

const JewelryDesigner: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
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
            gemType: '',
            gemCut: '',
            gemSizeMode: 'simple',
            gemSizeSimple: '',
            gemColor: '',
            gemTransparency: '',
            gemImageUrl: '',
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
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onSubmit = async (data: GemFormValues) => {
        setIsGenerating(true);
        setError('');

        try {
            const response = await generateDesign(data);
            navigate('/jewelry-designer/results', {
                state: { design: response.design },
            });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate design';
            setError(errorMessage);
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen" style={{ background: '#FAFAF8', fontFamily: "'Market Sans', sans-serif" }}>
            <div className="max-w-[1200px] mx-auto px-4 py-10">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mb-5"
                >
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-sm text-[#8B6914]" style={{ fontFamily: "'Market Sans', sans-serif" }}>
                        <Crown className="w-4 h-4 mr-2 text-[#D4AF37]" />
                        AI-Powered Design Studio
                    </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl text-center text-gray-900 mb-3 tracking-tight"
                    style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400 }}
                >
                    Create Your Masterpiece
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center text-gray-500 text-sm mb-10"
                    style={{ fontFamily: "'Market Sans', sans-serif" }}
                >
                    Transform your vision into stunning jewelry with the power of AI
                </motion.p>

                {/* Step Indicator */}
                {!isGenerating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center items-start mb-10 gap-2 max-w-[1000px] mx-auto"
                    >
                        {STEPS.map((step, index) => {
                            const isCompleted = currentStep > step.id;
                            const isCurrent = currentStep === step.id;
                            const Icon = step.icon;

                            return (
                                <React.Fragment key={step.id}>
                                    <div className="flex flex-col items-center min-w-[90px]">
                                        {/* Step Icon */}
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-all duration-300
                                                ${isCompleted
                                                    ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] shadow-[#D4AF37]/20'
                                                    : isCurrent
                                                        ? 'bg-gradient-to-br from-[#D4AF37] to-[#F5D061] shadow-[#D4AF37]/20'
                                                        : 'bg-gray-100 border border-gray-200'
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <Check className="w-5 h-5 text-white" strokeWidth={3} />
                                            ) : (
                                                <Icon className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-gray-400'}`} />
                                            )}
                                        </motion.div>

                                        {/* Step Name */}
                                        <p className={`mt-2 text-[13px] font-semibold transition-colors duration-300
                                            ${isCurrent ? 'text-[#B8860B]' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}
                                            style={{ fontFamily: "'Market Sans', sans-serif" }}
                                        >
                                            {step.name}
                                        </p>

                                        {/* Step Description */}
                                        <p className="text-[11px] text-gray-400 text-center" style={{ fontFamily: "'Market Sans', sans-serif" }}>{step.description}</p>
                                    </div>

                                    {/* Connector Line */}
                                    {index < STEPS.length - 1 && (
                                        <div className="w-[120px] h-[2px] mt-[22px] relative overflow-hidden rounded-full">
                                            <div className={`absolute inset-0 transition-all duration-500
                                                ${currentStep > step.id
                                                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D061]'
                                                    : 'bg-gray-200'
                                                }`}
                                            />
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </motion.div>
                )}

                {/* Form Card */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <motion.div
                        layout
                        className="rounded-2xl p-8 bg-white border border-gray-200 shadow-sm"
                    >
                        <AnimatePresence mode="wait">
                            {/* Step 1: Gem Details */}
                            {currentStep === 1 && (
                                <motion.div key="step1" variants={staggerChildren} {...fadeInUp} className="flex flex-col gap-6">
                                    <div className="flex items-center mb-2">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mr-4 shadow-md shadow-[#D4AF37]/20">
                                            <Gem className="w-[22px] h-[22px] text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: "'Market Sans', sans-serif" }}>Gem Details</h2>
                                            <p className="text-[13px] text-gray-500" style={{ fontFamily: "'Market Sans', sans-serif" }}>Tell us about your precious gemstone</p>
                                        </div>
                                    </div>

                                    <GemTypeSelector register={register} errors={errors} value={gemType} onChange={(v) => setValue('gemType', v)} />
                                    <GemCutSelector register={register} errors={errors} value={gemCut} onChange={(v) => setValue('gemCut', v)} />
                                    <GemSizeInput register={register} errors={errors} sizeMode={gemSizeMode} selectedSize={gemSizeSimple || ''} onSizeModeChange={(m) => setValue('gemSizeMode', m)} onSizeChange={(s) => setValue('gemSizeSimple', s)} />
                                    <GemColorSelector register={register} errors={errors} value={gemColor} onChange={(v) => setValue('gemColor', v)} />
                                    <TransparencySelector register={register} errors={errors} value={gemTransparency} onChange={(v) => setValue('gemTransparency', v)} />
                                </motion.div>
                            )}

                            {/* Step 2: Reference Image */}
                            {currentStep === 2 && (
                                <motion.div key="step2" {...fadeInUp} className="flex flex-col gap-6">
                                    <div className="flex items-center mb-2">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F5D061] flex items-center justify-center mr-4 shadow-md shadow-[#D4AF37]/20">
                                            <Camera className="w-[22px] h-[22px] text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: "'Market Sans', sans-serif" }}>Upload Reference</h2>
                                            <p className="text-[13px] text-gray-500" style={{ fontFamily: "'Market Sans', sans-serif" }}>Add a photo of your gem (optional)</p>
                                        </div>
                                    </div>

                                    <ImageUpload value={gemImageUrl} onChange={(url) => setValue('gemImageUrl', url)} />
                                    <p className="text-[13px] text-gray-400" style={{ fontFamily: "'Market Sans', sans-serif" }}>This helps our AI create more accurate designs</p>
                                </motion.div>
                            )}

                            {/* Step 3: Design Vision */}
                            {currentStep === 3 && (
                                <motion.div key="step3" {...fadeInUp} className="flex flex-col gap-6">
                                    <div className="flex items-center mb-2">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F5D061] flex items-center justify-center mr-4 shadow-md shadow-[#D4AF37]/20">
                                            <Sparkles className="w-[22px] h-[22px] text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: "'Market Sans', sans-serif" }}>Design Vision</h2>
                                            <p className="text-[13px] text-gray-500" style={{ fontFamily: "'Market Sans', sans-serif" }}>Describe your dream jewelry piece</p>
                                        </div>
                                    </div>

                                    <DesignPromptInput register={register} errors={errors} value={designPrompt} />
                                    <MaterialSelector selectedMetals={materials?.metals || []} selectedFinish={materials?.finish} onMetalsChange={(m) => setValue('materials.metals', m)} onFinishChange={(f) => setValue('materials.finish', f)} />
                                </motion.div>
                            )}

                            {/* Step 4: Ready to Create */}
                            {currentStep === 4 && !isGenerating && (
                                <motion.div key="step4" {...fadeInUp} className="flex flex-col gap-6">
                                    <div className="flex items-center mb-2">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mr-4 shadow-md shadow-[#D4AF37]/20">
                                            <Wand2 className="w-[22px] h-[22px] text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: "'Market Sans', sans-serif" }}>Ready to Create</h2>
                                            <p className="text-[13px] text-gray-500" style={{ fontFamily: "'Market Sans', sans-serif" }}>Review your choices and generate designs</p>
                                        </div>
                                    </div>

                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#D4AF37]/40 transition-all duration-300"
                                        >
                                            <h3 className="text-[13px] font-semibold text-[#B8860B] mb-3 flex items-center" style={{ fontFamily: "'Market Sans', sans-serif" }}>
                                                <Gem className="w-3.5 h-3.5 mr-2" />
                                                Gem Specifications
                                            </h3>
                                            <div className="flex flex-col gap-2 text-[13px]" style={{ fontFamily: "'Market Sans', sans-serif" }}>
                                                <div className="flex justify-between"><span className="text-gray-400">Type</span><span className="text-gray-900 font-medium capitalize">{gemType}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-400">Cut</span><span className="text-gray-900 font-medium">{gemCut}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-400">Color</span><span className="text-gray-900 font-medium">{gemColor}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-400">Clarity</span><span className="text-gray-900 font-medium">{gemTransparency}</span></div>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#D4AF37]/40 transition-all duration-300"
                                        >
                                            <h3 className="text-[13px] font-semibold text-[#B8860B] mb-3 flex items-center" style={{ fontFamily: "'Market Sans', sans-serif" }}>
                                                <Sparkles className="w-3.5 h-3.5 mr-2" />
                                                Design Vision
                                            </h3>
                                            <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-4" style={{ fontFamily: "'Market Sans', sans-serif" }}>{designPrompt}</p>
                                        </motion.div>
                                    </div>

                                    {/* Variations */}
                                    <div className="flex items-center justify-center gap-3 py-2">
                                        <span className="text-[13px] text-gray-500" style={{ fontFamily: "'Market Sans', sans-serif" }}>Variations:</span>
                                        {[2, 3, 4].map((num) => (
                                            <motion.button
                                                key={num}
                                                type="button"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setValue('numImages', num)}
                                                className={`w-9 h-9 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200
                                                    ${numImages === num
                                                        ? 'border-2 border-[#D4AF37] bg-[#D4AF37]/15 text-[#8B6914] shadow-md shadow-[#D4AF37]/10'
                                                        : 'border border-gray-300 bg-white text-gray-400 hover:border-gray-400'
                                                    }`}
                                                style={{ fontFamily: "'Market Sans', sans-serif" }}
                                            >
                                                {num}
                                            </motion.button>
                                        ))}
                                    </div>

                                    {/* Generate Button */}
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.01, boxShadow: '0 8px 30px rgba(212, 175, 55, 0.25)' }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 rounded-xl border-none bg-gradient-to-r from-[#D4AF37] via-[#F5D061] to-[#D4AF37] text-white font-bold text-[15px] flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 transition-shadow duration-300"
                                        style={{ fontFamily: "'Market Sans', sans-serif" }}
                                    >
                                        <Wand2 className="w-[18px] h-[18px]" />
                                        Generate My Design
                                    </motion.button>

                                    <p className="text-center text-xs text-gray-400" style={{ fontFamily: "'Market Sans', sans-serif" }}>This will take 10-15 seconds</p>

                                    {/* Disclaimer */}
                                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                                        <div className="flex items-start">
                                            <AlertTriangle className="w-[18px] h-[18px] text-amber-500 mr-3 shrink-0 mt-0.5" />
                                            <p className="text-[13px] text-amber-700 leading-relaxed" style={{ fontFamily: "'Market Sans', sans-serif" }}>
                                                <strong className="text-amber-800">Important:</strong> These are concept renderings, not final production designs.
                                                Actual jewelry may vary. Consult a professional jeweler for production-ready designs.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Generating State */}
                            {isGenerating && (
                                <motion.div key="generating" {...fadeInUp} className="text-center py-16">
                                    {/* Animated circle */}
                                    <div className="relative w-[110px] h-[110px] mx-auto mb-8">
                                        {/* Spinning outer ring */}
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                            className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#D4AF37] border-r-[#F5D061]/50"
                                        />
                                        {/* Inner gold circle */}
                                        <motion.div
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                            className="absolute inset-3 rounded-full bg-gradient-to-br from-[#F5A623] via-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-xl shadow-[#D4AF37]/20"
                                        >
                                            <Wand2 className="w-9 h-9 text-white" />
                                        </motion.div>
                                    </div>

                                    <h2 className="text-[28px] text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400 }}>
                                        Creating Magic
                                    </h2>
                                    <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'Market Sans', sans-serif" }}>
                                        AI is crafting {numImages} unique designs...
                                    </p>

                                    {/* Animated progress bar */}
                                    <div className="w-[200px] mx-auto h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '200%' }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                            className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full"
                                        />
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-4" style={{ fontFamily: "'Market Sans', sans-serif" }}>Usually takes 15-30 seconds</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200"
                            >
                                <p className="text-sm text-red-600" style={{ fontFamily: "'Market Sans', sans-serif" }}>{error}</p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Navigation */}
                    {!isGenerating && (
                        <div className="flex justify-between mt-6">
                            <motion.button
                                type="button"
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                whileHover={currentStep > 1 ? { x: -3 } : {}}
                                className={`flex items-center px-4 py-2.5 bg-transparent border-none text-sm cursor-pointer transition-colors duration-200
                                    ${currentStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-900'}`}
                                style={{ fontFamily: "'Market Sans', sans-serif" }}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Back
                            </motion.button>

                            {currentStep < 4 && (
                                <motion.button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                    whileHover={canProceed() ? { scale: 1.02, boxShadow: '0 4px 20px rgba(212, 175, 55, 0.2)' } : {}}
                                    whileTap={canProceed() ? { scale: 0.98 } : {}}
                                    className={`flex items-center px-6 py-2.5 rounded-lg border-none font-semibold text-sm transition-all duration-200
                                        ${canProceed()
                                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D061] text-white cursor-pointer shadow-md shadow-[#D4AF37]/15'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    style={{ fontFamily: "'Market Sans', sans-serif" }}
                                >
                                    Continue
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </motion.button>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default JewelryDesigner;
