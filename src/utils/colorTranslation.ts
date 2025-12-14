// Color translation from English to Vietnamese
const colorTranslations: { [key: string]: string } = {
    // Basic colors
    'red': 'Đỏ',
    'blue': 'Xanh dương',
    'green': 'Xanh lá',
    'yellow': 'Vàng',
    'orange': 'Cam',
    'purple': 'Tím',
    'pink': 'Hồng',
    'brown': 'Nâu',
    'black': 'Đen',
    'white': 'Trắng',
    'gray': 'Xám',
    'grey': 'Xám',

    // Extended colors
    'navy': 'Xanh navy',
    'beige': 'Be',
    'cream': 'Kem',
    'gold': 'Vàng kim',
    'silver': 'Bạc',
    'khaki': 'Kaki',
    'maroon': 'Nâu đỏ',
    'olive': 'Ô liu',
    'coral': 'San hô',
    'lavender': 'Oải hương',
    'mint': 'Bạc hà',
    'peach': 'Đào',
    'teal': 'Xanh mòng két',
    'turquoise': 'Ngọc lam',
    'violet': 'Tím',
    'indigo': 'Chàm',
    'magenta': 'Đỏ tươi',
    'cyan': 'Lục lam',
    'lime': 'Vàng chanh',
    'burgundy': 'Đỏ rượu vang',
};

/**
 * Translates color name from English to Vietnamese
 * @param color - English color name
 * @returns Vietnamese color name, or original if not found
 */
export const translateColor = (color: string): string => {
    if (!color) return color;

    // Convert to lowercase for matching
    const lowerColor = color.toLowerCase().trim();

    // Return Vietnamese translation if exists, otherwise return original (capitalized)
    return colorTranslations[lowerColor] || color.charAt(0).toUpperCase() + color.slice(1);
};

export default translateColor;
