with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

content = content.replace('provider = env("DB_PROVIDER")', 'provider = "sqlite"')

with open('prisma/schema.prisma', 'w') as f:
    f.write(content)
