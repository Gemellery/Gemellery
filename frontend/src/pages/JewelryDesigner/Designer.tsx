import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
    Gem, Camera, Sparkles, Wand2,
    ChevronLeft, ChevronRight, AlertTriangle, Crown, User, ChevronDown
} from 'lucide-react';
import { gemFormSchema } from '../../lib/jewelry-designer/validation';
import type { GemFormValues } from '../../lib/jewelry-designer/validation';
import { generateDesign } from '../../lib/jewelry-designer/api';

// Form Components
import { GemTypeSelector } from '../../components/jewelry-designer/forms/GemTypeSelector';
import { GemCutSelector } from '../../components/jewelry-designer/forms/GemCutSelector';
import { GemSizeInput } from '../../components/jewelry-designer/forms/GemSizeInput';
import { GemColorSelector } from '../../components/jewelry-designer/forms/GemColorSelector';
import { TransparencySelector } from '../../components/jewelry-designer/forms/TransparencySelector';
import { ImageUpload } from '../../components/jewelry-designer/forms/ImageUpload';
import { DesignPromptInput } from '../../components/jewelry-designer/forms/DesignPromptInput';
import { MaterialSelector } from '../../components/jewelry-designer/forms/MaterialSelector';

// Step definitions - matching mockup exactly
const STEPS = [
    { id: 1, name: 'Gem Details', description: 'Describe your gemstone', icon: Gem },
    { id: 2, name: 'Reference', description: 'Add a photo', icon: Camera },
    { id: 3, name: 'Vision', description: 'Your dream design', icon: Sparkles },
    { id: 4, name: 'Create', description: 'Generate magic', icon: Wand2 },
];

