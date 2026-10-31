"""Offline counterpart of ProjectJourney, sharing SVG assets and interaction."""
from pathlib import Path
from html import escape
import json

DETAILS=json.loads((Path(__file__).resolve().parent.parent/'content/project-journey.json').read_text())

def render_journey(items,locale,title,asset_url,prefix='journey-home'):
    e=lambda value:escape(str(value),quote=True)
    out='<div class="project-journey" data-project-journey><div class="journey-map"><svg class="journey-road" viewBox="0 0 1200 420" preserveAspectRatio="none" aria-hidden="true"><path d="M200 104H1000C1160 104 1160 316 1000 316H200"/></svg>'
    out+=f'<div class="journey-grid" role="tablist" aria-label="{e(title)}">'
    for i,item in enumerate(items):
        selected='true' if i==0 else 'false'
        tab_index='0' if i==0 else '-1'
        out+=f'<button type="button" role="tab" id="{prefix}-step-{i}" aria-controls="{prefix}-panel-{i}" aria-selected="{selected}" tabindex="{tab_index}" data-journey-step="{i}" class="journey-node journey-node-{i+1}"><span class="journey-art"><img src="{e(asset_url(i+1))}" width="160" height="160" alt="" loading="lazy"></span><span class="journey-number">{i+1:02}</span><span class="journey-title">{e(item)}</span></button>'
    out+='</div></div><div class="journey-details">'
    for i,item in enumerate(items):
        hidden=' hidden' if i else ''
        out+=f'<div role="tabpanel" id="{prefix}-panel-{i}" aria-labelledby="{prefix}-step-{i}" data-journey-panel{hidden} tabindex="0" class="journey-panel"><span class="journey-detail-number">{i+1:02} / {len(items):02}</span><div><h3>{e(item)}</h3><p>{e(DETAILS[locale][i])}</p></div></div>'
    return out+'</div></div>'
