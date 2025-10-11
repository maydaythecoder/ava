/**
 * Agents API Endpoint
 * CRUD operations for AI agents
 */

import { NextRequest, NextResponse } from 'next/server';

interface AgentData {
  id?: string;
  name: string;
  prompt: string;
  folderId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Mock database - replace with actual Supabase queries
const mockAgents: AgentData[] = [];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const folderId = searchParams.get('folderId');

    // Filter by folder if specified
    const agents = folderId
      ? mockAgents.filter((a) => a.folderId === folderId)
      : mockAgents;

    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const agent = await request.json();

    // Validate agent data
    if (!agent.name || !agent.prompt) {
      return NextResponse.json(
        { error: 'Name and prompt are required' },
        { status: 400 }
      );
    }

    // In production, save to Supabase
    const savedAgent = {
      ...agent,
      id: `agent_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockAgents.push(savedAgent);

    return NextResponse.json({ agent: savedAgent }, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}

