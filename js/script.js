const musicButton = document.getElementById("musicButton");
const musicControl = document.getElementById("musicControl");
const music = document.getElementById("backgroundMusic");
const pages = document.querySelectorAll(".page");
const nextButtons = document.querySelectorAll(".next-button");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");

const WORKER_URL = "https://midnight-note.alireza10-sh.workers.dev/";

music.loop = true;
music.preload = "auto";

function changePage(pageId) {
  pages.forEach((page) => page.classList.remove("active"));
  const targetPage = document.getElementById(pageId);
  if (!targetPage) {
    console.error("Page not found:", pageId);
    return;
  }
  targetPage.classList.add("active");
}

async function startMusic() {
  try {
    await music.play();
    musicControl.classList.add("visible");
    musicControl.textContent = "Ⅱ";
  } catch (error) {
    console.warn("Music could not start:", error);
    musicControl.classList.add("visible");
    musicControl.textContent = "♫";
  }
}

musicButton.addEventListener("click", async () => {
  musicButton.disabled = true;
  await startMusic();
  changePage("pageTwo");
});

musicControl.addEventListener("click", async () => {
  if (music.paused) {
    await startMusic();
  } else {
    music.pause();
    musicControl.textContent = "♫";
  }
});

nextButtons.forEach((button) => {
  button.addEventListener("click", () => changePage(button.dataset.next));
});

async function sendAnswer(answer) {
  changePage(answer === "yes" ? "pageEight" : "pageNine");
  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer, person: "saina" })
    });
    if (!response.ok) throw new Error(`Worker returned status ${response.status}`);
  } catch (error) {
    console.error(`Could not send ${answer.toUpperCase()} to Telegram:`, error);
  }
}

yesButton.addEventListener("click", () => sendAnswer("yes"));
noButton.addEventListener("click", () => sendAnswer("no"));

music.addEventListener("error", () => {
  console.error("Audio file could not be loaded. Check assets/music/lana.mp3");
});
