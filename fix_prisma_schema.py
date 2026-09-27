import re

def fix_schema(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Remove the comments
    content = re.sub(r'/// The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client\.\n', '', content)

    # Remove @@ignore
    content = re.sub(r'\s*@@ignore', '', content)

    lines = content.split('\n')
    new_lines = []

    for line in lines:
        if 'chat_id     String?' in line:
            line = line.replace('?', ' @id')

        if 'id               String?' in line:
            line = line.replace('?', ' @id')

        if 'id                 String?' in line:
            line = line.replace('?', ' @id')

        if 'date          String?' in line and 'hadith_id' in '\n'.join(lines[lines.index(line):lines.index(line)+5]):
            line = line.replace('?', ' @id')

        if 'surah_number' in line or 'verse_number' in line or 'reciter' in line or 'verse_key' in line or 'tafsir_id' in line or 'translation_id' in line:
            line = line.replace('?', '')

        new_lines.append(line)

    with open(file_path, 'w') as f:
        f.write('\n'.join(new_lines))

if __name__ == '__main__':
    fix_schema('prisma/schema.prisma')
