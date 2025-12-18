// assets/js/main.js

document.addEventListener("DOMContentLoaded", () => {
  setupCursor();
  setupGuestbook();
  setupSpotifyNowPlaying();
});

/* ---- CUSTOM CURSOR ---- */

function setupCursor() {
  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  document.body.appendChild(dot);

  let big = false;

  document.addEventListener("mousemove", (e) => {
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
  });

  const growTargets = ["A", "BUTTON"];
  document.addEventListener("mouseover", (e) => {
    if (growTargets.includes(e.target.tagName) || e.target.classList.contains("card")) {
      if (!big) {
        dot.classList.add("is-big");
        big = true;
      }
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (growTargets.includes(e.target.tagName) || e.target.classList.contains("card")) {
      dot.classList.remove("is-big");
      big = false;
    }
  });
}

/* ---- GUESTBOOK (front-end only) ---- */

function setupGuestbook() {
  const nameInput = document.getElementById("gbName");
  const msgInput = document.getElementById("gbMessage");
  const submit = document.getElementById("gbSubmit");
  const log = document.getElementById("guestbookLog");

  if (!submit || !log || !msgInput) return;

  submit.addEventListener("click", () => {
    const name = (nameInput?.value.trim() || "anon");
    const msg = msgInput.value.trim();
    if (!msg) return;

    const entry = document.createElement("div");
    entry.className = "guestbook-entry";
    entry.innerHTML = `<strong>${name}</strong>: ${msg}`;
    log.prepend(entry);
    msgInput.value = "";
  });
}

/* ---- SPOTIFY NOW PLAYING (front-end) ---- */

async function setupSpotifyNowPlaying() {
  const container = document.getElementById("spotify-now-playing");
  const trackEl = document.getElementById("spotifyTrack");
  const artistEl = document.getElementById("spotifyArtist");
  const extraEl = document.getElementById("spotifyExtra");

  if (!container || !trackEl || !artistEl) return;

  async function fetchNowPlaying() {
    try {
      const res = await fetch("/api/spotify/now-playing");
      if (!res.ok) {
        container.dataset.state = "idle";
        return;
      }
      const data = await res.json();

      if (!data || !data.is_playing) {
        container.dataset.state = "idle";
        trackEl.textContent = "silence (for now)";
        artistEl.textContent = "nothing currently playing on spotify";
        extraEl.textContent = "";
        return;
      }

      container.dataset.state = "playing";
      trackEl.textContent = data.track || "unknown track";
      artistEl.textContent = data.artist || "unknown artist";
      extraEl.textContent = data.context || "";
    } catch (e) {
      container.dataset.state = "idle";
    }
  }

  // initial + refresh every 30s
  fetchNowPlaying();
  setInterval(fetchNowPlaying, 30000);
}
