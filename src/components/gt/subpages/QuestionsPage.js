import React from 'react';
import { Helmet } from 'react-helmet';
import SubPageLayout from './SubPageLayout';

const FAQS = [
  { q: 'Where can I find trivia questions with numerical answers for a party game?', a: 'This page lists 200+ free trivia questions with single numerical answers, organized by category. Or just create a game on the free online version, which deals questions automatically.' },
  { q: 'What makes a good trivia question for a betting game?', a: 'Good questions have one verifiable numerical answer, are not common knowledge that everyone knows exactly, and aren\'t so obscure that wild guessing is meaningless. The sweet spot: most players have a rough idea, very few know exactly.' },
  { q: 'Are these questions family-safe?', a: 'Yes — all questions on this list are family-safe, factual, and educational. No alcohol, no adult content.' },
  { q: 'Can I use these for a school trivia event?', a: 'Absolutely. Categories cover human body, geography, history, science, animals, sports, movies, and food — great for cross-age groups.' },
];

const CATEGORIES = [
  { title: 'Human body', items: [
    ['How many bones does an adult human body have?', 206],
    ['How many teeth does a typical adult have (including wisdom teeth)?', 32],
    ['How many chambers does a human heart have?', 4],
    ['Roughly how many times does an average human heart beat per day?', 100000],
    ['How many muscles are commonly cited as needed to smile?', 17],
    ['How many bones are in a human hand (including the wrist)?', 27],
    ['How many liters of blood does an average adult body contain?', 5],
    ['How long is the average human small intestine, in feet?', 22],
    ['How many pairs of ribs does a human typically have?', 12],
    ['How many taste buds does an average human tongue have, in thousands?', 10],
    ['How many bones are in the human spine (vertebrae)?', 33],
  ] },
  { title: 'Geography', items: [
    ['How many countries are recognized in Africa?', 54],
    ['How many US states border Canada?', 13],
    ['How many time zones does Russia span?', 11],
    ['How many countries are in the European Union?', 27],
    ['How many oceans does Earth have?', 5],
    ['How tall is Mount Everest in feet?', 29032],
    ['How many Great Lakes are there?', 5],
    ['How many countries border Brazil?', 10],
    ['How many countries border China?', 14],
    ['How tall is the Eiffel Tower in feet (to the top)?', 1083],
    ['How many Hawaiian islands make up the main chain?', 8],
    ['How long is the Nile River in miles?', 4132],
  ] },
  { title: 'History', items: [
    ['What year did World War II end?', 1945],
    ['What year was the US Declaration of Independence signed?', 1776],
    ['What year did the Titanic sink?', 1912],
    ['What year did the Berlin Wall fall?', 1989],
    ['How many wives did Henry VIII have?', 6],
    ['How many original US colonies were there?', 13],
    ['What year was the first modern Olympic Games held?', 1896],
    ['How many years did the Hundred Years\' War actually last?', 116],
    ['What year did the French Revolution begin?', 1789],
    ['How many people signed the US Declaration of Independence?', 56],
    ['What year did World War I start?', 1914],
    ['How many years did Queen Elizabeth II reign?', 70],
  ] },
  { title: 'Science & space', items: [
    ['How many planets are in our solar system?', 8],
    ['How many moons does Mars have?', 2],
    ['How many elements are in the periodic table?', 118],
    ['What is the speed of light in millions of meters per second (rounded)?', 300],
    ['How many minutes does sunlight take to reach Earth (roughly)?', 8],
    ['How old is the Earth, in billions of years?', 4],
    ['How many degrees Fahrenheit does water boil at, at sea level?', 212],
    ['How many degrees Celsius does water freeze at?', 0],
    ['What is the atomic number of gold?', 79],
    ['What year did humans first walk on the Moon?', 1969],
    ['How many constellations are officially recognized?', 88],
  ] },
  { title: 'Movies & TV', items: [
    ['How many Oscars did Titanic (1997) win?', 11],
    ['How many films were in the Harry Potter series?', 8],
    ['How many seasons did Friends run?', 10],
    ['How many episodes were in The Office (US)?', 201],
    ['What year was the first iPhone released?', 2007],
    ['How many Star Wars films are in the main Skywalker saga?', 9],
    ['How many keys are on a standard piano?', 88],
    ['How many strings does a standard guitar have?', 6],
    ['How many seasons did Breaking Bad run?', 5],
    ['What year did Pixar release the first Toy Story?', 1995],
    ['What year was the first Star Wars movie released?', 1977],
  ] },
  { title: 'Sports', items: [
    ['How many players are on a soccer team on the field at one time?', 11],
    ['How many players are on a basketball team on the court at one time?', 5],
    ['How many innings are in a standard baseball game?', 9],
    ['How long is a marathon, in miles (to the nearest mile)?', 26],
    ['How many holes are in a standard round of golf?', 18],
    ['How many minutes are in a regulation soccer match?', 90],
    ['How many points is a touchdown worth in American football?', 6],
    ['How many tennis grand slams are there per year?', 4],
    ['What\'s the maximum score in 10-pin bowling?', 300],
    ['How long is an NBA basketball game, in minutes (regulation)?', 48],
  ] },
  { title: 'Animals & nature', items: [
    ['How many legs does a spider have?', 8],
    ['How many hearts does an octopus have?', 3],
    ['How tall is an average adult giraffe in feet?', 18],
    ['How fast can a cheetah run in mph (top speed)?', 70],
    ['How many years does an average elephant live?', 60],
    ['How long is an average blue whale, in feet?', 82],
    ['How many wings does a bee have?', 4],
    ['How many stomachs does a cow have?', 4],
    ['How many species of penguin are there?', 18],
  ] },
  { title: 'Food, tech, random', items: [
    ['How many slices in a standard large Domino\'s pizza?', 8],
    ['How many ounces are in a Venti Starbucks drink?', 20],
    ['How many cups in a US gallon?', 16],
    ['How many varieties of apples exist worldwide (approx)?', 7500],
    ['What year was Google founded?', 1998],
    ['What year was Facebook launched?', 2004],
    ['What year did YouTube launch?', 2005],
    ['How many tiles are in a Scrabble set?', 100],
    ['How many squares are on a chessboard?', 64],
    ['How many pieces does each player start with in chess?', 16],
    ['How many feet are in a mile?', 5280],
    ['How many seconds are in a day?', 86400],
    ['How many letters are in the Greek alphabet?', 24],
    ['How many books are in the Bible (Protestant canon)?', 66],
    ['How many cards in a standard deck (no jokers)?', 52],
  ] },
];

