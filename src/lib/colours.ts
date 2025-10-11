import cssColours from '@/data/css-colours.json';

export type CssColour = {
  name: string;
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  keywords: string[];
  notes?: string;
};

// Cache the colours array
const colours: CssColour[] = cssColours as CssColour[];

/**
 * Deterministic function to get the colour of the day
 * Maps each UTC date to a specific colour, cycling through all colours
 * before repeating
 */
export function getColourOfDay(date: Date): CssColour {
  // Convert to UTC date string to ensure consistency across timezones
  const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
  const year = utcDate.getFullYear();
  const month = utcDate.getMonth() + 1; // getMonth() is 0-indexed
  const day = utcDate.getDate();
  
  // Create a deterministic seed based on the date
  // Using a simple hash function to distribute evenly
  const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const seed = hashString(dateString);
  
  // Use the seed to select a colour index
  const colourIndex = seed % colours.length;
  
  return colours[colourIndex];
}

/**
 * Simple hash function to convert a string to a number
 * Uses djb2 algorithm for good distribution
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * Get all colours
 */
export function getAllColours(): CssColour[] {
  return colours;
}

/**
 * Get a colour by name
 */
export function getColourByName(name: string): CssColour | undefined {
  return colours.find(colour => 
    colour.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Format RGB values as CSS string
 */
export function formatRgb(rgb: [number, number, number]): string {
  return `rgb(${rgb.join(', ')})`;
}

/**
 * Format HSL values as CSS string
 */
export function formatHsl(hsl: [number, number, number]): string {
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
}

/**
 * Get today's colour (convenience function)
 */
export function getTodaysColour(): CssColour {
  return getColourOfDay(new Date());
}

/**
 * Get colour for a specific date string (YYYY-MM-DD)
 */
export function getColourForDate(dateString: string): CssColour {
  const date = new Date(dateString + 'T00:00:00.000Z'); // Force UTC
  return getColourOfDay(date);
}