const JewelryDesigner: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsed = JSON.parse(user);
            setUserName(parsed.full_name || parsed.email || 'admin');
        }
    }, []);

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
    const canProceedStep4 = canProceedStep1 && canProceedStep3;

    const canProceed = () => {
        switch (currentStep) {
            case 1: return canProceedStep1;
            case 2: return canProceedStep2;
            case 3: return canProceedStep3;
            case 4: return canProceedStep4;
            default: return false;
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

    // Get step icon background color based on state - matching mockup exactly
    const getStepIconBg = (stepId: number, isCompleted: boolean, isCurrent: boolean) => {
        if (isCompleted) return 'bg-emerald-500';
        if (!isCurrent) return 'bg-[#1e2337]';

        switch (stepId) {
            case 1: return 'bg-emerald-500'; // Gem - green
            case 2: return 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B]'; // Camera - gold/orange gradient
            case 3: return 'bg-gradient-to-br from-pink-500 to-rose-600'; // Sparkles - pink/magenta
            case 4: return 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B]'; // Wand - gold
            default: return 'bg-[#1e2337]';
        }
    };

    // Render step indicator - matching mockup exactly
    const renderStepIndicator = () => (
        <div className="flex justify-center items-start mb-12 px-4">
            {STEPS.map((step, index) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                const Icon = step.icon;

                return (
                    <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center" style={{ minWidth: '100px' }}>
                            {/* Step Icon */}
                            <div
                                className={`
                                    w-11 h-11 rounded-xl flex items-center justify-center shadow-lg
                                    ${getStepIconBg(step.id, isCompleted, isCurrent)}
                                `}
                                style={{
                                    boxShadow: isCurrent || isCompleted
                                        ? '0 4px 15px rgba(0, 0, 0, 0.3)'
                                        : 'none'
                                }}
                            >
                                {isCompleted ? (
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <Icon className={`w-5 h-5 ${isCurrent ? 'text-[#0A0F1E]' : 'text-gray-500'}`} />
                                )}
                            </div>

                            {/* Step Name */}
                            <p className={`mt-2 text-sm font-medium ${isCurrent ? 'text-[#D4AF37]' : isCompleted ? 'text-white' : 'text-gray-500'}`}>
                                {step.name}
                            </p>

                            {/* Step Description */}
                            <p className="text-xs text-gray-600 text-center whitespace-nowrap">
                                {step.description}
                            </p>
                        </div>

                        {/* Connector Line */}
                        {index < STEPS.length - 1 && (
                            <div
                                className={`h-0.5 mt-5 ${currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-700'}`}
                                style={{ width: '60px', marginLeft: '4px', marginRight: '4px' }}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0A0F1E]">
            {/* Header - matching mockup exactly */}
            <header className="w-full border-b border-gray-800/50 bg-[#0A0F1E]">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center"
                            style={{
                                background: 'linear-gradient(135deg, #F5A623 0%, #D4AF37 50%, #B8860B 100%)',
                            }}
                        >
                            <div className="w-5 h-5 rounded-full border-2 border-[#0A0F1E]" />
                        </div>
                        <span className="text-white font-medium">AI Jewelry Designer</span>
                    </div>

                    {/* User */}
                    <div className="flex items-center space-x-2 text-gray-400">
                        <User className="w-4 h-4" />
                        <span className="text-sm">{userName || 'admin'}</span>
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto py-10 px-4">
                {/* Badge - matching mockup */}
                <div className="flex justify-center mb-5">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#1a1f35]/80 border border-gray-700/50 text-sm text-gray-300">
                        <Crown className="w-4 h-4 mr-2 text-[#D4AF37]" />
                        AI-Powered Design Studio
                    </span>
                </div>

                {/* Title - matching mockup italic serif style */}
                <h1
                    className="text-4xl md:text-5xl text-center mb-3"
                    style={{
                        fontFamily: 'Georgia, "Times New Roman", serif',
                        fontStyle: 'italic',
                        color: '#D4AF37',
                        fontWeight: 400,
                    }}
                >
                    Create Your Masterpiece
                </h1>
                <p className="text-center text-gray-400 mb-10 text-sm">
                    Transform your vision into stunning jewelry with the power of AI
                </p>

                {/* Step Indicator */}
                {!isGenerating && renderStepIndicator()}

                {/* Form Card */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div
                        className="rounded-2xl p-6 md:p-8"
                        style={{
                            background: 'linear-gradient(180deg, rgba(26, 31, 53, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)',
                            border: '1px solid rgba(75, 85, 99, 0.3)',
                        }}
                    >
                        {/* Step 1: Gem Details */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="flex items-center mb-4">
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center mr-4"
                                        style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' }}
                                    >
                                        <Gem className="w-5 h-5 text-[#0A0F1E]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">Gem Details</h2>
                                        <p className="text-sm text-gray-400">Tell us about your precious gemstone</p>
                                    </div>
                                </div>

                                <GemTypeSelector
                                    register={register}
                                    errors={errors}
                                    value={gemType}
                                    onChange={(v) => setValue('gemType', v)}
                                />
                                <GemCutSelector
                                    register={register}
                                    errors={errors}
                                    value={gemCut}
                                    onChange={(v) => setValue('gemCut', v)}
                                />
                                <GemSizeInput
                                    register={register}
                                    errors={errors}
                                    sizeMode={gemSizeMode}
                                    selectedSize={gemSizeSimple || ''}
                                    onSizeModeChange={(m) => setValue('gemSizeMode', m)}
                                    onSizeChange={(s) => setValue('gemSizeSimple', s)}
                                />
                                <GemColorSelector
                                    register={register}
                                    errors={errors}
                                    value={gemColor}
                                    onChange={(v) => setValue('gemColor', v)}
                                />
                                <TransparencySelector
                                    register={register}
                                    errors={errors}
                                    value={gemTransparency}
                                    onChange={(v) => setValue('gemTransparency', v)}
                                />
                            </div>
                        )}

                        {/* Step 2: Reference Image */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="flex items-center mb-4">
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center mr-4"
                                        style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}
                                    >
                                        <Camera className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">Upload Reference</h2>
                                        <p className="text-sm text-gray-400">Add a photo of your gem (optional)</p>
                                    </div>
                                </div>

                                <ImageUpload
                                    value={gemImageUrl}
                                    onChange={(url) => setValue('gemImageUrl', url)}
                                />

                                <p className="text-sm text-gray-500">
                                    This helps our AI create more accurate designs
                                </p>
                            </div>
                        )}

                        {/* Step 3: Design Vision */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="flex items-center mb-4">
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center mr-4"
                                        style={{ background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)' }}
                                    >
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">Design Vision</h2>
                                        <p className="text-sm text-gray-400">Describe your dream jewelry piece</p>
                                    </div>
                                </div>

                                <DesignPromptInput
                                    register={register}
                                    errors={errors}
                                    value={designPrompt}
                                />

                                <MaterialSelector
                                    selectedMetals={materials?.metals || []}
                                    selectedFinish={materials?.finish}
                                    onMetalsChange={(m) => setValue('materials.metals', m)}
                                    onFinishChange={(f) => setValue('materials.finish', f)}
                                />
                            </div>
                        )}

                        {/* Step 4: Ready to Create */}
                        {currentStep === 4 && !isGenerating && (
                            <div className="space-y-6">
                                <div className="flex items-center mb-4">
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center mr-4"
                                        style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' }}
                                    >
                                        <Wand2 className="w-5 h-5 text-[#0A0F1E]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">Ready to Create</h2>
                                        <p className="text-sm text-gray-400">Review your choices and generate designs</p>
                                    </div>
                                </div>

                                {/* Summary Cards - matching mockup */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-[#0f1320] border border-gray-800/50">
                                        <h3 className="text-sm font-medium text-[#D4AF37] mb-3 flex items-center">
                                            <Gem className="w-4 h-4 mr-2" />
                                            Gem Specifications
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Type</span>
                                                <span className="text-white font-medium capitalize">{gemType}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Cut</span>
                                                <span className="text-white font-medium">{gemCut}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Color</span>
                                                <span className="text-white font-medium">{gemColor}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Clarity</span>
                                                <span className="text-white font-medium">{gemTransparency}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-[#0f1320] border border-gray-800/50">
                                        <h3 className="text-sm font-medium text-pink-400 mb-3 flex items-center">
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Design Vision
                                        </h3>
                                        <p className="text-sm text-gray-300 leading-relaxed line-clamp-4">{designPrompt}</p>
                                    </div>
                                </div>

                                {/* Variations */}
                                <div className="flex items-center justify-center space-x-3 py-2">
                                    <span className="text-sm text-gray-400">Variations:</span>
                                    {[2, 3, 4].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setValue('numImages', num)}
                                            className={`
                                                w-9 h-9 rounded-lg border font-medium transition-all text-sm
                                                ${numImages === num
                                                    ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-white'
                                                    : 'border-gray-700 text-gray-500 hover:border-gray-600'
                                                }
                                            `}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>

                                {/* Generate Button - matching mockup */}
                                <button
                                    type="submit"
                                    className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all hover:opacity-90"
                                    style={{
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #F5D061 50%, #D4AF37 100%)',
                                        color: '#0A0F1E',
                                    }}
                                >
                                    <Wand2 className="w-5 h-5" />
                                    <span>Generate My Design</span>
                                </button>

                                <p className="text-center text-xs text-gray-500">
                                    This will take 10-15 seconds
                                </p>

                                {/* Disclaimer */}
                                <div className="p-4 rounded-xl bg-amber-900/20 border border-amber-700/30">
                                    <div className="flex items-start">
                                        <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-amber-200/90">
                                            <strong className="text-amber-400">Important:</strong> These are concept renderings, not final production designs.
                                            Actual jewelry may vary. Consult a professional jeweler for production-ready designs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Generating State - matching mockup exactly */}
                        {isGenerating && (
                            <div className="text-center py-16">
                                {/* Animated circle with ring */}
                                <div className="relative w-28 h-28 mx-auto mb-8">
                                    {/* Outer ring */}
                                    <div
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background: 'linear-gradient(180deg, rgba(26, 31, 53, 1) 0%, rgba(17, 24, 39, 1) 100%)',
                                            border: '3px solid rgba(75, 85, 99, 0.3)',
                                        }}
                                    />
                                    {/* Inner gold circle */}
                                    <div
                                        className="absolute inset-3 rounded-full flex items-center justify-center"
                                        style={{
                                            background: 'linear-gradient(135deg, #F5A623 0%, #D4AF37 50%, #B8860B 100%)',
                                        }}
                                    >
                                        <Wand2 className="w-10 h-10 text-[#0A0F1E]" />
                                    </div>
                                </div>

                                <h2
                                    className="text-2xl mb-2"
                                    style={{
                                        fontFamily: 'Georgia, "Times New Roman", serif',
                                        fontStyle: 'italic',
                                        color: 'white',
                                    }}
                                >
                                    Creating Magic
                                </h2>
                                <p className="text-gray-400 mb-6 text-sm">AI is crafting {numImages} unique designs...</p>

                                {/* Progress bar */}
                                <div className="w-48 mx-auto h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full animate-pulse"
                                        style={{
                                            width: '60%',
                                            background: 'linear-gradient(90deg, #D4AF37, #F5D061)',
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-gray-600 mt-4">Usually takes 15-30 seconds</p>
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 p-4 rounded-xl bg-red-900/30 border border-red-700/50">
                                <p className="text-sm text-red-300">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Navigation - matching mockup */}
                    {!isGenerating && (
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                className={`
                                    flex items-center px-4 py-2.5 transition-all text-sm
                                    ${currentStep === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'}
                                `}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Back
                            </button>

                            {currentStep < 4 && (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                    className={`
                                        flex items-center px-6 py-2.5 rounded-lg font-medium text-sm transition-all
                                        ${canProceed()
                                            ? 'text-[#0A0F1E]'
                                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                        }
                                    `}
                                    style={canProceed() ? {
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #F5D061 100%)',
                                    } : {}}
                                >
                                    Continue
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default JewelryDesigner;
