#!/usr/bin/env node

/**
 * Standalone CLI script to generate today's social image
 * This version doesn't require a running server
 * Usage: node scripts/generate-today-standalone.js
 */

const fs = require('fs');
const path = require('path');

// Import colour data directly
const cssColours = require('../src/data/css-colours.json');

// Simple version of getColourOfDay function
function getTodaysColour() {
  const today = new Date();
  const utcDate = new Date(today.getTime() + (today.getTimezoneOffset() * 60000));
  const year = utcDate.getFullYear();
  const month = utcDate.getMonth() + 1;
  const day = utcDate.getDate();
  
  const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const seed = hashString(dateString);
  const colourIndex = seed % cssColours.length;
  
  return cssColours[colourIndex];
}

// Simple hash function
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return Math.abs(hash);
}

// Simple function to create a social image using canvas or similar
// For now, we'll create the data and show how to use it
async function generateTodaysImage() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    console.log(`🎨 Generating assets for ${today}`);
    
    // Get today's colour directly
    const colour = getTodaysColour();
    
    console.log(`🎯 Today's colour: ${colour.name} (${colour.hex})`);
    
    // Create output directory
    const outputDir = path.join(process.cwd(), 'generated');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Create colour data JSON
    const colourData = {
      date: today,
      name: colour.name,
      hex: colour.hex,
      rgb: `rgb(${colour.rgb.join(', ')})`,
      hsl: `hsl(${colour.hsl[0]}, ${colour.hsl[1]}%, ${colour.hsl[2]}%)`,
      description: colour.notes || `${colour.name} - ${colour.hex}`,
      keywords: colour.keywords
    };
    
    const infoPath = path.join(outputDir, `daily-css-colour-${today}.json`);
    fs.writeFileSync(infoPath, JSON.stringify(colourData, null, 2));
    console.log(`📄 Colour info saved to: ${infoPath}`);
    
    // Create a simple HTML file for the social image preview
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Daily CSS Colour Challenge - ${colour.name}</title>
    <style>
        body { margin: 0; font-family: system-ui, sans-serif; }
        .container {
            width: 1080px;
            height: 1080px;
            background-color: ${colour.hex};
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
            position: relative;
        }
        .content {
            background-color: rgba(0, 0, 0, 0.8);
            padding: 60px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        .name { font-size: 72px; font-weight: bold; margin-bottom: 20px; }
        .hex { font-size: 48px; opacity: 0.9; margin-bottom: 30px; }
        .challenge { font-size: 28px; opacity: 0.9; margin-bottom: 15px; color: #fbbf24; }
        .subtitle { font-size: 32px; opacity: 0.7; }
        .hashtag { 
            position: absolute; 
            bottom: 40px; 
            right: 40px; 
            font-size: 24px; 
            opacity: 0.8;
            background-color: rgba(0, 0, 0, 0.6);
            padding: 10px 20px;
            border-radius: 25px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <div class="challenge">🎨 Creative Challenge</div>
            <div class="name">${colour.name}</div>
            <div class="hex">${colour.hex}</div>
            <div class="subtitle">What will you create?</div>
        </div>
        <div class="hashtag">#dailycsscolor</div>
    </div>
</body>
</html>`;
    
    const htmlPath = path.join(outputDir, `daily-css-colour-${today}.html`);
    fs.writeFileSync(htmlPath, htmlContent);
    console.log(`🌐 HTML preview saved to: ${htmlPath}`);
    
    console.log('');
    console.log('✅ Assets generated successfully!');
    console.log('');
    console.log('📱 To create the PNG image:');
    console.log(`1. Open: ${htmlPath}`);
    console.log('2. Take a screenshot (1080x1080)');
    console.log('3. Or use your deployed site: YOUR_SITE/api/og?date=${today}');
    console.log('');
    console.log('🎨 Social Media Caption:');
    console.log(`🎨 Today's Creative Challenge: ${colour.name} ${colour.hex}`);
    console.log('');
    if (colour.notes) {
      console.log(`${colour.notes}`);
      console.log('');
    }
    console.log('What will you create with this color today?');
    console.log('• Digital art • Logo design • CSS animation • Watercolor');
    console.log('• Photography • Crafts • Web design • Illustration');
    console.log('');
    console.log('Share your creation with #dailycsscolor');
    console.log('');
    console.log(`#dailycsscolor #CSS #WebDev #${colour.name.replace(/\s+/g, '')} #CreativeChallenge #Art #Design`);
    
  } catch (error) {
    console.error('❌ Error generating assets:', error.message);
    console.log('');
    console.log('🔧 This script works offline and doesn\'t require a server!');
    process.exit(1);
  }
}

// Check if running directly
if (require.main === module) {
  generateTodaysImage();
}

module.exports = generateTodaysImage;
