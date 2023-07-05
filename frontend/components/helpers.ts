export function convertString(input: string) {
    const words = input.split('.');
    const result = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return result;
  }
  