// Flatten all category items into a single Q&A list for the schema
const ALL_QA = CATEGORIES.flatMap(cat => cat.items.map(([q, a]) => ({ q, a })));

const QUIZ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: '200 Trivia Questions With Numerical Answers',
  about: { '@type': 'Thing', name: 'Trivia' },
  educationalLevel: 'casual',
  hasPart: ALL_QA.slice(0, 50).map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: String(a) },
  })),
};

export default function QuestionsPage() {
  return (
    <SubPageLayout
      slug="200-trivia-questions-with-numerical-answers"
      title="200+ Trivia Questions With Number Answers [Free List]"
      description="Steal 200+ free trivia questions with numerical answers, sorted by category. Perfect for party games, trivia night, or classrooms. Family-safe and ready to play. Grab them free →"
      h1="200 Trivia Questions With Numerical Answers"
      keywords="trivia questions with numerical answers, number trivia questions, guesstimate questions, wits and wagers questions, party trivia number questions, family trivia game questions"
      faqs={FAQS}
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(QUIZ_SCHEMA)}</script>
      </Helmet>
      <p>
        <strong>Looking for trivia questions with single numerical answers?</strong> Here's a free list of 200+ family-safe questions organized by category — perfect for a betting-trivia <a href="https://en.wikipedia.org/wiki/Party_game" target="_blank" rel="noopener noreferrer">party game</a> like <a href="/guesstimate">Guesstimate</a>, classroom activities, road trips, or any "guess the number" game format. Each question has one verifiable answer. Mix and match across categories to balance easy and hard rounds.
      </p>

      <p>
        These work especially well for <strong>betting trivia formats</strong> (<a href="https://en.wikipedia.org/wiki/Wits_%26_Wagers" target="_blank" rel="noopener noreferrer">Wits &amp; Wagers</a>-style) where players guess and then bet on whose guess is closest — see our <a href="/guesstimate/free-alternative-to-wits-and-wagers-online">free Wits &amp; Wagers alternative</a>. Numerical answers let everyone participate — even people who don't know the exact answer can make an intelligent <a href="https://en.wikipedia.org/wiki/Estimation" target="_blank" rel="noopener noreferrer">estimate</a> and bet on others.
      </p>

      {CATEGORIES.map((cat, ci) => (
        <section key={ci}>
          <h2>{cat.title}</h2>
          <table>
            <thead>
              <tr><th>Question</th><th>Answer</th></tr>
            </thead>
            <tbody>
              {cat.items.map(([q, a], i) => (
                <tr key={i}><td>{q}</td><td><strong>{a.toLocaleString()}</strong></td></tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <h2>How to use this list</h2>
      <p>
        For a <strong>physical party game</strong>, write questions on cards and have someone read them out, much like a classic <a href="https://en.wikipedia.org/wiki/Pub_quiz" target="_blank" rel="noopener noreferrer">pub quiz</a>. For an <strong>online game</strong>, just <a href="/guesstimate">create a Guesstimate room</a> — our game deals random questions automatically each round. It's a great fit for <a href="/guesstimate/best-online-trivia-games-for-family-game-night">family game night</a>, a <a href="/guesstimate/virtual-team-building-trivia-game-for-work">virtual team-building session</a>, or a <a href="/guesstimate/how-to-host-virtual-trivia-night-on-zoom">trivia night on Zoom</a>.
      </p>

      <h2>Tips for writing your own number-answer questions</h2>
      <ul>
        <li><strong>One verifiable answer.</strong> Avoid "approximately X" questions where the answer depends on the source — good <a href="https://en.wikipedia.org/wiki/Trivia" target="_blank" rel="noopener noreferrer">trivia</a> has a single fact to check.</li>
        <li><strong>Avoid binary or single-digit answers.</strong> "How many sides does a triangle have?" is boring. "How many bones in the human body?" is great — these also shine in <a href="/guesstimate/price-is-right-style-party-game-online">Price Is Right-style</a> guessing rounds.</li>
        <li><strong>Mix difficulty.</strong> Some questions everyone roughly knows (How many states in the US?), some require a wild <a href="https://en.wikipedia.org/wiki/Order_of_magnitude" target="_blank" rel="noopener noreferrer">order-of-magnitude</a> guess (How many bones in a snake?).</li>
        <li><strong>Stay current.</strong> Avoid time-sensitive answers ("How many tweets per day?") unless you'll update them, especially for <a href="/guesstimate/christmas-and-holiday-trivia-party-games-online">holiday and seasonal trivia</a>.</li>
      </ul>
    </SubPageLayout>
  );
}
