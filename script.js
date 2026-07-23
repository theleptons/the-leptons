//constants
let songMap = new Map()
const audioList = []
const deadAir = new Audio();
let nowPlaying = new Audio()
let isPaused = 0;
let shuffleOn = 0;

document.addEventListener('DOMContentLoaded', function() {
  loadSongs();
});

function loadSongs() {
    const container = document.getElementById('song-list');
    let song_order = 0;

    fetch('./songs.json')
    .then(response => response.json()) // Parse the response text as JSON
    .then(data => {

        // Loop through each object inside the JSON array
        data.forEach(item => {   
            const songMetadataMap = new Map()
            
            // load metadata from JSON
            const song_id = item.SongID;
            const song_title = item.Song;
            const song_path = item.Path;
            const song_album = item.Album;
            const song_year = item.Year;
            const song_tracknumber = item.Track;
            const song_side = item.Side;
            songMetadataMap.set('song_title', song_title)
                        .set('song_path', song_path)
                        .set('song_album', song_album)
                        .set('song_year', song_year)
                        .set('song_tracknumber', song_tracknumber)
                        .set('song_side', song_side)
                        .set('song_order', song_order);

            // create audio object
            const song_audio_id = `${song_id}`;
            const song_audio = new Audio(song_path);
            song_audio.id = song_audio_id;
            song_audio.load();
            songMetadataMap.set('song_audio_id', song_audio_id)
                .set('song_audio', song_audio);
            audioList.push(song_audio)

            // create album div object if it doesn't exist
            const album_title = song_album;
            const album_div_id = `${album_title}-div`;
            // album_div = document.createElement('div');
            const album_title_header_id =  `${album_title}-header`;
            let album_title_header = document.createElement('h1');
            let album_div = document.getElementById(album_div_id);
            if (!album_div) {
                album_div = document.createElement('div');
                album_div.id = album_div_id;
                album_title_header.id = album_title_header_id;
                album_title_header.innerHTML = `
                    <h1>
                        '${album_title}'
                    </h1>
                `;
                album_div.appendChild(album_title_header);
                container.appendChild(album_div);
            } else {
                album_div = document.getElementById(album_div_id);
                album_title_header = document.getElementById(album_title_header_id);
            }
            songMetadataMap.set('album_title', album_title)
                .set('album_div_id', album_div_id)
                .set('album_div', album_div)
                .set('album_title_header_id', album_title_header_id)
                .set('album_title_header', album_title_header)

            // create album side object if it doesn't exist
            const album_side_title = `${song_side}`;
            const album_side_div_id = `${album_title}-${album_side_title}-div`;
            // const album_side_div = document.createElement('div');
            const album_side_title_header_id =  `${album_title}-${album_side_title}-header`;
            let album_side_title_header = document.createElement('h1');
            let album_side_div = document.getElementById(album_side_div_id);
            if (!album_side_div) {
                album_side_div = document.createElement('div');
                album_side_div.id = album_side_div_id;
                album_side_title_header.id = album_side_title_header_id;
                album_side_title_header.innerHTML = `
                    <h3>
                        '${album_side_title}'
                    </h3>
                `;
                album_side_div.appendChild(album_side_title_header);
                album_div.appendChild(album_side_div);
            } else {
                album_side_div = document.getElementById(album_side_div_id);
                album_side_title_header = document.getElementById(album_side_title_header_id);
            }
            songMetadataMap.set('album_side_title', album_side_title)
                .set('album_side_div_id', album_side_div_id)
                .set('album_side_div', album_side_div)
                .set('album_side_title_header_id', album_side_title_header_id)
                .set('album_side_title_header', album_side_title_header)

            // create song div object
            const song_div_id = `${song_title}-div`
            const song_div = document.createElement('div');
            song_div.id = song_div_id
            song_div.classList.add('parent');
            album_side_div.appendChild(song_div)
            songMetadataMap.set('song_div_id', song_div_id)
                .set('song_div', song_div)

            // create song title header and control objects
            const song_title_text_id = `${song_title}-title-text`
            const song_title_text = document.createElement('div');
            song_title_text.classList.add('child-left');
            song_title_text.innerHTML = `
                <h2>${song_title}</h2>
            `;
            const song_control_id = `${song_title}-control`
            const song_controls = document.createElement('div');
            song_controls.classList.add('child-right');
            song_controls.id = song_control_id
            // add first button
            const song_control_button_1_id = `${song_title}-control-button-1`
            const song_control_button_1 = document.createElement('button');
            song_control_button_1.innerHTML = `
                <img src="assets/images/icons/play_button.svg" alt="Play">
            `;
            song_control_button_1.classList.add('audio-control-button')
            song_control_button_1.classList.add('play-button');
            song_control_button_1.setAttribute('onclick', `playSong('${song_id}')`);
            song_control_button_1.id = song_control_button_1_id
            song_controls.appendChild(song_control_button_1);
            song_div.appendChild(song_title_text);
            song_div.appendChild(song_controls);

            songMetadataMap.set('song_title_text_id', song_title_text_id)
                .set('song_title_text', song_title_text)
                .set('song_control_id', song_control_id)
                .set('song_controls', song_controls)
                .set('song_control_button_1',song_control_button_1);

            // store in map
            songMap.set(song_id, songMetadataMap);
            
            //iterate song order counter
            song_order += 1;
        })
    })
    .catch(error => console.error('Error loading JSON data:', error));
    console.log(songMap)
}

