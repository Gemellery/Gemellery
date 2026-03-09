import { GoogleGenerativeAI } from "@google/generative-ai";


const apiKey = process.env.GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-image",
    generationConfig: {
        // @ts-ignore - responseModalities is valid but not in types
        responseModalities: ["Text", "Image"],
    }
});


export interface GemProperties {
    gemType: string;
    gemCut: string;
    gemSizeMode: "simple" | "advanced";
    gemSizeSimple?: string;
    gemSizeLengthMm?: number;
    gemSizeWidthMm?: number;
    gemSizeHeightMm?: number;
    gemSizeCarat?: number;
    gemColor: string;
    gemTransparency: string;
    gemImageUrl?: string;
}

export interface MaterialsSpec {
    metals: string[];
    finish?: string;
}

export interface DesignPromptInput {
    gemProperties: GemProperties;
    designPrompt: string;
    materials: MaterialsSpec;
}

export interface GeneratedDesign {
    imageBase64: string;
    mimeType: string;
}


export function buildJewelryPrompt(input: DesignPromptInput): string {
    const { gemProperties, designPrompt, materials } = input;

    // Build gem size description
    let gemSizeDesc = "";
    if (gemProperties.gemSizeMode === "simple" && gemProperties.gemSizeSimple) {
        gemSizeDesc = gemProperties.gemSizeSimple;
    } else if (gemProperties.gemSizeMode === "advanced") {
        const parts = [];
        if (gemProperties.gemSizeLengthMm)
            parts.push(`${gemProperties.gemSizeLengthMm}mm length`);
        if (gemProperties.gemSizeWidthMm)
            parts.push(`${gemProperties.gemSizeWidthMm}mm width`);
        if (gemProperties.gemSizeHeightMm)
            parts.push(`${gemProperties.gemSizeHeightMm}mm height`);
        if (gemProperties.gemSizeCarat)
            parts.push(`${gemProperties.gemSizeCarat} carats`);
        gemSizeDesc = parts.join(", ");
    }

    const prompt = `Create a photorealistic, professional jewelry design image.

DESIGN REQUEST: ${designPrompt}

GEMSTONE SPECIFICATIONS:
- Type: ${gemProperties.gemType}
- Cut: ${gemProperties.gemCut}
- Size: ${gemSizeDesc || "Medium"}
- Color: ${gemProperties.gemColor}
- Transparency: ${gemProperties.gemTransparency}

MATERIALS:
- Metal(s): ${materials.metals.join(", ")}
- Finish: ${materials.finish || "Polished"}

STYLE REQUIREMENTS:
- Professional jewelry photography style
- Clean white or gradient background
- Studio lighting with soft shadows
- High-end luxury aesthetic
- Sharp focus on the jewelry piece
- No text, watermarks, or logos
- Single piece of jewelry centered in frame

Generate a beautiful, elegant jewelry design that showcases the gemstone prominently.`;

    return prompt;
}

export function buildRefinementPrompt(
    originalPrompt: string,
    refinementInstructions: string,
    strength: number = 0.5
): string {
    const strengthDesc =
        strength < 0.3 ? "subtle" : strength < 0.7 ? "moderate" : "significant";

    return `Modify the jewelry design with ${strengthDesc} changes.

ORIGINAL DESIGN: ${originalPrompt}

REFINEMENT REQUEST: ${refinementInstructions}

Keep the same gemstone and overall style, but apply the requested modifications.
Maintain professional jewelry photography quality.`;
}


