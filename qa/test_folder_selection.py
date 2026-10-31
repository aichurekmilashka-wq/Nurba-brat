import json
import sys
import unittest
from test_simplification import ROOT, LANGUAGES, page


class FolderSelection(unittest.TestCase):
    def test_every_sheet_opens_its_service_and_titles_do_not_navigate(self):
        expected = [
            'medicines-registration', 'medical-devices-registration', 'dossier-review',
            'dossier-preparation', 'variations', 'pharmacovigilance', 'regulatory-consulting',
        ]
        for locale in LANGUAGES:
            cards = page(locale, 'services').find(cls='service-folder-card')
            self.assertEqual(len(cards), 7)
            for card, slug in zip(cards, expected):
                with self.subTest(locale=locale, service=slug):
                    self.assertFalse(card.find('h3')[0].find('a'))
                    sheets = card.find('a', 'gf-sheet')
                    self.assertEqual(len(sheets), 3)
                    for sheet in sheets:
                        self.assertEqual(sheet.attrs['href'], f'{slug}/index.html')
                        self.assertIn('aria-label', sheet.attrs)
                    self.assertTrue(card.find('button', 'gf-hit'))

    def test_persistent_contact_control_contains_phone_icon_and_no_visible_text(self):
        for locale in LANGUAGES:
            control = page(locale).find('a', 'header-contact')[0]
            self.assertTrue(control.attrs.get('aria-label'))
            self.assertTrue(control.find('svg'))

    @unittest.skipUnless(sys.platform == 'darwin', 'Uses the local macOS JavaScript engine')
    def test_hover_enables_sheets_without_navigating_and_touch_keeps_click_control(self):
        from js_runtime import JavaScript
        runtime = JavaScript()
        source = (ROOT / 'lib/folder-hover.js')
        self.assertTrue(source.is_file(), 'Shared hover interaction is missing')
        runtime.run(source.read_text().replace('export ', ''))
        result = runtime.run('''
          var document = {activeElement:null};
          var listeners = {}, open = false, changes = [];
          var root = {
            hasAttribute: () => open,
            contains: item => item === 'sheet',
            addEventListener: (name, handler) => listeners[name] = handler,
            removeEventListener: name => delete listeners[name],
          };
          var cleanup = mountFolderHover(root, value => {open=value;changes.push(value)});
          listeners.pointerenter({pointerType:'mouse'});
          var mouseOpened = open;
          listeners.pointerleave({pointerType:'mouse'});
          var mouseClosed = !open;
          listeners.pointerenter({pointerType:'touch'});
          var touchUnchanged = !open;
          open = true;
          listeners.pointerenter({pointerType:'mouse'});
          listeners.pointerleave({pointerType:'mouse'});
          var manualOpenPreserved = open;
          open = false;
          listeners.pointerenter({pointerType:'mouse'});
          document.activeElement = 'sheet';
          listeners.pointerleave({pointerType:'mouse'});
          var keyboardSelectionPreserved = open;
          cleanup();
          JSON.stringify({mouseOpened,mouseClosed,touchUnchanged,manualOpenPreserved,
            keyboardSelectionPreserved,cleaned:Object.keys(listeners).length===0});
        ''')
        self.assertEqual(json.loads(result), dict.fromkeys([
            'mouseOpened', 'mouseClosed', 'touchUnchanged', 'manualOpenPreserved',
            'keyboardSelectionPreserved', 'cleaned'], True))
