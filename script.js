//constants
const songMap = new Map()
const audioList = []

document.addEventListener('DOMContentLoaded', function() {
  loadSongs();
});

function loadSongs() {
    const container = document.getElementById('song-list');

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
                        .set('song_side', song_side);

            // create audio object
            const song_audio_id = `${song_title}-audio`;
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
            
        })
    })
    .catch(error => console.error('Error loading JSON data:', error));
    console.log(songMap)
}

function stopEverything() {
    for (let i = 0; i < audioList.length; i++) {
        audioList[i].pause();
    }
}

function allAudioStates() {
    for (let i = 0; i < audioList.length; i++) {
        console.log(`${audioList[i]}}`)
        console.log(`audioList[i].paused - ${audioList[i].paused}`)
        console.log(`audioList[i].ended - ${audioList[i].ended}`)
        console.log(`audioList[i].currentTime - ${audioList[i].currentTime}`)
    }
}

function playSong(song_id) {
    stopEverything();
    let song_audio = songMap.get(song_id).get("song_audio");
    song_audio.play();
    console.log(`Now playing '${songMap.get(song_id).get("song_title")}'`);
    setControlIcons();
}

function pauseSong(song_id) {
    let song_audio = songMap.get(song_id).get("song_audio");
    song_audio.pause();
    console.log(`Paused '${songMap.get(song_id).get("song_title")}'`);
    setControlIcons();
}

function setControlIcons() {
    for (const [song_id, songMetadataMap] of songMap) {
        let song_control_button_1_id = songMetadataMap.get("song_control_button_1_id");
        let song_control_button_1 = songMetadataMap.get("song_control_button_1");
        let song_control_id = songMetadataMap.get("song_control_id");
        let song_controls = songMetadataMap.get("song_controls");
        let song_audio = songMetadataMap.get("song_audio");
        let song_div = songMetadataMap.get("song_div");
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
            }
        }
    }
}