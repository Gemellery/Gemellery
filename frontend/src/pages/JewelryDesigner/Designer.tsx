import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
    Gem, Camera, Sparkles, Wand2,
    ChevronLeft, ChevronRight, AlertTriangle
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

// Step definitions matching mockup
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

    // Form state
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

    // Watch form values
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

    // Step validation
    const canProceedStep1 = gemType && gemCut && (gemSizeMode === 'simple' ? gemSizeSimple : true) && gemColor && gemTransparency;
    const canProceedStep2 = true; // Image is optional
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
        } catch (err: any) {
            setError(err.message || 'Failed to generate design');
            setIsGenerating(false);
        }
    };

    // Render step indicator (matching mockup)
    const renderStepIndicator = () => (
        <div className="flex justify-center items-center mb-10">
            {STEPS.map((step, index) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                const Icon = step.icon;

                return (
                    <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center transition-all
                  ${isCompleted
                                        ? 'bg-green-500'
                                        : isCurrent
                                            ? 'bg-[#D4AF37]'
                                            : 'bg-[#1a1f35] border border-gray-700'
                                    }
                `}
                            >
                                {isCompleted ? (
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <Icon className={`w-5 h-5 ${isCurrent ? 'text-[#0A1128]' : 'text-gray-500'}`} />
                                )}
                            </div>
                            <p className={`mt-2 text-sm font-medium ${isCurrent ? 'text-[#D4AF37]' : isCompleted ? 'text-white' : 'text-gray-500'}`}>
                                {step.name}
                            </p>
                            <p className="text-xs text-gray-600">{step.description}</p>
                        </div>

                        {index < STEPS.length - 1 && (
                            <div className={`w-16 h-0.5 mx-2 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-700'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0A1128]">
            <div className="max-w-4xl mx-auto py-12 px-4">
                {/* Header Badge */}
                <div className="flex justify-center mb-6">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#1a1f35] border border-gray-700 text-sm text-gray-400">
                        <Wand2 className="w-4 h-4 mr-2 text-[#D4AF37]" />
                        AI-Powered Design Studio
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-serif text-center text-[#D4AF37] mb-3">
                    Create Your Masterpiece
                </h1>
                <p className="text-center text-gray-400 mb-10">
                    Transform your vision into stunning jewelry with the power of AI
                </p>

                {/* Step Indicator */}
                {!isGenerating && renderStepIndicator()}

                {/* Form Card */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="bg-[#111827] rounded-2xl border border-gray-800 p-8">

                        {/* Step 1: Gem Details */}
                        {currentStep === 1 && (
                            <div className="space-y-8">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#D4AF37] flex items-center justify-center mr-4">
                                        <Gem className="w-6 h-6 text-[#0A1128]" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-[#D4AF37]">Gem Details</h2>
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
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mr-4">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-[#D4AF37]">Upload Reference</h2>
                                        <p className="text-sm text-gray-400">Add a photo of your gem (optional)</p>
                                    </div>
                                </div>

                                <ImageUpload
                                    value={gemImageUrl}
                                    onChange={(url) => setValue('gemImageUrl', url)}
                                />
                            </div>
                        )}

                        {/* Step 3: Design Vision */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-pink-500 flex items-center justify-center mr-4">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-[#D4AF37]">Design Vision</h2>
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
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#D4AF37] flex items-center justify-center mr-4">
                                        <Wand2 className="w-6 h-6 text-[#0A1128]" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-[#D4AF37]">Ready to Create</h2>
                                        <p className="text-sm text-gray-400">Review your choices and generate designs</p>
                                    </div>
                                </div>

                                {/* Summary Cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Gem Specifications */}
                                    <div className="p-4 rounded-xl border border-gray-700 bg-[#1a1f35]">
                                        <h3 className="text-sm font-medium text-[#D4AF37] mb-3 flex items-center">
                                            <Gem className="w-4 h-4 mr-2" />
                                            Gem Specifications
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Type</span>
                                                <span className="text-white capitalize">{gemType}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Cut</span>
                                                <span className="text-white">{gemCut}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Color</span>
                                                <span className="text-white">{gemColor}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Clarity</span>
                                                <span className="text-white">{gemTransparency}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Design Vision */}
                                    <div className="p-4 rounded-xl border border-gray-700 bg-[#1a1f35]">
                                        <h3 className="text-sm font-medium text-pink-400 mb-3 flex items-center">
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Design Vision
                                        </h3>
                                        <p className="text-sm text-gray-300 line-clamp-4">{designPrompt}</p>
                                    </div>
                                </div>

                                {/* Variations Selector */}
                                <div className="flex items-center justify-center space-x-4">
                                    <span className="text-sm text-gray-400">Variations:</span>
                                    {[2, 3, 4].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setValue('numImages', num)}
                                            className={`
                        w-10 h-10 rounded-lg border-2 font-medium transition-all
                        ${numImages === num
                                                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white'
                                                    : 'border-gray-700 text-gray-500 hover:border-gray-600'
                                                }
                      `}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>

                                {/* Generate Button */}
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#F5D061] text-[#0A1128] font-semibold rounded-xl flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                                >
                                    <Wand2 className="w-5 h-5" />
                                    <span>Generate My Design</span>
                                </button>

                                <p className="text-center text-xs text-gray-500">
                                    This will take 10-15 seconds
                                </p>

                                {/* Disclaimer */}
                                <div className="p-4 rounded-xl bg-amber-900/30 border border-amber-700/50">
                                    <div className="flex items-start">
                                        <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-amber-200">
                                                <strong>Important:</strong> These are concept renderings, not final production designs.
                                                Actual jewelry may vary. Consult a professional jeweler for production-ready designs.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Generating State */}
                        {isGenerating && (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#D4AF37] flex items-center justify-center">
                                    <Wand2 className="w-10 h-10 text-[#0A1128] animate-pulse" />
                                </div>
                                <h2 className="text-2xl font-serif text-white mb-2">Creating Magic</h2>
                                <p className="text-gray-400 mb-6">AI is crafting {numImages} unique designs...</p>
                                <div className="w-48 mx-auto h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#D4AF37] rounded-full animate-pulse" style={{ width: '60%' }} />
                                </div>
                                <p className="text-xs text-gray-600 mt-4">Usually takes 15-30 seconds</p>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mt-6 p-4 rounded-xl bg-red-900/30 border border-red-700/50">
                                <p className="text-sm text-red-300">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    {!isGenerating && (
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                className={`
                  flex items-center px-6 py-3 rounded-xl transition-all
                  ${currentStep === 1
                                        ? 'text-gray-600 cursor-not-allowed'
                                        : 'text-gray-400 hover:text-white'
                                    }
                `}
                            >
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                Back
                            </button>

                            {currentStep < 4 && (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                    className={`
                    flex items-center px-8 py-3 rounded-xl font-medium transition-all
                    ${canProceed()
                                            ? 'bg-[#D4AF37] text-[#0A1128] hover:bg-[#e5c349]'
                                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        }
                  `}
                                >
                                    Continue
                                    <ChevronRight className="w-5 h-5 ml-1" />
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
