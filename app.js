//VARS 
const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbyvTcG8b_DE0XdYW2zRei1ph2LA1vOnOx523X6UqxpKWqm9Sl6qtY6G8NJNVFOwwVM00A/exec';
const SHEETS_API_URL2 = 'https://script.google.com/macros/s/AKfycbyEL4q3e8I5fLT-N6NUbfWnpFmkz_vOf6y7GeIDzV5RVTR8x-ZWIuk4okB4Bwsyf1F33Q/exec';



/* WHAT SHOULD BE EXPECTED from App Scripts API
{
  "mike":{
    "kms_a":[4,5],
    "dates_a":["10 Jan 2026", "10 Jan 2026"]
  }
  "sam":{
    "kms_a":[10,8,3],
    "dates_a":["6 Jan 2026", "7 Jan 2026", "9 Jan 2026"]
  }
  "updated":"10 Jan 2026"
}
*/
////////////////////////////////////////////
// CLASSES
///////////////////////////////////////////
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
        this.tracks.sort((a, b) => b.km_sum - a.km_sum);
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

    renderTracks(){
        //render each track
        for (let track of this.tracks) {
            if (track === "updatedAt") {
                console.log("Skipping updatedAt");
                continue;
            }
            const entriesDiv = document.getElementById('leaderboard-entries');
            const trackDiv = track.draw();
            
            entriesDiv.appendChild(trackDiv);
            }
        }
    
    populateLeaderboard(json){
        //Convert JSON as tracks
        this.addJSONAsTracks(json);
        //sort tracks by distance
        this.updatePlaces();
        //render tracks
        this.renderTracks();

    }

    addJSONAsTracks(json){
        for (let key in json){
            console.log("KEY: ",key);
            // Set the updated time if key is updatedAt
            if (key === "updatedAt"){
                this.drawUpdatedAt(json[key]);
                continue;
            }
            const track = new Track(
                key,
                json[key]["km_a"],
                "./plants.png"
            );
            console.log("TRACK MADE: ", track);
            leaderboard.addTrack(track);
            console.log("TOTAL TRACK LIST: ",leaderboard.tracks);
        }
    }
}


class Track {
    constructor(name, kms, avatar_url){
        this.name = name;
        this.place = 0;
        this.kms = kms; //Array
        this.km_sum = this._getKmSum();
        this.avatar_url = avatar_url;
        this.total_km = 500;
    }

    getProgressPercentage(){
        if(this.total_km === 0) return 0;
        return (this.km_sum / this.total_km) * 100;
    }

    _getKmSum(){
        return (this.kms.reduce((a, b) => a + b, 0)).toFixed(2);
    }

    draw(){
        //Constants
        const screenWidth = window.innerWidth;
        const margin = 100;
        //Create parent div
        const parentDiv = document.createElement('div');
        parentDiv.style.display = 'grid';
        parentDiv.style.gridRow = 'auto auto';
        parentDiv.style.marginBottom = '40px';
        parentDiv.style.width = screenWidth * 0.9 + 'px';
        //Create name div
        const nameDiv = document.createElement('div');
        nameDiv.style.order = '-1';
        parentDiv.appendChild(nameDiv);
        nameDiv.innerText = `(${this.place}) ${this.name}`;
        nameDiv.style.fontSize = '24px';
        nameDiv.style.marginBottom = '10px';
        //Create Runner
        const runnerDiv = document.createElement('div');
        runnerDiv.style.display = 'grid';
        runnerDiv.style.alignItems = 'center';
        parentDiv.appendChild(runnerDiv);
        //Create Distance
        const distanceDiv = document.createElement('div');
        runnerDiv.appendChild(distanceDiv);
        distanceDiv.style.order = '-1';
        distanceDiv.innerHTML = `${this.km_sum} km`;
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
        runnerDiv.style.left = ((screenWidth*0.9) * (progressPercent / 100)) + 'px';
        return parentDiv;

    }
}
/////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////
function buildHTTPRequest(callbackFunctionName){
    const callbackSegment = '?callback=' + callbackFunctionName;
    return SHEETS_API_URL2 + callbackSegment;
}

