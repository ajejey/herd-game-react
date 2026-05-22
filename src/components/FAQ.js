import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import MeadowLayout, { GrassStrip, fredokaStyle } from './MeadowLayout';
import AdSlot from './AdSlot';

const QA = ({ q, accent, children }) => (
  <div
    className="rounded-2xl p-5 border-2 border-l-8"
    style={{ background: accent.bg, borderColor: accent.border, borderLeftColor: accent.left }}
  >
    <h3 style={fredokaStyle} className="text-xl font-bold text-[#2D1810] mb-2">{q}</h3>
    <div className="text-[#4A2D1B]">{children}</div>
  </div>
);

const ACCENTS = [
  { bg: '#F4FBF6', border: '#3D8B5A33', left: '#3D8B5A' },
  { bg: '#F2F9FF', border: '#5BA8D833', left: '#5BA8D8' },
  { bg: '#FFFBE8', border: '#FFD56B66', left: '#FFD56B' },
  { bg: '#FFF1F4', border: '#E84A8B33', left: '#E84A8B' }
];

const FAQ = () => {
  return (
    <MeadowLayout>
      <Helmet>
        <title>Frequently Asked Questions | Herd Game</title>
        <meta name="description" content="Find answers to common questions about Herd Game - how to play, game rules, technical support, and more information about our online multiplayer game." />
      </Helmet>

      <div className="relative bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 border-[#FFE8C8] p-6 md:p-8">
        <div className="mb-8 flex flex-wrap gap-3 justify-between items-center">
          <h1 style={fredokaStyle} className="text-3xl md:text-4xl font-bold text-[#2D1810]">
            Frequently Asked Questions
          </h1>
          <Link to="/" className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold">&larr; Return Home</Link>
        </div>

        {/* Game Basics */}
        <div className="mb-10">
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#3D8B5A] mb-5">Game Basics</h2>
          <div className="space-y-5">
            <QA q="What is Herd Game?" accent={ACCENTS[0]}>
              <p>
                Herd Game is an online multiplayer party game inspired by popular board games where players try to match their answers with the group.
                The goal is to think like the "herd" – giving answers that match what most other players are thinking.
                It's perfect for virtual game nights, team building activities, family gatherings, and any social event.
              </p>
            </QA>
            <QA q="How many players can join a game?" accent={ACCENTS[1]}>
              <p>
                Herd Game works best with 4 or more players, but there's no upper limit! You can play with small groups of friends or large parties.
                The more players you have, the more interesting the results can be as you try to predict what the majority will answer.
              </p>
            </QA>
            <QA q="Do I need to create an account to play?" accent={ACCENTS[2]}>
              <p>
                No, Herd Game doesn't require account creation. You simply enter a username when you create or join a game.
                This makes it easy to get started quickly without any registration process.
              </p>
            </QA>
            <QA q="Is Herd Game free to play?" accent={ACCENTS[3]}>
              <p>
                Yes, Herd Game is completely free to play! We may introduce optional premium features in the future,
                but the core game experience will always remain free for everyone to enjoy.
              </p>
            </QA>
          </div>
        </div>

        {/* Gameplay */}
        <div className="mb-10">
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#E84A8B] mb-5">Gameplay Questions</h2>
          <div className="space-y-5">
            <QA q="How do I win Herd Game?" accent={ACCENTS[3]}>
              <p>
                To win Herd Game, you need to be the first player to reach 8 points without holding the special marker (the Pink Cow).
                You earn points by giving answers that match with the majority of other players. If your answer is unique or in the minority,
                you won't earn points for that round.
              </p>
            </QA>
            <QA q="What is the Pink Cow marker?" accent={ACCENTS[2]}>
              <p>
                The Pink Cow is a special marker given to the player with the most unique answer in a round.
                If you're holding the Pink Cow, you cannot win the game even if you reach 8 points.
                To get rid of the Pink Cow, you need to give an answer that matches with the majority in a subsequent round.
              </p>
            </QA>
            <QA q="What types of questions will I be asked?" accent={ACCENTS[1]}>
              <p>
                Herd Game features a wide variety of fun, thought-provoking questions designed to reveal how people think.
                Examples include "What's the best pizza topping?", "Name a famous painting", or "What's the worst movie ever made?".
                The questions are designed to be accessible to players of all ages and backgrounds.
              </p>
            </QA>
            <QA q="Is there a time limit for answering questions?" accent={ACCENTS[0]}>
              <p>
                Yes, players have 30 seconds to submit their answers for each question. This keeps the game moving at a good pace
                and prevents players from overthinking their responses. If you don't answer within the time limit, you won't earn points for that round.
              </p>
            </QA>
          </div>
        </div>

        {/* Technical */}
        <div className="mb-10">
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#5BA8D8] mb-5">Technical Questions</h2>
          <div className="space-y-5">
            <QA q="What devices can I play Herd Game on?" accent={ACCENTS[1]}>
              <p>
                Herd Game works on any device with a modern web browser, including desktops, laptops, tablets, and smartphones.
                The game is responsive and adapts to different screen sizes, so you can play comfortably on any device.
              </p>
            </QA>
            <QA q="What happens if I lose connection during a game?" accent={ACCENTS[0]}>
              <p>
                If you lose connection during a game, Herd Game will attempt to reconnect you automatically.
                If that fails, you can rejoin using the same room code and username. The game saves your progress,
                so you won't lose your points or game status when reconnecting.
              </p>
            </QA>
            <QA q="Is my data secure when playing Herd Game?" accent={ACCENTS[2]}>
              <p>
                Yes, we take data security seriously. Herd Game only stores the minimal information needed to run the game
                (such as your temporary username and game progress). We don't collect personal information, and game data is
                deleted after periods of inactivity. For more details, please see our Privacy Policy.
              </p>
            </QA>
            <QA q="How do I report a bug or suggest a feature?" accent={ACCENTS[3]}>
              <p>
                We're always looking to improve Herd Game! If you encounter a bug or have a feature suggestion,
                please contact us through our About/Contact page. We appreciate your feedback and use it to make the game better for everyone.
              </p>
            </QA>
          </div>
        </div>

        <div>
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#FFB300] mb-3">More Questions?</h2>
          <p className="mb-3 text-[#4A2D1B]">
            If you have a question that isn't answered here, please feel free to reach out to us.
            You can contact us at <a href="mailto:ajejey@gmail.com" className="text-[#E84A8B] hover:text-[#C73B73] font-semibold">ajejey@gmail.com</a> or
            visit our <Link to="/about-contact" className="text-[#E84A8B] hover:text-[#C73B73] font-semibold">About/Contact page</Link>.
          </p>
          <p className="text-[#4A2D1B]">
            We're constantly updating this FAQ with new information based on player questions, so check back regularly!
          </p>
        </div>

        {/* Ad — bottom of FAQ */}
        <div className="mt-6 max-h-[300px] overflow-hidden">
          <AdSlot slot="5698170537" />
        </div>

        <GrassStrip className="absolute bottom-0 left-0 right-0 w-full h-5 -mb-[2px]" />
      </div>
    </MeadowLayout>
  );
};

export default FAQ;
