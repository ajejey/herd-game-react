import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { GameProvider } from './context/GameContext';
import Home from './components/Home';
import GameRoom from './components/GameRoom';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import AboutContact from './components/AboutContact';
import Blog from './components/Blog';
import FAQ from './components/FAQ';
import PostOne from './components/blogPosts/PostOne';
import PostTwo from './components/blogPosts/PostTwo';
import PostThree from './components/blogPosts/PostThree';
import PostFour from './components/blogPosts/PostFour';
import PostFive from './components/blogPosts/PostFive';
import PostSix from './components/blogPosts/PostSix';
import PostSeven from './components/blogPosts/PostSeven';
import PostEight from './components/blogPosts/PostEight';
import SayAnythingHome from './components/sa/SayAnythingHome';
import SayAnythingRoom from './components/sa/SayAnythingRoom';
import HowToPlayPage from './components/sa/subpages/HowToPlayPage';
import QuestionsPage from './components/sa/subpages/QuestionsPage';
import TwoPlayerPage from './components/sa/subpages/TwoPlayerPage';
import JackboxAlternativePage from './components/sa/subpages/JackboxAlternativePage';
import ZoomPartyGamesPage from './components/sa/subpages/ZoomPartyGamesPage';
import FamilyFriendlyPage from './components/sa/subpages/FamilyFriendlyPage';
import GuesstimateHome from './components/gt/GuesstimateHome';
import GuesstimateRoom from './components/gt/GuesstimateRoom';
import GtHowToPlayPage from './components/gt/subpages/HowToPlayPage';
import GtQuestionsPage from './components/gt/subpages/QuestionsPage';
import GtWitsWagersAltPage from './components/gt/subpages/WitsWagersAltPage';
import GtFamilyTriviaPage from './components/gt/subpages/FamilyTriviaPage';
import GtVirtualTriviaPage from './components/gt/subpages/VirtualTriviaPage';
import GtRulesScoringPage from './components/gt/subpages/RulesScoringPage';
import GtJackboxAltPage from './components/gt/subpages/JackboxAltPage';
import GtKahootAltPage from './components/gt/subpages/KahootAltPage';
import GtHolidayTriviaPage from './components/gt/subpages/HolidayTriviaPage';
import GtPriceIsRightPage from './components/gt/subpages/PriceIsRightPage';
import GtTwoPlayerTriviaPage from './components/gt/subpages/TwoPlayerTriviaPage';
import GtTeamBuildingPage from './components/gt/subpages/TeamBuildingPage';
import GtLongDistanceCouplesPage from './components/gt/subpages/LongDistanceCouplesPage';
import GtVideoCallGamesPage from './components/gt/subpages/VideoCallGamesPage';
import GtClassroomGamesPage from './components/gt/subpages/ClassroomGamesPage';
import GtNewYearsEvePage from './components/gt/subpages/NewYearsEvePage';
import GtDrinkingGamesPage from './components/gt/subpages/DrinkingGamesPage';
import GtFamilyReunionPage from './components/gt/subpages/FamilyReunionPage';

function App() {
  return (
    <SocketProvider>
      <GameProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game/:roomCode" element={<GameRoom />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/about-contact" element={<AboutContact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/1" element={<PostOne />} />
              <Route path="/blog/2" element={<PostTwo />} />
              <Route path="/blog/3" element={<PostThree />} />
              <Route path="/blog/4" element={<PostFour />} />
              <Route path="/blog/5" element={<PostFive />} />
              <Route path="/blog/6" element={<PostSix />} />
              <Route path="/blog/7" element={<PostSeven />} />
              <Route path="/blog/8" element={<PostEight />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/say-anything" element={<SayAnythingHome />} />
              <Route path="/say-anything/room/:roomCode" element={<SayAnythingRoom />} />
              <Route path="/say-anything/how-to-play-say-anything-board-game-online" element={<HowToPlayPage />} />
              <Route path="/say-anything/100-funny-say-anything-game-questions" element={<QuestionsPage />} />
              <Route path="/say-anything/can-you-play-say-anything-with-2-players" element={<TwoPlayerPage />} />
              <Route path="/say-anything/free-alternative-to-jackbox-party-pack" element={<JackboxAlternativePage />} />
              <Route path="/say-anything/how-to-play-party-games-on-zoom-with-friends" element={<ZoomPartyGamesPage />} />
              <Route path="/say-anything/family-friendly-party-games-to-play-online" element={<FamilyFriendlyPage />} />
              <Route path="/guesstimate" element={<GuesstimateHome />} />
              <Route path="/guesstimate/room/:roomCode" element={<GuesstimateRoom />} />
              <Route path="/guesstimate/how-to-play-online-trivia-betting-game" element={<GtHowToPlayPage />} />
              <Route path="/guesstimate/200-trivia-questions-with-numerical-answers" element={<GtQuestionsPage />} />
              <Route path="/guesstimate/free-alternative-to-wits-and-wagers-online" element={<GtWitsWagersAltPage />} />
              <Route path="/guesstimate/best-online-trivia-games-for-family-game-night" element={<GtFamilyTriviaPage />} />
              <Route path="/guesstimate/how-to-host-virtual-trivia-night-on-zoom" element={<GtVirtualTriviaPage />} />
              <Route path="/guesstimate/online-trivia-betting-game-rules-and-scoring" element={<GtRulesScoringPage />} />
              <Route path="/guesstimate/free-jackbox-alternative-no-download" element={<GtJackboxAltPage />} />
              <Route path="/guesstimate/kahoot-alternative-for-adults" element={<GtKahootAltPage />} />
              <Route path="/guesstimate/christmas-and-holiday-trivia-party-games-online" element={<GtHolidayTriviaPage />} />
              <Route path="/guesstimate/price-is-right-style-party-game-online" element={<GtPriceIsRightPage />} />
              <Route path="/guesstimate/trivia-games-for-2-players-online-free" element={<GtTwoPlayerTriviaPage />} />
              <Route path="/guesstimate/virtual-team-building-trivia-game-for-work" element={<GtTeamBuildingPage />} />
              <Route path="/guesstimate/online-games-for-long-distance-couples-free" element={<GtLongDistanceCouplesPage />} />
              <Route path="/guesstimate/games-to-play-on-facetime-and-video-calls" element={<GtVideoCallGamesPage />} />
              <Route path="/guesstimate/classroom-trivia-games-no-materials-for-teachers" element={<GtClassroomGamesPage />} />
              <Route path="/guesstimate/new-years-eve-party-games-for-adults-large-groups" element={<GtNewYearsEvePage />} />
              <Route path="/guesstimate/drinking-party-games-online-free-for-adults" element={<GtDrinkingGamesPage />} />
              <Route path="/guesstimate/family-reunion-games-for-adults-large-groups" element={<GtFamilyReunionPage />} />
            </Routes>
          </div>
        </Router>
      </GameProvider>
    </SocketProvider>
  );
}

export default App;
