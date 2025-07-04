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
const volumeSvgElement = document.querySelector(".volume-container svg");
const volumeRangeElement = document.querySelector(".volume-range");
const cardContainerElement = document.querySelector(".card-container");
let link;
let songs = [];
let currentSong = new Audio();
let currentVolume;

const getSongs = async (folder) => {
  songs = [];
  songsElement.innerHTML = "";
  const library = await fetch(`${link}/${folder}`);
  const response = await library.text();
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
  currentSong.src = songs[0].href;
  songInfoElement.innerHTML = songs[0].innerHTML.replace(".mp3", "");
  songTimeElement.innerHTML = "00:00 / 00:00";
  songPlayPauseFunction();
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

const displayAlbums = async () => {
  const playlist = await fetch(`${link}`);
  const response = await playlist.text();
  const songsPage = document.createElement("div");
  songsPage.innerHTML = response;
  const songsPageAnchorTags = Array.from(songsPage.querySelectorAll("a"));
  songsPageAnchorTags.forEach(async (anchor) => {
    if (!anchor.innerHTML.startsWith(".")) {
      let folder = anchor.innerHTML.replace("/", "");
      const info = await fetch(`${link}/${folder}/info.json`);
      const infoResponse = await info.json();
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.folder = folder;
      const image = document.createElement("img");
      image.src = `${link}/${folder}/cover.jpg`;
      image.alt = "Playlist Image";
      const heading = document.createElement("h2");
      heading.innerHTML = infoResponse.title;
      const paragraph = document.createElement("p");
      paragraph.innerHTML = infoResponse.description;
      card.append(image, heading, paragraph);
      card.addEventListener("click", (e) => {
        getSongs(e.currentTarget.dataset.folder);
        document.querySelector(".left-container").style.left = 0;
      });
      cardContainerElement.append(card);
    }
  });
};

if (location.hostname === "127.0.0.1") {
  link = "http://127.0.0.1:3000/spotify-clone/songs";
} else if (location.hostname === "spotify-clone4.netlify.app") {
  link = "https://spotify-clone4.netlify.app/songs";
} else {
  link = "https://arpittheslayer.github.io/spotify-clone/songs";
}

displayAlbums();

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

volumeSvgElement.addEventListener("click", () => {
  if (volumeRangeElement.value !== "0") {
    volumeSvgElement.innerHTML = `<svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                color="#ffffff"
                fill="none"
                class="stroke-icon"
              >
                <path
                  d="M22 22L2 2"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M17 10C17.6296 10.7667 18 11.7054 18 12.7195C18 13.1635 17.929 13.593 17.7963 14"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M20 8C21.2508 9.22951 22 10.7952 22 12.5C22 13.9164 21.4829 15.2367 20.5906 16.348"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14 14C14 17.1452 14 19.5313 13.074 19.9227C12.1481 20.3141 11.0583 19.2021 8.8787 16.9781C7.7499 15.8264 7.106 15.5713 5.5 15.5713C4.3879 15.5713 3.02749 15.7187 2.33706 14.6643C2 14.1496 2 13.4331 2 12C2 10.5669 2 9.85038 2.33706 9.33566C3.02749 8.28131 4.3879 8.42869 5.5 8.42869C6.60725 8.42869 7.3569 8.43869 7.96 7.96M14 9.5C14 6.3548 14.026 4.46866 13.1 4.0773C12.3292 3.75147 11.5323 4.46765 10 6"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>`;
    currentVolume = volumeRangeElement.value;
    currentSong.volume = 0;
    volumeRangeElement.value = 0;
  } else if (volumeRangeElement.value === "0") {
    volumeSvgElement.innerHTML = `<svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                color="#ffffff"
                fill="none"
                class="stroke-icon"
              >
                <path
                  d="M14 14.8135V9.18646C14 6.04126 14 4.46866 13.0747 4.0773C12.1494 3.68593 11.0603 4.79793 8.88232 7.02192C7.75439 8.17365 7.11085 8.42869 5.50604 8.42869C4.10257 8.42869 3.40084 8.42869 2.89675 8.77262C1.85035 9.48655 2.00852 10.882 2.00852 12C2.00852 13.118 1.85035 14.5134 2.89675 15.2274C3.40084 15.5713 4.10257 15.5713 5.50604 15.5713C7.11085 15.5713 7.75439 15.8264 8.88232 16.9781C11.0603 19.2021 12.1494 20.3141 13.0747 19.9227C14 19.5313 14 17.9587 14 14.8135Z"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M17 9C17.6254 9.81968 18 10.8634 18 12C18 13.1366 17.6254 14.1803 17 15"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M20 7C21.2508 8.36613 22 10.1057 22 12C22 13.8943 21.2508 15.6339 20 17"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>`;
    currentSong.volume = currentVolume / 100;
    volumeRangeElement.value = currentVolume;
  }
});
