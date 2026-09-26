import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { aiGenerationRateLimitMiddleware, abuseProtectionService } from './abuseProtection';
import { CONFIG } from './config';

export const aiRouter = Router();

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

/**
 * Fallback expert plan generator if GEMINI_API_KEY is not configured
 */
function generateStructuredFitnessPlan(params: {
  goal: string;
  experienceLevel: string;
  daysPerWeek: number;
  equipment: string;
  dietaryPreference: string;
}) {
  const { goal, experienceLevel, daysPerWeek, equipment, dietaryPreference } = params;

  return {
    overview: `IronForge Pro Protocol: ${experienceLevel} ${goal} Plan`,
    summary: `Engineered specifically for ${daysPerWeek} training sessions weekly utilizing ${equipment.toLowerCase()} with a ${dietaryPreference.toLowerCase()} macro architecture.`,
    weeklySchedule: [
      {
        day: 'Day 1',
        focus: 'Primary Strength & Foundation',
        exercises: [
          { name: 'Barbell Back Squat / Front Squat', sets: '4 sets', reps: '6-8 reps', rpe: 'RPE 8' },
          { name: 'Barbell Overhead Press or DB Press', sets: '4 sets', reps: '8-10 reps', rpe: 'RPE 8.5' },
          { name: 'Romanian Deadlifts (Hamstrings & Glutes)', sets: '3 sets', reps: '10-12 reps', rpe: 'RPE 8' },
          { name: 'Weighted Pull-Ups or Lat Pulldowns', sets: '3 sets', reps: '8-10 reps', rpe: 'RPE 9' },
          { name: 'Cable Woodchoppers & Core Hollow Body', sets: '3 sets', reps: '15 reps/side', rpe: 'RPE 7' },
        ],
      },
      {
        day: 'Day 2',
        focus: 'Hypertrophy & Upper Body Power',
        exercises: [
          { name: 'Incline Dumbbell Bench Press', sets: '4 sets', reps: '8-10 reps', rpe: 'RPE 8.5' },
          { name: 'Chest-Supported Row / T-Bar Row', sets: '4 sets', reps: '10-12 reps', rpe: 'RPE 8' },
          { name: 'Dumbbell Lateral Raises (Strict Form)', sets: '4 sets', reps: '12-15 reps', rpe: 'RPE 9' },
          { name: 'Overhead Triceps Rope Extensions', sets: '3 sets', reps: '12-15 reps', rpe: 'RPE 8.5' },
          { name: 'Incline Incline Dumbbell Bicep Curls', sets: '3 sets', reps: '10-12 reps', rpe: 'RPE 8.5' },
        ],
      },
      {
        day: 'Day 3',
        focus: daysPerWeek >= 4 ? 'Posterior Chain & Conditioning' : 'Full Body Metabolic Flush',
        exercises: [
          { name: 'Conventional Deadlift or Trap-Bar Deadlift', sets: '3 sets', reps: '5 reps', rpe: 'RPE 8' },
          { name: 'Bulgarian Split Squats (Dumbbell)', sets: '3 sets', reps: '10 reps/leg', rpe: 'RPE 8.5' },
          { name: 'Standing Face Pulls (Rear Delts & Rotators)', sets: '3 sets', reps: '15-20 reps', rpe: 'RPE 8' },
          { name: 'High-Intensity Assault Bike Intervals', sets: '8 rounds', reps: '20s work / 40s rest', rpe: 'RPE 9.5' },
        ],
      },
    ],
    nutritionBlueprint: {
      dailyCalories: goal === 'Fat Loss' ? '2,150 kcal (Target Deficit)' : '2,850 kcal (Clean Surplus)',
      proteinTarget: '180g - 210g (High Bioavailability)',
      carbsTarget: goal === 'Fat Loss' ? '180g complex carbs' : '320g performance carbs',
      fatsTarget: '65g - 75g healthy essential lipids',
      hydration: '3.5 to 4.0 liters pure water daily with trace electrolytes',
      recoverySupplementation: 'Creatine Monohydrate (5g daily), Whey Isolate, Magnesium Glycinate before sleep',
    },
    coachAdvice: 'Consistency and mechanical tension drive adaptations. Progressive overload every 14 days while keeping strict form.',
    generatedBy: 'IronForge Sports Science Engine',
  };
}

