import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Admin authentication
    const authHeader = request.headers.get('Authorization');
    const adminKey = process.env.ADMIN_SECRET_KEY;
    
    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { subjectA, subjectB, colorName } = body as { subjectA: string; subjectB: string; colorName?: string };
    
    if (!subjectA || !subjectB) {
      return NextResponse.json(
        { error: 'Both subject lines required for A/B test' },
        { status: 400 }
      );
    }
    
    // Store A/B test configuration
    const fs = require('fs');
    const abTestFile = '/tmp/ab-tests.json';
    
    let abTests = [];
    try {
      if (fs.existsSync(abTestFile)) {
        const data = fs.readFileSync(abTestFile, 'utf8');
        abTests = JSON.parse(data);
      }
    } catch (error) {
      console.log('Creating new A/B test file');
    }
    
    const testId = `test_${Date.now()}`;
    const newTest = {
      id: testId,
      colorName: colorName || 'Unknown',
      subjectA,
      subjectB,
      createdAt: new Date().toISOString(),
      results: {
        sentA: 0,
        sentB: 0,
        opensA: 0,
        opensB: 0,
        clicksA: 0,
        clicksB: 0
      }
    };
    
    abTests.push(newTest);
    fs.writeFileSync(abTestFile, JSON.stringify(abTests, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'A/B test created',
      testId,
      test: newTest
    });
    
  } catch (error) {
    console.error('A/B test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Admin authentication
    const authHeader = request.headers.get('Authorization');
    const adminKey = process.env.ADMIN_SECRET_KEY;
    
    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    // Get A/B test results
    const fs = require('fs');
    const abTestFile = '/tmp/ab-tests.json';
    
    let abTests = [];
    try {
      if (fs.existsSync(abTestFile)) {
        const data = fs.readFileSync(abTestFile, 'utf8');
        abTests = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading A/B tests:', error);
    }
    
    // Calculate results for each test
    const testsWithResults = abTests.map((test: any) => {
      const { results } = test;
      const openRateA = results.sentA > 0 ? Math.round((results.opensA / results.sentA) * 100) : 0;
      const openRateB = results.sentB > 0 ? Math.round((results.opensB / results.sentB) * 100) : 0;
      const clickRateA = results.sentA > 0 ? Math.round((results.clicksA / results.sentA) * 100) : 0;
      const clickRateB = results.sentB > 0 ? Math.round((results.clicksB / results.sentB) * 100) : 0;
      
      return {
        ...test,
        performance: {
          openRateA,
          openRateB,
          clickRateA,
          clickRateB,
          winner: openRateA > openRateB ? 'A' : openRateB > openRateA ? 'B' : 'tie'
        }
      };
    });
    
    return NextResponse.json({
      success: true,
      tests: testsWithResults
    });
    
  } catch (error) {
    console.error('A/B test results error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