function stopEverything() {
    console.log('Trying to stop everything.')
    for (let i = 0; i < audioList.length; i++) {
        stopSong(audioList[i].id);
    }
}

function allAudioStates() {
    for (let i = 0; i < audioList.length; i++) {
        let song_id = audioList[i].id;
        let song_metadata = songMap.get(song_id);
        let song_title = song_metadata.get("song_title");
        console.log(`${song_title} (${song_id}): paused (${audioList[i].paused}); ended (${audioList[i].ended}); currentTime (${audioList[i].currentTime});`);
    }
}

function audioState(song_id) {
    if (song_id.length > 0) {
        let song_metadata = songMap.get(song_id);
        let song_title = song_metadata.get("song_title");
        let song_audio = song_metadata.get("song_audio");
        console.log(`${song_title} (${song_id}): paused (${song_audio.paused}); ended (${song_audio.ended}); currentTime (${song_audio.currentTime});`);
    }
}

function playSongs(){
    if(nowPlaying.id.trim().length === 0){
        let next_song_id = Array.from(songMap.keys())[0];
        playSong(next_song_id);
    }
    updateCurrentState();
}

function pauseSongs(){
    updateCurrentState();
    nowPlaying.pause();
    updateCurrentState();
}

function updateCurrentState(){
    updateNowPlaying();
    updateMainPlayer();
    setControlIcons();
}

function updateNowPlaying(){
    console.log(`function updateNowPlaying`)
    let somethingPlaying = 0;
    let song_metadata = new Map();
    let song_title = "nothing";
    if (nowPlaying.id.trim().length > 0){
        song_metadata = songMap.get(nowPlaying.id);
        song_title = song_metadata.get("song_title");
    }
    for (let i = 0; i < audioList.length; i++) {
        let song = audioList[i];
        // console.log(song);
        if (song.id.length > 0) {
            song_id = song.id;
            song_metadata = songMap.get(song_id);
            song_title = song_metadata.get("song_title");
            song_paused = song.paused;
            song_ended = song.ended;
            song_current_time = song.currentTime;
        }
        if (somethingPlaying > 0) {
            if (!song_paused && !song_ended) {
                song.pause();
            } else if (song_paused && !song_ended && song_current_time > 0) {
                song.currentTime = 0;
            }
        } else if (!song_paused && !song_ended) {
            nowPlaying = song;
            somethingPlaying = 1;
            isPaused = 0;
        } else if (song_paused && !song_ended && song_current_time > 0) {
            nowPlaying = song;
            somethingPlaying = 1;
            isPaused = 1;
        } else {
            nowPlaying = deadAir;
        }
    }
    if (nowPlaying.id.trim().length > 0){
        song_metadata = new Map();
        song_metadata = songMap.get(nowPlaying.id);
        song_title = song_metadata.get("song_title");
    }
    console.log(`Now playing '${song_title}'`);
}

