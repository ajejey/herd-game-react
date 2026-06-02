import React from 'react';
import SubPageLayout from './SubPageLayout';

const FAQS = [
  { q: 'What are good Say Anything game questions?', a: 'Good Say Anything questions are open-ended, opinion-based, and have many possible funny answers — like "What\'s the worst gift to give your boss?" or "What\'s the most overrated movie of all time?". Avoid yes/no questions or anything with one obvious answer.' },
  { q: 'Where can I find a Say Anything game questions list?', a: 'This page has 100 free Say Anything game questions you can use right now. Our online version also generates random questions automatically each round — just create a room and play.' },
  { q: 'Can I write my own Say Anything questions?', a: 'In the physical board game yes, in our online version the question deck is built-in for now. We rotate 100+ questions and add more regularly. Want a custom-question mode? Let us know.' },
  { q: 'Are these Say Anything questions family-friendly?', a: 'Yes. All 100 questions on this list are family-safe and work for groups of any age. The fun comes from the answers your friends write, not from edgy prompts.' },
];

// Grouped 100 questions
const CATEGORIES = [
  {
    title: 'Food & drink questions',
    items: [
      'What is the best pizza topping?',
      'What is the most overrated dessert?',
      'What is the worst fast food chain?',
      'What is the strangest food combination that actually tastes good?',
      'What is the most disappointing breakfast cereal?',
      'What is the best snack to eat at midnight?',
      'What food do you secretly hate that everyone else loves?',
      'What is the most underrated pizza topping?',
      'What is the most delicious thing a grandparent makes?',
      'What food would you put in a time capsule for future humans?',
    ],
  },
  {
    title: 'Movies & TV questions',
    items: [
      'What is the worst movie sequel ever made?',
      'What is the most overrated movie of all time?',
      'What is the best movie to watch on a rainy day?',
      'Who is the most annoying TV character?',
      'What is the most rewatchable movie ever?',
      'What movie made you cry the most?',
      'What is the best Pixar movie?',
      'What show overstayed its welcome?',
      'Who is the most underrated actor?',
      'What is the best opening scene of any movie?',
    ],
  },
  {
    title: 'Awkward & embarrassing questions',
    items: [
      'What is the most embarrassing thing to be caught doing?',
      'What is the worst thing to say on a first date?',
      'What is the worst gift you could give your boss?',
      'What is the most embarrassing nickname someone could call you?',
      'What is the worst time to fart loudly?',
      'What is the most awkward thing to walk in on?',
      'What is the worst Christmas present you ever received?',
      'What is the worst thing to find in your bed?',
      'What is the most embarrassing childhood phase?',
      'What is the worst job interview question?',
    ],
  },
  {
    title: 'Hypothetical & weird questions',
    items: [
      'What would you do if you were invisible for a day?',
      'What would aliens think is the weirdest thing about humans?',
      'What animal would make the best president?',
      'What would you do if you won the lottery tomorrow?',
      'If you could rename a planet, what would you call it?',
      'What would dogs say if they could talk for one minute?',
      'What is the most useless superpower?',
      'What would be the worst superpower to have?',
      'If you could uninvent one thing, what would it be?',
      'What would the world be like if cats were in charge?',
    ],
  },
  {
    title: 'Best of / worst of questions',
    items: [
      'What is the best thing about being a kid?',
      'What is the best thing about being an adult?',
      'What is the best invention of the last 50 years?',
      'What is the worst thing about mornings?',
      'What is the best thing about Fridays?',
      'What is the worst trend of the last decade?',
      'What is the best smell in the world?',
      'What is the worst smell in the world?',
      'What is the best thing about working from home?',
      'What is the worst part about flying?',
    ],
  },
  {
    title: 'Friends & relationships questions',
    items: [
      'What is the most annoying habit a friend can have?',
      'What is the best thing about having siblings?',
      'What would be the worst roommate trait?',
      'What is the best way to apologize?',
      'What is the worst date idea?',
      'What is the most romantic thing someone could do?',
      'What is the most annoying thing a partner can do?',
      'What is the best thing about being single?',
      'What is the worst pet peeve at the dinner table?',
      'What would be the worst first impression?',
    ],
  },
  {
    title: 'Work & life questions',
    items: [
      'What is the worst job in the world?',
      'What is the most useless skill someone could have?',
      'What is the most pointless meeting topic?',
      'What is the best excuse to call out sick?',
      'What is the most annoying coworker habit?',
      'What is the worst office snack?',
      'What is the best thing about Mondays?',
      'What is the worst thing about working in an office?',
      'What is the most overrated career?',
      'What is the most underrated job?',
    ],
  },
  {
    title: 'Just-for-fun questions',
    items: [
      'What is the most satisfying sound in the world?',
      'What is the most useful app on your phone?',
      'What is the funniest thing that has ever happened to you?',
      'What is the most ridiculous thing people argue about?',
      'What is something everyone should try at least once?',
      'What is the most pointless argument you have ever had?',
      'What is the worst song to get stuck in your head?',
      'What is the strangest thing you have ever eaten?',
      'What would you do with a completely free day?',
      'What is something that always makes you feel better?',
    ],
  },
  {
    title: 'Pop culture & opinions questions',
    items: [
      'Who is the most overrated celebrity?',
      'What is the most useless invention of the past 10 years?',
      'What old trend should make a comeback?',
      'What is the most annoying internet trend?',
      'What is the worst social media platform?',
      'What is the most overrated tourist destination?',
      'What is the best decade for music?',
      'What is the most ridiculous fashion trend?',
      'What is the most overrated holiday?',
      'What is the most underrated holiday?',
    ],
  },
  {
    title: 'Bonus weird questions',
    items: [
      'What is the worst thing to step on barefoot?',
      'What is the most annoying sound in the world?',
      'What would you put on a billboard for everyone to see?',
      'What is the worst advice ever given?',
      'What is the most ridiculous law that should exist?',
      'What is the most useless thing you own but can\'t throw away?',
      'What is the most bizarre thing that has ever happened to you?',
      'What is the worst smell in a fridge?',
      'What would be the funniest thing to say at a wedding?',
      'What is the most ridiculous fear someone could have?',
    ],
  },
];

