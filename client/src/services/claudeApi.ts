import { Message, AIResponse, DocumentAnalysis, AnalysisType } from '@/types/chatbot';

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || '';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// System Prompts
export const PATIENT_SYSTEM_PROMPT = `You are a helpful, empathetic medical assistant for patients at Docvista Hospital.

Guidelines:
- Provide accurate health information in simple, easy-to-understand language
- Be warm, reassuring, and supportive
- ALWAYS remind users you're not a doctor and can't diagnose conditions
- For serious concerns, strongly suggest seeing a healthcare provider
- Avoid medical jargon; explain complex terms simply
- Provide actionable advice when appropriate
- Detect emergency situations and provide immediate guidance
- Help with hospital navigation, appointments, and general queries

IMPORTANT: If you detect emergency symptoms (chest pain, difficulty breathing, severe bleeding, loss of consciousness, etc.), immediately:
1. Acknowledge the emergency
2. Advise calling emergency services (911)
3. Provide first aid guidance while help arrives

Be concise but thorough. Keep responses under 200 words unless more detail is specifically requested.`;

export const DOCTOR_SYSTEM_PROMPT = `You are an expert clinical AI assistant for doctors at Docvista Hospital.

Capabilities:
- Analyze medical documents (lab reports, discharge summaries, radiology)
- Provide differential diagnosis suggestions
- Recommend treatment protocols based on evidence
- Check drug interactions and dosages
- Summarize research papers and clinical guidelines
- Identify patterns in patient history
- Calculate clinical scores and risk assessments

Output Format:
1. Executive Summary (2-3 sentences)
2. Key Findings (bulleted list)
3. Abnormal Values (highlighted with normal ranges)
4. Clinical Recommendations
5. Suggested Follow-up Actions
6. Confidence Level (High/Medium/Low)

Be precise, clinical, evidence-based, and cite sources when possible.`;

// Send message to Claude API
export async function sendMessageToClaude(
  messages: Message[],
  systemPrompt: string,
  maxTokens: number = 1000
): Promise<AIResponse> {
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      text: data.content[0].text,
      confidence: 0.85,
      needsEscalation: detectNeedsEscalation(data.content[0].text),
      isEmergency: detectEmergency(data.content[0].text)
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

// Analyze document with Claude
export async function analyzeDocument(
  documentText: string,
  analysisType: AnalysisType
): Promise<DocumentAnalysis> {
  const analysisPrompt = buildAnalysisPrompt(documentText, analysisType);
  
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: DOCTOR_SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: analysisPrompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    return parseAnalysisResult(data.content[0].text, analysisType);
  } catch (error) {
    console.error('Document analysis error:', error);
    throw error;
  }
}

// Build analysis prompt based on document type
function buildAnalysisPrompt(text: string, type: AnalysisType): string {
  const prompts = {
    lab_report: `Analyze this laboratory report and provide:
1. Executive summary of overall health status
2. Key findings (normal and abnormal values)
3. List of abnormal values with normal ranges
4. Clinical significance of abnormalities
5. Recommended follow-up tests or actions
6. Confidence level

Lab Report:
${text}`,
    
    discharge_summary: `Analyze this discharge summary and provide:
1. Brief summary of hospitalization
2. Key diagnoses and procedures
3. Important medications and instructions
4. Follow-up care recommendations
5. Red flags to watch for
6. Confidence level

Discharge Summary:
${text}`,
    
    radiology: `Analyze this radiology report and provide:
1. Summary of imaging findings
2. Key abnormalities or concerns
3. Clinical significance
4. Recommended follow-up imaging
5. Differential diagnoses if applicable
6. Confidence level

Radiology Report:
${text}`,
    
    prescription: `Analyze this prescription and provide:
1. List of medications with dosages
2. Potential drug interactions
3. Important side effects to monitor
4. Compliance recommendations
5. Contraindications if any
6. Confidence level

Prescription:
${text}`,
    
    general: `Analyze this medical document and provide:
1. Executive summary
2. Key medical information
3. Important findings or recommendations
4. Suggested actions
5. Confidence level

Document:
${text}`
  };

  return prompts[type] || prompts.general;
}

// Parse analysis result from Claude response
function parseAnalysisResult(text: string, type: AnalysisType): DocumentAnalysis {
  // Simple parsing - in production, use more sophisticated parsing
  const lines = text.split('\n');
  
  return {
    id: `analysis_${Date.now()}`,
    documentId: '',
    documentName: '',
    analysisType: type,
    summary: extractSection(text, 'summary') || lines[0] || '',
    keyFindings: extractBulletPoints(text, 'findings'),
    abnormalValues: extractAbnormalValues(text),
    recommendations: extractBulletPoints(text, 'recommendations'),
    confidence: 0.85,
    analyzedAt: new Date()
  };
}

// Helper functions
function extractSection(text: string, section: string): string {
  const regex = new RegExp(`${section}:?\\s*(.+?)(?=\\n\\n|\\d\\.|$)`, 'is');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

function extractBulletPoints(text: string, section: string): string[] {
  const sectionText = extractSection(text, section);
  return sectionText
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
    .map(line => line.replace(/^[-•]\s*/, '').trim());
}

function extractAbnormalValues(text: string): any[] {
  // Simplified extraction - in production, use more sophisticated parsing
  return [];
}

function detectEmergency(text: string): boolean {
  const emergencyKeywords = [
    'emergency', 'urgent', 'critical', 'severe',
    'call 911', 'immediate medical attention'
  ];
  
  return emergencyKeywords.some(keyword => 
    text.toLowerCase().includes(keyword)
  );
}

function detectNeedsEscalation(text: string): boolean {
  const escalationKeywords = [
    'see a doctor', 'consult', 'medical professional',
    'healthcare provider', 'specialist'
  ];
  
  return escalationKeywords.some(keyword => 
    text.toLowerCase().includes(keyword)
  );
}

// Mock function for development (when API key not available)
export async function sendMessageMock(
  messages: Message[],
  systemPrompt: string
): Promise<AIResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const lastMessage = messages[messages.length - 1];
  const isPatient = systemPrompt.includes('patient');
  
  // Simple mock responses
  if (lastMessage.content.toLowerCase().includes('appointment')) {
    return {
      text: isPatient 
        ? "I can help you book an appointment! To get started, I'll need to know which department or doctor you'd like to see. You can also use the 'Book Appointment' button above to browse available doctors."
        : "Based on the patient's symptoms and history, I recommend scheduling a follow-up appointment within 2 weeks. Consider cardiology given the elevated blood pressure readings.",
      suggestions: ['Book Appointment', 'Find Doctor'],
      confidence: 0.9
    };
  }
  
  if (lastMessage.content.toLowerCase().includes('symptom')) {
    return {
      text: isPatient
        ? "I understand you're experiencing symptoms. Can you describe what you're feeling? For example: headache, fever, pain, etc. Please note that I'm not a doctor and can't diagnose conditions, but I can provide general information and suggest when to seek medical care."
        : "For symptom analysis, please provide: onset, duration, severity (1-10), associated symptoms, and any relieving/aggravating factors. This will help formulate a differential diagnosis.",
      confidence: 0.85
    };
  }
  
  return {
    text: isPatient
      ? "I'm here to help! I can assist with booking appointments, answering health questions, finding doctors, and providing information about hospital services. What would you like to know?"
      : "I'm ready to assist with clinical decision support, document analysis, treatment protocols, or research queries. How can I help you today?",
    confidence: 0.9
  };
}
