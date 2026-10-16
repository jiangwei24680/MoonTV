"""给 Capacitor 生成的 AndroidManifest.xml 打补丁：
1. 添加 REQUEST_INSTALL_PACKAGES 权限（应用内安装 APK 需要）
2. 添加 FileProvider（Android 7+ 安装 APK 必须走 FileProvider）
用法: python3 patch_manifest.py android/app/src/main/AndroidManifest.xml
"""
import sys
import xml.etree.ElementTree as ET

ANDROID_NS = "http://schemas.android.com/apk/res/android"
ET.register_namespace("android", ANDROID_NS)


def qname(attr):
    return f"{{{ANDROID_NS}}}{attr}"


def main():
    path = sys.argv[1]
    tree = ET.parse(path)
    root = tree.getroot()

    # 1. 权限
    want_perms = {
        "android.permission.REQUEST_INSTALL_PACKAGES",
    }
    existing = {e.get(qname("name")) for e in root.findall("uses-permission")}
    for perm in want_perms:
        if perm not in existing:
            el = ET.Element("uses-permission")
            el.set(qname("name"), perm)
            # 插到第一个 application 之前，保持 manifest 规范顺序
            app = root.find("application")
            idx = list(root).index(app) if app is not None else len(list(root))
            root.insert(idx, el)
            print(f"added permission: {perm}")
        else:
            print(f"permission exists: {perm}")

    # 2. FileProvider
    app = root.find("application")
    if app is None:
        raise SystemExit("no <application> in manifest")
    has_provider = any(
        e.get(qname("name"), "").endswith("FileProvider")
        for e in app.findall("provider")
    )
    if not has_provider:
        provider = ET.SubElement(app, "provider")
        provider.set(qname("name"), "androidx.core.content.FileProvider")
        provider.set(qname("authorities"), "${applicationId}.fileprovider")
        provider.set(qname("exported"), "false")
        provider.set(qname("grantUriPermissions"), "true")
        meta = ET.SubElement(provider, "meta-data")
        meta.set(qname("name"), "android.support.FILE_PROVIDER_PATHS")
        meta.set(qname("resource"), "@xml/file_paths")
        print("added FileProvider")
    else:
        print("FileProvider exists")

    tree.write(path, encoding="utf-8", xml_declaration=True)
    print("manifest patched:", path)


if __name__ == "__main__":
    main()
