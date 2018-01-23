/* https://github.com/dchest/fast-sha256-js/blob/master/LICENSE

 This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org> */

// The MIT License (MIT)
//
// Copyright (c) 2013 Artem S Vybornov
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// The MIT License (MIT)
// Copyright base-x contributors (c) 2016
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// https://github.com/cryptocoinjs/base-x/blob/master/index.js
// base-x encoding
// Forked from https://github.com/cryptocoinjs/bs58
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas
// Merged Buffer refactorings from base58-native by Stephen Pair
// Copyright (c) 2013 BitPay Inc

// Copyright (c) 2017 Pieter Wuille
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// ISC License

// Copyright (c) 2013-2016 The btcsuite developers

// Permission to use, copy, modify, and distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
const CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"
const CHARSET_MAP = {"q": 0, "p": 1, "z": 2, "r": 3, "y": 4, "9": 5, "x": 6, "8": 7, "g": 8, "f": 9, "2": 10, "t": 11,
"v": 12, "d": 13, "w": 14, "0": 15, "s": 16, "3": 17, "j": 18, "n": 19, "5": 20, "4": 21, "k": 22, "h": 23,
"c": 24, "e": 25, "6": 26, "m": 27, "u": 28, "a": 29, "7": 30, "l": 31}
const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
const ALPHABET_MAP = {"1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6,
  "8": 7, "9": 8, "A": 9, "B": 10, "C": 11, "D": 12, "E": 13, "F": 14, "G": 15,
  "H": 16, "J": 17, "K": 18, "L": 19, "M": 20, "N": 21, "P": 22, "Q": 23, "R": 24,
  "S": 25, "T": 26, "U": 27, "V": 28, "W": 29, "X": 30, "Y": 31, "Z": 32, "a": 33,
  "b": 34, "c": 35, "d": 36, "e": 37, "f": 38, "g": 39, "h": 40, "i": 41, "j": 42,
  "k": 43, "m": 44, "n": 45, "o": 46, "p": 47, "q": 48, "r": 49, "s": 50, "t": 51,
  "u": 52, "v": 53, "w": 54, "x": 55, "y": 56, "z": 57}
var correctedAddress = ""

/* window.onload = window.onhashchange = function() {
  document.getElementById('addressToTranslate').value = window.location.hash.slice(1)
  document.getElementById('addressToTranslate').oninput()
}
document.getElementById('demo').onclick = function() {
  if(window.location.href.includes('#')) {
    window.location.href = window.location.href.substring(0, window.location.href.indexOf('#'));
  }
  window.location.href += '#1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu';
}
document.getElementsByClassName('btn btn-outline-primary btn-lg btn-block')[0].onclick = function() {
  cleanResultAddress();
}
document.getElementById('correctedButton').onclick = function() {
  document.getElementById('correctedButton').style = "display: none"
  document.getElementById('addressToTranslate').value = correctedAddress
  document.getElementById('addressToTranslate').oninput()
}
document.getElementById("addressToTranslate").oninput = function() {
  input = document.getElementById("addressToTranslate").value;
  if (
    input[11] == ":" &&
    input.length == 54 &&
    (input[12] == "q" || input[12] == "p")
  ) {
    for (var i = 0; i < 11; i++) {
      if (input[i] != "bitcoincash"[i]) {
        cleanResultAddress();
        return;
      }
    }
    parseAndConvertCashAddress("bitcoincash", input.slice(12));
  } else if (
    input[0] == "1" ||
    (input[0] == "3" && input.length > 25 && input.length < 35)
  ) {
    parseAndConvertOldAddress(input);
  } else if ((input[0] == "q" || input[0] == "p") && input.length == 42) {
    parseAndConvertCashAddress("bitcoincash", input);
  } else if (
    input[7] == ":" &&
    input.length == 50 &&
    (input[8] == "q" || input[8] == "p")
  ) {
    for (var i = 0; i < 7; i++) {
      if (input[i] != "bchtest"[i]) {
        cleanResultAddress();
        return;
      }
    }
    parseAndConvertCashAddress("bchtest", input.slice(8));
  } else if (
    input[11] == ":" &&
    input.length == 54 &&
    (input[12] == "Q" || input[12] == "P")
  ) {
    for (var i = 0; i < 11; i++) {
      if (input[i] != "BITCOINCASH"[i]) {
        cleanResultAddress();
        return;
      }
    }
    parseAndConvertOldAddress(input.toLowerCase());
  } else if (input[0] == "m" || input[0] == "n" || input[0] == "2") {
    parseAndConvertOldAddress(input);
  } else if (
    (input[0] == "C" || input[0] == "H") &&
    input.length > 25 &&
    input.length < 36
  ) {
    parseAndConvertOldAddress(input);
  } else {
    cleanResultAddress();
  }
};
*/

