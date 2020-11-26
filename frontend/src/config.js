const Config = {
  network: {
    backendUrl: process.env.REACT_APP_BACKEND_URL || 'http://192.168.0.153:8000',
    wsUrl: process.env.REACT_APP_WS_URL || 'ws://192.168.0.153:8000'
  },
  encryption: {
    passwordMinSize: parseInt(process.env.REACT_APP_PASSWORD_MIN_SIZE) || 4,
    ivSize: parseInt(process.env.REACT_APP_AES_IV_SIZE) || 16,
    saltSize: parseInt(process.env.REACT_APP_AES_SALT_SIZE) || 16,
    keySize: parseInt(process.env.REACT_APP_AES_KEY_SIZE) || 32,
    iterations: parseInt(process.env.REACT_APP_AES_ITERATIONS) || 100000
  }
}

export default Config