export async function generateJewelryDesigns(
    input: DesignPromptInput,
    numImages: number = 3
): Promise<GeneratedDesign[]> {
    const prompt = buildJewelryPrompt(input);
    const designs: GeneratedDesign[] = [];

    console.log(`[Gemini] Generating ${numImages} jewelry designs...`);

    // Generate images one at a time (Gemini generates one per request)
    for (let i = 0; i < numImages; i++) {
        try {
            console.log(`[Gemini] Generating design ${i + 1}/${numImages}...`);

            const result = await retryWithBackoff(async () => {
                const response = await model.generateContent({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: prompt + `\n\nVariation ${i + 1} of ${numImages}: Create a unique interpretation.`,
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 1.0,
                        topP: 0.95,
                        topK: 40,
                        maxOutputTokens: 8192,
                    },
                });
                return response;
            });

            const response = result.response;
            const candidates = response.candidates;

            if (!candidates || candidates.length === 0) {
                console.warn(`[Gemini] Design ${i + 1}: No candidates in response`);
                continue;
            }

            // Look for an image part in the response
            let imageBase64 = "";
            let mimeType = "image/png";

            for (const part of candidates[0].content.parts) {
                if ((part as any).inlineData) {
                    imageBase64 = (part as any).inlineData.data;
                    mimeType = (part as any).inlineData.mimeType || "image/png";
                    console.log(`[Gemini] Design ${i + 1}: Got image! Size: ${imageBase64.length} chars`);
                    break;
                } else if ((part as any).text) {
                    console.log(`[Gemini] Design ${i + 1}: Got text response (${(part as any).text.length} chars) — model may not support image output`);
                }
            }

            designs.push({ imageBase64, mimeType });
        } catch (error) {
            console.error(`[Gemini] Error generating design ${i + 1}:`, error);
            // Continue with remaining images
        }
    }

    return designs;
}

export async function refineJewelryDesign(
    originalPrompt: string,
    refinementInstructions: string,
    baseImageBase64?: string,
    strength: number = 0.5
): Promise<GeneratedDesign | null> {
    const prompt = buildRefinementPrompt(
        originalPrompt,
        refinementInstructions,
        strength
    );

    console.log("[Gemini] Refining jewelry design...");

    try {
        const result = await retryWithBackoff(async () => {
            // Build content parts - include image if available for true image editing
            const parts: any[] = [{ text: prompt }];

            if (baseImageBase64 && baseImageBase64.length > 100) {
                // Strip data URI prefix if present (e.g. "data:image/png;base64,...")
                const rawBase64 = baseImageBase64.includes(',')
                    ? baseImageBase64.split(',')[1]
                    : baseImageBase64;
                parts.unshift({
                    inlineData: {
                        mimeType: "image/png",
                        data: rawBase64,
                    },
                });
                console.log("[Gemini] Sending base image for refinement (image editing mode)");
            } else {
                console.log("[Gemini] No base image provided, generating fresh refinement");
            }

            const response = await model.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig: {
                    temperature: 0.8,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 8192,
                },
            });
            return response;
        });

        const response = result.response;
        const candidates = response.candidates;

        if (!candidates || candidates.length === 0) {
            console.warn("[Gemini] Refinement: No candidates in response");
            return null;
        }

        // Extract image from response
        let imageBase64 = "";
        let mimeType = "image/png";

        for (const part of candidates[0].content.parts) {
            if ((part as any).inlineData) {
                imageBase64 = (part as any).inlineData.data;
                mimeType = (part as any).inlineData.mimeType || "image/png";
                console.log(`[Gemini] Refinement: Got image! Size: ${imageBase64.length} chars`);
                break;
            } else if ((part as any).text) {
                console.log(`[Gemini] Refinement: Got text (${(part as any).text.length} chars)`);
            }
        }

        return { imageBase64, mimeType };
    } catch (error) {
        console.error("[Gemini] Error refining design:", error);
        return null;
    }
}


async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;
            console.warn(
                `[Gemini] Attempt ${attempt + 1}/${maxRetries} failed:`,
                error.message
            );

            if (attempt < maxRetries - 1) {
                const delay = initialDelay * Math.pow(2, attempt);
                console.log(`[Gemini] Retrying in ${delay}ms...`);
                await sleep(delay);
            }
        }
    }

    throw lastError || new Error("Max retries exceeded");
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isGeminiConfigured(): boolean {
    return !!process.env.GEMINI_API_KEY;
}
