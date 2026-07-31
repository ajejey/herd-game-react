/*
  What Farm Animal Are You — personality quiz.

  Category: personality / share-bait. Different content economics from Higher or
  Lower: there is no bank to exhaust, because the value is the RESULT you share,
  not the number of rounds. It never needs refreshing (tier 2).

  Aesthetic: the Herd meadow — cream paper, cocoa ink, meadow green, with each
  result carrying its own colour. No dark mode.

  Scoring: every option adds points to one or two animals. The highest total
  wins; ties break by the order below, which is deliberate — the Cow is the
  house animal and the safest default.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  green: '#3D8B5A',
  pink: '#E84A8B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

/* Order matters: earlier entries win ties. */
export const ANIMALS = {
  cow: {
    id: 'cow', name: 'The Cow', color: '#E84A8B',
    tagline: 'Calm, warm, quietly the heart of the herd.',
    line: 'You are the one everyone drifts toward. Unhurried, steady, generous with your time. You do not need to be the loudest in the room because people come to you anyway.',
    traits: ['warm', 'steady', 'grounded'],
    goodAt: 'Holding a group together when everyone else is losing the plot.',
  },
  sheepdog: {
    id: 'sheepdog', name: 'The Sheepdog', color: '#3D8B5A',
    tagline: 'Organised, loyal, secretly running everything.',
    line: 'Someone has to make the plan, and it is always you. You notice who has gone quiet, who has not eaten, and who needs walking back toward the group. Exhausting? Yes. Would you stop? Never.',
    traits: ['loyal', 'organised', 'watchful'],
    goodAt: 'Being the one who actually books the thing everyone talked about.',
  },
  goat: {
    id: 'goat', name: 'The Goat', color: '#C9762F',
    tagline: 'Chaotic, curious, climbing something they should not be.',
    line: 'Rules read as suggestions. If there is a fence, you are wondering what is on the other side of it. Life around you is never boring and occasionally on fire.',
    traits: ['bold', 'curious', 'chaotic'],
    goodAt: 'Turning an ordinary evening into a story people retell for years.',
  },
  horse: {
    id: 'horse', name: 'The Horse', color: '#8E5CF7',
    tagline: 'Proud, driven, happiest at full speed.',
    line: 'You have somewhere to be and a standard to meet. You are competitive in a way you would politely deny, and you would rather do something properly than do it comfortably.',
    traits: ['driven', 'proud', 'independent'],
    goodAt: 'Setting the pace and making everyone else quietly raise their game.',
  },
  pig: {
    id: 'pig', name: 'The Pig', color: '#F0A202',
    tagline: 'Clever, comfortable, wildly underestimated.',
    line: 'You are far sharper than you let on, and you have engineered a life with excellent snacks in it. People mistake your ease for laziness. It is not. It is efficiency.',
    traits: ['clever', 'easygoing', 'shrewd'],
    goodAt: 'Finding the shortcut nobody noticed and getting there first anyway.',
  },
  chicken: {
    id: 'chicken', name: 'The Chicken', color: '#D0463B',
    tagline: 'Loud, social, has an opinion and will share it.',
    line: 'You feel things at volume. The group chat is yours. You are first to react, first to gossip, and first to defend your people, sometimes before checking the facts.',
    traits: ['expressive', 'social', 'dramatic'],
    goodAt: 'Making sure nothing important ever happens in silence.',
  },
  duck: {
    id: 'duck', name: 'The Duck', color: '#2D8FBF',
    tagline: 'Unbothered on the surface, paddling hard underneath.',
    line: 'You look composed no matter what is happening. Everyone assumes you are fine, largely because you keep telling them you are. You are adaptable, private, and quietly resilient.',
    traits: ['calm', 'adaptable', 'private'],
    goodAt: 'Staying level when everything around you is not.',
  },
  sheep: {
    id: 'sheep', name: 'The Sheep', color: '#7A6E66',
    tagline: 'Agreeable, easy company, happiest among your people.',
    line: 'You would genuinely rather everyone got along. You are the easiest person to make plans with and you find comfort where others find boredom. Being part of something beats standing apart from it.',
    traits: ['agreeable', 'gentle', 'loyal'],
    goodAt: 'Being the person nobody has ever had an argument with.',
  },
};

export const ANIMAL_ORDER = ['cow', 'sheepdog', 'goat', 'horse', 'pig', 'chicken', 'duck', 'sheep'];

