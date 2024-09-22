// Lấy tất cả các phần tử cần thiết
const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  mainAudio = wrapper.querySelector("#main-audio"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = wrapper.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  showMoreBtn = wrapper.querySelector("#more-music"),
  hideMusicBtn = wrapper.querySelector("#close"),
  ulTag = wrapper.querySelector(".music-list ul"); // Lấy ul chứa danh sách nhạc

let musicIndex = 1;

window.addEventListener("load", () => {
  loadMusic(musicIndex); // Load bài hát khi trang được tải
  playingSong(); // Kiểm tra nếu bài hát đang được phát
  populateMusicList(); // Hiển thị danh sách nhạc
});

// Hàm load bài hát
function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

// Hàm hiển thị danh sách nhạc
function populateMusicList() {
  ulTag.innerHTML = ""; // Xóa danh sách cũ nếu có
  for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                   <div class="row">
                     <span>${allMusic[i].name}</span>
                     <p>${allMusic[i].artist}</p>
                   </div>
                   <audio class="audio-duration" id="music-${i}" src="songs/${allMusic[i].src}.mp3"></audio>
                   <span class="audio-duration">3:40</span>
                 </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag); // Thêm thẻ li vào ul
  }
  playingSong(); // Cập nhật trạng thái bài hát
}

// Hàm play bài hát
function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

// Hàm pause bài hát
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

// Hàm next bài hát
function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}

// Hàm previous bài hát
function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}

// Xử lý sự kiện khi nhấn nút play/pause
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
});

// Xử lý sự kiện khi nhấn nút next
nextBtn.addEventListener("click", () => {
  nextMusic();
});

// Xử lý sự kiện khi nhấn nút previous
prevBtn.addEventListener("click", () => {
  prevMusic();
});

// Cập nhật thời gian bài hát và thanh tiến trình
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuration = wrapper.querySelector(".max-duration");

  mainAudio.addEventListener("loadeddata", () => {
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) totalSec = `0${totalSec}`;
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) currentSec = `0${currentSec}`;
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// Xử lý sự kiện khi click vào thanh tiến trình
progressArea.addEventListener("click", (e) => {
  let progressWidthVal = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffsetX / progressWidthVal) * songDuration;
  playMusic();
});

// Xử lý sự kiện khi kết thúc bài hát
mainAudio.addEventListener("ended", () => {
  nextMusic();
});

// Hiển thị danh sách nhạc
showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

// Đóng danh sách nhạc
hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click();
});

// Kiểm tra trạng thái phát nhạc
function playingSong() {
  const allLiTag = ulTag.querySelectorAll("li");

  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");

    if (allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    if (allLiTag[j].getAttribute("li-index") == musicIndex) {
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

// Hàm xử lý khi nhấn vào bài hát trong danh sách
function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; // Cập nhật musicIndex với index của bài hát được nhấn
  loadMusic(musicIndex); // Load bài hát mới
  playMusic(); // Phát bài hát mới
  playingSong(); // Cập nhật trạng thái bài hát
}
// Thêm biến volumeSlider cho thanh trượt âm lượng
const volumeSlider = document.querySelector("#volume-slider");

// Xử lý sự kiện thay đổi âm lượng
volumeSlider.addEventListener("input", () => {
  mainAudio.volume = volumeSlider.value; // Cập nhật âm lượng dựa trên giá trị thanh trượt
});

// Đặt âm lượng ban đầu
mainAudio.volume = 1; // Mặc định là 100% âm lượng

