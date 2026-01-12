import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { extractTextFromFile } from '../services/ocrService';
import { generateMedicalSummary, extractMedicalEntities } from '../services/aiService';
import { RecordType } from '@prisma/client';

export const uploadMedicalRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

        const { recordType, patientId } = req.body;
        const filePath = req.file.path;
        
        // 1. OCR / Text Extraction
        const extractedText = await extractTextFromFile(filePath, req.file.mimetype);

        // 2. AI Processing
        const summary = await generateMedicalSummary(extractedText, recordType);
        const entities = await extractMedicalEntities(extractedText);

        // 3. Store in DB
        // Determine target patient: if uploaded by patient, it's them. If doctor, use patientId from body.
        let targetPatientId = patientId;
        if (req.user!.role === 'PATIENT') {
            const p = await prisma.patient.findUnique({ where: { patientId: req.user!.userId } });
            targetPatientId = p?.patientId;
        }

        if (!targetPatientId) {
             return res.status(400).json({ success: false, message: 'Patient ID required' });
        }

        const record = await prisma.medicalRecord.create({
            data: {
                patientId: targetPatientId,
                doctorId: req.user!.role === 'DOCTOR' ? (await prisma.doctor.findUnique({ where: { doctorId: req.user!.userId } }))?.doctorId : undefined,
                recordType: recordType as RecordType,
                documentUrl: filePath, // Locally stored path for MVP
                extractedText,
                summary,
                diagnosis: entities.diagnosis || null,
                prescriptions: entities.medications || {},
                recordDate: new Date()
            }
        });

        res.status(201).json({ success: true, data: record });

    } catch (error) {
        next(error);
    }
};

export const getMedicalRecords = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { patientId } = req.query;
        let where: any = {};

        // Access Control
        if (req.user!.role === 'PATIENT') {
             const p = await prisma.patient.findUnique({ where: { patientId: req.user!.userId } });
             where.patientId = p?.patientId;
        } else if (req.user!.role === 'DOCTOR') {
             if (patientId) where.patientId = patientId;
             // Doctors can technically search any patient if authorized, simplified here
        }

        const records = await prisma.medicalRecord.findMany({
            where,
            orderBy: { recordDate: 'desc' }
        });

        res.json({ success: true, data: records });
    } catch (error) {
        next(error);
    }
};
