import fs from 'fs';
import pdf from 'pdf-parse';
import Tesseract from 'tesseract.js';

export const extractTextFromFile = async (filePath: string, mimetype: string): Promise<string> => {
    try {
        if (mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await (pdf as any)(dataBuffer);
            return data.text;
        } else if (mimetype.startsWith('image/')) {
            const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
            return text;
        }
        return "";
    } catch (error) {
        console.error("OCR Error:", error);
        throw new Error("Failed to extract text from file");
    }
};
