"""Check visitor paths in the generated site: python3 -m unittest discover -s qa."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import json
import unittest

ROOT = Path(__file__).resolve().parents[1]
LANGUAGES = ('ru', 'ky', 'en', 'sv', 'nb')


class Element:
    def __init__(self, tag='', attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []

    def find(self, tag=None, cls=None):
        found = []
        for child in self.children:
            if (tag is None or child.tag == tag) and (cls is None or cls in child.attrs.get('class', '').split()):
                found.append(child)
            found.extend(child.find(tag, cls))
        return found


class Document(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.root = Element()
        self.stack = [self.root]
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        node = Element(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}:
            self.stack.append(node)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break


def page(locale, path=''):
    return Document(ROOT / 'prototype' / locale / path / 'index.html').root


class VisitorPaths(unittest.TestCase):
    def test_contact_page_has_four_direct_channels_without_download_form(self):
        for locale in LANGUAGES:
            with self.subTest(locale=locale):
                main = page(locale, 'contacts').find('main')[0]
                links = {a.attrs['href'] for a in main.find('a')}
                self.assertTrue({'https://wa.me/996503030997', 'https://t.me/+996503030997',
                                 'tel:+996503030997', 'mailto:aichurekmilashka@icloud.com'} <= links)
                self.assertFalse(main.find('form'))

    def test_menu_is_flat_and_has_no_duplicate_destinations(self):
        for locale in LANGUAGES:
            with self.subTest(locale=locale):
                menu = page(locale).find(cls='main-menu-panel')[0]
                links = [a.attrs['href'] for a in menu.find('a')]
                self.assertLessEqual(len(links), 6)
                self.assertEqual(len(links), len(set(links)))
                self.assertFalse(menu.find('details'))
                self.assertTrue(any('contacts' in Path(urlsplit(link).path).parts for link in links))

    def test_home_is_short_and_visitors_can_contact_the_company(self):
        for locale in LANGUAGES:
            with self.subTest(locale=locale):
                main = page(locale).find('main')[0]
                self.assertLessEqual(len(main.find(cls='content-section')), 3)
                self.assertLessEqual(len(main.find(cls='service-folder-card')), 3)
                self.assertTrue(any(a.attrs['href'].startswith('https://wa.me/') for a in main.find('a')))
                self.assertFalse(main.find('form'))

    def test_footer_offers_contacts_and_only_four_navigation_links(self):
        for locale in LANGUAGES:
            with self.subTest(locale=locale):
                footer = page(locale).find('footer')[0]
                navigation = footer.find(cls='footer-links')
                self.assertEqual(len(navigation), 1)
                self.assertLessEqual(len(navigation[0].find('a')), 4)
                links = [a.attrs['href'] for a in footer.find('a')]
                self.assertTrue(any(x.startswith('mailto:') for x in links))
                self.assertTrue(any(x.startswith('tel:') for x in links))

    def test_service_details_do_not_repeat_the_entire_home_page(self):
        data = json.loads((ROOT / 'content/site.json').read_text())
        for locale in LANGUAGES:
            for path, content in data['locales'][locale]['pages'].items():
                if path.startswith('services/'):
                    with self.subTest(locale=locale, path=path):
                        self.assertLessEqual(len(content['blocks']), 4)


if __name__ == '__main__':
    unittest.main()
