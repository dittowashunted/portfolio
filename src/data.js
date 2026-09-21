export const profile = {
  name: "Ditto",
  status: "A collection of things I've made",
  headlineTop: "Ideas, Made",
  headlineBottom: "Into Reality.",
  subtext:
    "A running archive of what I build: software, design, and edits, made because I wanted to make them.",
  location: "Canada",
  avatar: "/nagumo.jpeg",
  bioShort:
    "Self-taught creator working across video editing, graphic design, and code, based in Canada.",
  bioLong: [
    "I started out making my own YouTube videos in early 2024, then moved into freelance editing, cutting a video for a creator with 1K subscribers that became their most-viewed upload. From there I grew my own channel to 5,000+ subscribers in just a few months.",
    "In 2025 I taught myself to code, building my own tools and projects and contributing as a developer on a Roblox game. That same year I picked up graphic design, and now split my time between all three: editing, design, and coding.",
    "Right now I'm looking to build up more experience, so I'm open to taking on work at a low cost. If you've got something in mind, reach out.",
  ],
};

export const stats = [
  { value: 50, suffix: "+", label: "Projects Completed" },
  { value: 25, suffix: "+", label: "Happy Customers" },
  { value: 1, suffix: "+", label: "Year of Experience" },
  { value: 24, suffix: "/7", label: "Communication & Support" },
];

export const skills = [
  {
    title: "Graphic Design",
    description: "Bold, clean visuals: branding, layouts, and graphics that stand out.",
    tags: ["Photoshop", "Illustrator", "Figma"],
  },
  {
    title: "Video Editing",
    description: "Cutting, pacing, and polishing footage into something worth watching.",
    tags: ["Premiere Pro", "DaVinci Resolve"],
  },
  {
    title: "Branding",
    description: "Logos, color, and identity work that gives a project a consistent look.",
    tags: ["Illustrator", "Figma"],
  },
  {
    title: "Thumbnail Design",
    description: "Click-worthy thumbnails built to grab attention in a crowded feed.",
    tags: ["Photoshop"],
  },
  {
    title: "Coding & Scripting",
    description: "Building tools, bots, and scripts that automate the boring stuff.",
    tags: ["JavaScript", "Python", "React"],
  },
  {
    title: "Game Development",
    description: "Contributed as a developer on a Roblox game, from scripting to features.",
    tags: ["Lua", "Roblox Studio"],
  },
];

export const skillLevels = [
  { title: "Graphic Design", stars: 4 },
  { title: "Video Editing", stars: 5 },
  { title: "Coding & Scripting", stars: 4.5 },
];

export const tools = [
  "Photoshop",
  "Illustrator",
  "Premiere Pro",
  "After Effects",
  "Lightroom",
  "VS Code",
  "Roblox Studio",
];

export const languages = [
  { name: "English", level: "Fluent" },
  { name: "French", level: "Basic" },
];

export const experience = [
  {
    title: "Graphic Design",
    place: "Self-taught",
    dates: "2025",
  },
  {
    title: "Roblox Game Developer",
    place: "Contributor",
    dates: "2025",
  },
  {
    title: "Coding & Scripting",
    place: "Self-taught, personal projects",
    dates: "2025",
  },
  {
    title: "YouTube Channel",
    place: "Grew to 5,000+ subscribers",
    dates: "2024",
  },
  {
    title: "Freelance Video Editor",
    place: "Edited for a 1K-subscriber creator",
    dates: "2024",
  },
];

export const links = {
  discord: "dittowashunted",
  email: "dittodoestuff@gmail.com",
  github: "https://github.com/dittowashunted",
};

export const contacts = [
  { label: "Discord", value: "dittowashunted" },
  { label: "Email", value: links.email, href: `mailto:${links.email}` },
];

export const projects = [
  {
    title: "DittoGames",
    description: "A site of classic games and polls: play multiplayer favorites like Tic Tac Toe and Connect Four with a friend, or go solo with Snake, 2048, and Minesweeper.",
    tags: ["React", "JavaScript", "Multiplayer"],
    link: "https://ditto-games.netlify.app",
  },
  {
    title: "Project Two",
    description: "A short description of this project goes here: what it does and why you built it.",
    tags: ["Python"],
    link: "https://github.com/dittowashunted",
  },
  {
    title: "Project Three",
    description: "A short description of this project goes here: what it does and why you built it.",
    tags: ["Discord Bot"],
    link: "https://github.com/dittowashunted",
  },
];