function receiveData(json){
    console.log("Received data:", json);
    leaderboard.populateLeaderboard(json);
}

function triggerDataLoad(){
    console.log("Triggering data load...");
    const script = document.createElement('script');
    script.src = buildHTTPRequest('receiveData');
    document.head.appendChild(script);
}
////////////////////////////////////////////
//  TESTS
////////////////////////////////////////////
const test_json = { 
  "Samara": 
   { "km_a": [ 3.52, 3.2, 4.37, 1, 3.05, 3.2 ],
     "date_a": 
      [ "Thu Jan 01 2026 18:16:28 GMT-0700 (Mountain Standard Time)",
        "Fri Jan 02 2026 18:07:28 GMT-0700 (Mountain Standard Time)",
        "Sat Jan 03 2026 17:47:16 GMT-0700 (Mountain Standard Time)",
        "Tue Jan 06 2026 15:57:06 GMT-0700 (Mountain Standard Time)",
        "Tue Jan 06 2026 18:28:26 GMT-0700 (Mountain Standard Time)",
        "Fri Jan 09 2026 19:11:07 GMT-0700 (Mountain Standard Time)" ] },
  "Hollie": 
   { "km_a": [ 3.18, 3.3, 2.41, 1.07, 2.31, 1.58, 3.19, 4.06 ],
     "date_a": 
      [ "Sat Jan 03 2026 09:31:06 GMT-0700 (Mountain Standard Time)",
        "Sun Jan 04 2026 09:12:44 GMT-0700 (Mountain Standard Time)",
        "Mon Jan 05 2026 21:04:36 GMT-0700 (Mountain Standard Time)",
        "Tue Jan 06 2026 15:08:18 GMT-0700 (Mountain Standard Time)",
        "Wed Jan 07 2026 13:35:25 GMT-0700 (Mountain Standard Time)",
        "Thu Jan 08 2026 18:05:38 GMT-0700 (Mountain Standard Time)",
        "Sat Jan 10 2026 08:25:22 GMT-0700 (Mountain Standard Time)",
        "Sun Jan 11 2026 08:46:34 GMT-0700 (Mountain Standard Time)" ] },
  "Taylor": 
   { "km_a": [ 3, 6, 4 ],
     "date_a": 
      [ "Sat Jan 03 2026 17:20:31 GMT-0700 (Mountain Standard Time)",
        "Tue Jan 06 2026 19:17:24 GMT-0700 (Mountain Standard Time)",
        "Thu Jan 08 2026 18:13:23 GMT-0700 (Mountain Standard Time)" ] },
  "Mike": 
   { "km_a": [ 5, 5, 8, 4, 6 ],
     "date_a": 
      [ "Sun Jan 04 2026 12:33:32 GMT-0700 (Mountain Standard Time)",
        "Tue Jan 06 2026 14:39:20 GMT-0700 (Mountain Standard Time)",
        "Wed Jan 07 2026 14:32:32 GMT-0700 (Mountain Standard Time)",
        "Thu Jan 08 2026 13:41:53 GMT-0700 (Mountain Standard Time)",
        "Sun Jan 11 2026 11:12:54 GMT-0700 (Mountain Standard Time)" ] },
  "Erika": 
   { "km_a": [ 1, 3.2, 2 ],
     "date_a": 
      [ "Tue Jan 06 2026 19:03:59 GMT-0700 (Mountain Standard Time)",
        "Wed Jan 07 2026 12:29:43 GMT-0700 (Mountain Standard Time)",
        "Thu Jan 08 2026 18:13:56 GMT-0700 (Mountain Standard Time)" ] },
  "updatedAt": "Sun Jan 11 2026" 
}

////////////////////////////////////////////
// RUNTIME
////////////////////////////////////////////
const leaderboard = new Leaderboard();
document.addEventListener('DOMContentLoaded', triggerDataLoad);