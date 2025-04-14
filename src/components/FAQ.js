import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4">
      <Helmet>
        <title>Frequently Asked Questions | Herd Game</title>
        <meta name="description" content="Find answers to common questions about Herd Game - how to play, game rules, technical support, and more information about our online multiplayer game." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h1>
          <Link to="/" className="text-purple-600 hover:text-purple-800 font-medium">
            Return Home
          </Link>
        </div>
        
        <div className="prose max-w-none text-gray-700">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Game Basics</h2>
            
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-lg p-5">
                <h3 className="text-xl font-medium text-purple-800 mb-2">What is Herd Game?</h3>
                <p>
                  Herd Game is an online multiplayer party game inspired by popular board games where players try to match their answers with the group. 
                  The goal is to think like the "herd" – giving answers that match what most other players are thinking. 
                  It's perfect for virtual game nights, team building activities, family gatherings, and any social event.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-5">
                <h3 className="text-xl font-medium text-purple-800 mb-2">How many players can join a game?</h3>
                <p>
                  Herd Game works best with 4 or more players, but there's no upper limit! You can play with small groups of friends or large parties. 
                  The more players you have, the more interesting the results can be as you try to predict what the majority will answer.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-5">
                <h3 className="text-xl font-medium text-purple-800 mb-2">Do I need to create an account to play?</h3>
                <p>
                  No, Herd Game doesn't require account creation. You simply enter a username when you create or join a game. 
                  This makes it easy to get started quickly without any registration process.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-5">
                <h3 className="text-xl font-medium text-purple-800 mb-2">Is Herd Game free to play?</h3>
                <p>
                  Yes, Herd Game is completely free to play! We may introduce optional premium features in the future, 
                  but the core game experience will always remain free for everyone to enjoy.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gameplay Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-lg p-5">
                <h3 className="text-xl font-medium text-purple-800 mb-2">How do I win Herd Game?</h3>
                <p>
                  To win Herd Game, you need to be the first player to reach 8 points without holding the special marker (the Pink Cow). 
                  You earn points by giving answers that match with the majority of other players. If your answer is unique or in the minority, 
                  you won't earn points for that round.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-5">
                <h3 className="text-xl font-medium text-purple-800 mb-2">What is the Pink Cow marker?</h3>
                <p>
                  The Pink Cow is a special marker given to the player with the most unique answer in a round. 
                  If you're holding the Pink Cow, you cannot win the game even if you reach 8 points. 
                  To get rid of the Pink Cow, you need to give an answer that matches with the majority in a subsequent round.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-5">
                <h3 className="text-xl font-medium text-purple-800 mb-2">What types of questions will I be asked?</h3>
                <p>
                  Herd Game features a wide variety of fun, thought-provoking questions designed to reveal how people think. 
                  Examples include "What's the best pizza topping?", "Name a famous painting", or "What's the worst movie ever made?". 
                  The questions are designed to be accessible to players of all ages and backgrounds.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-5">
                <h3 className="text-xl font-medium text-purple-800 mb-2">Is there a time limit for answering questions?</h3>
                <p>
                  Yes, players have 30 seconds to submit their answers for each question. This keeps the game moving at a good pace 
                  and prevents players from overthinking their responses. If you don't answer within the time limit, you won't earn points for that round.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Technical Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-lg p-5">
                <h3 className="text-xl font-medium text-purple-800 mb-2">What devices can I play Herd Game on?</h3>
                <p>
                  Herd Game works on any device with a modern web browser, including desktops, laptops, tablets, and smartphones. 
                  The game is responsive and adapts to different screen sizes, so you can play comfortably on any device.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-5">
                <h3 className="text-xl font-medium text-purple-800 mb-2">What happens if I lose connection during a game?</h3>
                <p>
                  If you lose connection during a game, Herd Game will attempt to reconnect you automatically. 
                  If that fails, you can rejoin using the same room code and username. The game saves your progress, 
                  so you won't lose your points or game status when reconnecting.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-5">
                <h3 className="text-xl font-medium text-purple-800 mb-2">Is my data secure when playing Herd Game?</h3>
                <p>
                  Yes, we take data security seriously. Herd Game only stores the minimal information needed to run the game 
                  (such as your temporary username and game progress). We don't collect personal information, and game data is 
                  deleted after periods of inactivity. For more details, please see our Privacy Policy.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-5">
                <h3 className="text-xl font-medium text-purple-800 mb-2">How do I report a bug or suggest a feature?</h3>
                <p>
                  We're always looking to improve Herd Game! If you encounter a bug or have a feature suggestion, 
                  please contact us through our About/Contact page. We appreciate your feedback and use it to make the game better for everyone.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">More Questions?</h2>
            <p className="mb-4">
              If you have a question that isn't answered here, please feel free to reach out to us. 
              You can contact us at <a href="mailto:ajejey@gmail.com" className="text-purple-600 hover:text-purple-800">ajejey@gmail.com</a> 
              or visit our <Link to="/about-contact" className="text-purple-600 hover:text-purple-800">About/Contact page</Link>.
            </p>
            <p>
              We're constantly updating this FAQ with new information based on player questions, so check back regularly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
