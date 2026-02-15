
import { GoogleGenAI } from "@google/genai";

// Updated to support history for a more natural conversation flow as a consultant.
export const getAIProjectAdvice = async (userInput: string, history: any[] = []) => {
  // Always use { apiKey: process.env.API_KEY } directly to initialize the client.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Construct the contents including history for context.
    const contents = [
      ...history,
      { role: 'user', parts: [{ text: userInput }] }
    ];

    const response = await ai.models.generateContent({
      // Upgraded to gemini-3-pro-preview as project planning and consulting is a complex reasoning task.
      model: "gemini-3-pro-preview",
      contents: contents,
      config: {
        systemInstruction: `أنت الآن تتحدث كـ "مستشار تخطيط المشاريع" في استوديو هدير أبو الخير. 
        يجب أن يكون ردك احترافياً، استشارياً، ونابعاً من خبرة الاستوديو الطويلة.

        قواعد الحديث:
        1. لا تذكر أبداً أنك "ذكاء اصطناعي" أو "روبوت". تحدث بصيغة "نحن" أو "في استوديو هدير".
        2. التحليل أولاً: عندما يطلب العميل شيئاً، أظهر أنك فهمت رؤيته وحلل الفرص الإبداعية في طلبه.
        3. الاقتراحات: قدم دائماً حلولاً مبتكرة (تصميمية، تقنية، وتسويقية) تجعل المشروع يبدو فخماً ومميزاً.
        4. الشخصية: أنت خبير، ملهم، وودود جداً. استخدم اللهجة العُمانية الراقية بذكاء (يا هلا، مو الترتيب، بنرتب لك، فالك طيب).
        5. الاستمرارية: لا تنهِ ردك دون طرح سؤال يفتح آفاقاً جديدة للعميل في تفكيره بمشروعه (مثلاً: "هل تبي نركز على الهوية البصرية الكلاسيكية ولا نطلع بشي عصري وجريء؟").
        6. الاختصار والعمق: اجعل الردود مركزة وتحمل قيمة حقيقية، لا تطل الكلام بلا فائدة.

        تذكر: أنت واجهة استشارية لخبرة هدير أبو الخير (Senior Graphic Designer).`,
        temperature: 0.8,
      },
    });

    // Accessing .text property directly as per latest SDK guidelines.
    return response.text || "يا هلا بك، المستشار حالياً يفكر في رؤية إبداعية. جرب تسأل بطريقة ثانية وفالك طيب!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "يا هلا بك، المستشار حالياً في اجتماع لمناقشة فكرة إبداعية! تواصل مع هدير مباشرة على الواتساب (+968 7411 5401) وبترتب لك كل شي، وفالك طيب.";
  }
};
