from bcrypt import checkpw, gensalt, hashpw


async def hash_password(password: str, salt: str | None = None) -> str:
    """Hash password function"""
    if salt is None or not salt:
        salt_byte = gensalt(16)
    else:
        salt_byte = salt.encode("utf-8")

    hash = hashpw(password.encode("utf-8"), salt_byte)
    return str(hash, encoding="utf-8")


async def validate_password(password: str, hash: str) -> bool:
    return checkpw(password.encode("utf-8"), hash.encode("utf-8"))
