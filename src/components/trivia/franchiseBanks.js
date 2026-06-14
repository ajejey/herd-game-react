/*
  Franchise / themed trivia banks — curated, high-confidence question sets for
  topic pages that target a specific franchise keyword (e.g. "harry potter
  trivia"). These are kept SEPARATE from the daily POOL on purpose: niche
  franchise questions should NOT leak into general Daily Trivia.

  Schema matches the rest of the app: the CORRECT answer is authored FIRST in
  `options`; option order is shuffled at runtime by shuffleQuiz().
*/

export const HARRY_POTTER = [
  { q: 'Which Hogwarts house is Harry Potter sorted into?', options: ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'], difficulty: 0 },
  { q: 'What is the name of Harry Potter\'s pet owl?', options: ['Hedwig', 'Errol', 'Pigwidgeon', 'Crookshanks'], difficulty: 0 },
  { q: 'Who wrote the Harry Potter book series?', options: ['J.K. Rowling', 'J.R.R. Tolkien', 'Suzanne Collins', 'Roald Dahl'], difficulty: 0 },
  { q: 'What position does Harry play on the Quidditch team?', options: ['Seeker', 'Keeper', 'Beater', 'Chaser'], difficulty: 1 },
  { q: 'What is the name of the dark wizard Harry must defeat?', options: ['Lord Voldemort', 'Gellert Grindelwald', 'Salazar Slytherin', 'Igor Karkaroff'], difficulty: 0 },
  { q: 'What spell is used to disarm an opponent?', options: ['Expelliarmus', 'Stupefy', 'Wingardium Leviosa', 'Lumos'], difficulty: 1 },
  { q: 'From which platform do students board the Hogwarts Express?', options: ['Platform Nine and Three-Quarters', 'Platform Nine', 'Platform Ten', 'Platform Seven and a Half'], difficulty: 0 },
  { q: 'Who is the headmaster of Hogwarts for most of the series?', options: ['Albus Dumbledore', 'Severus Snape', 'Minerva McGonagall', 'Cornelius Fudge'], difficulty: 0 },
  { q: 'What form does Harry\'s Patronus take?', options: ['A stag', 'A phoenix', 'An otter', 'A doe'], difficulty: 1 },
  { q: 'What is the name of Hagrid\'s three-headed dog?', options: ['Fluffy', 'Fang', 'Norbert', 'Buckbeak'], difficulty: 1 },
  { q: 'What is the incantation for the Killing Curse?', options: ['Avada Kedavra', 'Crucio', 'Sectumsempra', 'Imperio'], difficulty: 1 },
  { q: 'What is the name of the Weasley family home?', options: ['The Burrow', 'Grimmauld Place', 'The Shrieking Shack', 'Spinner\'s End'], difficulty: 1 },
  { q: 'Who is Harry\'s godfather?', options: ['Sirius Black', 'Remus Lupin', 'James Potter', 'Arthur Weasley'], difficulty: 1 },
  { q: 'What core is inside Harry\'s wand?', options: ['Phoenix feather', 'Dragon heartstring', 'Unicorn hair', 'Veela hair'], difficulty: 2 },
  { q: 'What does the spell "Lumos" do?', options: ['Lights the tip of the wand', 'Unlocks a door', 'Mends broken objects', 'Levitates an object'], difficulty: 0 },
  { q: 'What is the wizarding bank called?', options: ['Gringotts', 'Flourish and Blotts', 'Ollivanders', 'Borgin and Burkes'], difficulty: 1 },
  { q: 'What magical object does Hermione use to attend extra classes in Prisoner of Azkaban?', options: ['A Time-Turner', 'The Marauder\'s Map', 'A Pensieve', 'A Remembrall'], difficulty: 2 },
  { q: 'What is the name of the house-elf freed by Harry in the second book?', options: ['Dobby', 'Kreacher', 'Winky', 'Hokey'], difficulty: 1 },
  { q: 'Into how many pieces did Voldemort intend to split his soul?', options: ['Seven', 'Three', 'Five', 'Twelve'], difficulty: 2 },
  { q: 'What is the wizarding prison guarded by Dementors called?', options: ['Azkaban', 'Nurmengard', 'The Ministry', 'Knockturn Alley'], difficulty: 1 },
  { q: 'What does the Marauder\'s Map reveal?', options: ['Everyone\'s location inside Hogwarts', 'Hidden treasure', 'The future', 'Secret spells'], difficulty: 1 },
  { q: 'What is Draco Malfoy\'s Hogwarts house?', options: ['Slytherin', 'Gryffindor', 'Ravenclaw', 'Hufflepuff'], difficulty: 0 },
  { q: 'What hidden London street is the wizarding shopping district?', options: ['Diagon Alley', 'Knockturn Alley', 'Privet Drive', 'Godric\'s Hollow'], difficulty: 1 },
  { q: 'What are the gold coins of the wizarding currency called?', options: ['Galleons', 'Sickles', 'Knuts', 'Florins'], difficulty: 2 },
  { q: 'Which French school competes in the Triwizard Tournament?', options: ['Beauxbatons', 'Durmstrang', 'Ilvermorny', 'Mahoutokoro'], difficulty: 2 },
  { q: 'Who is the Potions master and head of Slytherin house?', options: ['Severus Snape', 'Horace Slughorn', 'Gilderoy Lockhart', 'Quirinus Quirrell'], difficulty: 1 },
  { q: 'What sport is played on broomsticks at Hogwarts?', options: ['Quidditch', 'Gobstones', 'Wizard\'s Chess', 'Quodpot'], difficulty: 0 },
  { q: 'What is the name of Ron Weasley\'s pet rat?', options: ['Scabbers', 'Hedwig', 'Trevor', 'Nagini'], difficulty: 1 },
  { q: 'Which Deathly Hallow makes the wearer invisible?', options: ['The Cloak of Invisibility', 'The Elder Wand', 'The Resurrection Stone', 'The Sorting Hat'], difficulty: 1 },
  { q: 'What creature is Buckbeak?', options: ['A Hippogriff', 'A Thestral', 'A Phoenix', 'A Basilisk'], difficulty: 1 },
  { q: 'What is the name of the giant snake in the Chamber of Secrets?', options: ['Basilisk', 'Nagini', 'Aragog', 'Norbert'], difficulty: 1 },
  { q: 'Who teaches Defence Against the Dark Arts in Prisoner of Azkaban?', options: ['Remus Lupin', 'Gilderoy Lockhart', 'Mad-Eye Moody', 'Dolores Umbridge'], difficulty: 2 },
];
