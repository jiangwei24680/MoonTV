#!/usr/bin/env python3
"""Force the debug build to sign with the repo's fixed debug keystore.

Background: the workflow used to copy keystore/debug.keystore to
~/.android/debug.keystore and rely on AGP's implicit debug signing config.
In practice AGP ignored it and generated a fresh ephemeral keystore on
every runner (v14/v15/v16 all had different signatures), so updates
failed with INSTALL_FAILED_UPDATE_INCOMPATIBLE ("signature conflict").
This script wires an explicit signingConfigs.debug into the generated
android/app/build.gradle, pointing at android/app/debug.keystore
(copied from keystore/debug.keystore by the workflow), so every build
is signed with the same key. Idempotent; fails loudly if the patch
cannot be applied.
"""
import re
import sys

GRADLE = "android/app/build.gradle"
KEYSTORE = "android/app/debug.keystore"

SIGNING_BLOCK = '''    signingConfigs {
        debug {
            storeFile file("debug.keystore")
            storePassword "android"
            keyAlias "androiddebugkey"
            keyPassword "android"
        }
    }
'''

DEBUG_TYPE = '''        debug {
            signingConfig signingConfigs.debug
        }
'''


def main() -> int:
    with open(GRADLE, encoding="utf-8") as f:
        text = f.read()

    if "signingConfigs" not in text:
        m = re.search(r"^android\s*\{\s*$", text, re.M)
        if not m:
            print("patch_signing: no 'android {' block found", file=sys.stderr)
            return 1
        text = text[: m.end()] + "\n" + SIGNING_BLOCK + text[m.end():]
        print("patch_signing: signingConfigs block inserted")
    else:
        print("patch_signing: signingConfigs already present, skipped")

    if "signingConfigs.debug" not in text:
        m = re.search(r"^(\s*)buildTypes\s*\{\s*$", text, re.M)
        if not m:
            print("patch_signing: no 'buildTypes {' block found", file=sys.stderr)
            return 1
        text = text[: m.end()] + "\n" + DEBUG_TYPE + text[m.end():]
        print("patch_signing: debug buildType inserted")
    else:
        print("patch_signing: debug buildType already present, skipped")

    with open(GRADLE, "w", encoding="utf-8") as f:
        f.write(text)

    with open(KEYSTORE, "rb") as f:
        header = f.read(4)
    if not header:
        print("patch_signing: keystore file is empty", file=sys.stderr)
        return 1
    print("patch_signing: keystore present at", KEYSTORE)
    print("patch_signing: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
