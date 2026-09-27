import re

def fix_schema(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    lines = content.split('\n')
    new_lines = []

    for line in lines:
        if 'chat_id     String?' in line:
            line = line.replace('?', ' @id')

        new_lines.append(line)

    with open(file_path, 'w') as f:
        f.write('\n'.join(new_lines))

if __name__ == '__main__':
    fix_schema('prisma/schema.prisma')
