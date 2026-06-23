export interface ColorValidationResult {
  r: number;
  g: number;
  b: number;
  isValid: boolean;
}

export function parseHex(hex: string): ColorValidationResult | null {
  let cleanHex = hex.trim().replace(/^#/, '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  } else if (cleanHex.length === 4) {
    cleanHex = cleanHex.slice(0, 3).split('').map(char => char + char).join('');
  }

  if (cleanHex.length !== 6 && cleanHex.length !== 8) {
    return null;
  }

  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }

  return {
    r,
    g,
    b,
    isValid: r >= b && g >= b
  };
}

export function parseRgb(rgbStr: string): ColorValidationResult | null {
  const match = rgbStr.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\)/);
  if (!match) {
    return null;
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }

  return {
    r,
    g,
    b,
    isValid: r >= b && g >= b
  };
}

export function validateColor(color: string): boolean {
  const cleanColor = color.trim().toLowerCase();
  
  if (cleanColor.startsWith('#')) {
    const res = parseHex(cleanColor);
    return res ? res.isValid : false;
  }
  
  if (cleanColor.startsWith('rgb')) {
    const res = parseRgb(cleanColor);
    return res ? res.isValid : false;
  }

  if (cleanColor === 'transparent') {
    return true;
  }

  return false;
}
