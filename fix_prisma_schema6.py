with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

content = content.replace('url      = env("DATABASE_URL")', 'url      = "file:../muslimdaily_master.sqlite"')

with open('prisma/schema.prisma', 'w') as f:
    f.write(content)
