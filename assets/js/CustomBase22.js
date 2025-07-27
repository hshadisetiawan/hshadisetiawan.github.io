class CustomBase22 {
    constructor() {
        this.ALPHABET = '0123456789ABCDEFabcdef';
        this.BASE = BigInt(this.ALPHABET.length);
    }

    CB22(method, message) {
        if (!message || message.length === 0) {
            return 'Error Base22';
        }
        if (method === 'ENCODE') {
            return this.encode(message);
        } else if (method === 'DECODE') {
            return this.decode(message);
        } else {
            return 'Error: Method invalid (ENCODE/DECODE)';
        }
    }

    encode(message) {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(message);
        let intData = BigInt('0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(''));

        let result = '';
        while (intData > 0) {
            const remainder = intData % this.BASE;
            intData = intData / this.BASE;
            result = this.ALPHABET[Number(remainder)] + result;
        }

        // Handle leading zeros
        for (const b of bytes) {
            if (b === 0) {
                result = this.ALPHABET[0] + result;
            } else {
                break;
            }
        }

        return result;
    }

    decode(message) {
        let intData = BigInt(0);
        for (const c of message) {
            const digit = this.ALPHABET.indexOf(c);
            if (digit < 0) {
                return 'Invalid Base22 Character';
            }
            intData = intData * this.BASE + BigInt(digit);
        }

        let hex = intData.toString(16);
        if (hex.length % 2) hex = '0' + hex;

        const byteArray = Uint8Array.from(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

        // Handle leading '1's as 0x00 bytes
        let leadingZeros = 0;
        for (const c of message) {
            if (c === this.ALPHABET[0]) {
                leadingZeros++;
            } else {
                break;
            }
        }

        const result = new Uint8Array(leadingZeros + byteArray.length);
        result.set(byteArray, leadingZeros);

        return new TextDecoder().decode(result);
    }
}