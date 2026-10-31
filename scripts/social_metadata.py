"""Static link-preview metadata, available to crawlers without JavaScript."""
from html import escape

SITE_URL = 'https://aichurekmilashka-wq.github.io/Nurba-brat/'
IMAGE_URL = SITE_URL + 'public/assets/og-nurba.png'
LOCALES = {'ru':'ru_RU','ky':'ky_KG','en':'en_US','sv':'sv_SE','nb':'nb_NO'}

def social_metadata(lang, path, title, description):
    suffix = '' if lang == 'ru' and not path else f'prototype/{lang}/' + (path + '/' if path else '') + 'index.html'
    url = SITE_URL + suffix
    full_title = f'{title} | Nurba'
    tags = [
        ('og:type','website'), ('og:site_name','Nurba'), ('og:title',full_title),
        ('og:description',description), ('og:url',url), ('og:locale',LOCALES[lang]),
        ('og:image',IMAGE_URL), ('og:image:secure_url',IMAGE_URL),
        ('og:image:type','image/png'), ('og:image:width','1200'), ('og:image:height','630'),
        ('og:image:alt','Nurba — Регуляторный консалтинг'),
    ]
    output = ''.join(f'<meta property="{key}" content="{escape(value, quote=True)}">' for key,value in tags)
    output += ''.join(f'<meta property="og:locale:alternate" content="{locale}">' for code,locale in LOCALES.items() if code != lang)
    for key,value in [('twitter:card','summary_large_image'),('twitter:title',full_title),('twitter:description',description),('twitter:image',IMAGE_URL),('twitter:image:alt','Nurba — Регуляторный консалтинг')]:
        output += f'<meta name="{key}" content="{escape(value, quote=True)}">'
    return output
