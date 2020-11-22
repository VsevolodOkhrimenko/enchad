import {
  exportPublicKey,
  exportPrivateKey,
  encryptPrivateKey,
  decryptPrivateKey,
  importPrivateKey,
  importPublicKey
} from 'helpers/encryption'
import {
  RESET_KEYS,
  SET_KEYS,
  SET_USER_KEYS,
  SET_OPPONENT_KEY,
  SET_DECRYPTED_PRIVATE_KEY,
  SET_ENCRYPTED_PRIVATE_KEY,
  SET_ENCRYPTION_ERROR,
  SET_ENCRYPTION_LOADING
} from './types'
import store from 'store'


export function resetKeys() {
  return function action(dispatch) {
    dispatch({
      type: RESET_KEYS
    })
  }
}

export function setEncryptionError(error) {
  return function action(dispatch) {
    dispatch({
      type: SET_ENCRYPTION_ERROR,
      payload: {
          encryptionError: error
        }
    })
  }
}

export function setEncryptionLoading(isLoading) {
  return function action(dispatch) {
    dispatch({
      type: SET_ENCRYPTION_LOADING,
      payload: {
          encryptionLoading: isLoading
        }
    })
  }
}

export function setKeys(privateKey, publicKey, opPublicKey) {
  return function action(dispatch) {
    dispatch({
      type: SET_KEYS,
      payload: {
        activePrivateKey: privateKey,
        activePublicKey: publicKey,
        activeOpponentPublicKey: opPublicKey
      }
    })
  }
}

export function setUserKeys(threadId, privateKey, publicKey) {
  return function action(dispatch) {
    dispatch({
      type: SET_USER_KEYS,
      payload: {
        activePrivateKey: privateKey,
        activePublicKey: publicKey
      }
    })
  }
}

export function setOpponentKey(opponentPublicKey) {
  const activeOpponentPublicKey = importPublicKey(opponentPublicKey)
  return function action(dispatch) {
    dispatch({
      type: SET_OPPONENT_KEY,
      payload: {
        activeOpponentPublicKey: activeOpponentPublicKey
      }
    })
  }
}

export function setEncryptedPrivateKey(threadId, callback) {

  return function action(dispatch) {
    const encryptedPrivateKey = localStorage.getItem(`private-${threadId}`)
    dispatch({
      type: SET_ENCRYPTED_PRIVATE_KEY,
      payload: {
        encryptedPrivateKey: encryptedPrivateKey
      }
    })
    if (callback) {
        callback()
      }
  }
}

export function setDecryptedKeyPair(threadId, passphrase, callback) {
  const { salt } = store.getState().auth

  return function action(dispatch) {
      dispatch(setEncryptionError(null))
      const encryptedKey = localStorage.getItem(`private-${threadId}`)
      decryptPrivateKey(encryptedKey, passphrase, salt).then(decryptedPrivateKey => {
        const privateKeyObj = importPrivateKey(decryptedPrivateKey)
        const publicKey = localStorage.getItem(`public-${threadId}`)
        const publicKeyObj = importPublicKey(publicKey)
        dispatch({
          type: SET_USER_KEYS,
          payload: {
            activePrivateKey: privateKeyObj,
            activePublicKey: publicKeyObj
          }
        })
        if (callback) {
          callback()
        }
      }).catch(e => {
        let message = ''
        if (!encryptedKey) {
          message = 'No private key stored'
        } else {
          message = 'Error while decrypting. Please, chech your password'
        }
        dispatch(setEncryptionError(message))
      })
  }
}

export function setDecryptedPrivateKey(threadId, passphrase, callback) {
  const { salt } = store.getState().auth

  return function action(dispatch) {
    dispatch(setEncryptionError(null))
    const encryptedKey = localStorage.getItem(`private-${threadId}`)
    decryptPrivateKey(encryptedKey, passphrase, salt).then(decryptedPrivateKey => {
      const privateKey = importPrivateKey(decryptedPrivateKey)
      dispatch({
        type: SET_DECRYPTED_PRIVATE_KEY,
        payload: {
          activePrivateKey: privateKey
        }
      })
      if (callback) {
        callback()
      }
    })
  }
}

export function storeEncryptedPrivateKey(privateKeyObj, passphrase, threadId) {
  const { salt } = store.getState().auth

  return function action(dispatch) {
    dispatch(setEncryptionError(null))
    const publicKey = exportPublicKey(privateKeyObj)
    const publicKeyObj = importPublicKey(publicKey)
    const privateKey = exportPrivateKey(privateKeyObj)
    encryptPrivateKey(privateKey, passphrase, salt).then(encryptedPrivateKey => {
      localStorage.setItem(`public-${threadId}`, publicKey)
      localStorage.setItem(`private-${threadId}`, encryptedPrivateKey)
      dispatch({
        type: SET_USER_KEYS,
        payload: {
          activePrivateKey: privateKeyObj,
          activePublicKey: publicKeyObj
        }
      })
      dispatch({
        type: SET_ENCRYPTED_PRIVATE_KEY,
        payload: {
          encryptedPrivateKey: encryptedPrivateKey
        }
      })
    })
  }
}

export function storePrivatePublicPair(passphrase, threadId, keysDict, callback) {
  const { salt } = store.getState().auth

  return function action(dispatch) {
    dispatch(setEncryptionError(null))
    const { privateKey, publicKey, privateKeyObj, publicKeyObj } = keysDict
    encryptPrivateKey(privateKey, passphrase, salt).then(encryptedPrivateKey => {
      localStorage.setItem(`public-${threadId}`, publicKey)
      localStorage.setItem(`private-${threadId}`, encryptedPrivateKey)
      dispatch({
        type: SET_USER_KEYS,
        payload: {
          activePrivateKey: privateKeyObj,
          activePublicKey: publicKeyObj
        }
      })
      dispatch({
        type: SET_ENCRYPTED_PRIVATE_KEY,
        payload: {
          encryptedPrivateKey: encryptedPrivateKey
        }
      })
      if (callback) {
        callback()
      }
    }).catch(e => {
        const message = 'Error while encrypting'
        dispatch(setEncryptionError(message))
      })
  }
}


