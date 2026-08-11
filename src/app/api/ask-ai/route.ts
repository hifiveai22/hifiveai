import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// ---------------------------------------------------------------------------
// Lazy-initialised ZAI singleton (server-side only)
// ---------------------------------------------------------------------------
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// ---------------------------------------------------------------------------
// In-memory conversation store  (sessionId → message[])
// ---------------------------------------------------------------------------
const conversations = new Map<string, { role: 'user' | 'system' | 'assistant'; content: string }[]>();

const MAX_HISTORY = 10; // keep last N user+assistant turns per session

// ---------------------------------------------------------------------------
// System prompt (sent as the first "assistant" message per the SDK requirement)
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are HiFive AI's Ask AI assistant - an intelligent advisor for the AI-native People Operating System. You help business leaders, HR professionals, CFOs, and operators understand how HiFive AI can transform their people operations.

Key knowledge:
- HiFive AI has 5 interconnected modules (HiTalent for talent acquisition, HiPeople for people lifecycle, HiPay for global payroll, HiGlobal for EOR & compliance, HiOps for operations & IT) connected by HiAI (the cross-module intelligence layer)
- All modules share a single cryptographic source of truth - no data silos
- Ask AI can reason across all modules simultaneously, answer complex cross-functional questions, and take actions autonomously
- HiFive AI replaces 5-8 fragmented tools with one unified platform
- Typical TCO savings: 40-73% compared to point solutions
- Implementation: 4-6 weeks for <150 employees, 8-12 weeks for enterprise
- Security: SOC 2 Type II, ISO 27001, GDPR compliant

Guidelines:
- Be concise, professional, and consultative
- Use specific numbers and outcomes when relevant (e.g., "40% faster time-to-hire", "99.9% payroll accuracy")
- When users ask about pricing, direct them to the TCO Estimator on the Why page or suggest booking a demo
- Don't fabricate specific pricing numbers - offer ranges and suggest getting a precise quote
- If asked about something unrelated to people operations, politely redirect
- Format responses with clear structure (use bullet points, bold text for emphasis)
- Always end with a relevant follow-up question or next step suggestion`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Trim conversation history to at most `max` messages (FIFO) */
type ChatMessage = { role: 'user' | 'system' | 'assistant'; content: string };

function trimHistory(messages: ChatMessage[], max: number): ChatMessage[] {
  if (messages.length <= max) return messages;
  return messages.slice(messages.length - max);
}

// ---------------------------------------------------------------------------
// POST  /api/ask-ai  -  Send a message and receive an AI response
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId: incomingSessionId } = body as {
      message?: string;
      sessionId?: string;
    };

    // Validate required field
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'A non-empty "message" field is required.' },
        { status: 400 },
      );
    }

    const sessionId = incomingSessionId || generateSessionId();

    // Retrieve or initialise conversation history
    const history = conversations.get(sessionId) ?? [
      { role: 'assistant', content: SYSTEM_PROMPT },
    ];

    // Append the new user message
    history.push({ role: 'user', content: message.trim() });

    // Build the messages array sent to the model (system prompt + last N messages)
    const messagesToSend: ChatMessage[] = [
      { role: 'assistant', content: SYSTEM_PROMPT },
      ...trimHistory(
        history.filter((m) => m.role !== 'assistant' || m.content !== SYSTEM_PROMPT),
        MAX_HISTORY,
      ),
    ];

    // Call the AI model
    const zai = await getZAI();
    const completion = await zai.chat.completions.create({
      messages: messagesToSend,
      thinking: { type: 'disabled' },
    });

    // Extract the assistant reply
    const assistantMessage =
      completion.choices?.[0]?.message?.content ?? 'I apologise - I was unable to generate a response. Please try again.';

    // Persist the turn in history
    history.push({ role: 'assistant', content: assistantMessage });
    conversations.set(sessionId, trimHistory(history, MAX_HISTORY + 1)); // +1 to keep the latest assistant reply

    return NextResponse.json({
      success: true,
      response: assistantMessage,
      sessionId,
    });
  } catch (error: unknown) {
    console.error('[ask-ai] Error generating response:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE  /api/ask-ai  -  Clear conversation history for a session
// ---------------------------------------------------------------------------
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body as { sessionId?: string };

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A "sessionId" field is required.' },
        { status: 400 },
      );
    }

    const deleted = conversations.delete(sessionId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Session not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[ask-ai] Error clearing session:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