function updateMainPlayer(){
    console.log(`function updateMainPlayer`);
    let main_player_button_1 = document.getElementById("main-player-button-1");
    let main_player_text = document.getElementById("main-player-text");
    if(nowPlaying.id.trim().length === 0){
        main_player_text.textContent = "Nothing is playing right now.";
        console.log(`Set display to "Nothing is playing right now."`);
        main_player_button_1.innerHTML = `<img src="assets/images/icons/play_button_40.svg" alt="Play">`;
        main_player_button_1.classList.remove('pause-button');
        main_player_button_1.classList.add('play-button');
        main_player_button_1.setAttribute('onclick', `playSongs()`);
    } else if(nowPlaying.id.trim().length > 0 && isPaused === 1){
        let song_metadata = songMap.get(nowPlaying.id);
        let song_title = song_metadata.get("song_title");
        main_player_text.textContent = song_title;
        console.log(`Set display to '${song_title}'`);
        main_player_button_1.innerHTML = `<img src="assets/images/icons/play_button_40.svg" alt="Resume Song">`;
        main_player_button_1.classList.remove('pause-button');
        main_player_button_1.classList.add('play-button');
        main_player_button_1.setAttribute('onclick', `playSong('${nowPlaying.id}')`);
        console.log(`'${song_title}' paused, showing play button.`);
    } else {
        let song_metadata = songMap.get(nowPlaying.id);
        let song_title = song_metadata.get("song_title");
        main_player_text.textContent = song_title;
        console.log(`Set display to '${song_title}'`);
        main_player_button_1.innerHTML = `<img src="assets/images/icons/pause_button_40.svg" alt="Pause">`;
        main_player_button_1.classList.remove('main-play-button');
        main_player_button_1.classList.add('main-pause-button');
        main_player_button_1.setAttribute('onclick', `pauseSongs()`);
        console.log(`'${song_title}' playing, showing pause button.`);
    }

    let main_player_shuffle_button = document.getElementById("main-player-shuffle-button");
    if (shuffleOn === 0) {
        main_player_shuffle_button.classList.remove('main-unshuffle-button');
        main_player_shuffle_button.classList.add('main-shuffle-button');
        main_player_shuffle_button.setAttribute('onclick', `shuffleSongs()`);
    } else if (shuffleOn === 1) {
        main_player_shuffle_button.classList.remove('main-shuffle-button');
        main_player_shuffle_button.classList.add('main-unshuffle-button');
        main_player_shuffle_button.setAttribute('onclick', `unshuffleSongs()`);
    }
}

function playSong(song_id) {
    let song_metadata = songMap.get(song_id);
    let song_title = song_metadata.get("song_title");
    console.log(`Trying to play '${song_title}'`);
    console.log(!nowPlaying.id.trim().length === 0);
    console.log(song_id !== nowPlaying.id.trim());
    if (nowPlaying.id.trim().length !== 0 && song_id !== nowPlaying.id.trim()){
        stopSong(nowPlaying.id.trim());
    }
    let song_audio = song_metadata.get("song_audio");
    song_audio.play();
    updateCurrentState();
}

function pauseSong(song_id) {
    let song_metadata = songMap.get(song_id);
    let song_title = song_metadata.get("song_title");
    console.log(`Trying to pause '${song_title}'`);
    let song_audio = song_metadata.get("song_audio");
    song_audio.pause();
    updateCurrentState();
}

function stopSong(song_id){
    if (song_id.length > 0) {
        let song_metadata = songMap.get(song_id);
        let song_title = song_metadata.get("song_title");
        console.log(`Trying to stop '${song_title}'`);
        let song_audio = song_metadata.get("song_audio");
        song_audio.pause();
        song_audio.currentTime = 0;
        updateCurrentState();
    }
}

function previousSong(){
    const currentSongIndex = Array.from(songMap.keys()).indexOf(nowPlaying.id);
    const previousSongIndex = currentSongIndex - 1;
    if (previousSongIndex >= 0) {
        let previous_song_id = Array.from(songMap.keys())[previousSongIndex];
        playSong(previous_song_id);
    }
}

function nextSong(){
    const lastSongIndex = songMap.size - 1;
    const currentSongIndex = Array.from(songMap.keys()).indexOf(nowPlaying.id);
    const nextSongIndex = currentSongIndex + 1;
    if (nextSongIndex <= lastSongIndex) {
        let next_song_id = Array.from(songMap.keys())[nextSongIndex];
        playSong(next_song_id);
    }
}

