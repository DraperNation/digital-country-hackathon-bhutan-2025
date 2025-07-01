import secrets
import hmac
import base64
import hashlib


hmac_secret = base64.urlsafe_b64decode('YjJxeUZkR2ZhNGJfR1lWQ2ZrSFBxTGhIeVRxWVR3eFg=')


def generate_otp() -> str:
    """Returns a 6‑digit zero‑padded string using cryptographic RNG."""
    return f"{secrets.randbelow(1_000_000):06}"


def hmac_tag(payload: bytes) -> bytes:
    return hmac.new(hmac_secret, payload, hashlib.sha256).digest()


def encode_token(payload: bytes, tag: bytes) -> str:
    return base64.urlsafe_b64encode(payload + b"." + tag).decode()


def decode_token(token: str) -> tuple[bytes, bytes]:
    data = base64.urlsafe_b64decode(token.encode())
    payload, tag = data.rsplit(b".", 1)
    return payload, tag
