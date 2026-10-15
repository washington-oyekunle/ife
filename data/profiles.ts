export type Profile = {
  id: string;
  name: string;
  age: number;
  city: string;
  country: string;
  occupation: string;
  education: string;
  bio: string;
  photos: string[];
  interests: string[];
  prompts: { question: string; answer: string }[];
  verified: boolean;
  distance: number;
  compatibility: number;
};

export const interestOptions = [
  'Music', 'Cooking', 'Travel', 'Faith', 'Fitness', 'Art',
  'Reading', 'Film', 'Dance', 'Tech', 'Entrepreneurship', 'Fashion',
  'Photography', 'Football', 'Nature', 'Food', 'Languages', 'Community',
];

export const promptQuestions = [
  'My ideal weekend looks like...',
  'What I value most in a relationship...',
  'A cultural tradition I cherish...',
  'My love language is...',
  'I\'m looking for someone who...',
  'The way to my heart is...',
];

const womenPhotos = [
  'https://images.pexels.com/photos/37038761/pexels-photo-37038761.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/39598425/pexels-photo-39598425.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/36536385/pexels-photo-36536385.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/27038743/pexels-photo-27038743.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/33646629/pexels-photo-33646629.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/11215202/pexels-photo-11215202.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/13826388/pexels-photo-13826388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/31860868/pexels-photo-31860868.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

const menPhotos = [
  'https://images.pexels.com/photos/7257963/pexels-photo-7257963.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/15929275/pexels-photo-15929275.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/3316263/pexels-photo-3316263.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/7432863/pexels-photo-7432863.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/30208144/pexels-photo-30208144.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/2233066/pexels-photo-2233066.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

export const discoverProfiles: Profile[] = [
  {
    id: '1',
    name: 'Amara',
    age: 26,
    city: 'Lagos',
    country: 'Nigeria',
    occupation: 'Product Designer',
    education: 'B.Sc. Computer Science',
    bio: 'Designer by day, jollof critic by night. I love old soul music, weekend markets, and conversations that go deep quickly.',
    photos: [womenPhotos[0], womenPhotos[4], womenPhotos[1]],
    interests: ['Art', 'Music', 'Cooking', 'Travel', 'Fashion'],
    prompts: [
      { question: 'My ideal weekend looks like...', answer: 'Jollof at my mom\'s, a gallery opening, and dancing to Fela until midnight.' },
      { question: 'What I value most in a relationship...', answer: 'Honesty and laughter — if we can\'t laugh about it, we can\'t fix it.' },
    ],
    verified: true,
    distance: 3,
    compatibility: 94,
  },
  {
    id: '2',
    name: 'Kwesi',
    age: 29,
    city: 'Accra',
    country: 'Ghana',
    occupation: 'Software Engineer',
    education: 'M.Sc. Software Engineering',
    bio: 'I build things and break bread. Football on Saturdays, code on weekdays, and family always. Looking for my person.',
    photos: [menPhotos[0], menPhotos[3], menPhotos[1]],
    interests: ['Tech', 'Football', 'Faith', 'Entrepreneurship', 'Music'],
    prompts: [
      { question: 'I\'m looking for someone who...', answer: 'Can hold their own in a debate and still make me laugh mid-argument.' },
      { question: 'A cultural tradition I cherish...', answer: 'Every Sunday dinner at my grandmother\'s. No exceptions.' },
    ],
    verified: true,
    distance: 12,
    compatibility: 88,
  },
  {
    id: '3',
    name: 'Zainab',
    age: 24,
    city: 'Nairobi',
    country: 'Kenya',
    occupation: 'Marketing Strategist',
    education: 'B.A. Communications',
    bio: 'Wordsmith, tea enthusiast, and serial traveler. I\'ve been to 14 countries and counting. Next stop: somewhere with you?',
    photos: [womenPhotos[1], womenPhotos[5], womenPhotos[2]],
    interests: ['Travel', 'Reading', 'Languages', 'Photography', 'Food'],
    prompts: [
      { question: 'My love language is...', answer: 'Quality time and acts of service — show up for me and I\'m yours.' },
      { question: 'My ideal weekend looks like...', answer: 'A morning hike, a new restaurant, and a book I can\'t put down.' },
    ],
    verified: true,
    distance: 8,
    compatibility: 91,
  },
  {
    id: '4',
    name: 'Tunde',
    age: 31,
    city: 'Lagos',
    country: 'Nigeria',
    occupation: 'Architect',
    education: 'M.Arch',
    bio: 'I design spaces and build relationships the same way — with intention. Love jazz, good design, and long drives with no destination.',
    photos: [menPhotos[1], menPhotos[4], menPhotos[2]],
    interests: ['Art', 'Photography', 'Music', 'Travel', 'Nature'],
    prompts: [
      { question: 'The way to my heart is...', answer: 'A vinyl record you picked just for me and a conversation that runs past midnight.' },
      { question: 'What I value most in a relationship...', answer: 'Curiosity — someone who wants to know me, not just date me.' },
    ],
    verified: true,
    distance: 5,
    compatibility: 86,
  },
  {
    id: '5',
    name: 'Fatima',
    age: 27,
    city: 'Abuja',
    country: 'Nigeria',
    occupation: 'Doctor',
    education: 'M.D.',
    bio: 'Healer, hiker, and hopeless romantic. I believe in showing up — for my patients, my family, and my person.',
    photos: [womenPhotos[2], womenPhotos[6], womenPhotos[3]],
    interests: ['Faith', 'Fitness', 'Nature', 'Reading', 'Community'],
    prompts: [
      { question: 'I\'m looking for someone who...', answer: 'Prays, laughs loud, and isn\'t afraid of a little vulnerability.' },
      { question: 'A cultural tradition I cherish...', answer: 'Eid morning — the whole family in one room, all forgiven.' },
    ],
    verified: true,
    distance: 6,
    compatibility: 89,
  },
  {
    id: '6',
    name: 'Kofi',
    age: 28,
    city: 'Kumasi',
    country: 'Ghana',
    occupation: 'Entrepreneur',
    education: 'B.Sc. Business Administration',
    bio: 'I started a fintech and a band in the same year. I take work and play equally seriously. Let\'s build something together.',
    photos: [menPhotos[2], menPhotos[5], menPhotos[0]],
    interests: ['Entrepreneurship', 'Music', 'Tech', 'Fitness', 'Food'],
    prompts: [
      { question: 'My ideal weekend looks like...', answer: 'A long run, a longer brunch, and a studio session that turns into a party.' },
      { question: 'The way to my heart is...', answer: 'Ambition with humility — dream big but never forget where you came from.' },
    ],
    verified: true,
    distance: 15,
    compatibility: 83,
  },
];

export const matchProfiles: Profile[] = [
  {
    id: 'm1',
    name: 'Amara',
    age: 26,
    city: 'Lagos',
    country: 'Nigeria',
    occupation: 'Product Designer',
    education: 'B.Sc. Computer Science',
    bio: 'Designer by day, jollof critic by night.',
    photos: [womenPhotos[0]],
    interests: ['Art', 'Music', 'Cooking'],
    prompts: [],
    verified: true,
    distance: 3,
    compatibility: 94,
  },
  {
    id: 'm2',
    name: 'Kwesi',
    age: 29,
    city: 'Accra',
    country: 'Ghana',
    occupation: 'Software Engineer',
    education: 'M.Sc. Software Engineering',
    bio: 'I build things and break bread.',
    photos: [menPhotos[0]],
    interests: ['Tech', 'Football', 'Faith'],
    prompts: [],
    verified: true,
    distance: 12,
    compatibility: 88,
  },
  {
    id: 'm3',
    name: 'Zainab',
    age: 24,
    city: 'Nairobi',
    country: 'Kenya',
    occupation: 'Marketing Strategist',
    education: 'B.A. Communications',
    bio: 'Wordsmith and serial traveler.',
    photos: [womenPhotos[1]],
    interests: ['Travel', 'Reading', 'Languages'],
    prompts: [],
    verified: true,
    distance: 8,
    compatibility: 91,
  },
];

export type Message = {
  id: string;
  senderId: string;
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  profileId: string;
  name: string;
  photo: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: Message[];
};

export const conversations: Conversation[] = [
  {
    id: 'c1',
    profileId: 'm1',
    name: 'Amara',
    photo: womenPhotos[0],
    lastMessage: 'Jollof this weekend? I know a place 😊',
    lastMessageTime: '2m',
    unread: 2,
    messages: [
      { id: '1', senderId: 'm1', text: 'Hey! I loved your profile — that travel photo is amazing', time: '10:30 AM' },
      { id: '2', senderId: 'me', text: 'Thank you! Zanzibar was unreal. Have you been?', time: '10:32 AM' },
      { id: '3', senderId: 'm1', text: 'Not yet but it\'s on my list! Maybe we should plan something', time: '10:35 AM' },
      { id: '4', senderId: 'me', text: 'I like the way you think 😄', time: '10:36 AM' },
      { id: '5', senderId: 'm1', text: 'Jollof this weekend? I know a place 😊', time: '10:40 AM' },
    ],
  },
  {
    id: 'c2',
    profileId: 'm2',
    name: 'Kwesi',
    photo: menPhotos[0],
    lastMessage: 'Sounds like a plan. Sunday works?',
    lastMessageTime: '1h',
    unread: 0,
    messages: [
      { id: '1', senderId: 'm2', text: 'I saw you\'re into football too — Arsenal or Chelsea?', time: 'Yesterday' },
      { id: '2', senderId: 'me', text: 'Arsenal all the way. You?', time: 'Yesterday' },
      { id: '3', senderId: 'm2', text: 'Chelsea. We might have a problem here 😂', time: 'Yesterday' },
      { id: '4', senderId: 'me', text: 'Rivalry aside, there\'s a match Sunday if you want to watch together', time: 'Yesterday' },
      { id: '5', senderId: 'm2', text: 'Sounds like a plan. Sunday works?', time: 'Yesterday' },
    ],
  },
  {
    id: 'c3',
    profileId: 'm3',
    name: 'Zainab',
    photo: womenPhotos[1],
    lastMessage: '14 countries and counting? I need to hear this story',
    lastMessageTime: '3h',
    unread: 1,
    messages: [
      { id: '1', senderId: 'me', text: 'Hi Zainab! Your travel photos are incredible', time: '2h ago' },
      { id: '2', senderId: 'm3', text: '14 countries and counting? I need to hear this story', time: '1h ago' },
    ],
  },
];
