const alphabet =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function numberToBase62(num: number) {
  let base62 = [];
  let divident = num;

  while (divident) {
    base62.push(alphabet[divident % 62]);
    divident = Math.floor(divident / 62);
  }

  base62.reverse();

  return base62.join("");
}

export function base62ToNumber(base62: string) {
  let id = 0;

  for (let i = 0; i < base62.length; i++) {
    if ("a" <= base62[i] && base62[i] <= "z") {
      id = id * 62 + base62[i].charCodeAt(0) - "a".charCodeAt(0);
    }

    if ("A" <= base62[i] && base62[i] <= "Z") {
      id = id * 62 + base62[i].charCodeAt(0) - "A".charCodeAt(0) + 26;
    }

    if ("0" <= base62[i] && base62[i] <= "9") {
      id = id * 62 + base62[i].charCodeAt(0) - "0".charCodeAt(0) + 52;
    }
  }

  return id;
}