function parseAndConvertCashAddress(prefix, payloadString) {
  var payloadUnparsed = [];
  for (var i = 0; i < payloadString.length; i++) {
    payloadUnparsed.push(CHARSET_MAP[payloadString[i]]);
  }
  var expandPrefix = [];
  // func ExpandPrefix(prefix string) []byte {
  // ret := make(data, len(prefix) + 1)
  // for i := 0; i < len(prefix); i++ {
  //	ret[i] = byte(prefix[i]) & 0x1f;
  // }
  // ret[len(prefix)] = 0;
  // return ret;
  // }
  // https://play.golang.org/p/NMR2ImCmdpZ
  var netType = true;
  if (prefix == "bitcoincash") {
    expandPrefix = [2, 9, 20, 3, 15, 9, 14, 3, 1, 19, 8, 0];
  } else {
    /*if (prefix == "bchtest")*/ expandPrefix = [2, 3, 8, 20, 5, 19, 20, 0];
    netType = false;
  }
  var polymodInput = expandPrefix.concat(payloadUnparsed);
  var polymodResult = polyMod(polymodInput);
  for (var i = 0; i < polymodResult.length; i++) {
    if (polymodResult[i] != 0) {
      var syndromes = {};
      var c = [];
      var t = 0;
      for (var p = 0; p < polymodInput.length; p++) {
        for (var e = 1; e < 32; e++) {
          polymodInput[p] ^= e;
          c = polyMod(polymodInput);
          t = 0;
          for (var k = 0; k < c.length; k++) {
            t += c[k];
          }
          if (t == 0) {
            correctedAddress = rebuildAddress(polymodInput);
            return;
          }
          //syndromes[simplify(xor(c, polymodResult))] = p * 32 + e
          polymodInput[p] ^= e;
        }
      }
      cleanResultAddress();
      return;
    }
  }
  var payload = convertBits(payloadUnparsed.slice(0, -8), 5, 8, false);
  if (payload.length == 0) {
    cleanResultAddress();
    return;
  }
  var addressType = payload[0] >> 3; // 0 or 1
  craftOldAddress(addressType, payload.slice(1, 21), netType);
}


function craftOldAddress(kind, addressHash, netType) {
  if (netType) {
    if (kind == 0) {
      CheckEncodeBase58(addressHash, 0x00);
    } else {
      CheckEncodeBase58(addressHash, 0x05);
    }
  } else {
    if (kind == 0) {
      CheckEncodeBase58(addressHash, 0x6f);
    } else {
      CheckEncodeBase58(addressHash, 0xc4);
    }
  }
}

function CheckEncodeBase58(input, version) {
  var b = [version];
  b = b.concat(input);
  var h = sha256(Uint8Array.from(b));
  var h2 = sha256(h);
  b = b.concat(Array.from(h2).slice(0, 4));
//  document.getElementById("resultAddress").value = EncodeBase58Simplified(b);
}

