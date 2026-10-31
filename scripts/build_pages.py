"""Build a GitHub Pages artifact using the validated offline site, without Node."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / '_site'
subprocess.run([sys.executable, str(ROOT / 'scripts/build_site.py')], cwd=ROOT, check=True)
OUT.mkdir(exist_ok=True)
shutil.copy2(ROOT / 'Предпросмотр.html', OUT / 'index.html')
shutil.copy2(ROOT / 'Предпросмотр.html', OUT / 'Предпросмотр.html')
shutil.copytree(ROOT / 'prototype', OUT / 'prototype', dirs_exist_ok=True)
shutil.copytree(ROOT / 'public/assets', OUT / 'public/assets', dirs_exist_ok=True, ignore=shutil.ignore_patterns('nurayim-portrait.jpeg', '*.prompt.txt'))
(OUT / '.nojekyll').touch()

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'a' and a.get('href'):
            self.links.append(a['href'])
        if tag == 'img' and a.get('src'):
            self.links.append(a['src'])

count = 0
for file in OUT.rglob('*.html'):
    parser = Links()
    parser.feed(file.read_text())
    for link in parser.links:
        parsed = urlsplit(link)
        if parsed.scheme or parsed.netloc or not parsed.path:
            continue
        dest = (file.parent / unquote(parsed.path)).resolve()
        if not dest.is_relative_to(OUT.resolve()) or not dest.is_file():
            raise RuntimeError(f'Broken published link in {file.relative_to(OUT)}: {link}')
    count += 1
print(f'GitHub Pages artifact: {count} HTML files; published links and images: OK')