export default function QuestionsPage() {
  return (
    <SubPageLayout
      slug="100-funny-say-anything-game-questions"
      title="100 Funny Say Anything Game Questions (Free List)"
      description="Grab 100 free Say Anything game questions for your next party — funny, family-friendly, and ready to play. Or play the free online version instantly. Start now."
      h1="100 Funny Say Anything Game Questions"
      keywords="say anything game questions, say anything questions list, party game questions, funny party game prompts, say anything online questions"
      faqs={FAQS}
    >
      <p>
        <strong>Looking for funny Say Anything game questions?</strong> Here are 100 free question prompts you can use at your next game night — organized by category, family-friendly, and ready to play. These are the same kinds of open-ended, opinion-based questions used in the official North Star Games version of Say Anything. You can read them out loud at a physical party, or skip the list entirely and <a href="/say-anything">play the free online version</a> which deals random questions for you.
      </p>

      <p>
        A good Say Anything question is <strong>open-ended</strong>, <strong>opinion-based</strong>, and has <strong>many possible funny answers</strong>. Avoid yes/no questions, anything with one obvious correct answer, and topics that might get heated. The funniest answers come from prompts where the group has strong, ridiculous, or contradictory opinions.
      </p>

      {CATEGORIES.map((cat, ci) => (
        <section key={ci}>
          <h2>{cat.title}</h2>
          <ol start={ci * 10 + 1}>
            {cat.items.map((q, qi) => (
              <li key={qi}>{q}</li>
            ))}
          </ol>
        </section>
      ))}

      <h2>How to use these Say Anything questions</h2>
      <p>
        If you're playing the <strong>physical board game</strong>, write each question on a card or print this page. If you're playing the <strong>free online version</strong>, you don't need to do anything — our system shuffles questions automatically each round. Just create a room.
      </p>

      <h2>Tips for writing your own Say Anything questions</h2>
      <ul>
        <li><strong>Start with "What is the..."</strong> or "What would..." — these phrasings invite creative answers.</li>
        <li><strong>Pick a familiar category</strong> — food, movies, awkward situations, jobs, pop culture. Everyone has opinions there.</li>
        <li><strong>Avoid one-right-answer questions</strong> like trivia. The fun is in the opinions.</li>
        <li><strong>Keep it under 10 words</strong> if you can. Long prompts are harder to remember and slower to answer.</li>
        <li><strong>Stay group-appropriate.</strong> The board game is rated 13+ but you set the tone for your group.</li>
      </ul>
    </SubPageLayout>
  );
}
