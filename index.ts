import bigInt from 'big-integer';



type ObjectUn<T> = T & { [key: string]: unknown };
class RSA {

  /**
   * Return the encrypted message.
   *
   * @param encodedMsg - The Object to be crypted
   * @param n - Private key N
   * @param e - Pubblic key E
   * @returns Return the encrypted message 
   *
   * @beta
   */

  encrypt(encodedMsg: ObjectUn<{ time: number }>, n: string, e: string) {
    const message = this.messageToCode(JSON.stringify(encodedMsg));
    const KeyN = bigInt(n);
    const KeyE = bigInt(e);
    return this.codeToMessage(bigInt(message).modPow(KeyE, KeyN).toString());
  };
  /**
   * Return the decrypted message.
   *
   * @param encryptedMsg - The message to be decrypted 
   * @param d - Pubblic key D
   * @param n - Private key N
   * @returns Return the decrypted message 
   *
   * @beta
   */
  decrypt(encryptedMsg: string, d: string, n: string) {
    const KeyN = bigInt(n);
    const KeyD = bigInt(d);
    let c:ObjectUn<{ time: number }>;
    try {
      c = JSON.parse(this.codeToMessage(bigInt(this.messageToCode(encryptedMsg)).modPow(KeyD, KeyN).toString()));
      
      if (c?.time < Date.now()) 
        return {error:"expired"}

    } catch (error) {
      return {error:"invalid msg"}
    };
    return c;
  };

  private randomPrime(bits: number) {
    const min = bigInt.one.shiftLeft(bits - 1);
    const max = bigInt.one.shiftLeft(bits).prev();

    while (true) {
      let p = bigInt.randBetween(min, max);
      if (p.isProbablePrime(256)) {
        return p;
      };
    };
  };
  /**
   * Return {e,n,d} e and d are pubblic key n is private
   *
   * @param keysize - Size of key 
   * @returns Return {e,n,d} e and d are pubblic key n is private
   *
   * @beta
   */
  generate(keysize: number) {
    const e = bigInt(65537);
    let p = bigInt.zero;
    let q = bigInt.zero;
    let totient = bigInt.zero;

    do {
      p = this.randomPrime(keysize / 2);
      q = this.randomPrime(keysize / 2);
      totient = bigInt.lcm(
        p.prev(),
        q.prev(),
      );
    } while (bigInt.gcd(e, totient).notEquals(1) || p.minus(q).abs().shiftRight(keysize / 2 - 100).isZero());
    return {
      e: e.toString(),
      n: p.multiply(q).toString(),
      d: e.modInv(totient).toString(),
    };
  };

  private codeToMessage(code: string) {
    let result = "";

    for (let i = 0; i < code.length; i += 2) {
      if (code[i] == "0") {
        result += "0L";
        i--;
        continue;
      }
      if (parseInt(code[i]) < 3) {
        result += String.fromCharCode(parseInt(code[i] + code[i + 1] + code[i + 2]));
        i++;
        continue;
      }
      result += String.fromCharCode(parseInt(code[i] + code[i + 1]));
    }
    return result;
  };
  private messageToCode(code: string) {
    let result = ""
    for (let i = 0; i < code.length; i++) {
      if (code[i] + code[i + 1] == "0L") {
        result += "0";
        i++;
        continue;
      };
      result += code.charCodeAt(i);
    };
    return result;
  };
}

export default RSA;