import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedback, email, category } = body as { feedback: string; email?: string; category?: string };
    
    if (!feedback || !feedback.trim()) {
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400 }
      );
    }
    
    // Store feedback in file
    const fs = require('fs');
    const feedbackFile = '/tmp/feedback.json';
    
    let feedbackList = [];
    try {
      if (fs.existsSync(feedbackFile)) {
        const data = fs.readFileSync(feedbackFile, 'utf8');
        feedbackList = JSON.parse(data);
      }
    } catch (error) {
      console.log('Creating new feedback file');
    }
    
    const newFeedback = {
      id: `feedback_${Date.now()}`,
      feedback: feedback.trim(),
      email: email || null,
      category: category || 'general',
      timestamp: new Date().toISOString(),
      status: 'new'
    };
    
    feedbackList.unshift(newFeedback); // Add to beginning
    
    // Keep only last 1000 feedback items
    if (feedbackList.length > 1000) {
      feedbackList = feedbackList.slice(0, 1000);
    }
    
    fs.writeFileSync(feedbackFile, JSON.stringify(feedbackList, null, 2));
    
    console.log('New feedback received:', {
      category: newFeedback.category,
      hasEmail: !!newFeedback.email,
      length: newFeedback.feedback.length
    });
    
    return NextResponse.json({
      success: true,
      message: 'Feedback received successfully'
    });
    
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
