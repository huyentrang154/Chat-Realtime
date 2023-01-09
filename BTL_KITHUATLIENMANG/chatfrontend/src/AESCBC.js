/*
 *  jsaes version 0.1  -  Copyright 2006 B. Poettering
 *
 *  This program is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU General Public License as
 *  published by the Free Software Foundation; either version 2 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
 *  02111-1307 USA
 */
 
 // later modifications by wwwtyro@github

    const Sbox = new Array(99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22);

    const ShiftRowTab = new Array(0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11);

        const Sbox_Inv = new Array(256);
        for (var i = 0; i < 256; i++)
          Sbox_Inv[Sbox[i]] = i;

        const ShiftRowTab_Inv = new Array(16);
        for (var i = 0; i < 16; i++)
           ShiftRowTab_Inv[ShiftRowTab[i]] = i;

        const xtime = new Array(256);
        for (var i = 0; i < 128; i++) {
            xtime[i] = i << 1;
            xtime[128 + i] = (i << 1) ^ 0x1b;
        }

    // const Done = function () {
    //     delete Sbox_Inv;
    //     delete ShiftRowTab_Inv;
    //     delete xtime;
    // }

    const ExpandKey = function (key) {
        var kl = key.length,
            ks, Rcon = 1;
        switch (kl) {
        case 16:
            ks = 16 * (10 + 1);
            break;
        case 24:
            ks = 16 * (12 + 1);
            break;
        case 32:
            ks = 16 * (14 + 1);
            break;
        default:
            alert("Khóa của bạn phải có độ dài 16, 24 or 32 bytes!");
        }
        for (var i = kl; i < ks; i += 4) {
            var temp = key.slice(i - 4, i);
            
            if (i % kl === 0) {
                temp = new Array(Sbox[temp[1]] ^ Rcon, Sbox[temp[2]], Sbox[temp[3]], Sbox[temp[0]]);
                console.log(temp[2])
                if ((Rcon <<= 1) >= 256) Rcon ^= 0x11b;
            }
            else if ((kl > 24) && (i % kl == 16)) temp = new Array(Sbox[temp[0]], Sbox[temp[1]], Sbox[temp[2]], Sbox[temp[3]]);
            for (var j = 0; j < 4; j++)
            key[i + j] = key[i + j - kl] ^ temp[j];
        }
        console.log(key);
    }

    const Encrypt = function (block, key) {
        var l = key.length;
        AddRoundKey(block, key.slice(0, 16));
        for (var i = 16; i < l - 16; i += 16) {
            SubBytes(block, Sbox);
            ShiftRows(block, ShiftRowTab);
            MixColumns(block);
            AddRoundKey(block, key.slice(i, i + 16));
        }
        SubBytes(block, Sbox);
        ShiftRows(block, ShiftRowTab);
        AddRoundKey(block, key.slice(i, l));
    }

    const Decrypt = function (block, key) {
        console.log(block)
        var l = key.length;
        AddRoundKey(block, key.slice(l - 16, l));
        ShiftRows(block, ShiftRowTab_Inv);
        SubBytes(block, Sbox_Inv);
        for (var i = l - 32; i >= 16; i -= 16) {
            AddRoundKey(block, key.slice(i, i + 16));
            MixColumns_Inv(block);
            ShiftRows(block, ShiftRowTab_Inv);
            SubBytes(block, Sbox_Inv);
        }
        AddRoundKey(block, key.slice(0, 16));
        console.log(block)
    }

    const SubBytes = function (state, sbox) {
        for (var i = 0; i < 16; i++)
        state[i] = sbox[state[i]];
    }

    const AddRoundKey = function (state, rkey) {
        for (var i = 0; i < 16; i++)
        state[i] ^= rkey[i];
    }

    const ShiftRows = function (state, shifttab) {
        var h = new Array().concat(state);
        for (var i = 0; i < 16; i++)
        state[i] = h[shifttab[i]];
    }

    const MixColumns = function (state) {
        for (var i = 0; i < 16; i += 4) {
            var s0 = state[i + 0],
                s1 = state[i + 1];
            var s2 = state[i + 2],
                s3 = state[i + 3];
            var h = s0 ^ s1 ^ s2 ^ s3;
            state[i + 0] ^= h ^ xtime[s0 ^ s1];
            state[i + 1] ^= h ^ xtime[s1 ^ s2];
            state[i + 2] ^= h ^ xtime[s2 ^ s3];
            state[i + 3] ^= h ^ xtime[s3 ^ s0];
        }
    }

    const MixColumns_Inv = function (state) {
        for (var i = 0; i < 16; i += 4) {
            var s0 = state[i + 0],
                s1 = state[i + 1];
            var s2 = state[i + 2],
                s3 = state[i + 3];
            var h = s0 ^ s1 ^ s2 ^ s3;
            var xh = xtime[h];
            var h1 = xtime[xtime[xh ^ s0 ^ s2]] ^ h;
            var h2 = xtime[xtime[xh ^ s1 ^ s3]] ^ h;
            state[i + 0] ^= h1 ^ xtime[s0 ^ s1];
            state[i + 1] ^= h2 ^ xtime[s1 ^ s2];
            state[i + 2] ^= h1 ^ xtime[s2 ^ s3];
            state[i + 3] ^= h2 ^ xtime[s3 ^ s0];
        }
    }
    
    const string2bytes = function(string)
    {
        var bytes = [];
        for(var i = 0; i < string.length; i++) 
        {
            bytes.push(string.charCodeAt(i));
        }
        return bytes;
    }
    
    const pad16 = function(bytes)
    {
        var newBytes = bytes.slice(0);
        var padding = (16 - (bytes.length % 16)) % 16;
        for(i = bytes.length; i < bytes.length + padding; i++)
        {
            newBytes.push(0);
        }
        return newBytes;
    }

    // const blockIV = function()
    // {
    //     var r = new SecureRandom();
    //     var IV = new Array(16);
    //     r.nextBytes(IV);
    //     return IV;
    // } 

    const blockXOR = function(a, b)
    {
        var xor = new Array(16);
        for(var i = 0; i < 16; i++)
        {
            xor[i] = a[i] ^ b[i];
        }
        return xor;
    }
    const bytes2string = function(bytes)
    {
        var string = "";
        for(var i = 0; i < bytes.length; i++)
        {
            string += String.fromCharCode(bytes[i]);
        }   
        return string;
    }
    var base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    const b256to64 = function(t) {
        var a, c, n;
        var r = '', l = 0, s = 0;
        var tl = t.length;
        for (n = 0; n < tl; n++)
        {
            c = t.charCodeAt(n);
            if (s === 0)
            {
                r += base64Chars.charAt((c >> 2) & 63);
                a = (c & 3) << 4;
            }
            else if (s === 1)
            {
                r += base64Chars.charAt((a | (c >> 4) & 15));
                a = (c & 15) << 2;
            }
            else if (s === 2)
            {
                r += base64Chars.charAt(a | ((c >> 6) & 3));
                l += 1;
                r += base64Chars.charAt(c & 63);
            }
            l += 1;
            s += 1;
            if (s === 3) s = 0;
        }
        if (s > 0)
        {
            r += base64Chars.charAt(a);
            l += 1;
            r += '=';
            l += 1;
        }
        if (s === 1)
        {
            r += '=';
        }
        return r;
    }
    export const encryptAESCBC = function(plaintext, key)
    {
        key = string2bytes(key);
        ExpandKey(key);
        //console.log(key)
        var blocks = string2bytes(plaintext);
        blocks = pad16(blocks);
        var encryptedBlocks = [32, 116, 114, 97, 110, 103, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for(var i = 0; i < blocks.length/16; i++)
        {
            var tempBlock = blocks.slice(i * 16, i * 16 + 16);
            var prevBlock = encryptedBlocks.slice((i) * 16, (i) * 16 + 16);
            tempBlock = blockXOR(prevBlock, tempBlock);
            Encrypt(tempBlock, key);
            encryptedBlocks = encryptedBlocks.concat(tempBlock);
        }
        var ciphertext = bytes2string(encryptedBlocks);
        return b256to64(ciphertext)
    }
    const b64to256 = function(t) 
    {
        var c, n;
        var r = '', s = 0, a = 0;
        var tl = t.length;
        for (n = 0; n < tl; n++)
        {
            c = base64Chars.indexOf(t.charAt(n));
            if (c >= 0)
            {
                if (s) r += String.fromCharCode(a | (c >> (6 - s)) & 255);
                s = (s + 2) & 7;
                a = (c << s) & 255;
            }
        }
        return r;
    }    

    const depad = function(bytes)
    {
        var newBytes = bytes.slice(0);
        while(newBytes[newBytes.length - 1] === 0)
        {
            newBytes = newBytes.slice(0, newBytes.length - 1);
        }
        return newBytes;
    }
    

    export const decryptAESCBC = function(encryptedText, key)
    {
        key = string2bytes(key);
        ExpandKey(key);
        //console.log(key)
        var Text = b64to256(encryptedText);
        var encryptedBlocks = string2bytes(Text);
        encryptedBlocks=pad16(encryptedBlocks);
        console.log(encryptedBlocks,"de")
        var decryptedBlocks = [];
        for(var i = 1; i < encryptedBlocks.length/16; i++)
        {
            var tempBlock = encryptedBlocks.slice(i * 16, i * 16 + 16);
            var prevBlock = encryptedBlocks.slice((i-1) * 16, (i-1) * 16 + 16);
            Decrypt(tempBlock, key);
            tempBlock = blockXOR(prevBlock, tempBlock);
            decryptedBlocks = decryptedBlocks.concat(tempBlock);
            
        }
        decryptedBlocks = depad(decryptedBlocks);
        
        return decryptedBlocks;
    }