function EncodeBase58Simplified(b) {
  var digits = [0];
  for (var i = 0; i < b.length; i++) {
    for (var j = 0, carry = b[i]; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      // https://jsperf.com/different-ways-to-truncate
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  var answer = "";
  // leading zero bytes
  for (var i = 0; i < b.length && b[i] === 0; i++) {
    answer = answer.concat("1");
  }
  // reverse
  for (var t = digits.length - 1; t >= 0; t--) {
    answer = answer.concat(ALPHABET[digits[t]]);
  }
  return answer;
}


function parseAndConvertOldAddress(oldAddress) {
  var bytes = [0];
  for (var i = 0; i < oldAddress.length; i++) {
    var value = ALPHABET_MAP[oldAddress[i]];
    if (value == undefined) {
      cleanResultAddress();
      return;
    }
    for (var j = 0; j < bytes.length; j++) {
      value += bytes[j] * 58;
      bytes[j] = value & 0xff;
      value >>= 8;
    }
    while (value > 0) {
      bytes.push(value & 0xff);
      value >>= 8;
    }
  }

  for (var i = 0; i < oldAddress.length && oldAddress[i] === "1"; i++) {
    bytes.push(0);
  }
  if (bytes.length < 5) {
    cleanResultAddress();
    return;
  }

  bytes = bytes.reverse();
  var version = bytes[0];
  var h = sha256(Uint8Array.from(bytes.slice(0, -4)));
  var h2 = sha256(h);
  if (
    h2[0] != bytes[bytes.length - 4] ||
    h2[1] != bytes[bytes.length - 3] ||
    h2[2] != bytes[bytes.length - 2] ||
    h2[3] != bytes[bytes.length - 1]
  ) {
    cleanResultAddress();
    return;
  }
  var payload = bytes.slice(1, bytes.length - 4);
  if (version == 0x00) {
    return craftCashAddress(0, payload, true);
  } else if (version == 0x05) {
    return craftCashAddress(1, payload, true);
  } else if (version == 0x6f) {
    return craftCashAddress(0, payload, false);
  } else if (version == 0xc4) {
    return craftCashAddress(1, payload, false);
  } else if (version == 0x1c) {
    return craftCashAddress(0, payload, true);
  } else if (version == 0x28) {
    return craftCashAddress(1, payload, true);
  } else {
    cleanResultAddress();
  }
}


function packCashAddressData(addressType, addressHash) {
  // Pack addr data with version byte.
  var versionByte = addressType << 3;
  // Those addresses are not in use!
  /*var encodedSize = (addressHash.length - 20) / 4
	if ((addressHash.length-20)%4 != 0) {
		return []
	}
	if (encodedSize < 0 || encodedSize > 8) {
		return []
	}
	versionByte |= encodedSize*/
  var data = [versionByte].concat(addressHash);
  return convertBits(data, 8, 5, true);
}

function convertBits(data, fromBits, tobits, pad) {
  // General power-of-2 base conversion.
  var acc = 0;
  var bits = 0;
  var ret = [];
  var maxv = (1 << tobits) - 1;
  var maxAcc = (1 << (fromBits + tobits - 1)) - 1;
  for (var i = 0; i < data.length; i++) {
    var value = data[i];
    if (value < 0 || value >> fromBits !== 0) {
      return [];
    }
    acc = ((acc << fromBits) | value) & maxAcc;
    bits += fromBits;
    while (bits >= tobits) {
      bits -= tobits;
      ret.push((acc >> bits) & maxv);
    }
  }
  if (pad) {
    if (bits > 0) {
      ret.push((acc << (tobits - bits)) & maxv);
    }
  } else if (bits >= fromBits || ((acc << (tobits - bits)) & maxv) != 0) {
    return [];
  }
  return ret;
}

function craftCashAddress(kind, addressHash, netType) {
  var payload = packCashAddressData(kind, addressHash);
  if (payload.length == 0) {
    cleanResultAddress();
    return;
  }
  // func ExpandPrefix(prefix string) []byte {
  // ret := make(data, len(prefix) + 1)
  // for i := 0; i < len(prefix); i++ {
  //	ret[i] = byte(prefix[i]) & 0x1f;
  // }
  // ret[len(prefix)] = 0;
  // return ret;
  // }
  // https://play.golang.org/p/NMR2ImCmdpZ
  var expandPrefix = [];
  if (netType == true) {
    expandPrefix = [2, 9, 20, 3, 15, 9, 14, 3, 1, 19, 8, 0];
  } else {
    expandPrefix = [2, 3, 8, 20, 5, 19, 20, 0];
  }
  var enc = expandPrefix.concat(payload);
  var mod = polyMod(enc.concat([0, 0, 0, 0, 0, 0, 0, 0]));
  var retChecksum = [];
  for (var i = 0; i < 8; i++) {
    // Convert the 5-bit groups in mod to checksum values.
    // retChecksum[i] = (mod >> uint(5*(7-i))) & 0x1f
    retChecksum[i] = simplify(and(rShift(mod, 5 * (7 - i)), [31]))[0];
  }
  var combined = payload.concat(retChecksum);
  var ret = "";
  if (netType == true) {
    ret = "bitcoincash:";
  } else {
    ret = "bchtest:";
  }
  for (var i = 0; i < combined.length; i++) {
    ret = ret.concat(CHARSET[combined[i]]);
  }
  if (ret.length == 54 || ret.length == 50) {
    return ret;
//    document.getElementById("resultAddress").value = ret;
//    document.getElementById("resultAddressBlock").style.display = "block";
  } else {
    cleanResultAddress();
  }
}

function cleanResultAddress() {
/*  document.getElementById("resultAddress").value = "";
  document.getElementById("resultAddressBlock").style.display = "none";
  document.getElementById("correctedButton").style = "display: none"; */
}

// SHA256
!function(t,e){var i={};!function(t){"use strict";function e(t,e,i,r,n){for(var h,f,a,o,u,d,p,c,b,g,l,y,v;n>=64;){for(h=e[0],f=e[1],a=e[2],o=e[3],u=e[4],d=e[5],p=e[6],c=e[7],g=0;g<16;g++)l=r+4*g,t[g]=(255&i[l])<<24|(255&i[l+1])<<16|(255&i[l+2])<<8|255&i[l+3];for(g=16;g<64;g++)b=t[g-2],y=(b>>>17|b<<15)^(b>>>19|b<<13)^b>>>10,b=t[g-15],v=(b>>>7|b<<25)^(b>>>18|b<<14)^b>>>3,t[g]=(y+t[g-7]|0)+(v+t[g-16]|0);for(g=0;g<64;g++)y=(((u>>>6|u<<26)^(u>>>11|u<<21)^(u>>>25|u<<7))+(u&d^~u&p)|0)+(c+(s[g]+t[g]|0)|0)|0,v=((h>>>2|h<<30)^(h>>>13|h<<19)^(h>>>22|h<<10))+(h&f^h&a^f&a)|0,c=p,p=d,d=u,u=o+y|0,o=a,a=f,f=h,h=y+v|0;e[0]+=h,e[1]+=f,e[2]+=a,e[3]+=o,e[4]+=u,e[5]+=d,e[6]+=p,e[7]+=c,r+=64,n-=64}return r}function i(t){var e=(new r).update(t),i=e.digest();return e.clean(),i}t.__esModule=!0,t.digestLength=32,t.blockSize=64;var s=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);var r=function(){function i(){this.digestLength=t.digestLength,this.blockSize=t.blockSize,this.state=new Int32Array(8),this.temp=new Int32Array(64),this.buffer=new Uint8Array(128),this.bufferLength=0,this.bytesHashed=0,this.finished=!1,this.reset()}return i.prototype.reset=function(){return this.state[0]=1779033703,this.state[1]=3144134277,this.state[2]=1013904242,this.state[3]=2773480762,this.state[4]=1359893119,this.state[5]=2600822924,this.state[6]=528734635,this.state[7]=1541459225,this.bufferLength=0,this.bytesHashed=0,this.finished=!1,this},i.prototype.clean=function(){for(t=0;t<this.buffer.length;t++)this.buffer[t]=0;for(var t=0;t<this.temp.length;t++)this.temp[t]=0;this.reset()},i.prototype.update=function(t,i){if(void 0===i&&(i=t.length),this.finished)throw new Error("SHA256: can't update because hash was finished.");var s=0;if(this.bytesHashed+=i,this.bufferLength>0){for(;this.bufferLength<64&&i>0;)this.buffer[this.bufferLength++]=t[s++],i--;64===this.bufferLength&&(e(this.temp,this.state,this.buffer,0,64),this.bufferLength=0)}for(i>=64&&(s=e(this.temp,this.state,t,s,i),i%=64);i>0;)this.buffer[this.bufferLength++]=t[s++],i--;return this},i.prototype.finish=function(t){if(!this.finished){var i=this.bytesHashed,s=this.bufferLength,r=i/536870912|0,n=i<<3,h=i%64<56?64:128;this.buffer[s]=128;for(f=s+1;f<h-8;f++)this.buffer[f]=0;this.buffer[h-8]=r>>>24&255,this.buffer[h-7]=r>>>16&255,this.buffer[h-6]=r>>>8&255,this.buffer[h-5]=r>>>0&255,this.buffer[h-4]=n>>>24&255,this.buffer[h-3]=n>>>16&255,this.buffer[h-2]=n>>>8&255,this.buffer[h-1]=n>>>0&255,e(this.temp,this.state,this.buffer,0,h),this.finished=!0}for(var f=0;f<8;f++)t[4*f+0]=this.state[f]>>>24&255,t[4*f+1]=this.state[f]>>>16&255,t[4*f+2]=this.state[f]>>>8&255,t[4*f+3]=this.state[f]>>>0&255;return this},i.prototype.digest=function(){var t=new Uint8Array(this.digestLength);return this.finish(t),t},i.prototype._saveState=function(t){for(var e=0;e<this.state.length;e++)t[e]=this.state[e]},i.prototype._restoreState=function(t,e){for(var i=0;i<this.state.length;i++)this.state[i]=t[i];this.bytesHashed=e,this.finished=!1,this.bufferLength=0},i}();t.Hash=r;var n=function(){function t(t){this.inner=new r,this.outer=new r,this.blockSize=this.inner.blockSize,this.digestLength=this.inner.digestLength;var e=new Uint8Array(this.blockSize);if(t.length>this.blockSize)(new r).update(t).finish(e).clean();else for(i=0;i<t.length;i++)e[i]=t[i];for(i=0;i<e.length;i++)e[i]^=54;this.inner.update(e);for(i=0;i<e.length;i++)e[i]^=106;this.outer.update(e),this.istate=new Uint32Array(8),this.ostate=new Uint32Array(8),this.inner._saveState(this.istate),this.outer._saveState(this.ostate);for(var i=0;i<e.length;i++)e[i]=0}return t.prototype.reset=function(){return this.inner._restoreState(this.istate,this.inner.blockSize),this.outer._restoreState(this.ostate,this.outer.blockSize),this},t.prototype.clean=function(){for(var t=0;t<this.istate.length;t++)this.ostate[t]=this.istate[t]=0;this.inner.clean(),this.outer.clean()},t.prototype.update=function(t){return this.inner.update(t),this},t.prototype.finish=function(t){return this.outer.finished?this.outer.finish(t):(this.inner.finish(t),this.outer.update(t,this.digestLength).finish(t)),this},t.prototype.digest=function(){var t=new Uint8Array(this.digestLength);return this.finish(t),t},t}();t.HMAC=n;t.hash=i,t.default=i;t.hmac=function(t,e){var i=new n(t).update(e),s=i.digest();return i.clean(),s};t.pbkdf2=function(t,e,i,s){for(var r=new n(t),h=r.digestLength,f=new Uint8Array(4),a=new Uint8Array(h),o=new Uint8Array(h),u=new Uint8Array(s),d=0;d*h<s;d++){var p=d+1;f[0]=p>>>24&255,f[1]=p>>>16&255,f[2]=p>>>8&255,f[3]=p>>>0&255,r.reset(),r.update(e),r.update(f),r.finish(o);for(b=0;b<h;b++)a[b]=o[b];for(b=2;b<=i;b++){r.reset(),r.update(o).finish(o);for(var c=0;c<h;c++)a[c]^=o[c]}for(var b=0;b<h&&d*h+b<s;b++)u[d*h+b]=a[b]}for(d=0;d<h;d++)a[d]=o[d]=0;for(d=0;d<4;d++)f[d]=0;return r.clean(),u}}(i);var s=i.default;for(var r in i)s[r]=i[r];"object"==typeof module&&"object"==typeof module.exports?module.exports=s:"function"==typeof define&&define.amd?define(function(){return s}):t.sha256=s}(this);

function and(a, b) {
  var t = a.length - b.length;
  c = [];
  if (t >= 0) {
    for (var i = 0; i < b.length; i++) {
      c.push(a[i + t] & b[i]);
    }
  } else {
    for (var i = 0; i < a.length; i++) {
      c.push(a[i] & b[i - t]);
    }
  }
  return c;
}

function xor(a, b) {
  var t = a.length - b.length;
  var c = [];
  if (t > 0) {
    b = Array(t)
      .fill(0)
      .concat(b);
  } else if (t < 0) {
    a = Array(-t)
      .fill(0)
      .concat(a);
  }
  for (var i = 0; i < a.length; i++) {
    c.push(a[i] ^ b[i]);
  }
  return c;
}

function rShift(a, b) {
  // 35 >= b >= 0
  if (a.length === 0) {
    return [0];
  }
  if (b > 31) {
    var t = a.slice(0, -1);
    b -= 32;
  } else {
    var t = a.slice(0);
  }
  if (b === 0) {
    return t;
  }
  for (var i = t.length - 1; i > 0; i--) {
    t[i] >>>= b;
    // alternative code:
    t[i] |= (t[i - 1] & ((2 << (b + 1)) - 1)) << (32 - b);
    // a[i] |= (a[i-1] << (32 - b)) >>> (32 - b)
  }
  t[0] >>>= b;
  if (t[0] === 0) {
    return t.slice(1);
  }
  return t;
}

function add5zerosAtTheEnd(a) {
  a = [0].concat(a);
  for (var i = 1; i < a.length; i++) {
    a[i - 1] |= a[i] >>> 27;
    a[i] <<= 5;
  }
  return a;
}

function polyMod(v) {
  var c = [0, 1];
  var c0 = [0];
  var temp = [];
  for (var i = 0; i < v.length; i++) {
    c0 = rShift(c, 35);
    c = xor(add5zerosAtTheEnd(and(c, [7, -1])), [v[i]]);
    if (c0.length === 0) {
      continue;
    }
    if (c0[0] & 1) {
      c = xor(c, [0x98, 0xf2bc8e61]);
    }
    if (c0[0] & 2) {
      c = xor(c, [0x79, 0xb76d99e2]);
    }
    if (c0[0] & 4) {
      c = xor(c, [0xf3, 0x3e5fb3c4]);
    }
    if (c0[0] & 8) {
      c = xor(c, [0xae, 0x2eabe2a8]);
    }
    if (c0[0] & 16) {
      c = xor(c, [0x1e, 0x4f43e470]);
    }
  }
  return xor(c, [1]);
}

function rebuildAddress(bytes) {
  var ret = "";
  var i = 0;
  while (bytes[i] != 0) {
    ret = ret.concat(String.fromCharCode(96 + bytes[i]));
    i++;
  }
  ret = ret.concat(":");
  for (i++; i < bytes.length; i++) {
    ret = ret.concat(CHARSET[bytes[i]]);
  }
  return ret;
}

function simplify(v) {
  if (v.length === 0) {
    return [0];
  }
  var i = 0;
  while (v[i] === 0) {
    i++;
  }
  var z = v.slice(i);
  if (z.length === 0) {
    z = [0];
  }
  return z;
}
