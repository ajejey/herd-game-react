/*
  Topic-trivia pages — programmatic SEO. Each topic is a keyword-targeted,
  PLAYABLE quiz built from the category-tagged question bank (questions.js).
  Routes are top-level (/music-trivia, /movie-trivia, …) for clean keyword URLs.
*/
export const TOPICS = [
  {
    slug: 'music-trivia', name: 'Music', emoji: '🎵',
    title: 'Music Trivia — Free Music Trivia Questions & Quiz',
    h1: 'Music Trivia',
    keyword: 'music trivia, music trivia questions, music quiz, music trivia game',
    categories: ['Music'],
    blurb: 'From classic hits to one-hit wonders — how good is your music knowledge?',
  },
  {
    slug: 'movie-trivia', name: 'Movie', emoji: '🎬',
    title: 'Movie Trivia — Free Film Trivia Questions & Quiz',
    h1: 'Movie Trivia',
    keyword: 'movie trivia, film trivia, movie trivia questions, movie quiz',
    categories: ['Film'],
    blurb: 'Test your film knowledge — from blockbusters to cult classics.',
  },
  {
    slug: 'geography-trivia', name: 'Geography', emoji: '🌍',
    title: 'Geography Trivia — Free Geography Quiz Questions',
    h1: 'Geography Trivia',
    keyword: 'geography trivia, geography quiz, geography trivia questions',
    categories: ['Geography'],
    blurb: 'Capitals, rivers, countries and landmarks — how well do you know the world?',
  },
  {
    slug: 'science-trivia', name: 'Science', emoji: '🔬',
    title: 'Science Trivia — Free Science Quiz Questions',
    h1: 'Science Trivia',
    keyword: 'science trivia, science quiz, science trivia questions',
    categories: ['Science'],
    blurb: 'Biology, chemistry, physics and space — put your science smarts to the test.',
  },
  {
    slug: 'history-trivia', name: 'History', emoji: '🏛️',
    title: 'History Trivia — Free History Quiz Questions',
    h1: 'History Trivia',
    keyword: 'history trivia, history quiz, history trivia questions',
    categories: ['History'],
    blurb: 'From ancient empires to modern times — how much history do you remember?',
  },
  {
    slug: 'sports-trivia', name: 'Sports', emoji: '⚽',
    title: 'Sports Trivia — Free Sports Quiz Questions',
    h1: 'Sports Trivia',
    keyword: 'sports trivia, sports quiz, sports trivia questions',
    categories: ['Sport'],
    blurb: 'Football, tennis, the Olympics and more — test your sports knowledge.',
  },
  {
    slug: 'tv-trivia', name: 'TV', emoji: '📺',
    title: 'TV Trivia — Free Television Quiz Questions',
    h1: 'TV Trivia',
    keyword: 'tv trivia, television trivia, tv quiz, tv trivia questions',
    categories: ['TV', 'Television'],
    blurb: 'Binge-worthy shows and classic series — how well do you know TV?',
  },
  {
    slug: 'video-game-trivia', name: 'Video Game', emoji: '🎮',
    title: 'Video Game Trivia — Free Gaming Quiz Questions',
    h1: 'Video Game Trivia',
    keyword: 'video game trivia, gaming trivia, video game quiz, game trivia questions',
    categories: ['Games'],
    blurb: 'From retro classics to modern hits — prove you’re a real gamer.',
  },
  {
    slug: 'animal-trivia', name: 'Animal', emoji: '🦁',
    title: 'Animal Trivia — Free Animal Quiz Questions',
    h1: 'Animal Trivia',
    keyword: 'animal trivia, animal quiz, animal trivia questions',
    categories: ['Animals'],
    blurb: 'From the savannah to the deep sea — how much do you know about animals?',
  },
  {
    slug: 'general-knowledge-trivia', name: 'General Knowledge', emoji: '🧠',
    title: 'General Knowledge Trivia — Free Quiz Questions',
    h1: 'General Knowledge Trivia',
    keyword: 'general knowledge trivia, general knowledge quiz, trivia questions and answers',
    categories: ['General'],
    blurb: 'A bit of everything — the classic pub-quiz mix to test your all-round knowledge.',
  },
];

export const getTopic = (slug) => TOPICS.find((t) => t.slug === slug) || null;