/* Each option: { t: text, s: { animalId: points } } */
export const QUESTIONS = [
  {
    q: 'The group chat is deciding where to eat. You…',
    options: [
      { t: 'Make the booking before anyone changes their mind', s: { sheepdog: 2, horse: 1 } },
      { t: 'Say "I genuinely don\'t mind, anything works"', s: { sheep: 2, cow: 1 } },
      { t: 'Suggest somewhere nobody has heard of, 40 minutes away', s: { goat: 2, duck: 1 } },
      { t: 'Send 14 messages with strong opinions', s: { chicken: 2, horse: 1 } },
    ],
  },
  {
    q: 'It is Saturday and you have nothing planned. Perfect day?',
    options: [
      { t: 'Something ambitious. A hike, a race, a project', s: { horse: 2, goat: 1 } },
      { t: 'Nothing at all. Food, sofa, no obligations', s: { pig: 2, cow: 1 } },
      { t: 'Whoever is around, whatever they are doing', s: { sheep: 2, chicken: 1 } },
      { t: 'Something on your own that recharges you', s: { duck: 2, pig: 1 } },
    ],
  },
  {
    q: 'A plan falls apart at the last minute. Your first reaction?',
    options: [
      { t: 'Immediately start fixing it', s: { sheepdog: 2, horse: 1 } },
      { t: 'Honestly? Relief', s: { pig: 2, duck: 1 } },
      { t: 'Announce your feelings about it, loudly', s: { chicken: 2 } },
      { t: 'Shrug and go with whatever happens next', s: { duck: 2, sheep: 1 } },
    ],
  },
  {
    q: 'At a party where you know three people, you are…',
    options: [
      { t: 'Talking to everyone, including the dog', s: { chicken: 2, goat: 1 } },
      { t: 'Anchored in one good conversation all night', s: { cow: 2, duck: 1 } },
      { t: 'Near the food, and staying there', s: { pig: 2 } },
      { t: 'Quietly checking everyone is having a good time', s: { sheepdog: 2, sheep: 1 } },
    ],
  },
  {
    q: 'Someone says "there is a rule against that." You think…',
    options: [
      { t: 'There is a way around it', s: { goat: 2, pig: 1 } },
      { t: 'Then there is a reason for it', s: { sheep: 2, cow: 1 } },
      { t: 'Who made the rule, and are they right?', s: { horse: 2, chicken: 1 } },
      { t: 'Not my problem either way', s: { duck: 2 } },
    ],
  },
  {
    q: 'How do people describe you when you are not there?',
    options: [
      { t: '"Unbelievably organised"', s: { sheepdog: 2 } },
      { t: '"The calmest person I know"', s: { duck: 2, cow: 1 } },
      { t: '"An absolute menace, in a good way"', s: { goat: 2, chicken: 1 } },
      { t: '"Smarter than they let on"', s: { pig: 2, horse: 1 } },
    ],
  },
  {
    q: 'You get competitive about…',
    options: [
      { t: 'Everything. Including things that are not competitions', s: { horse: 2, chicken: 1 } },
      { t: 'Nothing, genuinely', s: { sheep: 2, cow: 1 } },
      { t: 'Only when someone doubts you', s: { goat: 2, duck: 1 } },
      { t: 'Getting the best deal, seat, or portion', s: { pig: 2 } },
    ],
  },
  {
    q: 'Your friend is having a terrible week. You…',
    options: [
      { t: 'Turn up with food and stay a while', s: { cow: 2, sheepdog: 1 } },
      { t: 'Drag them out to do something ridiculous', s: { goat: 2, chicken: 1 } },
      { t: 'Make them a plan to fix it', s: { sheepdog: 2, horse: 1 } },
      { t: 'Sit with them and say very little', s: { duck: 2, sheep: 1 } },
    ],
  },
];

/** picks: array of chosen option indexes. Returns an animal id. */
export function scoreQuiz(picks) {
  const totals = Object.fromEntries(ANIMAL_ORDER.map((a) => [a, 0]));
  picks.forEach((choice, i) => {
    const opt = QUESTIONS[i]?.options?.[choice];
    if (!opt) return;
    for (const [animal, pts] of Object.entries(opt.s)) {
      if (animal in totals) totals[animal] += pts;
    }
  });
  // Highest score; ANIMAL_ORDER breaks ties deterministically.
  let best = ANIMAL_ORDER[0];
  for (const a of ANIMAL_ORDER) if (totals[a] > totals[best]) best = a;
  return { animal: best, totals };
}
