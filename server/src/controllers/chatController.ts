import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { handleAIChat } from '../services/aiService';
import { ContextType, UserRole } from '@prisma/client';

export const chatWithAI = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message, sessionId } = req.body;
        const userId = req.user!.userId;
        const role = req.user!.role;

        // 1. Determine Context
        let systemPrompt = "You are a helpful assistant.";
        let contextType: ContextType = ContextType.GENERAL;

        if (role === UserRole.PATIENT) {
            systemPrompt = `You are a helpful medical assistant for patients called Docvista AI. 
            Provide information but always recommend consulting with doctors.
            Do not provide specific diagnoses or treatment plans.
            Be empathetic and clear.`;
            contextType = ContextType.MEDICAL_QUERY; // Defaulting
        } else if (role === UserRole.DOCTOR) {
            systemPrompt = `You are a medical AI assistant for healthcare professionals.
            Provide evidence-based information, drug references, and clinical support.
            Include relevant citations when possible.`;
            contextType = ContextType.MEDICAL_QUERY;
        }

        // 2. Chat Session Management
        let session;
        if (sessionId) {
            session = await prisma.aiChatSession.findUnique({ where: { id: sessionId } });
        }
        
        // If no session or new one needed
        if (!session) {
            session = await prisma.aiChatSession.create({
                data: {
                    userId,
                    contextType, // defaulting
                    messages: [],
                    sessionStart: new Date()
                }
            });
        }

        // 3. Get History
        // Cast JSON to array
        const history = (session.messages as any[]) || [];

        // 4. Call AI
        const aiResponse = await handleAIChat(message, systemPrompt, history);

        // 5. Update History
        const newHistory = [
            ...history,
            { role: 'user', content: message },
            { role: 'assistant', content: aiResponse }
        ];

        await prisma.aiChatSession.update({
            where: { id: session.id },
            data: { messages: newHistory }
        });

        res.json({ success: true, response: aiResponse, sessionId: session.id });

    } catch (error) {
        next(error);
    }
};
