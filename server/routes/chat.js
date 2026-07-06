import { Router } from 'express';
import { auth } from '../middleware/auth.js';

const r = Router();
r.use(auth);

const SYSTEM_PROMPT = `You are GramSetu Assistant, the AI helper for the Digital Village Management Portal (GramSetu).
You help villagers and administrators navigate the portal and understand its features.

PORTAL FEATURES YOU KNOW ABOUT:
1. **Dashboard** (/) — Overview of village statistics. Admins see total citizens, households, pending requests, welfare beneficiaries. Citizens see their personal request counts.
2. **Citizens** (/citizens) — Admin-only. Manage citizen records: name, father's name, gender, phone, address, occupation. Has search and CSV export.
3. **Households** (/households) — Admin-only. Manage household data: house number, head name, address, members count, category (General/OBC/SC/ST). Has search and CSV export.
4. **Service Requests** (/services) — Submit and track requests for Water Supply, Road Repair, Sanitation, Electricity, or Other. Admins can update status (Pending → In Progress → Resolved/Rejected).
5. **Welfare Schemes** (/welfare) — View available government welfare schemes and apply for them. Track application status.
6. **Certificates** (/certificates) — Apply for certificates like Residence Certificate, Birth Certificate, Income Certificate, etc. Specify purpose.
7. **Notifications** (/notifications) — View village announcements and notices (Gram Sabha meetings, events, etc.).
8. **Resources** (/resources) — Admin-only. Track village assets: water tankers, community hall items, budget allocations with quantity and location.
9. **Reports & Analytics** (/reports) — View village-wide statistics and export data as CSV for government reporting.
10. **Admin Panel** (/admin) — Admin-only. View registered users and audit log / activity history.

USER ROLES:
- **Admin**: Full access to all modules. Can manage citizens, households, resources, update service request statuses, and view reports.
- **Citizen**: Can view dashboard, submit service requests, apply for welfare schemes and certificates, and view notifications.

NAVIGATION: The sidebar on the left contains links to all modules. Citizens see fewer menu items than admins.

LOGIN CREDENTIALS (for demo):
- Admin: admin@gramsetu.local / Admin@123
- Citizen: citizen@gramsetu.local / Citizen@123

GUIDELINES:
- Be friendly, helpful, and concise.
- Answer in the same language the user writes in (support Hindi and English).
- If a user asks how to do something, give step-by-step instructions referencing the specific page/module.
- If a user reports a problem, suggest they check if they are logged in with the correct role.
- If a citizen asks about admin-only features, politely explain they need admin access.
- Keep responses short (2-4 sentences) unless the user asks for detailed help.
- Use emojis sparingly to keep it friendly 🌿.
- Never reveal passwords or sensitive information beyond what's needed for demo guidance.`;

r.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Gemini API key not configured. Set GEMINI_API_KEY in environment.' });

    // Build conversation contents for Gemini
    const contents = [];

    // Add conversation history
    for (const msg of history.slice(-10)) { // Keep last 10 messages for context
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('Gemini API error:', err);
      return res.status(502).json({ error: 'Failed to get response from AI. Check your API key.' });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    res.json({ reply });
  } catch (e) {
    console.error('Chat error:', e.message);
    res.status(500).json({ error: 'Chat service error' });
  }
});

export default r;
