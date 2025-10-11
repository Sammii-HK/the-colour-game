#!/usr/bin/env node

/**
 * CLI script to generate today's social image locally
 * Usage: pnpm generate:today
 */

const fs = require('fs');
const path = require('path');

// Add fetch polyfill for Node.js environments that don't have it
let fetch;
if (typeof globalThis.fetch === 'undefined') {
  fetch = require('node-fetch');
} else {
  fetch = globalThis.fetch;
}

async function generateTodaysImage() {
  try {
    const siteUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:3000';
    const today = new Date().toISOString().split('T')[0];
    const imageUrl = `${siteUrl}/api/og?date=${today}`;
    
    console.log(`🎨 Generating image for ${today}`);
    console.log(`📍 Fetching from: ${imageUrl}`);
    console.log(`💡 Make sure your server is running: npm run dev`);
    
    // Fetch the image
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      if (response.status === 500) {
        console.log('💡 Server error - make sure your dev server is running with: npm run dev');
        console.log('💡 Or set PUBLIC_SITE_URL to your deployed URL');
      }
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    // Create output directory
    const outputDir = path.join(process.cwd(), 'generated');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Save the image
    const buffer = await response.arrayBuffer();
    const filename = `daily-css-colour-${today}.png`;
    const filepath = path.join(outputDir, filename);
    
    fs.writeFileSync(filepath, Buffer.from(buffer));
    
    console.log(`✅ Image saved to: ${filepath}`);
    console.log(`📱 Ready for social media posting!`);
    
    // Also get the colour info
    const colourResponse = await fetch(`${siteUrl}/api/daily-colour`);
    if (colourResponse.ok) {
      const colourData = await colourResponse.json();
      console.log(`🎯 Today's colour: ${colourData.name} (${colourData.hex})`);
      
      // Save colour info as JSON
      const infoPath = path.join(outputDir, `daily-css-colour-${today}.json`);
      fs.writeFileSync(infoPath, JSON.stringify(colourData, null, 2));
      console.log(`📄 Colour info saved to: ${infoPath}`);
    }
    
  } catch (error) {
    console.error('❌ Error generating image:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure your dev server is running: npm run dev');
    console.log('2. Wait for "Ready" message before running this script');
    console.log('3. Or set PUBLIC_SITE_URL to your deployed Vercel URL');
    console.log('4. Example: PUBLIC_SITE_URL=https://your-app.vercel.app npm run generate:today');
    process.exit(1);
  }
}

// Check if running directly
if (require.main === module) {
  generateTodaysImage();
}

module.exports = generateTodaysImage;
