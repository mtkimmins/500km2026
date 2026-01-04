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
}



class Track {
    constructor(name, progress_km=0, total_km, avatar_url){
        this.name = name;
        this.place = 0;
        this.progress_km = progress_km;
        this.total_km = total_km;
        this.avatar_url = avatar_url;
    }

    addKm(amount){
        //check if its a number
        this.progress_km += amount;
    }

    setGoalKm(amount){
        //check if number
        this.total_km = amount;
    }

    setProgressKm(amount){
        //check if number
        this.progress_km = amount;
    }

    getProgressPercentage(){
        if(this.total_km === 0) return 0;
        return (this.progress_km / this.total_km) * 100;
    }

    drawProgressBar(){
        const percentage = this.getProgressPercentage();
        const progressBarContainer = document.createElement('div');
        progressBarContainer.classList.add('progress-bar-container');
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        progressBar.style.width = `${percentage}%`;
        progressBarContainer.appendChild(progressBar);
        return progressBarContainer;
    }
}



class DataLoader {
    async fetchData(url){
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
}