/**
 * POST /api/ai/generate-plan
 * Protected by strict AI generation rate limiter (5 req / 10 min) and bot defenses.
 */
aiRouter.post('/generate-plan', aiGenerationRateLimitMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      goal = 'Muscle Building & Hypertrophy',
      experienceLevel = 'Intermediate',
      daysPerWeek = 4,
      equipment = 'Full Commercial Gym',
      dietaryPreference = 'High Protein Balanced',
      customNotes = '',
    } = req.body;

    const ai = getGeminiClient();

    // If Gemini API key is available, call gemini-3.8-flash
    if (ai) {
      const prompt = `You are the Head Athletic Performance Coach at IRONFORGE FITNESS.
Generate an elite, highly detailed, customized workout and nutrition protocol in strict JSON format based on the client parameters:
- Goal: ${goal}
- Experience Level: ${experienceLevel}
- Days Per Week: ${daysPerWeek}
- Available Equipment: ${equipment}
- Dietary Preference: ${dietaryPreference}
- Custom Athlete Notes: ${customNotes ? String(customNotes).slice(0, 200) : 'None'}

Return ONLY a valid JSON object matching this schema:
{
  "overview": string,
  "summary": string,
  "weeklySchedule": [
    {
      "day": string,
      "focus": string,
      "exercises": [
        { "name": string, "sets": string, "reps": string, "rpe": string }
      ]
    }
  ],
  "nutritionBlueprint": {
    "dailyCalories": string,
    "proteinTarget": string,
    "carbsTarget": string,
    "fatsTarget": string,
    "hydration": string,
    "recoverySupplementation": string
  },
  "coachAdvice": string,
  "generatedBy": "IronForge Gemini AI Coach"
}`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          res.json({
            success: true,
            data: parsed,
            quotaInfo: {
              remainingThisWindow: 5, // dynamically updated in headers
              windowMinutes: 10,
            },
          });
          return;
        }
      } catch (geminiError: any) {
        console.warn('[GEMINI AI WARNING] Call failed, using high-performance sports engine fallback:', geminiError?.message);
      }
    }

    // High performance calibrated fallback
    const fallbackPlan = generateStructuredFitnessPlan({
      goal: String(goal),
      experienceLevel: String(experienceLevel),
      daysPerWeek: Number(daysPerWeek) || 4,
      equipment: String(equipment),
      dietaryPreference: String(dietaryPreference),
    });

    res.json({
      success: true,
      data: fallbackPlan,
      quotaInfo: {
        windowMinutes: 10,
        maxQuota: CONFIG.RATE_LIMIT.AI_MAX_REQUESTS,
      },
    });
  } catch (error: any) {
    console.error('[AI GENERATION ERROR]', error);
    res.status(500).json({
      error: 'Failed to generate training plan.',
      message: error?.message || 'Internal AI service error.',
    });
  }
});

/**
 * GET /api/ai/quota
 * Returns client's current AI rate limit status
 */
aiRouter.get('/quota', (req: Request, res: Response) => {
  const ip = abuseProtectionService.getClientIp(req);
  res.json({
    rateLimit: {
      maxRequests: CONFIG.RATE_LIMIT.AI_MAX_REQUESTS,
      windowMinutes: Math.round(CONFIG.RATE_LIMIT.AI_WINDOW_MS / 60000),
      maxPromptChars: CONFIG.RATE_LIMIT.AI_MAX_PROMPT_CHARS,
      clientIp: ip.replace(/:.*/, ''), // sanitize IP display
    },
  });
});
