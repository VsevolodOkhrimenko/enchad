import hashlib
import os
import base64
from django.conf import settings
from Crypto.Cipher import AES


IV_SIZE = int(settings.IV_SIZE)
KEY_SIZE = int(settings.KEY_SIZE)
SALT_SIZE = int(settings.SALT_SIZE)
SYMMETRIC_PASS = settings.SYMMETRIC_PASS


def symmetric_encrypt(target):
    cleartext = bytes(target, 'utf-8')
    password = bytes(SYMMETRIC_PASS, 'utf-8')
    salt = os.urandom(SALT_SIZE)
    derived = hashlib.pbkdf2_hmac('sha256', password, salt, 100000,
                                  dklen=IV_SIZE + KEY_SIZE)
    iv = derived[0:IV_SIZE]
    key = derived[IV_SIZE:]
    encrypted = salt + AES.new(key, AES.MODE_CFB, iv).encrypt(cleartext)
    base64_bytes = base64.b64encode(encrypted)
    return base64_bytes.decode("utf-8")


def symmetric_decrypt(encrypted):
    encrypted_encoded = encrypted.encode("utf-8")
    encrypted_bytes = base64.b64decode(encrypted_encoded)
    salt = encrypted_bytes[0:SALT_SIZE]
    password = bytes(SYMMETRIC_PASS, 'utf-8')
    derived = hashlib.pbkdf2_hmac('sha256', password, salt, 100000,
                                  dklen=IV_SIZE + KEY_SIZE)
    iv = derived[0:IV_SIZE]
    key = derived[IV_SIZE:]
    cleartext = AES.new(key, AES.MODE_CFB, iv).decrypt(
        encrypted_bytes[SALT_SIZE:])
    return cleartext.decode("utf-8")
