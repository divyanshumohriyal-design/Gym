import { Router, Request, Response } from 'express';
import { leadSubmissionRateLimitMiddleware } from './abuseProtection';

export const leadRouter = Router();

// In-memory leads storage for portfolio demonstration
interface LeadRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  preferredTime?: string;
  membershipPlan?: string;
  message?: string;
  submittedAt: string;
}

const capturedLeads: LeadRecord[] = [];

/**
 * POST /api/leads/free-trial
 * Protected by leadSubmissionRateLimitMiddleware and bot defense.
 */
leadRouter.post('/free-trial', leadSubmissionRateLimitMiddleware, (req: Request, res: Response) => {
  const { fullName, email, phone, preferredTime, membershipPlan } = req.body;

  if (!fullName || !email || !phone) {
    res.status(400).json({
      error: 'Missing required lead information.',
      message: 'Full name, email, and phone number are required.',
    });
    return;
  }

  const lead: LeadRecord = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fullName: String(fullName).trim(),
    email: String(email).trim().toLowerCase(),
    phone: String(phone).trim(),
    preferredTime: preferredTime ? String(preferredTime).trim() : undefined,
    membershipPlan: membershipPlan ? String(membershipPlan).trim() : undefined,
    submittedAt: new Date().toISOString(),
  };

  capturedLeads.push(lead);

  res.status(201).json({
    success: true,
    message: 'Free 1-Day All-Access Pass claimed successfully! Check your inbox for pass activation.',
    leadId: lead.id,
  });
});

/**
 * POST /api/leads/contact
 * Protected by leadSubmissionRateLimitMiddleware and bot defense.
 */
leadRouter.post('/contact', leadSubmissionRateLimitMiddleware, (req: Request, res: Response) => {
  const { fullName, email, phone, message } = req.body;

  if (!fullName || !email || !message) {
    res.status(400).json({
      error: 'Missing required contact fields.',
      message: 'Please provide name, email, and message.',
    });
    return;
  }

  const lead: LeadRecord = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fullName: String(fullName).trim(),
    email: String(email).trim().toLowerCase(),
    phone: phone ? String(phone).trim() : 'N/A',
    message: String(message).trim(),
    submittedAt: new Date().toISOString(),
  };

  capturedLeads.push(lead);

  res.status(201).json({
    success: true,
    message: 'Inquiry received. An IronForge fitness advisor will respond within 24 business hours.',
    leadId: lead.id,
  });
});
