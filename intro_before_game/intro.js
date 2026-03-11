document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");

  startBtn.addEventListener("click", () => {
    // 跳转到游戏界面
    window.location.href = "../main_game/mygame.html";
  });
});
