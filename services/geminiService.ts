
import { GoogleGenAI } from "@google/genai";

export const getAIProjectAdvice = async (userInput: string) => {
  // محاولة قراءة المفتاح من أكثر من مكان لضمان التوافق
  const apiKey = process.env.API_KEY || (import.meta as any).env?.VITE_API_KEY;
  
  if (!apiKey) {
    console.error("API_KEY is missing!");
    return "يا هلا بك، يبدو أن مفتاح الـ API غير معرف حالياً. تأكدي من إضافته في إعدادات Vercel باسم API_KEY.";
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userInput,
      config: {
        systemInstruction: `أنت المساعد الذكي لهدير أبو الخير، Senior Creative Director بخبرة 10 سنوات.
        
        قواعد الرد الصارمة:
        1. اللهجة: تكلم بلهجة عُمانية "بيضاء" محترمة وراقية (مثلاً: يا هلا بك، فالك طيب، بنضبط لك، مو الترتيب، الأمور طيبة).
        2. الأسلوب: ردود ذكية، مختصرة، ومباشرة. لا تكن "ثرثاراً".
        3. الشخصية: أنت تقني ومحترف جداً، تبرز خبرة هدير في المتاجر الإلكترونية (سلة، زد) والذكاء الاصطناعي.
        4. الهدف: اقناع العميل بجودة عمل هدير مع توجيهه للتواصل واتساب (+968 7411 5401) في نهاية الرد.`,
        temperature: 0.7,
      },
    });
    return response.text || "فالك طيب، بس السيرفر شوي مشغول. جرب مرة ثانية.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "السموحة منك، فيه خلل بسيط في الربط. تواصل مع هدير واتساب وفالك طيب!";
  }
};
