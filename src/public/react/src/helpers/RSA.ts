import Primes from '../constants/primes';
import int from 'int';

const powerModulus = (base: string, exponent: string, modulo: string): string => {
    let intBase = int(base);
    let intExponent = int(exponent);
    let intModulo = int(modulo);
    let res = int(1);
    intBase = intBase.mod(intModulo);
    while (parseInt(intExponent.toString()) > 0) {
        if (intExponent.mod(2).toString() === int(1).toString()) {

            res = res.mul(intBase).mod(intModulo);
        }
        intExponent = intExponent.div(2);
        intBase = intBase.mul(intBase).mod(intModulo);
    }
    return res.toString();
}


export const cypher = (msg: string, key: string[]): string => {
    let encrypted = ""
    for (let i = 0; i < msg.length; i++) {
        encrypted += powerModulus(msg.charCodeAt(i).toString(), key[1], key[0]) + ',';
    }
    return encrypted;
}

export const decypher = (msg: string, key: string[]): string => {
    let decrypted = ""
    const msgData = msg.split(',');
    for (let i = 0; i < msgData.length - 1; i++) {
        decrypted += String.fromCharCode(parseInt(powerModulus(msgData[i], key[2], key[0])));
    }
    return decrypted;
}


const gcdExt = (a: any, b: any): any[] => {
    if (parseInt(b.toString()) === 0)
        return [a, int(1), int(0)];
    let [gcd, x, y] = gcdExt(b, a.mod(b));
    return [gcd, y, x.sub(a.div(b).mul(y))];
}

export const genKeysRSA = () => {
    const p = int(Primes[Math.floor(Math.random() * 2000)]);
    const q = int(Primes[Math.floor(Math.random() * 2000)]);
    const n = p.mul(q);
    const phi = int(p.sub(1)).mul(q.sub(1));
    let gcd = int(0);
    let e = int(3);
    let d = int(0);
    for (let i = 3; i < phi; i++) {
        e = int(i);
        [gcd, d,] = gcdExt(e, phi);
        if (parseInt(gcd.toString()) === 1) { break; }
    }
    d = parseInt(d.toString()) > 0 ? d : phi.add(d).toString();
    return [n.toString(), e.toString(), d.toString()];
}