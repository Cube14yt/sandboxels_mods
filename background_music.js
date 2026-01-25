// Huge WIP
// Will be making an actual UI for this soon
function loadJsDelivr(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => {
        console.log('Loaded:', url);
        if (callback) callback();
    };
    script.onerror = () => {
        console.error('Failed to load:', url);
    };
    document.head.appendChild(script);
}

let currentMusic;
const PLAY = "\u25B6";
const PAUSE = "\u23F8";
/**
 * 
 * @param {string|File} userAudio 
 */
function setBackgroundMusic(userAudio) {
    let audioSrc;

    if (typeof userAudio === "string") {
        if (!isValidAudioUrl(userAudio)) {
            promptText("Invalid audio URL");
            return;
        }
        audioSrc = new URL(userAudio).href;
    } else if (userAudio instanceof File) {
        if (!userAudio.type.startsWith("audio/")) {
            promptText("Invalid audio file");
            return;
        }
        audioSrc = URL.createObjectURL(userAudio);
    } else {
        promptText("Invalid audio input");
        return;
    }

    if (currentMusic && currentMusic.src === audioSrc) return;

    if (currentMusic) {
        currentMusic.pause();
        currentMusic.remove();
    }

    const audio = document.createElement('audio');
    audio.src = audioSrc;
    audio.loop = true;
    audio.volume = 0.5;
    audio.id = "bgm";
    document.body.appendChild(audio);

    currentMusic = audio;

    // Only save if it's a URL, not a local file
    if (typeof userAudio === "string") {
        settings.bgMusic = audioSrc;
        saveSettings();
    }

    logMessage(`Now playing: ${audioSrc}`);
    return audio;
}


function isValidAudioUrl(inpurl) {
    try {
        const url = new URL(inpurl);
        if (!['http:', 'https:'].includes(url.protocol)) return false;
        return /\.(mp3|wav|ogg)$/i.test(url.pathname);
    } catch {
        return false;
    }
}


let music_setting;
let play;
let playing = false;
dependOn("betterSettings.js", () => {
    // @ts-ignore
    const settings_tab = new SettingsTab("background_music.js")
    // @ts-ignore
    music_setting = new Setting("Background Music", "bgm", settingType.TEXT, false)
    // @ts-ignore
    play = new Setting("Background Music", "bgm", settingType.TEXT, false)
    settings_tab.registerSettings(undefined, play)
    settings_tab.registerSettings(undefined, music_setting)
    // @ts-ignore
    settingsManager.registerTab(settings_tab)
})

keybinds["KeyK"] = () => {
    if (play) {
        document.getElementById('pauseButton').click()
    }
}

function addCss() {
    const CSS = `
    .songControl {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);

        display: flex;
        gap: 10px;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        
        padding: 10px;
        height: 20px;
        
        pointer-events: none;
        background-color: transparent;      /* see-through inner area */
        border: 2px solid white;            /* outline */
        box-shadow: 0 0 8px rgba(0,0,0,0.8);
    }

    `
    const style_div = document.createElement("style")
    style_div.innerHTML = CSS

    document.head.appendChild(style_div)
}

function createPauseButton() {
    const pauseButton = document.createElement("button");
    /**
     * @this {HTMLButtonElement}
     */
    pauseButton.onclick = function () {
        if (playing) {
            this.textContent = "▶"
            playing = !playing
            currentMusic?.pause();
        } else {
            this.textContent = "⏸"
            playing = !playing
            const url = music_setting.value;
            if (!isValidAudioUrl(url)) return;

            if (!currentMusic || currentMusic.src !== new URL(url).href) {
                setBackgroundMusic(url);
            }
            currentMusic?.play()
        }
    }
    pauseButton.textContent = PLAY
    pauseButton.style.pointerEvents = 'auto'
    pauseButton.style.border = '2px solid white'
    pauseButton.id = 'pauseButton'
    return pauseButton
}

function createResetButton() {
    const resetButton = document.createElement("button");
    /**
     * @this {HTMLButtonElement}
     */
    resetButton.onclick = function () {
        if (currentMusic) currentMusic.currentTime = 0
    }
    resetButton.textContent = "↺"
    resetButton.style.pointerEvents = "auto"
    resetButton.style.border = '2px solid white'
    resetButton.id = 'resetButton'
    return resetButton
}

function createSongInput() {
    const inputButton = document.createElement('button')
    inputButton.onclick = function () {
        promptChoose("How do you want to input your song?", ["URL", "File"], (choice) => {

        })
    }
}

function showSongUi() {
    let songDiv = document.getElementById("songUiParent");

    const canvas_div = document.getElementById("canvasDiv");
    if (!canvas_div) {
        console.log(canvas_div)
        requestAnimationFrame(showSongUi)
    };

    if (!songDiv) {

        songDiv = document.createElement("div");
        songDiv.classList.add("songControl", "fade");
        songDiv.id = "songUiParent";
        songDiv.appendChild(createPauseButton())
        songDiv.append(createResetButton())
        canvas_div.appendChild(songDiv);
    }
    console.log("UI loaded sucessfully")
}

addCss()
showSongUi()
