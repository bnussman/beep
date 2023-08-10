export function getRandomString(length = 5) {
  const letters = 'abcdefghijklmnopqrstuvwxyz';

  let str = '';

  for (let i = 0; i < length; i++) {
    str += letters.charAt(Math.floor(Math.random() * letters.length)) 
  }

  return str;
}