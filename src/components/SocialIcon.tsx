import React from 'react';
import {
  Mail,
  Phone,
  Globe,
  Github,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  Star,
  Send,
  Calendar,
  Slack,
  Twitch,
  FileText,
  Link as LinkIcon,
} from 'lucide-react';

export interface SocialIconProps {
  icon: string;
  className?: string;
}

export interface PlatformMeta {
  id: string;
  name: string;
  category: 'direct' | 'meeting' | 'social' | 'professional' | 'other';
  placeholder: string;
  defaultUrl: string;
  helpText: string;
  aliases: string[];
}

export const SUPPORTED_PLATFORMS: PlatformMeta[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'professional',
    placeholder: 'https://linkedin.com/in/smahsan52',
    defaultUrl: 'https://linkedin.com/in/smahsan52',
    helpText: 'Full profile URL — e.g. https://linkedin.com/in/yourname',
    aliases: ['linkedin', 'in', 'li'],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'direct',
    placeholder: '+92 300 2711390 or wa.me link',
    defaultUrl: '+92 300 2711390',
    helpText: 'Digits only with country code (e.g. 923002711390) or full https://wa.me/ link',
    aliases: ['whatsapp', 'wa', 'whatsappbusiness'],
  },
  {
    id: 'email',
    name: 'Email',
    category: 'direct',
    placeholder: 'smahsan52@hotmail.com',
    defaultUrl: 'smahsan52@hotmail.com',
    helpText: 'Direct email address — e.g. smahsan52@hotmail.com',
    aliases: ['email', 'mail', 'envelope', 'gmail', 'outlook'],
  },
  {
    id: 'phone',
    name: 'Phone',
    category: 'direct',
    placeholder: '+92 300 2711390',
    defaultUrl: '+92 300 2711390',
    helpText: 'Phone number with country code — e.g. +92 300 2711390',
    aliases: ['phone', 'tel', 'telephone', 'call', 'mobile'],
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    category: 'meeting',
    placeholder: 'https://teams.microsoft.com/l/...',
    defaultUrl: 'https://teams.microsoft.com',
    helpText: 'Teams meeting invitation link or direct channel URL',
    aliases: ['teams', 'msteams', 'microsoftteams', 'team'],
  },
  {
    id: 'meet',
    name: 'Google Meet',
    category: 'meeting',
    placeholder: 'https://meet.google.com/abc-defg-hij',
    defaultUrl: 'https://meet.google.com',
    helpText: 'Google Meet room URL or meeting code',
    aliases: ['meet', 'googlemeet', 'gmeet', 'google-meet'],
  },
  {
    id: 'zoom',
    name: 'Zoom',
    category: 'meeting',
    placeholder: 'https://zoom.us/j/1234567890',
    defaultUrl: 'https://zoom.us',
    helpText: 'Personal meeting room link or invitation URL',
    aliases: ['zoom', 'zoommeeting', 'zoomvideo', 'zoom-meeting'],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'social',
    placeholder: 'https://facebook.com/yourprofile',
    defaultUrl: 'https://facebook.com',
    helpText: 'Facebook profile or business page URL',
    aliases: ['facebook', 'fb'],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    placeholder: 'https://instagram.com/username or @username',
    defaultUrl: 'https://instagram.com',
    helpText: 'Instagram profile URL or handle',
    aliases: ['instagram', 'ig', 'insta'],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'social',
    placeholder: 'https://tiktok.com/@username or @username',
    defaultUrl: 'https://tiktok.com',
    helpText: 'TikTok profile URL or handle',
    aliases: ['tiktok', 'tik-tok', 'tik_tok'],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'social',
    placeholder: 'https://youtube.com/@channel',
    defaultUrl: 'https://youtube.com',
    helpText: 'YouTube channel URL or video profile',
    aliases: ['youtube', 'yt', 'youtubevideo'],
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    category: 'social',
    placeholder: 'https://x.com/username or @username',
    defaultUrl: 'https://x.com',
    helpText: 'Twitter / X profile URL or handle',
    aliases: ['twitter', 'x', 'xcorp', 'tweet'],
  },
  {
    id: 'calendly',
    name: 'Calendly / Booking',
    category: 'meeting',
    placeholder: 'https://calendly.com/yourname',
    defaultUrl: 'https://calendly.com',
    helpText: 'Calendly scheduling or calendar appointment link',
    aliases: ['calendly', 'calendar', 'booking', 'schedule', 'appointments'],
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'direct',
    placeholder: 'https://t.me/username or @username',
    defaultUrl: 'https://t.me',
    helpText: 'Telegram direct username or channel link',
    aliases: ['telegram', 'tg'],
  },
  {
    id: 'skype',
    name: 'Skype',
    category: 'meeting',
    placeholder: 'skype:username?chat or username',
    defaultUrl: 'skype:live:consultant?chat',
    helpText: 'Skype username or call/chat URI',
    aliases: ['skype', 'skypecall'],
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'social',
    placeholder: 'https://discord.gg/yourserver or username',
    defaultUrl: 'https://discord.com',
    helpText: 'Discord server invite or profile handle',
    aliases: ['discord'],
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'professional',
    placeholder: 'https://yourworkspace.slack.com',
    defaultUrl: 'https://slack.com',
    helpText: 'Slack workspace invite or channel link',
    aliases: ['slack'],
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'professional',
    placeholder: 'https://github.com/yourusername',
    defaultUrl: 'https://github.com',
    helpText: 'GitHub developer profile URL',
    aliases: ['github', 'gh', 'git'],
  },
  {
    id: 'threads',
    name: 'Threads',
    category: 'social',
    placeholder: 'https://threads.net/@username',
    defaultUrl: 'https://threads.net',
    helpText: 'Threads profile link or handle',
    aliases: ['threads'],
  },
  {
    id: 'wechat',
    name: 'WeChat',
    category: 'direct',
    placeholder: 'WeChat ID or link',
    defaultUrl: 'https://wechat.com',
    helpText: 'WeChat ID or QR link',
    aliases: ['wechat', 'weixin'],
  },
  {
    id: 'twitch',
    name: 'Twitch',
    category: 'social',
    placeholder: 'https://twitch.tv/channel',
    defaultUrl: 'https://twitch.tv',
    helpText: 'Twitch channel or stream URL',
    aliases: ['twitch'],
  },
  {
    id: 'reddit',
    name: 'Reddit',
    category: 'social',
    placeholder: 'https://reddit.com/u/username',
    defaultUrl: 'https://reddit.com',
    helpText: 'Reddit user or subreddit link',
    aliases: ['reddit'],
  },
  {
    id: 'medium',
    name: 'Medium',
    category: 'professional',
    placeholder: 'https://medium.com/@username',
    defaultUrl: 'https://medium.com',
    helpText: 'Medium or Substack publication URL',
    aliases: ['medium', 'substack', 'blog'],
  },
  {
    id: 'website',
    name: 'Website / Portfolio',
    category: 'other',
    placeholder: 'https://yourwebsite.com',
    defaultUrl: 'https://',
    helpText: 'Personal portfolio, company website, or external link',
    aliases: ['website', 'web', 'globe', 'portfolio', 'site', 'link'],
  },
];

