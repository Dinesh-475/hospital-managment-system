import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { ChatBubble } from '@/components/chatbot/ChatBubble';
import { ChatWindow } from '@/components/chatbot/ChatWindow';

export const PatientChatbot: React.FC = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    messages,
    isTyping,
    sendMessage,
    sendQuickAction,
    exportChat,
    quickActions
  } = useChat('patient', currentUser?.id || 'guest');

  const handleQuickAction = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId);
    if (action) {
      sendQuickAction(action);
    }
  };

  return (
    <>
      <ChatBubble
        onClick={() => setIsOpen(true)}
        isOpen={isOpen}
        unreadCount={0}
      />
      
      <ChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isTyping={isTyping}
        onSendMessage={sendMessage}
        onQuickAction={handleQuickAction}
        onExport={exportChat}
        userType="patient"
      />
    </>
  );
};
