import { useState, useEffect } from 'react';
import { Message, Conversation, AIResponse, QuickAction } from '@/types/chatbot';
import { sendMessageToClaude, sendMessageMock, PATIENT_SYSTEM_PROMPT, DOCTOR_SYSTEM_PROMPT } from '@/services/claudeApi';
import { toast } from 'sonner';

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'book_appointment', label: 'Book Appointment', icon: 'Calendar', prompt: 'I want to book an appointment' },
  { id: 'check_symptoms', label: 'Check Symptoms', icon: 'Activity', prompt: 'I want to check my symptoms' },
  { id: 'find_doctor', label: 'Find a Doctor', icon: 'UserSearch', prompt: 'Help me find a doctor' },
  { id: 'hospital_services', label: 'Hospital Services', icon: 'Building', prompt: 'Tell me about hospital services' },
  { id: 'emergency_help', label: 'Emergency Help', icon: 'AlertCircle', prompt: 'I need emergency help' }
];

export function useChat(userType: 'patient' | 'doctor', userId: string) {
  const [conversation, setConversation] = useState<Conversation>({
    id: `conv_${Date.now()}`,
    userId,
    userType,
    messages: [],
    context: {},
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add welcome message on mount
  useEffect(() => {
    if (conversation.messages.length === 0) {
      const welcomeMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: userType === 'patient'
          ? "Hello! I'm your Docvista AI assistant. I can help you with appointments, health questions, finding doctors, and more. How can I assist you today?"
          : "Hello Doctor! I'm your clinical AI assistant. I can help with document analysis, clinical guidelines, treatment protocols, and research. How can I assist you?",
        timestamp: new Date()
      };
      
      setConversation(prev => ({
        ...prev,
        messages: [welcomeMessage]
      }));
    }
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      updatedAt: new Date()
    }));

    setIsTyping(true);
    setError(null);

    try {
      // Use mock for development, real API in production
      const systemPrompt = userType === 'patient' ? PATIENT_SYSTEM_PROMPT : DOCTOR_SYSTEM_PROMPT;
      const response = await sendMessageMock([...conversation.messages, userMessage], systemPrompt);

      // Add AI response
      const aiMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        metadata: {
          confidence: response.confidence,
          isEmergency: response.isEmergency,
          needsEscalation: response.needsEscalation
        }
      };

      setConversation(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        updatedAt: new Date()
      }));

      // Show emergency alert if detected
      if (response.isEmergency) {
        toast.error('Emergency detected! Please call 911 or visit the emergency department immediately.', {
          duration: 10000
        });
      }

    } catch (err) {
      setError('Failed to get response. Please try again.');
      toast.error('Failed to send message. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const sendQuickAction = (action: QuickAction) => {
    sendMessage(action.prompt);
  };

  const clearChat = () => {
    setConversation({
      id: `conv_${Date.now()}`,
      userId,
      userType,
      messages: [],
      context: {},
      createdAt: new Date(),
      updatedAt: new Date()
    });
  };

  const exportChat = () => {
    const chatText = conversation.messages
      .map(m => `[${m.role.toUpperCase()}] ${m.content}`)
      .join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_${conversation.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    conversation,
    messages: conversation.messages,
    isTyping,
    error,
    sendMessage,
    sendQuickAction,
    clearChat,
    exportChat,
    quickActions: QUICK_ACTIONS
  };
}
