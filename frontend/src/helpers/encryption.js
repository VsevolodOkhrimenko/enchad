import NodeRSA from 'node-rsa'
import aesjs from 'aes-js'
import pbkdf2 from 'pbkdf2'


function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
}

export function importPrivateKey(keyData) {
  const key = new NodeRSA()
  key.importKey(keyData, 'pkcs8')
  return key
}

export async function encryptPrivateKey(keyData, passphrase, salt) {
  const key_256 = pbkdf2.pbkdf2Sync(passphrase, salt, 10000, 256 / 8, 'sha512')
  const keyBytes = aesjs.utils.utf8.toBytes(keyData)
  const aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter())
  const encryptedBytes = aesCtr.encrypt(keyBytes)
  return aesjs.utils.hex.fromBytes(encryptedBytes)
}

export async function decryptPrivateKey(encryptedKey, passphrase, salt) {
  const key_256 = pbkdf2.pbkdf2Sync(passphrase, salt, 10000, 256 / 8, 'sha512')
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedKey)
  const aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter())
  const decryptedBytes = aesCtr.decrypt(encryptedBytes)
  return aesjs.utils.utf8.fromBytes(decryptedBytes)
}

export function importPublicKey(keyData) {
  const key = new NodeRSA()
  key.importKey(keyData, 'pkcs8-public')
  return key
}

export function exportPrivateKey(key) {
  return key.exportKey('pkcs8')
}

export function generatePrivateKey() {
  const key = new NodeRSA()
  return key.generateKeyPair()
}

export function exportPublicKey(key) {
  return key.exportKey('pkcs8-public')
}

export function encrypt(target, key) {
  return key.encrypt(target, 'base64')
}

export function decrypt(target, key) {
  try {
    return {
      type: 'success',
      content: b64DecodeUnicode(key.decrypt(target, 'base64'))
    }
  } catch(e) {
    return {
      type: 'error',
      content: 'Error while decrypting'
    }
  }
}

export async function decryptMessageArr(arr, key) {
  const decrypted = []
  arr.forEach(element => {
    decrypted.push({
      ...element,
      'text': decrypt(element['text'], key)
    })
  })
  return decrypted
}
