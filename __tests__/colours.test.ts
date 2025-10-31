import { getColourOfDay, getTodaysColour, getColourByName, formatRgb, formatHsl } from '../src/lib/colours';

describe('Colour Library', () => {
  describe('getColourOfDay', () => {
    test('returns same colour for same date', () => {
      const date = new Date('2025-01-15T00:00:00.000Z');
      const colour1 = getColourOfDay(date);
      const colour2 = getColourOfDay(date);
      
      expect(colour1).toEqual(colour2);
    });
    
    test('returns different colours for consecutive days', () => {
      const date1 = new Date('2025-01-15T00:00:00.000Z');
      const date2 = new Date('2025-01-16T00:00:00.000Z');
      
      const colour1 = getColourOfDay(date1);
      const colour2 = getColourOfDay(date2);
      
      expect(colour1.name).not.toBe(colour2.name);
    });
    
    test('handles timezone differences correctly', () => {
      // Same UTC date should return same colour regardless of local timezone
      const utcDate = new Date('2025-01-15T00:00:00.000Z');
      const localDate = new Date('2025-01-15T12:00:00+12:00'); // Same UTC day
      
      const colour1 = getColourOfDay(utcDate);
      const colour2 = getColourOfDay(localDate);
      
      expect(colour1).toEqual(colour2);
    });
    
    test('cycles through all colours eventually', () => {
      const colours = new Set();
      const startDate = new Date('2025-01-01T00:00:00.000Z');
      
      // Test 200 consecutive days to ensure we get variety
      for (let i = 0; i < 200; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const colour = getColourOfDay(date);
        colours.add(colour.name);
      }
      
      // Should have many different colours
      expect(colours.size).toBeGreaterThan(50);
    });
  });
  
  describe('getColourByName', () => {
    test('finds colour by exact name', () => {
      const colour = getColourByName('CornflowerBlue');
      expect(colour).toBeDefined();
      expect(colour?.name).toBe('CornflowerBlue');
      expect(colour?.hex).toBe('#6495ED');
    });
    
    test('finds colour case-insensitively', () => {
      const colour = getColourByName('cornflowerblue');
      expect(colour).toBeDefined();
      expect(colour?.name).toBe('CornflowerBlue');
    });
    
    test('returns undefined for non-existent colour', () => {
      const colour = getColourByName('NonExistentColour');
      expect(colour).toBeUndefined();
    });
  });
  
  describe('formatRgb', () => {
    test('formats RGB values correctly', () => {
      const rgb = formatRgb([255, 128, 64]);
      expect(rgb).toBe('rgb(255, 128, 64)');
    });
  });
  
  describe('formatHsl', () => {
    test('formats HSL values correctly', () => {
      const hsl = formatHsl([180, 50, 75]);
      expect(hsl).toBe('hsl(180, 50%, 75%)');
    });
  });
  
  describe('getTodaysColour', () => {
    test('returns a valid colour object', () => {
      const colour = getTodaysColour();
      
      expect(colour).toBeDefined();
      expect(typeof colour.name).toBe('string');
      expect(typeof colour.hex).toBe('string');
      expect(Array.isArray(colour.rgb)).toBe(true);
      expect(Array.isArray(colour.hsl)).toBe(true);
      expect(colour.rgb).toHaveLength(3);
      expect(colour.hsl).toHaveLength(3);
      expect(colour.hex).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });
});



