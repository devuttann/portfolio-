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
      title: 'Nanoba',
      desc: 'Board game.',
      longDesc: 'A board game made by team Electronic Paysam during the GGJ-2026. A game with the story set in a future on a spaceship with limited resources, and communities must reach their individual goals to win.',
      image: '',
      tag: 'game design',
      tools: ['Paper-Pen Sketch', 'Obsidian', 'Figma', 'Krita'],
      link: ''
    },
    {
      id: 'gd-02',
      title: 'Mandates of Leakage',
      desc: 'A game about peeing.',
      longDesc: 'Mandates of Leakage is a game that was built as part of Electronic Paysam during the JAMPackd GameJam 2025. Its a game about how a city tries to erase markers of migrant laborers, which then causes the players as laborers to do actions which erase the identity of the city.',
      image: '',
      tag: 'game design',
      tools: ['Unity', 'Miro', 'Notion'],
      link: ''
    },
    {
      id: 'gd-03',
      title: 'The Inks are Changing Hues',
      desc: 'VR experience putting the player in the position of a pen doctor.',
      longDesc: 'Built as part of Electronic Paysam, a VR simulation in which the player is put in the role of a pen doctor in 1960s Thrissur, a period when the political landscape of Kerala was changing.',
      image: '',
      tag: 'game design',
      tools: ['Tiled', 'Unity', 'Miro'],
      link: ''
    },
    {
      id: 'gd-04',
      title: 'The Cook,The Crook and The Camera',
      desc: 'A security guard watches as his coworked cooks food in a mall, whilst burglars break in.',
      longDesc: 'Made using Three.js and plane geometries stacked to resemble a diorama, the player plays as a security guard obsessed with food, and must decide between having his coworker cook food in the mall kitchen, or catch the burglars who broke into the mall.',
      image: '',
      tag: 'game design',
      tools: ['Tiled', 'Unity', 'Miro'],
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
