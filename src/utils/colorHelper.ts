import { colorChoices } from '../constants/filterOptions';

// Mapping for display colors (Hex codes)
export const colorHexMap: Record<string, string> = {
    black: '#000000',
    white: '#FFFFFF',
    gray: '#808080',
    navy: '#000080',
    beige: '#F5F5DC',
    brown: '#A52A2A',
    red: '#FF0000',
    orange: '#FFA500',
    yellow: '#FFFF00',
    green: '#008000',
    blue: '#0000FF',
    purple: '#800080',
    pink: '#FFC0CB',
    gold: '#FFD700',
    silver: '#C0C0C0',
};

// Helper to get Vietnamese name
export const getColorLabel = (colorKey: string): string => {
    const choice = colorChoices.find(c => c.id === colorKey || c.id === colorKey.toLowerCase());
    return choice ? choice.name : colorKey;
};

// Helper to get Hex code
export const getColorHex = (colorKey: string): string => {
    const key = colorKey.toLowerCase();
    return colorHexMap[key] || '#e0e0e0'; // Default gray if not found
};
