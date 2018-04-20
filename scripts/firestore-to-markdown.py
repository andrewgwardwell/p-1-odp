# Convert Firestore documents to markdown files
#
# Usage:
#   firestore-backup-restore
#     --accountCredentials firebase-key.json \
#     --backupPath backup \
#     --prettyPrint
#   python scripts/firestore-to-markdown.py

from glob import glob
from pathlib import Path
import json
import yaml

for inf in (f for col in ['principles', 'sightings'] for f in glob(f'firestore/{col}/*/*')):
    data = json.loads(open(inf).read())

    # extracrt and normalize the frontmatter and descriptions
    fm = {k: v['value'] for k, v in data.items()}
    desc = fm.pop('description', '').replace('\\n', '\n')
    if 'elements' in fm:
        name = fm['title'].lower().replace(' ', '-')
        fm['principles'] = [k.replace('-', ' ') for k in fm.pop('elements')]
    else:
        fm['name'] = fm.pop('title')

    _, col, name, *_ = inf.split('/')
    outf = f'src/pages/{col}/{name}.md'
    fm['path'] = f'/{col}/{name}'
    print(inf, '->', outf)

    with open(outf, 'w') as fd:
        fd.write('---\n')
        fd.write(yaml.dump(fm, default_flow_style=False))
        fd.write('---\n\n')
        fd.write(desc)
        fd.write('\n')
