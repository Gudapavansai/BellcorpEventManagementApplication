const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');

dotenv.config();

const events = [
    {
        name: "Mumbai Jazz Nights",
        organizer: "Blue Frog Events",
        location: "Bandra Fort, Mumbai",
        date: new Date("2026-07-15T19:00:00"),
        description: "An evening of smooth jazz and coastal vibes under the Mumbai stars.",
        capacity: 500,
        category: "Music",
        image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Bangalore Tech Summit 2026",
        organizer: "Karnataka Digital",
        location: "Bangalore Palace Grounds",
        date: new Date("2026-09-20T09:00:00"),
        description: "Asia's largest tech innovation summit featuring global industry leaders.",
        capacity: 2000,
        category: "Tech",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Coffee & Art Workshop",
        organizer: "Third Wave Roasters",
        location: "Koramangala, Bangalore",
        date: new Date("2026-03-12T10:00:00"),
        description: "Learn brewing techniques and latte art from India's champion baristas.",
        capacity: 20,
        category: "Workshop",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop"
    },
    {
        name: "Delhi Half Marathon",
        organizer: "Fit India",
        location: "India Gate, New Delhi",
        date: new Date("2026-11-05T06:00:00"),
        description: "Run through the heart of the capital in this prestigious annual marathon.",
        capacity: 5000,
        category: "Sports",
        image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Spicy Street Food Fest",
        organizer: "Delhi Food Walks",
        location: "Chandni Chowk, Delhi",
        date: new Date("2026-10-12T12:00:00"),
        description: "A culinary journey through the legendary street food lanes of Old Delhi.",
        capacity: 1500,
        category: "Food",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2187&auto=format&fit=crop"
    },
    {
        name: "Goa Blockchain Conference",
        organizer: "Web3 India",
        location: "Grand Hyatt, Goa",
        date: new Date("2026-08-22T10:00:00"),
        description: "Discussing the future of decentralized finance by the beach.",
        capacity: 800,
        category: "Conference",
        image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop"
    },
    {
        name: "Sufi Music Night",
        organizer: "Mehfil Arts",
        location: "Taramati Baradari, Hyderabad",
        date: new Date("2026-04-18T20:00:00"),
        description: "A soulful evening of Qawwali and Sufi music in a historic setting.",
        capacity: 600,
        category: "Music",
        image: "https://images.unsplash.com/photo-1514525253344-99a42999aa2e?q=80&w=1600"
    },
    {
        name: "IPL Final Screening",
        organizer: "Cricket Fever",
        location: "Wankhede Stadium, Mumbai",
        date: new Date("2026-05-28T19:00:00"),
        description: "Watch the grand finale on massive screens with live commentary.",
        capacity: 10000,
        category: "Sports",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1600"
    },
    {
        name: "Chennai Gaming Expo",
        organizer: "Madras Gamers",
        location: "Chennai Trade Centre",
        date: new Date("2026-12-05T10:00:00"),
        description: "South India's biggest gaming convention with cosplay and tournaments.",
        capacity: 3000,
        category: "Tech",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600"
    },
    {
        name: "Jaipur Literature Festival",
        organizer: "Teamwork Arts",
        location: "Diggi Palace, Jaipur",
        date: new Date("2026-01-20T10:00:00"),
        description: "The greatest literary show on Earth featuring Nobel laureates and local authors.",
        capacity: 5000,
        category: "Conference",
        image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=1600"
    },
    {
        name: "Rishikesh Yoga Retreat",
        organizer: "Ganga Flow",
        location: "Rishikesh, Uttarakhand",
        date: new Date("2026-03-15T06:00:00"),
        description: "7-day intensive yoga and meditation retreat by the banks of the Ganges.",
        capacity: 40,
        category: "Other",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop"
    },
    {
        name: "Pune Startup Meetup",
        organizer: "Pune Open Coffee",
        location: "Koregaon Park, Pune",
        date: new Date("2026-06-12T17:00:00"),
        description: "Networking for founders and investors in Pune's thriving startup ecosystem.",
        capacity: 100,
        category: "Tech",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1600"
    },
    {
        name: "Kolkata Winter Gala",
        organizer: "City of Joy Events",
        location: "Victoria Memorial, Kolkata",
        date: new Date("2025-12-24T19:00:00"),
        description: "Christmas Eve celebration with carols, cakes, and lights.",
        capacity: 800,
        category: "Other",
        image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1600"
    }
];

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Event.deleteMany();
        await Event.insertMany(events);
        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

importData();
