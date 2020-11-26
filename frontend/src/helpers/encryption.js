import NodeRSA from 'node-rsa'
import aesjs from 'aes-js'
import pbkdf2 from 'pbkdf2'
import Config from 'config'

const { ivSize, saltSize, keySize, iterations } = Config.encryption


function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
}

export function importPrivateKey(keyData) {
  const key = new NodeRSA()
  key.importKey(keyData, 'pkcs8')
  return key
}

export async function encryptPrivateKey(keyData, passphrase, userSecret) {
  const array = new Uint8Array(saltSize)
  const salt = window.crypto.getRandomValues(array)
  const strongPassphrase = passphrase + userSecret
  const derived = pbkdf2.pbkdf2Sync(strongPassphrase, salt, iterations, ivSize + keySize, 'sha512')
  const iv = derived.slice(0, ivSize)
  const key = derived.slice(ivSize)
  const keyBytes = aesjs.utils.utf8.toBytes(keyData)
  const aesCfb = new aesjs.ModeOfOperation.cfb(key, iv)
  const encryptedKeyBytes = aesCfb.encrypt(keyBytes)
  const encryptedBytes = new Uint8Array([...salt, ...encryptedKeyBytes])
  return aesjs.utils.hex.fromBytes(encryptedBytes)
}

export async function decryptPrivateKey(encryptedKey, passphrase, userSecret) {
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedKey)
  const salt = new Uint8Array(encryptedBytes.slice(0, saltSize))
  const strongPassphrase = passphrase + userSecret
  const derived = pbkdf2.pbkdf2Sync(strongPassphrase, salt, iterations, ivSize + keySize, 'sha512')
  const iv = derived.slice(0, ivSize)
  const key = derived.slice(ivSize)
  const aesCfb = new aesjs.ModeOfOperation.cfb(key, iv)
  const decryptedBytes = aesCfb.decrypt(new Uint8Array(encryptedBytes.slice(saltSize)))
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
  } catch (e) {
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
      text: decrypt(element.text, key)
    })
  })
  return decrypted
}
