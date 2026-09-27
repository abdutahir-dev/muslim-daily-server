import re

def fix_schema(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    lines = content.split('\n')
    new_lines = []

    for line in lines:
        if 'surah_number' in line or 'verse_number' in line or 'reciter' in line or 'verse_key' in line or 'tafsir_id' in line or 'translation_id' in line:
            line = line.replace('?', '')

        new_lines.append(line)

    with open(file_path, 'w') as f:
        f.write('\n'.join(new_lines))

if __name__ == '__main__':
    fix_schema('prisma/schema.prisma')
