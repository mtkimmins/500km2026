//VARS 
SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbxUhKRZFFPMUgxXJ0NZMCbIIm-frmaL5oXxVaHzgNFRtJW-x9zkejC06F7GUqhnx8vMGw/exec';


////////////////////////////////////////////
// CLASSES
////////////////////////////////////////////
class DataLoader {
    async fetchData(url){
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
}


class Leaderboard {
    constructor(){
        this.tracks = []; // A list of track objects in order of winning
    }

    addTrack(track){
        this.tracks.push(track);
    }

    _sortTracksByProgress(){
        this.tracks.sort((a, b) => b.progress_km - a.progress_km);
    }

    updatePlaces(){
        this._sortTracksByProgress();
        this.tracks.forEach((track, index) => {
            track.place = index + 1;
        });
    }

    removeTrack(trackName){
        this.tracks = this.tracks.filter(track => track.name !== trackName);
    }

    drawUpdatedAt(updatedAt){
        const updateDiv = document.getElementById('updatedAt');
        updateDiv.innerText = updatedAt;
        console.log("Updated at:", updatedAt);

    }
}


class Track {
    constructor(name, km, avatar_url){
        this.name = name;
        this.place = 0;
        this.km = km;
        this.avatar_url = avatar_url;
        this.total_km = 500;
    }

    addKm(amount){
        //check if its a number
        this.km += amount;
    }

    setGoalKm(amount){
        //check if number
        this.total_km = amount;
    }

    setProgressKm(amount){
        //check if number
        this.km = amount;
    }

    getProgressPercentage(){
        if(this.total_km === 0) return 0;
        return (this.km / this.total_km) * 100;
    }

    draw(){
        //Constants
        const screenWidth = window.innerWidth;
        const margin = 100;
        //Create parent div
        const parentDiv = document.createElement('div');
        parentDiv.style.flexDirection = 'column';
        parentDiv.style.alignItems = 'center';
        parentDiv.style.marginBottom = '40px';
        parentDiv.style.width = screenWidth - margin*2 + 'px';
        //Create name div
        const nameDiv = document.createElement('div');
        nameDiv.style.order = '-1';
        nameDiv.style.textAlign = 'left';
        parentDiv.appendChild(nameDiv);
        nameDiv.innerText = `${this.place}. ${this.name} - ${this.km} km`;
        nameDiv.style.fontSize = '24px';
        nameDiv.style.marginBottom = '10px';
        //Create Runner
        const runnerDiv = document.createElement('div');
        runnerDiv.style.display = 'flex';
        runnerDiv.style.flexDirection = 'row';
        runnerDiv.style.alignItems = 'center';
        parentDiv.appendChild(runnerDiv);
        //Create Distance
        const distanceDiv = document.createElement('div');
        runnerDiv.appendChild(distanceDiv);
        distanceDiv.style.order = '-1';
        distanceDiv.innerHTML = `${this.km} km`;
        distanceDiv.style.fontSize = '20px';
        //Create avatar img
        const avatarImg = document.createElement('img');
        avatarImg.style.order = '1';
        runnerDiv.appendChild(avatarImg);
        avatarImg.src = this.avatar_url;
        avatarImg.style.width = 50 + 'px';
        avatarImg.style.height = 50 + 'px';
        avatarImg.style.borderRadius = '50%';
        //Track line
        const lineDiv = document.createElement('div');
        lineDiv.style.order = '1';
        parentDiv.appendChild(lineDiv);
        lineDiv.style.width = screenWidth - margin*2;
        lineDiv.style.height = '10px';
        lineDiv.style.backgroundColor = '#000000ff';

        //Position avatar based on progress
        const progressPercent = this.getProgressPercentage();
        runnerDiv.style.position = 'relative';
        runnerDiv.style.left = ((screenWidth - margin*2) * (progressPercent / 100)) + 'px';
        return parentDiv;

    }
}
/////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////
//fetch data from google sheets
function getData(){
    var script = document.createElement('script');
    script.src = SHEETS_API_URL
    document.head.appendChild(script);
}
////////////////////////////////////////////
// RUNTIME
////////////////////////////////////////////

//TEST JSON DATA
// const json = {
//   "mike":230,
//   "sam":405,
//   "updated":"Jan 1, 2024"
// }

const json = getData();
const leaderboard = new Leaderboard();
// document.addEventListener("DOMContentLoaded", getData);

//partition data into tracks and add to leaderboard
for (let key in json) {
    console.log(key + ": " + json[key]);
    if (key === "updated"){
        leaderboard.drawUpdatedAt(json[key]);
        continue;
    }
    const track = new Track(
        key,
        parseFloat(json[key]),
        "./plants.png"
    );
    console.log(track);
    leaderboard.addTrack(track);
    console.log(leaderboard.tracks);
}

//sort tracks by distance
leaderboard.updatePlaces();

//render each track
for (let track of leaderboard.tracks) {
    const entriesDiv = document.getElementById('leaderboard-entries');
    const trackDiv = track.draw();
    
    entriesDiv.appendChild(trackDiv);
}