export const normalizePlatform = (iconName: string): string => {
  const clean = (iconName || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const meta of SUPPORTED_PLATFORMS) {
    if (meta.id === clean || meta.aliases.includes(clean)) {
      return meta.id;
    }
  }
  return clean;
};

export const getPlatformName = (iconName: string): string => {
  const norm = normalizePlatform(iconName);
  const found = SUPPORTED_PLATFORMS.find((p) => p.id === norm);
  if (found) return found.name;
  if (!iconName) return 'Custom Platform';
  return iconName.charAt(0).toUpperCase() + iconName.slice(1);
};

export const getPlatformHelpText = (iconName: string): string => {
  const norm = normalizePlatform(iconName);
  const found = SUPPORTED_PLATFORMS.find((p) => p.id === norm);
  if (found) return found.helpText;
  return "Full profile URL or address — e.g. https://... If the name doesn't match a known icon, a star icon is shown.";
};

export const getSocialHref = (iconName: string, url: string): string => {
  const norm = normalizePlatform(iconName);
  const trimmed = (url || '').trim();
  if (!trimmed) return '#';

  if (norm === 'email' || (trimmed.includes('@') && !trimmed.startsWith('http'))) {
    return trimmed.startsWith('mailto:') ? trimmed : `mailto:${trimmed}`;
  }

  if (norm === 'phone') {
    const cleanNum = trimmed.replace(/[^\d+]/g, '');
    return trimmed.startsWith('tel:') ? trimmed : `tel:${cleanNum}`;
  }

  if (norm === 'whatsapp') {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const digitsOnly = trimmed.replace(/\D/g, '');
    return `https://wa.me/${digitsOnly}`;
  }

  if (norm === 'telegram') {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const user = trimmed.replace(/^@/, '');
    return `https://t.me/${user}`;
  }

  if (norm === 'skype') {
    if (trimmed.startsWith('skype:') || trimmed.startsWith('http')) {
      return trimmed;
    }
    return `skype:${trimmed}?chat`;
  }

  if (norm === 'tiktok') {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const user = trimmed.replace(/^@/, '');
    return `https://tiktok.com/@${user}`;
  }

  if (norm === 'instagram') {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const user = trimmed.replace(/^@/, '');
    return `https://instagram.com/${user}`;
  }

  if (norm === 'facebook') {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return `https://facebook.com/${trimmed}`;
  }

  if (norm === 'youtube') {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const user = trimmed.replace(/^@/, '');
    return `https://youtube.com/@${user}`;
  }

  if (norm === 'twitter') {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const user = trimmed.replace(/^@/, '');
    return `https://x.com/${user}`;
  }

  if (norm === 'threads') {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const user = trimmed.replace(/^@/, '');
    return `https://threads.net/@${user}`;
  }

  if (norm === 'github') {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const user = trimmed.replace(/^@/, '');
    return `https://github.com/${user}`;
  }

  if (norm === 'calendly') {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return `https://calendly.com/${trimmed}`;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

export const getSocialTarget = (iconName: string, url: string): string | undefined => {
  const norm = normalizePlatform(iconName);
  const trimmed = (url || '').trim();
  if (norm === 'email' || trimmed.startsWith('mailto:') || norm === 'phone' || trimmed.startsWith('tel:') || norm === 'skype' || trimmed.startsWith('skype:')) {
    return undefined;
  }
  return '_blank';
};

export const getSocialRel = (iconName: string, url: string): string | undefined => {
  const target = getSocialTarget(iconName, url);
  return target === '_blank' ? 'noopener noreferrer' : undefined;
};

export const SocialIcon: React.FC<SocialIconProps> = ({ icon, className = 'w-4 h-4' }) => {
  const norm = normalizePlatform(icon);

  switch (norm) {
    case 'linkedin':
      return (
        <span
          className={`font-sans font-black tracking-tight text-[15px] leading-none inline-flex items-center justify-center select-none ${className}`}
          aria-hidden="true"
        >
          in
        </span>
      );

    case 'email':
      return <Mail className={className} aria-hidden="true" />;

    case 'phone':
      return <Phone className={className} aria-hidden="true" />;

    case 'whatsapp':
      return (
        <svg
          className={`fill-current ${className}`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m-3.53 3.32c-.19 0-.41.07-.63.32-.22.25-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.58.25 1.02.4 1.37.51.58.18 1.1.16 1.52.1.46-.07 1.41-.58 1.61-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.47-.28s-1.47-.72-1.7-.8c-.23-.08-.4-.12-.57.12-.17.25-.66.8-.81.97-.15.17-.3.19-.55.07s-1.06-.39-2.02-1.25c-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.32-.02-.45s-.57-1.37-.78-1.88c-.2-.49-.4-.43-.57-.44-.15-.01-.32-.01-.51-.01Z" />
        </svg>
      );

    case 'teams':
      // Microsoft Teams: Iconic enterprise collaboration mark
      return (
        <svg
          className={`fill-current ${className}`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M16.5 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18.5 7.75h-4a1.25 1.25 0 0 0-1.25 1.25v3.25c.5.18 1.04.28 1.6.28.98 0 1.89-.3 2.65-.8.32-.21.5-.56.5-.93V9a1.25 1.25 0 0 0-1.25-1.25ZM11 5.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM13.25 7H8.75A2.25 2.25 0 0 0 6.5 9.25v6.5A2.25 2.25 0 0 0 8.75 18h4.5a2.25 2.25 0 0 0 2.25-2.25v-6.5A2.25 2.25 0 0 0 13.25 7ZM10.25 9.25h1.5v1.25H11v4.5H9.5v-4.5h-.75V9.25h1.5ZM4.5 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6.5 7.75h-4A1.25 1.25 0 0 0 1.25 9v2.8c0 .37.18.72.5.93.76.5 1.67.8 2.65.8.56 0 1.1-.1 1.6-.28V9A1.25 1.25 0 0 0 6.5 7.75Z" />
        </svg>
      );

    case 'meet':
      // Google Meet video camera
      return (
        <svg
          className={`fill-current ${className}`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M13.5 8.2v7.6a1 1 0 0 0 1.57.82l5.5-3.8a1 1 0 0 0 0-1.64l-5.5-3.8A1 1 0 0 0 13.5 8.2ZM3 7a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7Z" />
        </svg>
      );

    case 'zoom':
      // Zoom video camera rounded glyph
      return (
        <svg
          className={`fill-current ${className}`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h7.5A2.5 2.5 0 0 1 16.5 6.5v11a2.5 2.5 0 0 1-2.5 2.5H6.5A2.5 2.5 0 0 1 4 17.5v-11ZM18 8.64l4.24-3.18A.75.75 0 0 1 23.4 6.06v11.88a.75.75 0 0 1-1.16.6l-4.24-3.18V8.64Z" />
        </svg>
      );

    case 'tiktok':
      // TikTok musical note mark
      return (
        <svg
          className={`fill-current ${className}`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.41a6.33 6.33 0 0 0-.85-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.58a8.28 8.28 0 0 0 4.84 1.56V6.69h-.07Z" />
        </svg>
      );

    case 'youtube':
      return <Youtube className={className} aria-hidden="true" />;

    case 'facebook':
      return <Facebook className={className} aria-hidden="true" />;

    case 'instagram':
      return <Instagram className={className} aria-hidden="true" />;

    case 'twitter':
      // Modern X logo
      return (
        <svg
          className={`fill-current ${className}`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );

    case 'calendly':
      return <Calendar className={className} aria-hidden="true" />;

    case 'telegram':
      return (
        <svg
          className={`fill-current ${className}`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm4.64 6.8-1.75 8.24c-.13.58-.48.72-.97.45l-2.68-1.98-1.29 1.25c-.14.14-.26.26-.54.26l.19-2.73 4.97-4.49c.22-.19-.05-.3-.34-.11L7.1 13.62l-2.65-.83c-.58-.18-.59-.58.12-.86l10.35-3.99c.48-.18.9.11.72.86Z" />
        </svg>
      );

    case 'skype':
      return (
        <svg
          className={`fill-current ${className}`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12 2C8.6 2 5.6 3.8 4 6.7 3.3 6.2 2.4 6 1.5 6 0.7 6 0 6.7 0 7.5c0 .9.2 1.8.7 2.5C.2 11.4 0 13.2 0 15c0 6.6 5.4 12 12 12 3.4 0 6.4-1.8 8-4.7.7.5 1.6.7 2.5.7.8 0 1.5-.7 1.5-1.5 0-.9-.2-1.8-.7-2.5.5-1.4.7-3.2.7-5 0-6.6-5.4-12-12-12zm2.3 14.8c-1.8.7-3.9.6-5.4-.3-.5-.3-.7-.9-.4-1.4.3-.5.9-.7 1.4-.4 1 .6 2.4.7 3.6.2 1.1-.4 1.7-1.3 1.4-2.2-.3-.8-1.2-1.2-2.5-1.5-2.2-.5-3.7-1.4-3.3-3.3.4-1.9 2.4-2.8 4.7-2.5 1.5.2 2.9.9 3.8 1.9.4.4.4 1.1 0 1.5s-1.1.4-1.5 0c-.6-.7-1.6-1.2-2.7-1.4-1.4-.2-2.3.4-2.5 1.2-.2.8.5 1.3 1.9 1.7 2.4.6 4.1 1.5 3.8 3.6-.2 1.7-1.6 2.7-3.7 3.2z" />
        </svg>
      );

    case 'discord':
      return (
        <svg
          className={`fill-current ${className}`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      );

    case 'slack':
      return <Slack className={className} aria-hidden="true" />;

    case 'github':
      return <Github className={className} aria-hidden="true" />;

    case 'threads':
      return (
        <svg
          className={`fill-current ${className}`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10Z" />
        </svg>
      );

    case 'wechat':
      return (
        <svg
          className={`fill-current ${className}`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M8.5 2C4.36 2 1 4.91 1 8.5c0 1.99.99 3.78 2.56 4.97L3 17l3.86-1.28c.53.18 1.07.28 1.64.28.43 0 .86-.06 1.28-.15A6.9 6.9 0 0 1 9.5 13c0-3.59 3.36-6.5 7.5-6.5.6 0 1.18.06 1.74.17C17.38 3.79 13.26 2 8.5 2Zm-2 4.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm5 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM17 7.5c-3.59 0-6.5 2.46-6.5 5.5 0 3.04 2.91 5.5 6.5 5.5.47 0 .93-.05 1.38-.15L22 19.5l-.83-2.92C22.42 15.53 23.5 14.1 23.5 13c0-3.04-2.91-5.5-6.5-5.5Zm-2 3.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
        </svg>
      );

    case 'twitch':
      return <Twitch className={className} aria-hidden="true" />;

    case 'reddit':
      return (
        <svg
          className={`fill-current ${className}`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm7.5 10.5c0 .83-.67 1.5-1.5 1.5-.1 0-.2-.01-.3-.04-.52 1.48-2.12 2.54-4.04 2.76.08.3.14.61.14.93 0 2.21-1.79 4-4 4s-4-1.79-4-4c0-.32.06-.63.14-.93-1.92-.22-3.52-1.28-4.04-2.76-.1.03-.2.04-.3.04-.83 0-1.5-.67-1.5-1.5 0-.58.33-1.09.82-1.34-.05-.22-.07-.44-.07-.66 0-2.48 2.91-4.5 6.5-4.5.64 0 1.25.07 1.83.19l1.1-2.58a.5.5 0 0 1 .58-.29l3.12.66c.21-.39.63-.66 1.11-.66.69 0 1.25.56 1.25 1.25s-.56 1.25-1.25 1.25c-.56 0-1.04-.37-1.19-.88l-2.73-.58-.95 2.22c2.04.54 3.44 1.86 3.44 3.39 0 .22-.02.44-.07.66.49.25.82.76.82 1.34ZM8.5 12.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Zm7 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Zm-5.94 2.82a.5.5 0 0 0 .7.7c.72-.72 2.16-.72 2.88 0a.5.5 0 0 0 .7-.7c-1.1-1.1-3.18-1.1-4.28 0Z" />
        </svg>
      );

    case 'medium':
      return <FileText className={className} aria-hidden="true" />;

    case 'website':
      return <Globe className={className} aria-hidden="true" />;

    case 'link':
      return <LinkIcon className={className} aria-hidden="true" />;

    default:
      return <Star className={className} aria-hidden="true" />;
  }
};
