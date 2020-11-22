import uuid
import hashlib
from random import choice


def generate_16_hash_code():
    hash_object = hashlib.sha1(bytes(str(uuid.uuid4()), 'utf-8'))
    pbHash = hash_object.hexdigest()
    stript_hash = pbHash[:8] + pbHash[0:8]
    return ''.join(choice((str.upper, str.lower))(c) for c in stript_hash)


def generate_56_hash_code():
    seed = str(uuid.uuid4()).encode('utf-8')
    hash_str = hashlib.sha224(seed).hexdigest()
    return ''.join(choice((str.upper, str.lower))(c) for c in hash_str)


def validate_uuid4_array(uuid_arrr):
    for uuid_string in uuid_arrr:
        try:
            uuid.UUID(uuid_string, version=4)
        except ValueError:
            return False
    return True
