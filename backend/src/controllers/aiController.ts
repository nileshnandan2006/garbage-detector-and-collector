import { Request, Response } from 'express';
import { detectGarbage } from '../services/aiDetectionService.js';

export async function detectGarbageEndpoint(req: Request, res: Response) {
  try {
    const file = req.file;
    const preferredCategory = req.body?.category;
    const fileName = file?.originalname || req.body?.fileName || '';

    const filePath = file?.path;

    const detection = await detectGarbage(filePath, preferredCategory, fileName);

    return res.json({
      success: true,
      imageUrl: file ? `/uploads/${file.filename}` : undefined,
      ...detection
    });
  } catch (err: any) {
    console.error('AI Detection API error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to run AI detection.',
      error: err.message
    });
  }
}
