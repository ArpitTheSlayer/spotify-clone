const songsElement = document.querySelector(".songs");
const songInfoElement = document.querySelector(".song-info");
const songTimeElement = document.querySelector(".song-time");
const playButtonElement = document.querySelector(".play-button");
const circleElement = document.querySelector(".circle");
const seekbarElement = document.querySelector(".seek-bar");
const hamburgerIconElement = document.querySelector(".hamburger-icon");
const crossIconElement = document.querySelector(".cross-icon");
const previousButtonElement = document.querySelector(".previous-button");
const nextButtonElement = document.querySelector(".next-button");
const volumeRangeElement = document.querySelector(".volume-range");
const songs = [];
let currentSong = new Audio();

const getSongs = async () => {
  const link = await fetch("http://127.0.0.1:3000/spotify-clone/songs/");
  const response = await link.text();
  const songsPage = document.createElement("div");
  songsPage.innerHTML = response;
  const songsPageAnchorTags = Array.from(songsPage.querySelectorAll("a"));
  songsPageAnchorTags.forEach((anchorTag) => {
    if (anchorTag.href.endsWith(".mp3")) songs.push(anchorTag);
  });
  songs.forEach((song) => {
    const songElement = document.createElement("div");
    songElement.className = "song";
    songElement.innerHTML = `<svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="stroke-icon"
            >
              <circle
                cx="6.5"
                cy="18.5"
                r="3.5"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <circle
                cx="18"
                cy="16"
                r="3"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M10 18.5L10 7C10 6.07655 10 5.61483 10.2635 5.32794C10.5269 5.04106 11.0175 4.9992 11.9986 4.91549C16.022 4.57222 18.909 3.26005 20.3553 2.40978C20.6508 2.236 20.7986 2.14912 20.8993 2.20672C21 2.26432 21 2.4315 21 2.76587V16"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 10C15.8667 10 19.7778 7.66667 21 7"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>${song.innerHTML.replace(".mp3", "")}</span>
            <div class="play-buttons">
              <span>Play Now</span>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="stroke-icon"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <path
                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>`;
    const songPlayButton = songElement.querySelector(".play-buttons");
    songPlayButton.addEventListener("click", () => {
      currentSong.src = song.href;
      songPlayPauseFunction();
      currentSong.play();
      songInfoElement.innerHTML = song.innerHTML.replace(".mp3", "");
      songTimeElement.innerHTML = "00:00 / 00:00";
    });
    songsElement.append(songElement);
  });
  if (currentSong.src === "") {
    currentSong.src = songs[0].href;
    songInfoElement.innerHTML = songs[0].innerHTML.replace(".mp3", "");
    songTimeElement.innerHTML = "00:00 / 00:00";
  }
};

const songPlayPauseFunction = () => {
  if (currentSong.paused) {
    currentSong.play();
    playButtonElement.innerHTML = `<svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="stroke-icon"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path
            d="M9.5 9L9.5 15M14.5 9V15"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>`;
  } else {
    currentSong.pause();
    playButtonElement.innerHTML = `<svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="stroke-icon"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                fill="currentColor"
              />
            </svg>`;
  }
};

const secondsToDuration = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  if (isNaN(time)) {
    return "00:00";
  }
  if (minutes < 10) {
    minutes = minutes.toString().padStart(2, "0");
  }
  if (seconds < 10) {
    seconds = seconds.toString().padStart(2, "0");
  }
  return `${minutes}:${seconds}`;
};

const findSongIndex = () => {
  let songIndex;
  songs.forEach((song, index) => {
    if (currentSong.src === song.href) {
      songIndex = index;
    }
  });
  return songIndex;
};

getSongs();

playButtonElement.addEventListener("click", songPlayPauseFunction);

currentSong.addEventListener("timeupdate", () => {
  const currentTime = secondsToDuration(currentSong.currentTime);
  const currentDuration = secondsToDuration(currentSong.duration);
  songTimeElement.innerHTML = `${currentTime} / ${currentDuration}`;
  circleElement.style.left =
    (currentSong.currentTime / currentSong.duration) * 100 + "%";
});

seekbarElement.addEventListener("click", (e) => {
  const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  circleElement.style.left = percent + "%";
  currentSong.currentTime = (currentSong.duration * percent) / 100;
});

hamburgerIconElement.addEventListener("click", () => {
  document.querySelector(".left-container").style.left = 0;
});

crossIconElement.addEventListener("click", () => {
  document.querySelector(".left-container").style.left = "-100%";
});

previousButtonElement.addEventListener("click", () => {
  let songIndex = findSongIndex();

  if (songIndex > 0) {
    currentSong.src = songs[songIndex - 1].href;
    songInfoElement.innerHTML = songs[songIndex - 1].innerHTML.replace(
      ".mp3",
      ""
    );
    songPlayPauseFunction();
  }
});

nextButtonElement.addEventListener("click", () => {
  let songIndex = findSongIndex();

  if (songIndex < songs.length - 1) {
    currentSong.src = songs[songIndex + 1].href;
    songInfoElement.innerHTML = songs[songIndex + 1].innerHTML.replace(
      ".mp3",
      ""
    );
    songPlayPauseFunction();
  }
});

volumeRangeElement.addEventListener("change", (e) => {
  currentSong.volume = parseInt(e.target.value) / 100;
});
