import os

def sanitize(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.py'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'rb') as f:
                        content = f.read()
                    if b'\x00' in content:
                        print(f"FIXING: {path}")
                        sanitized = content.replace(b'\x00', b'')
                        with open(path, 'wb') as f:
                            f.write(sanitized)
                    # Also ensure UTF-8 without BOM
                    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                        text = f.read()
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(text)
                except Exception as e:
                    print(f"Error {path}: {e}")

if __name__ == "__main__":
    sanitize('.')
