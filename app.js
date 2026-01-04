//VARS
import { Track, Leaderboard, DataLoader } from './module.js';
SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbzKMGLNmBZWQ2tYyBmPS8NoyVn3K0185X5oqfKTNoxn9CXfN6lcEapbd9kU4JZ7o4ES/exec';



////////////////////////////////////////////
// RUNTIME
////////////////////////////////////////////
const leaderboard = new Leaderboard();
const dataLoader = new DataLoader();
const JsonData = dataLoader.fetchData(SHEETS_API_URL);
console.log(JsonData);

// Refresh data every 5 minutes
setInterval(dataLoader.fetchData(SHEETS_API_URL), 5 * 60 * 1000);