import { ArrowUpRight } from 'lucide-react'
import contacts from '@/content/contacts.json'

export default function ContactChannels({ ui, compact = false }: {
  ui: Record<string, string>; compact?: boolean
}) {
  const channels = [
    { label: 'WhatsApp', value: contacts.phoneDisplay, href: contacts.whatsapp },
    { label: 'Telegram', value: contacts.phoneDisplay, href: contacts.telegram },
    { label: ui.phoneLabel, value: contacts.phoneDisplay, href: `tel:${contacts.phone}` },
    { label: 'Email', value: contacts.email, href: `mailto:${contacts.email}` },
  ]
  return <div className={compact ? 'footer-contacts' : 'contact-channels'}>
    {channels.map(({ label, value, href }) => <a className="contact-channel" href={href} key={href}
      {...(href.startsWith('https:') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      <span className="contact-copy"><strong>{label}</strong>{(!compact || !href.startsWith('https:')) && <span>{value}</span>}</span>
      {!compact && <ArrowUpRight className="contact-arrow" size={18} aria-hidden="true" />}
    </a>)}
  </div>
}
