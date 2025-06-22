import { IConversation } from "@/types";
import { settingsAtom } from "@/store/settings";
import { employeeProfileAtom } from "@/store/wellness";
import { getDefaultStore } from "jotai";

export const createConversation = async (
  token: string,
): Promise<IConversation> => {
  // Get settings and employee profile from Jotai store
  const settings = getDefaultStore().get(settingsAtom);
  const employeeProfile = getDefaultStore().get(employeeProfileAtom);
  
  // Build the wellness context string
  let contextString = "You are a professional AI wellness coach specializing in corporate employee wellness, stress management, and burnout prevention. ";
  
  if (employeeProfile) {
    contextString += `You are speaking with ${employeeProfile.name}, who works as a ${employeeProfile.role} in the ${employeeProfile.department} department. `;
    
    const metrics = employeeProfile.wellnessMetrics;
    contextString += `Their current wellness metrics are: Stress Level: ${metrics.stressLevel}/10, Energy Level: ${metrics.energyLevel}/10, Work-Life Balance: ${metrics.workLifeBalance}/10, Workload Satisfaction: ${metrics.workloadSatisfaction}/10, Burnout Risk: ${metrics.burnoutRisk}. `;
    
    if (metrics.burnoutRisk === 'high') {
      contextString += "They are at high risk for burnout and need immediate support and strategies. ";
    } else if (metrics.burnoutRisk === 'medium') {
      contextString += "They have moderate burnout risk and would benefit from preventive strategies. ";
    } else {
      contextString += "They have low burnout risk but can still benefit from wellness optimization. ";
    }
  }
  
  contextString += "Focus on providing practical, actionable advice for stress management, productivity improvement, work-life balance, and burnout prevention. Be empathetic, professional, and supportive. ";
  
  if (settings.context) {
    contextString += settings.context;
  }
  
  const payload = {
    persona_id: settings.persona || "pd43ffef",
    custom_greeting: settings.greeting || 
      (employeeProfile 
        ? `Hello ${employeeProfile.name}! I'm your AI wellness coach. I've reviewed your recent wellness assessment and I'm here to help you manage stress, boost productivity, and maintain a healthy work-life balance. How are you feeling today?`
        : "Hello! I'm your AI wellness coach, here to help you manage workplace stress, improve productivity, and prevent burnout. How can I support your wellness journey today?"
      ),
    conversational_context: contextString
  };
  
  console.log('Sending wellness coaching payload to API:', payload);
  
  const response = await fetch("https://tavusapi.com/v2/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": token ?? "",
    },
    body: JSON.stringify(payload),
  });

  if (!response?.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};