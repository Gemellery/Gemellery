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

// Step definitions
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

    // Step icon background based on state
    const getStepIconStyle = (stepId: number, isCompleted: boolean, isCurrent: boolean) => {
        if (isCompleted) {
            return { background: '#22C55E' }; // Green
        }
        if (!isCurrent) {
            return { background: '#1E2337', border: '1px solid #374151' };
        }

        switch (stepId) {
            case 1: return { background: '#22C55E' };
            case 2: return { background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' };
            case 3: return { background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)' };
            case 4: return { background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' };
            default: return { background: '#1E2337' };
        }
    };

    // Step indicator matching mockup
    const renderStepIndicator = () => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginBottom: '40px', gap: '8px', maxWidth: '1200px', margin: '0 auto 40px auto' }}>
            {STEPS.map((step, index) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                const Icon = step.icon;

                return (
                    <React.Fragment key={step.id}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '90px' }}>
                            {/* Step Icon */}
                            <div
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: (isCurrent || isCompleted) ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
                                    ...getStepIconStyle(step.id, isCompleted, isCurrent),
                                }}
                            >
                                {isCompleted ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ) : (
                                    <Icon style={{ width: '20px', height: '20px', color: isCurrent ? '#0A0F1E' : '#6B7280' }} />
                                )}
                            </div>

                            {/* Step Name */}
                            <p style={{
                                marginTop: '8px',
                                fontSize: '13px',
                                fontWeight: 500,
                                fontFamily: 'Inter, sans-serif',
                                color: isCurrent ? '#D4AF37' : isCompleted ? '#FFFFFF' : '#6B7280',
                            }}>
                                {step.name}
                            </p>

                            {/* Step Description */}
                            <p style={{
                                fontSize: '11px',
                                fontFamily: 'Inter, sans-serif',
                                color: '#4B5563',
                                textAlign: 'center',
                            }}>
                                {step.description}
                            </p>
                        </div>

                        {/* Connector Line */}
                        {index < STEPS.length - 1 && (
                            <div style={{
                                width: '120px',
                                height: '2px',
                                marginTop: '22px',
                                background: currentStep > step.id ? '#22C55E' : '#374151',
                            }} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#0A0F1E', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <header style={{
                width: '100%',
                borderBottom: '1px solid rgba(55, 65, 81, 0.5)',
                background: '#0A0F1E',
                padding: '16px 24px',
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #F5A623 0%, #D4AF37 50%, #B8860B 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                border: '2px solid #0A0F1E',
                            }} />
                        </div>
                        <span style={{ color: 'white', fontWeight: 500, fontSize: '16px' }}>AI Jewelry Designer</span>
                    </div>

                    {/* User */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF' }}>
                        <User style={{ width: '16px', height: '16px' }} />
                        <span style={{ fontSize: '14px' }}>{userName || 'admin'}</span>
                        <ChevronDown style={{ width: '16px', height: '16px' }} />
                    </div>
                </div>
            </header>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>
                {/* Badge */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '8px 16px',
                        borderRadius: '9999px',
                        background: 'rgba(26, 31, 53, 0.8)',
                        border: '1px solid rgba(55, 65, 81, 0.5)',
                        fontSize: '13px',
                        color: '#D1D5DB',
                    }}>
                        <Crown style={{ width: '16px', height: '16px', marginRight: '8px', color: '#D4AF37' }} />
                        AI-Powered Design Studio
                    </span>
                </div>

                {/* Title - Playfair Display Italic */}
                <h1 style={{
                    fontFamily: '"Playfair Display", serif',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: '48px',
                    textAlign: 'center',
                    color: '#D4AF37',
                    marginBottom: '12px',
                    letterSpacing: '-0.5px',
                }}>
                    Create Your Masterpiece
                </h1>

                <p style={{
                    textAlign: 'center',
                    color: '#9CA3AF',
                    fontSize: '14px',
                    marginBottom: '40px',
                    fontFamily: 'Inter, sans-serif',
                }}>
                    Transform your vision into stunning jewelry with the power of AI
                </p>

                {/* Step Indicator */}
                {!isGenerating && renderStepIndicator()}

                {/* Form Card */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{
                        borderRadius: '16px',
                        padding: '32px',
                        background: 'linear-gradient(180deg, rgba(26, 31, 53, 0.95) 0%, rgba(17, 24, 39, 0.98) 100%)',
                        border: '1px solid rgba(55, 65, 81, 0.3)',
                    }}>
                        {/* Step 1: Gem Details */}
                        {currentStep === 1 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '16px',
                                    }}>
                                        <Gem style={{ width: '22px', height: '22px', color: '#0A0F1E' }} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>Gem Details</h2>
                                        <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Tell us about your precious gemstone</p>
                                    </div>
                                </div>

                                <GemTypeSelector register={register} errors={errors} value={gemType} onChange={(v) => setValue('gemType', v)} />
                                <GemCutSelector register={register} errors={errors} value={gemCut} onChange={(v) => setValue('gemCut', v)} />
                                <GemSizeInput register={register} errors={errors} sizeMode={gemSizeMode} selectedSize={gemSizeSimple || ''} onSizeModeChange={(m) => setValue('gemSizeMode', m)} onSizeChange={(s) => setValue('gemSizeSimple', s)} />
                                <GemColorSelector register={register} errors={errors} value={gemColor} onChange={(v) => setValue('gemColor', v)} />
                                <TransparencySelector register={register} errors={errors} value={gemTransparency} onChange={(v) => setValue('gemTransparency', v)} />
                            </div>
                        )}

                        {/* Step 2: Reference Image */}
                        {currentStep === 2 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '16px',
                                    }}>
                                        <Camera style={{ width: '22px', height: '22px', color: 'white' }} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>Upload Reference</h2>
                                        <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Add a photo of your gem (optional)</p>
                                    </div>
                                </div>

                                <ImageUpload value={gemImageUrl} onChange={(url) => setValue('gemImageUrl', url)} />
                                <p style={{ fontSize: '13px', color: '#6B7280' }}>This helps our AI create more accurate designs</p>
                            </div>
                        )}

                        {/* Step 3: Design Vision */}
                        {currentStep === 3 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '16px',
                                    }}>
                                        <Sparkles style={{ width: '22px', height: '22px', color: 'white' }} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>Design Vision</h2>
                                        <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Describe your dream jewelry piece</p>
                                    </div>
                                </div>

                                <DesignPromptInput register={register} errors={errors} value={designPrompt} />
                                <MaterialSelector selectedMetals={materials?.metals || []} selectedFinish={materials?.finish} onMetalsChange={(m) => setValue('materials.metals', m)} onFinishChange={(f) => setValue('materials.finish', f)} />
                            </div>
                        )}

                        {/* Step 4: Ready to Create */}
                        {currentStep === 4 && !isGenerating && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '16px',
                                    }}>
                                        <Wand2 style={{ width: '22px', height: '22px', color: '#0A0F1E' }} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>Ready to Create</h2>
                                        <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Review your choices and generate designs</p>
                                    </div>
                                </div>

                                {/* Summary Cards */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div style={{ padding: '16px', borderRadius: '12px', background: '#0F1320', border: '1px solid rgba(55, 65, 81, 0.5)' }}>
                                        <h3 style={{ fontSize: '13px', fontWeight: 500, color: '#D4AF37', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                                            <Gem style={{ width: '14px', height: '14px', marginRight: '8px' }} />
                                            Gem Specifications
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#6B7280' }}>Type</span>
                                                <span style={{ color: 'white', fontWeight: 500, textTransform: 'capitalize' }}>{gemType}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#6B7280' }}>Cut</span>
                                                <span style={{ color: 'white', fontWeight: 500 }}>{gemCut}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#6B7280' }}>Color</span>
                                                <span style={{ color: 'white', fontWeight: 500 }}>{gemColor}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#6B7280' }}>Clarity</span>
                                                <span style={{ color: 'white', fontWeight: 500 }}>{gemTransparency}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ padding: '16px', borderRadius: '12px', background: '#0F1320', border: '1px solid rgba(55, 65, 81, 0.5)' }}>
                                        <h3 style={{ fontSize: '13px', fontWeight: 500, color: '#EC4899', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                                            <Sparkles style={{ width: '14px', height: '14px', marginRight: '8px' }} />
                                            Design Vision
                                        </h3>
                                        <p style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' as const }}>{designPrompt}</p>
                                    </div>
                                </div>

                                {/* Variations */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '8px 0' }}>
                                    <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Variations:</span>
                                    {[2, 3, 4].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setValue('numImages', num)}
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '8px',
                                                border: numImages === num ? '2px solid #D4AF37' : '1px solid #374151',
                                                background: numImages === num ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                                                color: numImages === num ? 'white' : '#6B7280',
                                                fontWeight: 500,
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>

                                {/* Generate Button */}
                                <button
                                    type="submit"
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #F5D061 50%, #D4AF37 100%)',
                                        color: '#0A0F1E',
                                        fontWeight: 600,
                                        fontSize: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Wand2 style={{ width: '18px', height: '18px' }} />
                                    Generate My Design
                                </button>

                                <p style={{ textAlign: 'center', fontSize: '12px', color: '#6B7280' }}>
                                    This will take 10-15 seconds
                                </p>

                                {/* Disclaimer */}
                                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(120, 53, 15, 0.2)', border: '1px solid rgba(180, 83, 9, 0.3)' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <AlertTriangle style={{ width: '18px', height: '18px', color: '#F59E0B', marginRight: '12px', flexShrink: 0, marginTop: '2px' }} />
                                        <p style={{ fontSize: '13px', color: '#FCD34D', lineHeight: 1.5 }}>
                                            <strong style={{ color: '#FBBF24' }}>Important:</strong> These are concept renderings, not final production designs.
                                            Actual jewelry may vary. Consult a professional jeweler for production-ready designs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Generating State */}
                        {isGenerating && (
                            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                {/* Animated circle */}
                                <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 32px' }}>
                                    {/* Outer dark ring */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(180deg, #1A1F35 0%, #111827 100%)',
                                        border: '3px solid rgba(55, 65, 81, 0.4)',
                                    }} />
                                    {/* Inner gold circle */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: '12px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #F5A623 0%, #D4AF37 50%, #B8860B 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Wand2 style={{ width: '36px', height: '36px', color: '#0A0F1E' }} />
                                    </div>
                                </div>

                                <h2 style={{
                                    fontFamily: '"Playfair Display", serif',
                                    fontStyle: 'italic',
                                    fontWeight: 400,
                                    fontSize: '28px',
                                    color: 'white',
                                    marginBottom: '8px',
                                }}>
                                    Creating Magic
                                </h2>
                                <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '24px' }}>
                                    AI is crafting {numImages} unique designs...
                                </p>

                                {/* Progress bar */}
                                <div style={{ width: '200px', margin: '0 auto', height: '6px', background: '#1F2937', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: '60%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #D4AF37, #F5D061)',
                                        borderRadius: '3px',
                                        animation: 'pulse 2s ease-in-out infinite',
                                    }} />
                                </div>
                                <p style={{ fontSize: '11px', color: '#4B5563', marginTop: '16px' }}>
                                    Usually takes 15-30 seconds
                                </p>
                            </div>
                        )}

                        {error && (
                            <div style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(127, 29, 29, 0.3)', border: '1px solid rgba(185, 28, 28, 0.5)' }}>
                                <p style={{ fontSize: '14px', color: '#FCA5A5' }}>{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    {!isGenerating && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px 16px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: currentStep === 1 ? '#4B5563' : '#9CA3AF',
                                    fontSize: '14px',
                                    cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                                }}
                            >
                                <ChevronLeft style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                                Back
                            </button>

                            {currentStep < 4 && (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '10px 24px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: canProceed() ? 'linear-gradient(135deg, #D4AF37 0%, #F5D061 100%)' : '#374151',
                                        color: canProceed() ? '#0A0F1E' : '#6B7280',
                                        fontWeight: 500,
                                        fontSize: '14px',
                                        cursor: canProceed() ? 'pointer' : 'not-allowed',
                                    }}
                                >
                                    Continue
                                    <ChevronRight style={{ width: '16px', height: '16px', marginLeft: '4px' }} />
                                </button>
                            )}
                        </div>
                    )}
                </form>
            </div>

            {/* CSS for pulse animation */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </div>
    );
};

export default JewelryDesigner;
