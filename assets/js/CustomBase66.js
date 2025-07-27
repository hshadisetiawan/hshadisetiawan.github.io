class CustomBase66 {
  constructor() {
    this.ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz#$=@!*?^";
    this.BASE = BigInt(this.ALPHABET.length);
  }

  CB66(method, message) {
    if (!message || message.length === 0) {
      return "Error Base66";
    }

    if (method === "ENCODE") {
      return this.encode(message);
    } else if (method === "DECODE") {
      return this.decode(message);
    } else {
      return "Error: Method invalid (ENCODE/DECODE)";
    }
  }

  encode(message) {
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);
    let intData = BigInt('0x' + [...messageBytes].map(b => b.toString(16).padStart(2, '0')).join(''));
    let result = '';

    while (intData > 0n) {
      const divmod = [intData / this.BASE, intData % this.BASE];
      intData = divmod[0];
      result = this.ALPHABET[Number(divmod[1])] + result;
    }

    // Handle leading zeros
    for (let b of messageBytes) {
      if (b === 0) {
        result = this.ALPHABET[0] + result;
      } else {
        break;
      }
    }

    return result;
  }

  decode(message) {
    let intData = 0n;
    for (let c of message) {
      const digit = this.ALPHABET.indexOf(c);
      if (digit < 0) {
        return "Invalid Base66 Character";
      }
      intData = intData * this.BASE + BigInt(digit);
    }

    let hex = intData.toString(16);
    if (hex.length % 2 !== 0) hex = '0' + hex;
    const bytes = hex.match(/.{2}/g).map(byte => parseInt(byte, 16));

    // Handle leading '1's (zero bytes)
    let leadingZeros = 0;
    for (let c of message) {
      if (c === this.ALPHABET[0]) {
        leadingZeros++;
      } else {
        break;
      }
    }

    const fullBytes = new Uint8Array(leadingZeros + bytes.length);
    fullBytes.set(bytes, leadingZeros);
    const decoder = new TextDecoder();
    return decoder.decode(fullBytes);
  }
}