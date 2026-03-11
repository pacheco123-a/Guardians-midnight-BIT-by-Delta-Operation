const menuButton = document.getElementById("menu-button");
const menuOverlay = document.getElementById("menu-overlay");
const closeBtn = document.getElementById("close-btn");
const exitBtn = document.getElementById("exit-btn");
const newgameBtn = document.getElementById("newgame-btn");
const volumeSlider = document.getElementById("volume");

// 切换菜单显示状态
function toggleMenu() {
  if (menuOverlay.classList.contains("hidden")) {
    menuOverlay.classList.remove("hidden");
    menu_paused = true;
  } else {
    menuOverlay.classList.add("hidden");
    menu_paused = false;
  }
}

if(menu_paused){

}

// 点击按钮切换菜单
menuButton.addEventListener("click", toggleMenu);

// 点击关闭按钮关闭菜单
closeBtn.addEventListener("click", toggleMenu);

// 按Esc键切换菜单
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    toggleMenu();
  }
});
exitBtn.addEventListener("click", () => {
  if (confirm("你确定要退出游戏吗？")){
      window.location.href = "../index.html";
  }
});

newgameBtn.addEventListener("click", () => {
  if (confirm("开启新游戏会清空当前进度，你确定要重新开始吗？")){
      localStorage.removeItem('mygameSave');
      window.location.href = "mygame.html";
  }
});

const muteBtn = document.getElementById("mute-btn");

// 记录静音状态
let isMuted = false;

// 点击按钮切换静音
muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;

  if (isMuted) {
    // 静音
    window.masterVolumeBeforeMute = masterVolume; // 保存之前的音量
    masterVolume = 0;
    muteBtn.textContent = "取消静音";
  } else {
    // 恢复
    masterVolume = window.masterVolumeBeforeMute || 0.5;
    muteBtn.textContent = "静音";
  }

  updateAllVolumes();
});
