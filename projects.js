// =============================================
//  projects.js  —  Your portfolio data
//  Edit this file to add / update your work!
// =============================================

const PROJECTS = {

  animation: [
    {
      id: 'anim-01',
      title: 'Courtroom',
      desc: 'Title animation for a short film named "Courtroom"',
      longDesc: 'A 50-second ending title animation for a short film about a design jury that happens within the setting of an actual courtroom. THe animation tries to capture the main characters and their quirky characters. Fully made in Krita. Credits for edit to my groupmate Nikhil Chaphekar.',
      image: '',   // e.g. 'assets/images/forest-spirit.jpg'
      tag: 'animation',
      tools: ['Krita', 'After Effects', 'Premier Pro'],
      link: ''     // e.g. 'https://youtu.be/...'
    },
    {
      id: 'anim-02',
      title: 'Self-Logo Animation',
      desc: 'Simple squash-stretch logo animation for myself.',
      longDesc: 'Small 10-second animation showing squash and stretch. An animation made for a logo for myself, featuring my humoungous connected eyebrows.',
      image: '',
      tag: 'animation',
      tools: ['Krita', 'Premiere Pro'],
      link: ''
    },
    {
      id: 'anim-03',
      title: 'Simple Ball Bounce Animation',
      desc: 'A simple bouncing ball animation to demonstrate timing and spacing.',
      longDesc: 'A simple 3-version animations of a bouncing ball, made to demonstrate the principles of timing and spacing. The ball squashes when it hits the ground and stretches as it bounces up, with exaggerated timing to make it feel more dynamic.',
      image: '',
      tag: 'animation',
      tools: ['Krita', 'p5.js'],
      link: 'https://editor.p5js.org/devmn204/full/shqQy1v7g'
    },
  ],

  gamedesign: [
    {
      id: 'gd-01',
      title: 'Echoes of the Vault',
      desc: 'Roguelite dungeon crawler — full GDD & prototype.',
      longDesc: 'A turn-based roguelite with an asymmetric memory mechanic: the dungeon remembers your previous runs. Wrote full GDD, designed enemy AI behaviour trees, balanced progression curves. Prototyped in Godot 4.',
      image: '',
      tag: 'game design',
      tools: ['Godot 4', 'Figma', 'Google Docs'],
      link: ''
    },
    {
      id: 'gd-02',
      title: 'Paperweight — Puzzle Mechanic',
      desc: 'Paper-folding physics puzzle concept.',
      longDesc: 'Explored the design space of folding paper as a core mechanic. Designed 12 escalating puzzle levels, documented edge cases, and tested with 5 playtesters. Presented as a 20-page design doc.',
      image: '',
      tag: 'game design',
      tools: ['Unity', 'Miro', 'Notion'],
      link: ''
    },
    {
      id: 'gd-03',
      title: 'Saltmarsh — Level Design',
      desc: 'Environment & encounter layout for a 2D platformer.',
      longDesc: 'Designed the Saltmarsh biome for a student game project — grey-box layout, encounter pacing, environmental storytelling beats, and prop placement. Used a design pillar of "curiosity over challenge".',
      image: '',
      tag: 'game design',
      tools: ['Tiled', 'Unity', 'Miro'],
      link: ''
    },
  ],

  gameart: [
    {
      id: 'ga-01',
      title: 'Pixel Tileset — Overgrown Ruins',
      desc: '16×16 modular tileset with 4 biome variants.',
      longDesc: 'Full modular tileset: ground, wall, decoration, and transition tiles. Designed at 16×16px with a limited 12-colour palette. Includes animated water tiles and crumbling walls.',
      image: '',
      tag: 'game art',
      tools: ['Aseprite', 'Photoshop'],
      link: ''
    },
    {
      id: 'ga-02',
      title: 'UI Kit — Fantasy HUD',
      desc: 'Parchment-style HUD elements for an RPG.',
      longDesc: 'Complete UI system: health & stamina bars, inventory grid, dialogue box, and map frame. All assets vectored in Illustrator then textured in Photoshop to feel hand-made.',
      image: '',
      tag: 'game art',
      tools: ['Illustrator', 'Photoshop'],
      link: ''
    },
    {
      id: 'ga-03',
      title: 'Character Sprite — "Cinder"',
      desc: 'Full sprite sheet with 8-directional walk + attacks.',
      longDesc: 'Pixel art character sprite at 32×32px. Includes idle, walk (8 directions), 2 attack animations, hurt, and death. Drew each frame in Aseprite with a warm fire-wizard colour palette.',
      image: '',
      tag: 'game art',
      tools: ['Aseprite'],
      link: ''
    },
  ],

  illustration: [
    {
      id: 'il-01',
      title: 'Editorial — "On Being Lost"',
      desc: 'Double-page spread for a student magazine.',
      longDesc: 'Editorial illustration exploring the feeling of purposeful wandering. Ink linework with digital watercolour washes. Published in the MICA student journal, Issue 12.',
      image: '',
      tag: 'illustration',
      tools: ['Procreate', 'Photoshop'],
      link: ''
    },
    {
      id: 'il-02',
      title: 'World Map — "The Tethered Isles"',
      desc: 'Fantasy cartography for a tabletop campaign.',
      longDesc: 'Full world map for a homebrew TTRPG setting. Hand-inked coastlines, mountains, and cities, then coloured digitally in Photoshop. Designed to feel like a real aged document.',
      image: '',
      tag: 'illustration',
      tools: ['Procreate', 'Photoshop', 'Krita'],
      link: ''
    },
    {
      id: 'il-03',
      title: 'Character Studies — "The Peddlers"',
      desc: '6-character series, ink + watercolour.',
      longDesc: 'A series of 6 travelling merchant characters, each from a different fictional culture. Focused on silhouette variety and costume storytelling. Mixed media: ink on paper, scanned and coloured digitally.',
      image: '',
      tag: 'illustration',
      tools: ['Ink on paper', 'Procreate'],
      link: ''
    },
  ],

};

// Skills for About page
const SKILLS = [
  { name: 'Procreate',     level: 90 },
  { name: 'p5.js',         level: 95 },
  { name: 'Aseprite',      level: 85 },
  { name: 'Godot 4',       level: 70 },
  { name: 'Unity',         level: 60 },
  { name: 'Krita',         level: 75 },
  { name: 'Illustrator',   level: 65 },
  { name: 'Photoshop',     level: 72 },
  { name: 'Pen/Paper',     level: 95 },
];
