/**
 * AI Translation API Endpoint
 * Translates between YAML workflows and natural language
 */

import { NextRequest, NextResponse } from 'next/server';
import { WorkflowTranslator } from '@ava/ai-service';

const translator = process.env.OPENAI_API_KEY 
  ? new WorkflowTranslator({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { yaml, direction = 'toEnglish' } = body;

    if (!yaml || typeof yaml !== 'string') {
      return NextResponse.json({ error: 'YAML content is required' }, { status: 400 });
    }

    if (!translator) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    let translationResult;

    if (direction === 'toEnglish') {
      translationResult = await translator.yamlToEnglish(yaml);
    } else if (direction === 'toYaml') {
      translationResult = await translator.englishToYAML(yaml);
    } else {
      return NextResponse.json({ error: 'Invalid direction' }, { status: 400 });
    }

    if (!translationResult.success) {
      return NextResponse.json({ error: translationResult.error || 'Translation failed' }, { status: 500 });
    }

    return NextResponse.json({ result: translationResult.content, direction });
  } catch (error) {
    console.error('AI translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}

