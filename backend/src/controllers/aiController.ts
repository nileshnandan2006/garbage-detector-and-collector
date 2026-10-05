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

/**
 * Diagnostic & Testing Endpoint:
 * GET /api/test-ai?scenario=clean | plastic | construction | food | medical | ewaste
 * POST /api/test-ai (with image upload)
 */
export async function testAiEndpoint(req: Request, res: Response) {
  try {
    const scenario = String(req.query.scenario || req.body.scenario || 'plastic');
    const file = req.file;

    let testFileName = 'garbage_sample.jpg';
    let testCategory = 'Plastic Waste';

    if (file) {
      testFileName = file.originalname;
    } else {
      switch (scenario.toLowerCase()) {
        case 'clean':
        case 'clean_park':
        case 'clean_street':
          testFileName = 'clean_park_scenery.jpg';
          testCategory = 'None';
          break;
        case 'construction':
        case 'debris':
          testFileName = 'construction_debris_pile.jpg';
          testCategory = 'Construction Waste';
          break;
        case 'food':
        case 'organic':
          testFileName = 'food_scraps_market.jpg';
          testCategory = 'Food Waste';
          break;
        case 'medical':
        case 'biohazard':
          testFileName = 'medical_waste_hospital.jpg';
          testCategory = 'Medical Waste';
          break;
        case 'ewaste':
        case 'electronics':
          testFileName = 'ewaste_circuit_scrap.jpg';
          testCategory = 'E-Waste';
          break;
        default:
          testFileName = 'plastic_bottles_roadside.jpg';
          testCategory = 'Plastic Waste';
          break;
      }
    }

    const result = await detectGarbage(file?.path, testCategory, testFileName);

    return res.json({
      status: 'success',
      scenarioTested: scenario,
      testedFileName: testFileName,
      detection: result,
      diagnostic: {
        hasGeminiApiKey: !!process.env.GEMINI_API_KEY,
        engineSelected: result.engineUsed,
        verdict: result.detected ? '🚨 GARBAGE CONFIRMED IN IMAGE' : '✅ CLEAN AREA VERIFIED (NO GARBAGE)'
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      message: 'AI diagnostic test failed.',
      error: err.message
    });
  }
}