function shuffleSongs() {
    console.log('shuffling...');
    console.log(songMap);
    let copyOfSongMap = new Map(songMap);
    let randomizedSongMap = new Map();
    let songsInOrder = Array.from(songMap.keys());
    let songsUpperBound = songsInOrder.length;
    let countDown = songsUpperBound - 1;
    for (let i = 0; i < songsUpperBound; i++) {
        randPicker = Math.floor(Math.random() * (countDown - 0 + 1)) + 0;
        let get_song_id = Array.from(copyOfSongMap.keys())[randPicker];
        let get_song_metadata = copyOfSongMap.get(get_song_id);
        randomizedSongMap.set(get_song_id, get_song_metadata);
        copyOfSongMap.delete(get_song_id);
        countDown -= 1;
    }
    let songsRandomOrder = Array.from(randomizedSongMap.keys());
    songMap = randomizedSongMap;
    console.log(songMap);
    shuffleOn = 1;
    playSongs();
}

function unshuffleSongs() {
    console.log('unshuffling...');
    console.log(songMap);
    let copyOfSongMap = new Map(songMap);
    let unshuffledSongMap = new Map();
    let songsUpperBound = Array.from(songMap.keys()).length;
    let unfoundUpperbound = songsUpperBound;
    for (let i = 0; i < songsUpperBound; i++) {
        for (let j = 0; j < unfoundUpperbound; j++) {
            let get_song_id = Array.from(copyOfSongMap.keys())[j];
            let get_song_metadata = copyOfSongMap.get(get_song_id);
            let song_order = get_song_metadata.get('song_order');
            if ( song_order === i) {
                unshuffledSongMap.set(get_song_id, get_song_metadata);
                copyOfSongMap.delete(get_song_id);
                unfoundUpperbound -= 1;
                continue;
            }
        }
    }
    songMap = unshuffledSongMap;
    console.log(songMap);
    shuffleOn = 0;
    updateCurrentState();
}

function setControlIcons() {
    console.log(`function setControlIcons`);
    for (const [song_id, songMetadataMap] of songMap) {
        let song_control_button_1_id = songMetadataMap.get("song_control_button_1_id");
        let song_control_button_1 = songMetadataMap.get("song_control_button_1");
        let song_control_id = songMetadataMap.get("song_control_id");
        let song_controls = songMetadataMap.get("song_controls");
        let song_audio = songMetadataMap.get("song_audio");
        let song_div = songMetadataMap.get("song_div");
        let song_title = songMetadataMap.get("song_title");
        if (song_control_button_1.classList.contains('play-button')) {
            if (!song_audio.paused && !song_audio.ended) {
                // change to pause button
                song_control_button_1.innerHTML = `
                    <img src="assets/images/icons/pause_button.svg" alt="Play">
                `;
                song_control_button_1.classList.remove('play-button');
                song_control_button_1.classList.add('pause-button');
                song_control_button_1.setAttribute('onclick', `pauseSong('${song_id}')`);
                song_controls.appendChild(song_control_button_1);
                songMetadataMap.set('song_control_button_1', song_control_button_1)
                songMap.set(song_id, songMetadataMap);
                console.log(`set '${song_title}' button to pause.`);
            } else {
                // do nothing
            }
        } else if (song_control_button_1.classList.contains('pause-button')) {
            if (!song_audio.paused && !song_audio.ended) {
                // do nothing
            } else {
                // change to play button
                song_control_button_1.id = song_control_button_1_id;
                song_control_button_1.innerHTML = `
                    <img src="assets/images/icons/play_button.svg" alt="Play">
                `;
                song_control_button_1.classList.remove('pause-button');
                song_control_button_1.classList.add('play-button');
                song_control_button_1.setAttribute('onclick', `playSong('${song_id}')`);
                song_controls.appendChild(song_control_button_1);
                songMetadataMap.set('song_control_button_1', song_control_button_1)
                songMap.set(song_id, songMetadataMap);
                console.log(`set '${song_title}' button to play.`);
            }
        }
    }
}