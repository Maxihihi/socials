const CONFIG = {
  // ---------- Profil ----------
  // source: "discord" = Name/Bild kommen von deinem Discord-Profil (Lanyard)
  //         "custom"  = es wird immer der Wert aus "custom" benutzt
  // "custom" ist auch der Ersatz, falls Lanyard nicht erreichbar ist.
  name:   { source: "discord", custom: "maxihihi" },
  avatar: { source: "discord", custom: "" },   // Bild-URL, leer = großes Buchstaben-Icon
  bio: "Minecraft / Plugins / Bots",
  footer: "@2026 maxihihi",

  // ---------- Discord-Status (Lanyard) ----------
  discordId: "1479924807167508661",   // Zahlen-ID deines Discord-Accounts
  lanyard: {
    enabled: true,
    showActivity: true,            // zeigt "spielt ...", "hört ..." usw.
    refreshSeconds: 15             // wie oft der Status neu geholt wird
  },

  // ---------- Look ----------
  theme: {
    background: "#000000",
    card: "#050505",
    row: "#0d0d0d",
    border: "#262626",
    accent: "#ffffff",
    muted: "#8a8a8a",
    cardMaxWidth: "420px",
    cardRadius: "22px"
  },

  // Google-Fonts-Namen (einfach austauschbar)
  fonts: {
    heading: "Unbounded",
    body: "Space Grotesk",
    mono: "JetBrains Mono"
  },

  // ---------- Effekte (je an/aus) ----------
  effects: {
    particles: true,
    particleCount: 60,
    tilt: true,
    glow: true,
    fadeIn: true
  },

  // ---------- Socials ----------
  // enabled: true/false  ->  Social ein- oder ausblenden
  // icon: Name auf simpleicons.org (z. B. "youtube", "tiktok", "instagram")
  // iconUrl: optional, eigenes Logo (überschreibt "icon")
  // Reihenfolge hier = Reihenfolge auf der Seite
  socials: [
    { enabled: true,  name: "Twitch",     description: "Streams ansehen",   url: "https://twitch.tv/maxihihi2402",              icon: "twitch" },
    { enabled: true,  name: "YouTube",    description: "Videos ansehen",    url: "https://youtube.com/@maxi-hihi",          icon: "youtube" },
    { enabled: true,  name: "Discord",    description: "Server beitreten",  url: "https://discord.gg/xpDmz6KWqx",           icon: "discord" },
    { enabled: true,  name: "Cat-Craft",  description: "Community-Server",  url: "https://dsc.gg/cat-craft",                 icon: "discord" },
    { enabled: true,  name: "WhatsApp",   description: "Channel folgen",    url: "https://whatsapp.com/channel/maxihihi", icon: "whatsapp" },
    { enabled: true,  name: "GitHub",     description: "Projekte ansehen",  url: "https://github.com/maxihihi",              icon: "github" },
    { enabled: true,  name: "SoundCloud", description: "Musik anhören",     url: "https://soundcloud.com/maxihihi",         icon: "soundcloud" },
    { enabled: false, name: "Instagram",  description: "Fotos ansehen",     url: "https://instagram.com/DEIN_NAME",          icon: "instagram" },
    { enabled: false, name: "TikTok",     description: "Clips ansehen",     url: "https://tiktok.com/@DEIN_NAME",            icon: "tiktok" }
  ]
};
