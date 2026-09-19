// ============================================================================
// NEURO MUSIC — CORE JAVASCRIPT ENGINE (Glass UI + Backend + Audio + PWA)
// ============================================================================

/* ==== 1. CURATED MUSIC DATA ==== */
const SONGS = [
  { id: 101, title: "Fade", artist: "Alan Walker", album: "NCS Releases", dur: 260, icon: "music", grad: "linear-gradient(135deg,#093028,#237a57)", ytId: "_F0xihSJ31Y", genre: "Electronic" },
  { id: 102, title: "On & On", artist: "Cartoon ft. Daniel Levi", album: "NCS Top Hits", dur: 208, icon: "headphones", grad: "linear-gradient(135deg,#2d1b69,#11998e)", ytId: "TI9w3sLjrqo", genre: "Electronic" },
  { id: 103, title: "The Spectre", artist: "Alan Walker", album: "NCS Top Hits", dur: 193, icon: "radio", grad: "linear-gradient(135deg,#1f1c2c,#928dab)", ytId: "lNM9HlEK4q4", genre: "Electronic" },
  { id: 104, title: "Heroes Tonight", artist: "Janji ft. Johnning", album: "NCS Top Hits", dur: 208, icon: "flame", grad: "linear-gradient(135deg,#833ab4,#fd1d1d)", ytId: "3nQNiWdeH2Q", genre: "Gaming" },
  { id: 105, title: "Lofi Beats & Chill", artist: "Lofi Girl & Lumosound", album: "Lofi Sessions", dur: 360, icon: "coffee", grad: "linear-gradient(135deg,#1a1a3e,#4a4aaa)", ytId: "kAw9xGI8vgk", genre: "Lofi" },
  { id: 106, title: "Alone", artist: "Marshmello", album: "Joytime", dur: 199, icon: "disc", grad: "linear-gradient(135deg,#20002c,#cbb4d4)", ytId: "OBs1Fb8adGQ", genre: "Electronic" },
  { id: 107, title: "Mortals", artist: "Warriyo ft. Laura Brehm", album: "NCS Top Hits", dur: 228, icon: "zap", grad: "linear-gradient(135deg,#000428,#004e92)", ytId: "BOMFt9OCsT0", genre: "Electronic" },
  { id: 108, title: "Fly Away", artist: "TheFatRat ft. Anjulie", album: "Warrior Songs", dur: 194, icon: "sparkles", grad: "linear-gradient(135deg,#360033,#0b8793)", ytId: "4nivniaycwQ", genre: "Gaming" },
  { id: 109, title: "Monody", artist: "TheFatRat ft. Laura Brehm", album: "Warrior Songs", dur: 290, icon: "sun", grad: "linear-gradient(135deg,#00b4db,#0083b0)", ytId: "E3Vyt0Vs_90", genre: "Gaming" },
  { id: 110, title: "Invincible", artist: "DEAF KEV", album: "NCS Top Hits", dur: 273, icon: "activity", grad: "linear-gradient(135deg,#eb3349,#f45c43)", ytId: "bSdnOdmDtvQ", genre: "Electronic" },
  { id: 111, title: "Beautiful Now", artist: "Zedd ft. Jon Bellion", album: "True Colors", dur: 218, icon: "music", grad: "linear-gradient(135deg,#8f7bff,#d9c9ff)", ytId: "67_ZA1zLlXA", genre: "Electronic" },
  { id: 112, title: "True Colors", artist: "Zedd", album: "True Colors", dur: 228, icon: "star", grad: "linear-gradient(135deg,#54e0c7,#8f7bff)", ytId: "OXfqC_K7hwg", genre: "Electronic" }
];

const ALBUMS = [
  { id: 1, name: "NCS Top Hits", artist: "NoCopyrightSounds", grad: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)", count: 5, songIds: [102, 103, 104, 107, 110] },
  { id: 2, name: "True Colors", artist: "Zedd", grad: "linear-gradient(135deg,#241c58,#140f30)", count: 2, songIds: [111, 112] },
  { id: 3, name: "Warrior Songs", artist: "TheFatRat", grad: "linear-gradient(135deg,#360033,#0b8793)", count: 2, songIds: [108, 109] },
  { id: 4, name: "Chill & Lofi Beats", artist: "Lofi Girl", grad: "linear-gradient(135deg,#093028,#237a57)", count: 1, songIds: [105] }
];

const ARTISTS = [
  { name: "Alan Walker", grad: "linear-gradient(135deg,#093028,#237a57)", query: "Alan Walker" },
  { name: "Marshmello", grad: "linear-gradient(135deg,#8f7bff,#d9c9ff)", query: "Marshmello" },
  { name: "Zedd", grad: "linear-gradient(135deg,#54e0c7,#8f7bff)", query: "Zedd" },
  { name: "TheFatRat", grad: "linear-gradient(135deg,#360033,#0b8793)", query: "TheFatRat" },
  { name: "Lofi Girl", grad: "linear-gradient(135deg,#1a1a3e,#4a4aaa)", query: "Lofi Girl" },
  { name: "Cartoon", grad: "linear-gradient(135deg,#2d1b69,#11998e)", query: "Cartoon" }
];

/* ==== 2. APPLICATION STATE ==== */
function _loadLiked() {
  try {
    const raw = localStorage.getItem('neuro_liked_songs');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [SONGS[0], SONGS[1], SONGS[10]];
}

function _loadPlaylists() {
  try {
    const raw = localStorage.getItem('neuro_pls');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [
    { id: "pl_focus", name: "Late Night Focus", desc: "Ambient & Electronic", tracks: [SONGS[4], SONGS[0], SONGS[1]] },
    { id: "pl_hype", name: "Gym & Energy", desc: "High Energy Beats", tracks: [SONGS[1], SONGS[2], SONGS[3], SONGS[7]] }
  ];
}

const S = {
  cur: null,
  idx: -1,
  queue: [...SONGS],
  playing: false,
  shuffle: false,
  repeat: false,
  mute: false,
  vol: 0.7,
  likedSongs: _loadLiked(),
  pls: _loadPlaylists(),
  activePlaylist: null,
  view: 'discover',
  searchDebounceTimer: null,
  progressTimer: null,
  pendingAddSong: null
};

function isLiked(id) {
  return S.likedSongs.some(s => s.id === id || (s.ytId && s.ytId === id));
}

/* ==== 3. PERSISTENT BACKGROUND AUDIO KEEP-ALIVE ==== */
const SILENT_AUDIO_WAV = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
let keepAliveEl = null;

function initKeepAliveAudio() {
  keepAliveEl = document.getElementById('keepAliveAudio');
  if (keepAliveEl) {
    keepAliveEl.src = SILENT_AUDIO_WAV;
    keepAliveEl.volume = 0.01;
  }
}

function startKeepAliveAudio() {
  if (keepAliveEl) {
    keepAliveEl.play().catch(() => {});
  }
}

function pauseKeepAliveAudio() {
  if (keepAliveEl) {
    keepAliveEl.pause();
  }
}

/* ==== 4. YOUTUBE IFRAME ENGINE ==== */
let ytPlayer = null;
let ytReady = false;

function loadYTAPI() {
  if (window.YT && window.YT.Player) {
    initYTPlayer();
    return;
  }
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

window.onYouTubeIframeAPIReady = function() {
  initYTPlayer();
};

function initYTPlayer() {
  try {
    const origin = window.location.origin;
    const playerVars = {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      playsinline: 1,
      enablejsapi: 1,
      rel: 0
    };
    if (origin && origin.startsWith('http')) {
      playerVars.origin = origin;
      playerVars.widget_referrer = origin;
    }

    ytPlayer = new YT.Player('yt-player', {
      height: '180',
      width: '240',
      playerVars: playerVars,
      events: {
        onReady: onYTReady,
        onStateChange: onYTStateChange,
        onError: onYTError
      }
    });
  } catch (err) {
    console.error("YT Player init failed:", err);
  }
}

function onYTReady() {
  ytReady = true;
  console.log("YouTube Player is ready");
  if (ytPlayer) {
    ytPlayer.setVolume(S.vol * 100);
    if (S.pendingSong) {
      const pSong = S.pendingSong;
      S.pendingSong = null;
      playSong(pSong);
    }
  }
}

function onYTStateChange(e) {
  if (e.data === YT.PlayerState.PLAYING) {
    S.playing = true;
    startKeepAliveAudio();
    updatePlayingUI(true);
    startProgress();
  } else if (e.data === YT.PlayerState.PAUSED) {
    S.playing = false;
    pauseKeepAliveAudio();
    updatePlayingUI(false);
    stopProgress();
  } else if (e.data === YT.PlayerState.ENDED) {
    if (S.repeat) {
      if (ytPlayer && ytPlayer.seekTo) {
        ytPlayer.seekTo(0, true);
        ytPlayer.playVideo();
      }
    } else {
      nextTrack();
    }
  }
}

function onYTError(e) {
  console.warn("YT Player error code:", e.data);
  // Error codes: 101 or 150 = embedding disabled, 100 = video removed
  showToast("Audio unavailable for this track, playing next...");
  setTimeout(() => nextTrack(), 1000);
}

/* ==== 5. PLAYBACK CONTROLS ==== */
function playSong(song, newQueue) {
  if (!song || !song.ytId) return;
  if (newQueue && newQueue.length) {
    S.queue = [...newQueue];
  }
  S.cur = song;
  S.idx = S.queue.findIndex(s => s.ytId === song.ytId);
  if (S.idx === -1) {
    S.queue.unshift(song);
    S.idx = 0;
  }

  S.playing = true;
  startKeepAliveAudio();
  updateMediaSession(song);
  renderPlayerDetails();
  renderMiniPlayer();
  renderQueueList();
  highlightActiveRows();
  updatePlayingUI(true);
  saveState();
  document.title = `${song.title} — Neuro Music`;

  if (ytPlayer && ytReady && ytPlayer.loadVideoById) {
    try {
      ytPlayer.loadVideoById({
        videoId: song.ytId,
        startSeconds: 0
      });
      if (S.mute) ytPlayer.mute(); else ytPlayer.unMute();
      ytPlayer.setVolume(S.vol * 100);
      ytPlayer.playVideo();
    } catch (e) {
      console.error("Error playing video:", e);
    }
  } else {
    S.pendingSong = song;
    loadYTAPI();
    showToast("Starting player...");
  }
}

function togglePlay() {
  if (!S.cur) {
    if (S.queue.length) playSong(S.queue[0]);
    return;
  }
  if (!ytPlayer || !ytReady) {
    playSong(S.cur);
    return;
  }

  const pState = ytPlayer.getPlayerState ? ytPlayer.getPlayerState() : -1;
  if (S.playing || pState === 1) { // 1 = PLAYING
    ytPlayer.pauseVideo();
    S.playing = false;
    pauseKeepAliveAudio();
    updatePlayingUI(false);
  } else {
    ytPlayer.playVideo();
    S.playing = true;
    startKeepAliveAudio();
    updatePlayingUI(true);
  }
}

function nextTrack() {
  if (!S.queue.length) return;
  if (S.shuffle) {
    S.idx = Math.floor(Math.random() * S.queue.length);
  } else {
    S.idx = (S.idx + 1) % S.queue.length;
  }
  playSong(S.queue[S.idx]);
}

function prevTrack() {
  if (!ytPlayer || !ytReady) return;
  if (ytPlayer.getCurrentTime && ytPlayer.getCurrentTime() > 3) {
    ytPlayer.seekTo(0);
    return;
  }
  if (!S.queue.length) return;
  S.idx = (S.idx - 1 + S.queue.length) % S.queue.length;
  playSong(S.queue[S.idx]);
}

function toggleShuffle() {
  S.shuffle = !S.shuffle;
  const btn = document.getElementById('playerShuffleBtn');
  if (btn) btn.classList.toggle('active', S.shuffle);
  showToast(S.shuffle ? "Shuffle On" : "Shuffle Off");
  saveState();
}

function toggleRepeat() {
  S.repeat = !S.repeat;
  const btn = document.getElementById('playerRepeatBtn');
  if (btn) btn.classList.toggle('active', S.repeat);
  showToast(S.repeat ? "Repeat On" : "Repeat Off");
  saveState();
}

function toggleMute() {
  if (!ytPlayer || !ytReady) return;
  S.mute = !S.mute;
  if (S.mute) ytPlayer.mute(); else ytPlayer.unMute();
  updateVolumeUI();
  saveState();
}

function setVolume(v) {
  S.vol = Math.max(0, Math.min(1, v));
  S.mute = false;
  if (ytPlayer && ytReady) {
    ytPlayer.unMute();
    ytPlayer.setVolume(S.vol * 100);
  }
  updateVolumeUI();
  saveState();
}

function seekTo(fraction) {
  if (!ytPlayer || !ytReady || !ytPlayer.getDuration) return;
  const dur = ytPlayer.getDuration();
  if (dur > 0) {
    const target = dur * Math.max(0, Math.min(1, fraction));
    ytPlayer.seekTo(target, true);
  }
}

/* ==== 6. PROGRESS TRACKING ==== */
function startProgress() {
  stopProgress();
  S.progressTimer = setInterval(updateProgressUI, 500);
}

function stopProgress() {
  if (S.progressTimer) {
    clearInterval(S.progressTimer);
    S.progressTimer = null;
  }
}

function updateProgressUI() {
  if (!ytPlayer || !ytReady || !ytPlayer.getCurrentTime) return;
  const curTime = ytPlayer.getCurrentTime() || 0;
  const dur = ytPlayer.getDuration() || (S.cur?.dur || 0);

  const pct = dur > 0 ? (curTime / dur) * 100 : 0;
  
  const fill = document.getElementById('playerScrubberFill');
  if (fill) fill.style.width = pct + '%';

  const miniFill = document.getElementById('miniProgressFill');
  if (miniFill) miniFill.style.width = pct + '%';

  const elapsedEl = document.getElementById('playerElapsed');
  const remEl = document.getElementById('playerRemaining');
  if (elapsedEl) elapsedEl.textContent = formatTime(curTime);
  if (remEl) remEl.textContent = '-' + formatTime(Math.max(0, dur - curTime));
}

function formatTime(secs) {
  secs = Math.floor(secs);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/* ==== 7. MEDIA SESSION ==== */
function updateMediaSession(song) {
  if (!('mediaSession' in navigator)) return;

  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: song.album || "Neuro Music",
      artwork: [
        { src: 'https://via.placeholder.com/192.png?text=Neuro+Music', sizes: '192x192', type: 'image/png' },
        { src: 'https://via.placeholder.com/512.png?text=Neuro+Music', sizes: '512x512', type: 'image/png' }
      ]
    });

    navigator.mediaSession.setActionHandler('play', () => togglePlay());
    navigator.mediaSession.setActionHandler('pause', () => togglePlay());
    navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
    navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime && ytPlayer && ytPlayer.seekTo) {
        ytPlayer.seekTo(details.seekTime, true);
      }
    });
  } catch (e) {
    console.warn("MediaSession error:", e);
  }
}

/* ==== 8. BACKEND SEARCH INTEGRATION ==== */
function initSearch() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClearBtn');
  const toggleBtn = document.getElementById('searchToggle');
  const panel = document.getElementById('searchPanel');

  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      input.focus();
    }
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.classList.remove('visible');
    renderSearchResults([]);
  });

  input.addEventListener('input', () => {
    const q = input.value.trim();
    clearBtn.classList.toggle('visible', q.length > 0);

    if (S.searchDebounceTimer) clearTimeout(S.searchDebounceTimer);
    if (!q) {
      renderSearchResults([]);
      return;
    }

    const container = document.getElementById('searchResults');
    if (container) container.innerHTML = '<div class="search-status">Searching YouTube Music...</div>';

    S.searchDebounceTimer = setTimeout(() => {
      performBackendSearch(q);
    }, 350);
  });
}

async function performBackendSearch(query) {
  const container = document.getElementById('searchResults');
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    const data = await res.json();
    renderSearchResults(data.results || []);
  } catch (err) {
    console.error('Backend search error:', err);
    if (container) {
      container.innerHTML = '<div class="search-status">Could not connect to YouTube Music search. Check server.</div>';
    }
  }
}

function renderSearchResults(results) {
  const container = document.getElementById('searchResults');
  if (!container) return;
  container.innerHTML = '';

  if (!results.length) {
    container.innerHTML = '<div class="search-status">No songs found. Try another search.</div>';
    return;
  }

  results.forEach(song => {
    const row = document.createElement('div');
    row.className = 'row';
    row.dataset.id = song.id;
    row.innerHTML = `
      <div class="cover" style="background:${song.grad || 'linear-gradient(135deg,#8f7bff,#d9c9ff)'}">
        <i data-lucide="music"></i>
      </div>
      <div class="meta">
        <div class="t">${escapeHtml(song.title)}</div>
        <div class="a">${escapeHtml(song.artist)} • ${formatTime(song.dur || 0)}</div>
      </div>
      <div class="action-btns">
        <button class="row-action-btn ${isLiked(song.id) ? 'liked' : ''}" title="Like" onclick="toggleLike(${JSON.stringify(song).replace(/"/g, '&quot;')}, event)">
          <i data-lucide="heart"></i>
        </button>
        <button class="row-action-btn" title="Add to Playlist" onclick="openAddToPlaylistModal(${JSON.stringify(song).replace(/"/g, '&quot;')}, event)">
          <i data-lucide="plus"></i>
        </button>
      </div>
    `;
    row.onclick = () => {
      playSong(song, [song, ...S.queue]);
    };
    container.appendChild(row);
  });

  lucide.createIcons();
}

/* ==== 9. UI RENDERING ==== */
function renderAll() {
  renderRecentRail();
  renderTrendingPanel();
  renderArtistRail();
  renderAlbumsRail();
  renderPlaylistsPanel();
  renderLikedBadge();
  renderPlayerDetails();
  renderMiniPlayer();
  renderQueueList();
}

function renderRecentRail() {
  const rail = document.getElementById('recentRail');
  if (!rail) return;
  rail.innerHTML = '';

  SONGS.slice(0, 6).forEach(song => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="art" style="background:${song.grad}">
        <i data-lucide="${song.icon || 'music'}"></i>
      </div>
      <div class="t">${escapeHtml(song.title)}</div>
      <div class="a">${escapeHtml(song.artist)}</div>
    `;
    card.onclick = () => playSong(song, SONGS);
    rail.appendChild(card);
  });
  lucide.createIcons();
}

function renderTrendingPanel() {
  const panel = document.getElementById('trendingPanel');
  if (!panel) return;
  panel.innerHTML = '';

  SONGS.slice(0, 5).forEach((song) => {
    const row = document.createElement('div');
    row.className = 'row' + (S.cur?.id === song.id ? ' playing' : '');
    row.dataset.id = song.id;
    row.innerHTML = `
      <div class="cover" style="background:${song.grad}">
        <i data-lucide="${song.icon || 'music'}"></i>
      </div>
      <div class="meta">
        <div class="t">${escapeHtml(song.title)}</div>
        <div class="a">${escapeHtml(song.artist)}</div>
      </div>
      <div class="action-btns">
        <button class="row-action-btn ${isLiked(song.id) ? 'liked' : ''}" title="Like" onclick="toggleLike(${JSON.stringify(song).replace(/"/g, '&quot;')}, event)">
          <i data-lucide="heart"></i>
        </button>
        <button class="row-action-btn" title="Add to Playlist" onclick="openAddToPlaylistModal(${JSON.stringify(song).replace(/"/g, '&quot;')}, event)">
          <i data-lucide="plus"></i>
        </button>
      </div>
      <div class="dur">${song.dur ? formatTime(song.dur) : 'Stream'}</div>
    `;
    row.onclick = (e) => {
      if (e.target.closest('.action-btns')) return;
      playSong(song, SONGS);
    };
    panel.appendChild(row);
  });
  lucide.createIcons();
}

function renderArtistRail() {
  const rail = document.getElementById('artistRail');
  if (!rail) return;
  rail.innerHTML = '';

  ARTISTS.forEach(art => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="art" style="background:${art.grad}">
        <i data-lucide="user"></i>
      </div>
      <div class="t">${escapeHtml(art.name)}</div>
    `;
    card.onclick = () => {
      document.getElementById('searchPanel').classList.add('open');
      const input = document.getElementById('searchInput');
      input.value = art.query;
      document.getElementById('searchClearBtn').classList.add('visible');
      performBackendSearch(art.query);
      input.focus();
    };
    rail.appendChild(card);
  });
  lucide.createIcons();
}

function renderAlbumsRail() {
  const rail = document.getElementById('albumsRail');
  if (!rail) return;
  rail.innerHTML = '';

  ALBUMS.forEach(alb => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="art" style="background:${alb.grad}">
        <i data-lucide="disc"></i>
      </div>
      <div class="t">${escapeHtml(alb.name)}</div>
      <div class="a">${escapeHtml(alb.artist)} • ${alb.count} tracks</div>
    `;
    card.onclick = () => {
      const albSongs = alb.songIds.map(id => SONGS.find(s => s.id === id)).filter(Boolean);
      if (albSongs.length) playSong(albSongs[0], albSongs);
      showToast(`Playing album: ${alb.name}`);
    };
    rail.appendChild(card);
  });
  lucide.createIcons();
}

function renderPlaylistsPanel() {
  const panel = document.getElementById('playlistsPanel');
  const sidebarList = document.getElementById('sidebarPlaylistsList');
  
  if (sidebarList) sidebarList.innerHTML = '';
  if (panel) panel.innerHTML = '';

  if (!S.pls.length) {
    if (panel) panel.innerHTML = '<div class="empty-state"><i data-lucide="folder-plus"></i><p>No playlists yet. Tap + New Playlist to create one!</p></div>';
    if (sidebarList) sidebarList.innerHTML = '<div style="padding:10px;font-size:12px;color:var(--text-2);">No playlists</div>';
    lucide.createIcons();
    return;
  }

  S.pls.forEach(pl => {
    // Main view row
    if (panel) {
      const row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = `
        <div class="cover" style="background:linear-gradient(135deg,#54e0c7,#5f7bd9)">
          <i data-lucide="list-music"></i>
        </div>
        <div class="meta">
          <div class="t">${escapeHtml(pl.name)}</div>
          <div class="a">${escapeHtml(pl.desc || (pl.tracks.length + ' tracks'))}</div>
        </div>
        <div class="count">${pl.tracks.length}</div>
      `;
      row.onclick = () => openPlaylistView(pl);
      panel.appendChild(row);
    }

    // Desktop sidebar playlist item
    if (sidebarList) {
      const sItem = document.createElement('div');
      sItem.className = 'sidebar-pl-item';
      sItem.innerHTML = `<i data-lucide="list-music" style="width:16px;height:16px;flex-shrink:0;"></i><span>${escapeHtml(pl.name)}</span>`;
      sItem.onclick = () => openPlaylistView(pl);
      sidebarList.appendChild(sItem);
    }
  });
  lucide.createIcons();
}

function renderLikedBadge() {
  const badge = document.getElementById('likedCountBadge');
  if (badge) badge.textContent = `${S.likedSongs.length} songs`;
  const sBadge = document.getElementById('sidebarLikedBadge');
  if (sBadge) sBadge.textContent = S.likedSongs.length;
}

/* ==== 10. PLAYER & MINI-PLAYER UI ==== */
function renderPlayerDetails() {
  const s = S.cur;
  if (!s) return;

  const titleEl = document.getElementById('playerTitle');
  const artistEl = document.getElementById('playerArtist');
  const artEl = document.getElementById('playerArt');
  const likeBtn = document.getElementById('playerLikeBtn');

  if (titleEl) titleEl.textContent = s.title;
  if (artistEl) artistEl.textContent = s.artist;
  if (artEl) {
    artEl.style.background = s.grad || 'linear-gradient(135deg,#2a2260,#171235)';
    artEl.innerHTML = `<i data-lucide="${s.icon || 'music'}"></i>`;
  }
  if (likeBtn) likeBtn.classList.toggle('liked', isLiked(s.id));
  lucide.createIcons();
}

function renderMiniPlayer() {
  const s = S.cur;
  const bar = document.getElementById('miniPlayerBar');
  if (!s || !bar) return;

  bar.classList.remove('hidden');
  const titleEl = document.getElementById('miniTitle');
  const artistEl = document.getElementById('miniArtist');
  const artEl = document.getElementById('miniArt');

  if (titleEl) titleEl.textContent = s.title;
  if (artistEl) artistEl.textContent = s.artist;
  if (artEl) {
    artEl.style.background = s.grad || 'linear-gradient(135deg,#5b3df0,#9db4ff)';
    artEl.innerHTML = `<i data-lucide="${s.icon || 'music'}"></i>`;
  }
  lucide.createIcons();
}

function renderQueueList() {
  const container = document.getElementById('playerQueueList');
  if (!container) return;
  container.innerHTML = '';

  S.queue.forEach((song) => {
    const isNow = S.cur && S.cur.id === song.id;
    const row = document.createElement('div');
    row.className = 'row' + (isNow ? ' playing' : '');
    row.innerHTML = `
      <div class="cover" style="background:${song.grad}">
        <i data-lucide="${song.icon || 'music'}"></i>
      </div>
      <div class="meta">
        <div class="t">${escapeHtml(song.title)}</div>
        <div class="a">${escapeHtml(song.artist)}</div>
      </div>
      ${isNow ? '<div class="eq"><span></span><span></span><span></span></div>' : `<div class="dur">${song.dur ? formatTime(song.dur) : 'Stream'}</div>`}
    `;
    row.onclick = () => playSong(song);
    container.appendChild(row);
  });
  lucide.createIcons();
}

function updatePlayingUI(playing) {
  const playerScreen = document.getElementById('playerScreen');
  if (playerScreen) playerScreen.classList.toggle('playing', playing);

  const mainPlayIcon = document.getElementById('playerMainPlayIcon');
  if (mainPlayIcon) {
    mainPlayIcon.setAttribute('data-lucide', playing ? 'pause' : 'play');
  }

  const miniPlayIcon = document.getElementById('miniPlayIcon');
  if (miniPlayIcon) {
    miniPlayIcon.setAttribute('data-lucide', playing ? 'pause' : 'play');
  }

  lucide.createIcons();
}

function updateVolumeUI() {
  const slider = document.getElementById('playerVolumeSlider');
  const icon = document.getElementById('volumeIcon');
  if (slider) slider.value = S.mute ? 0 : Math.round(S.vol * 100);
  if (icon) {
    icon.setAttribute('data-lucide', S.mute || S.vol === 0 ? 'volume-x' : (S.vol < 0.5 ? 'volume-1' : 'volume-2'));
  }
  lucide.createIcons();
}

function highlightActiveRows() {
  document.querySelectorAll('.row[data-id]').forEach(r => {
    r.classList.toggle('playing', parseInt(r.dataset.id) === S.cur?.id);
  });
}

/* ==== 11. SUBVIEWS: LIKED SONGS & PLAYLISTS ==== */
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + viewId);
  if (target) target.classList.add('active');
  S.view = viewId;

  if (viewId === 'discover' || viewId === 'library') {
    document.querySelectorAll('.mode').forEach(m => {
      m.classList.toggle('active', m.dataset.view === viewId);
    });
    document.querySelectorAll('.dock-item').forEach(d => {
      d.classList.toggle('active', d.dataset.target === viewId);
    });
  }

  // Update desktop sidebar active item
  document.querySelectorAll('.sidebar-item').forEach(item => {
    const isTarget = (viewId === 'discover' && item.id === 'sidebarHome') ||
                     (viewId === 'library' && item.id === 'sidebarLibrary') ||
                     (viewId === 'liked' && item.id === 'sidebarLiked');
    item.classList.toggle('active', isTarget);
  });
}

function openLikedView() {
  showView('liked');
  renderLikedList();
}

function renderLikedList() {
  const panel = document.getElementById('likedListPanel');
  const subtext = document.getElementById('likedSubtext');
  if (subtext) subtext.textContent = `${S.likedSongs.length} tracks`;
  if (!panel) return;
  panel.innerHTML = '';

  if (!S.likedSongs.length) {
    panel.innerHTML = '<div class="empty-state"><i data-lucide="heart"></i><p>No liked songs yet. Tap the heart on any song!</p></div>';
    lucide.createIcons();
    return;
  }

  S.likedSongs.forEach(song => {
    const isNow = S.cur && S.cur.id === song.id;
    const row = document.createElement('div');
    row.className = 'row' + (isNow ? ' playing' : '');
    row.innerHTML = `
      <div class="cover" style="background:${song.grad}">
        <i data-lucide="${song.icon || 'music'}"></i>
      </div>
      <div class="meta">
        <div class="t">${escapeHtml(song.title)}</div>
        <div class="a">${escapeHtml(song.artist)}</div>
      </div>
      <div class="action-btns">
        <button class="row-action-btn liked" title="Unlike" onclick="toggleLike(${JSON.stringify(song).replace(/"/g, '&quot;')}, event)">
          <i data-lucide="heart"></i>
        </button>
      </div>
      <div class="dur">${song.dur ? formatTime(song.dur) : 'Stream'}</div>
    `;
    row.onclick = (e) => {
      if (e.target.closest('.action-btns')) return;
      playSong(song, S.likedSongs);
    };
    panel.appendChild(row);
  });
  lucide.createIcons();
}

function openPlaylistView(pl) {
  S.activePlaylist = pl;
  showView('playlist');
  document.getElementById('playlistViewTitle').textContent = pl.name;
  document.getElementById('playlistViewSubtext').textContent = `${pl.tracks.length} tracks`;

  const panel = document.getElementById('playlistTracksPanel');
  if (!panel) return;
  panel.innerHTML = '';

  if (!pl.tracks.length) {
    panel.innerHTML = '<div class="empty-state"><i data-lucide="music-2"></i><p>This playlist is empty. Add songs from search or discover!</p></div>';
    lucide.createIcons();
    return;
  }

  pl.tracks.forEach((song, idx) => {
    const isNow = S.cur && S.cur.id === song.id;
    const row = document.createElement('div');
    row.className = 'row' + (isNow ? ' playing' : '');
    row.innerHTML = `
      <div class="cover" style="background:${song.grad}">
        <i data-lucide="${song.icon || 'music'}"></i>
      </div>
      <div class="meta">
        <div class="t">${escapeHtml(song.title)}</div>
        <div class="a">${escapeHtml(song.artist)}</div>
      </div>
      <div class="action-btns">
        <button class="row-action-btn" title="Remove" onclick="removeFromPlaylist('${pl.id}', ${idx}, event)">
          <i data-lucide="x"></i>
        </button>
      </div>
    `;
    row.onclick = (e) => {
      if (e.target.closest('.action-btns')) return;
      playSong(song, pl.tracks);
    };
    panel.appendChild(row);
  });
  lucide.createIcons();
}

function removeFromPlaylist(plId, index, e) {
  if (e) e.stopPropagation();
  const pl = S.pls.find(p => p.id === plId);
  if (!pl) return;
  pl.tracks.splice(index, 1);
  saveState();
  openPlaylistView(pl);
  showToast("Removed from playlist");
}

/* ==== 12. LIKES & PLAYLIST MANAGEMENT ==== */
function toggleLike(song, e) {
  if (e) e.stopPropagation();
  if (!song) song = S.cur;
  if (!song) return;

  const idx = S.likedSongs.findIndex(s => s.id === song.id || (s.ytId && s.ytId === song.ytId));
  if (idx >= 0) {
    S.likedSongs.splice(idx, 1);
    showToast("Removed from Liked Songs");
  } else {
    S.likedSongs.unshift(song);
    showToast("Added to Liked Songs");
  }

  saveState();
  renderLikedBadge();
  if (S.cur && (S.cur.id === song.id || S.cur.ytId === song.ytId)) {
    renderPlayerDetails();
  }
  if (S.view === 'liked') renderLikedList();
  highlightActiveRows();
  lucide.createIcons();
}

function openAddToPlaylistModal(song, e) {
  if (e) e.stopPropagation();
  S.pendingAddSong = song;
  const modal = document.getElementById('addToPlaylistModal');
  const choices = document.getElementById('addToPlaylistChoices');
  if (!choices) return;
  choices.innerHTML = '';

  if (!S.pls.length) {
    choices.innerHTML = '<div class="search-status">No playlists created yet.</div>';
  } else {
    S.pls.forEach(pl => {
      const item = document.createElement('div');
      item.className = 'row';
      item.innerHTML = `
        <div class="cover" style="background:linear-gradient(135deg,#54e0c7,#5f7bd9)">
          <i data-lucide="list-plus"></i>
        </div>
        <div class="meta">
          <div class="t">${escapeHtml(pl.name)}</div>
          <div class="a">${pl.tracks.length} tracks</div>
        </div>
      `;
      item.onclick = () => {
        pl.tracks.push(S.pendingAddSong);
        saveState();
        modal.classList.remove('open');
        showToast(`Added to ${pl.name}`);
        renderPlaylistsPanel();
      };
      choices.appendChild(item);
    });
  }

  modal.classList.add('open');
  lucide.createIcons();
}

function createNewPlaylist(name) {
  if (!name || !name.trim()) return;
  const pl = {
    id: 'pl_' + Date.now(),
    name: name.trim(),
    desc: 'Custom Playlist',
    tracks: []
  };
  S.pls.unshift(pl);
  saveState();
  renderPlaylistsPanel();
  showToast(`Created playlist "${pl.name}"`);
}

/* ==== 13. THEME TOGGLE (Light / Dark) ==== */
function initTheme() {
  const saved = localStorage.getItem('neuro_theme') || 'dark';
  applyTheme(saved);
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('neuro_theme', next);
  showToast(next === 'dark' ? 'Dark Theme' : 'Light Theme');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.querySelector('#themeToggleBtn i');
  if (icon) {
    icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    lucide.createIcons();
  }
}

/* ==== 14. STATE PERSISTENCE ==== */
const STATE_KEY = 'neuro_glass_state';

function saveState() {
  try {
    const snap = {
      ytId: S.cur?.ytId || null,
      trackId: S.cur?.id || null,
      title: S.cur?.title || null,
      artist: S.cur?.artist || null,
      grad: S.cur?.grad || null,
      dur: S.cur?.dur || 0,
      vol: S.vol,
      shuffle: S.shuffle,
      repeat: S.repeat
    };
    localStorage.setItem(STATE_KEY, JSON.stringify(snap));
    localStorage.setItem('neuro_liked_songs', JSON.stringify(S.likedSongs));
    localStorage.setItem('neuro_pls', JSON.stringify(S.pls));
  } catch (e) {}
}

function restoreState() {
  try {
    const snap = JSON.parse(localStorage.getItem(STATE_KEY));
    if (snap) {
      S.vol = snap.vol ?? 0.7;
      S.shuffle = snap.shuffle ?? false;
      S.repeat = snap.repeat ?? false;
      updateVolumeUI();

      if (snap.ytId) {
        S.cur = {
          id: snap.trackId,
          ytId: snap.ytId,
          title: snap.title,
          artist: snap.artist,
          grad: snap.grad,
          dur: snap.dur,
          icon: 'music'
        };
        renderPlayerDetails();
        renderMiniPlayer();
      }
    }
  } catch (e) {}
}

/* ==== 15. TOAST NOTIFICATIONS ==== */
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

/* ==== 16. EVENT LISTENERS & INITIALIZATION ==== */
function setupEvents() {
  document.getElementById('tabDiscover')?.addEventListener('click', () => showView('discover'));
  document.getElementById('tabLibrary')?.addEventListener('click', () => showView('library'));

  document.getElementById('likedHeroRow')?.addEventListener('click', () => openLikedView());
  document.getElementById('likedBackBtn')?.addEventListener('click', () => showView('library'));
  document.getElementById('playAllLikedBtn')?.addEventListener('click', () => {
    if (S.likedSongs.length) playSong(S.likedSongs[0], S.likedSongs);
    else showToast("No liked songs to play");
  });
  document.getElementById('shuffleLikedBtn')?.addEventListener('click', () => {
    if (S.likedSongs.length) {
      S.shuffle = true;
      document.getElementById('playerShuffleBtn')?.classList.add('active');
      const rand = Math.floor(Math.random() * S.likedSongs.length);
      playSong(S.likedSongs[rand], S.likedSongs);
    }
  });

  document.getElementById('playlistBackBtn')?.addEventListener('click', () => showView('library'));
  document.getElementById('playPlaylistBtn')?.addEventListener('click', () => {
    if (S.activePlaylist && S.activePlaylist.tracks.length) {
      playSong(S.activePlaylist.tracks[0], S.activePlaylist.tracks);
    } else {
      showToast("Playlist is empty");
    }
  });
  document.getElementById('deletePlaylistBtn')?.addEventListener('click', () => {
    if (S.activePlaylist && confirm(`Delete playlist "${S.activePlaylist.name}"?`)) {
      S.pls = S.pls.filter(p => p.id !== S.activePlaylist.id);
      saveState();
      showView('library');
      renderPlaylistsPanel();
      showToast("Playlist deleted");
    }
  });

  const createModal = document.getElementById('createPlaylistModal');
  const createInput = document.getElementById('newPlaylistInput');
  document.getElementById('createPlaylistBtn')?.addEventListener('click', () => {
    createInput.value = '';
    createModal.classList.add('open');
    createInput.focus();
  });
  document.getElementById('cancelCreatePlaylistBtn')?.addEventListener('click', () => createModal.classList.remove('open'));
  document.getElementById('confirmCreatePlaylistBtn')?.addEventListener('click', () => {
    createNewPlaylist(createInput.value);
    createModal.classList.remove('open');
  });
  createInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      createNewPlaylist(createInput.value);
      createModal.classList.remove('open');
    }
  });

  document.getElementById('cancelAddToPlaylistBtn')?.addEventListener('click', () => {
    document.getElementById('addToPlaylistModal').classList.remove('open');
  });

  // Bottom dock buttons (Mobile)
  document.getElementById('dockHome')?.addEventListener('click', () => showView('discover'));
  document.getElementById('dockSearch')?.addEventListener('click', () => {
    const panel = document.getElementById('searchPanel');
    panel.classList.add('open');
    document.getElementById('searchInput').focus();
  });
  document.getElementById('dockLibrary')?.addEventListener('click', () => showView('library'));
  document.getElementById('dockLiked')?.addEventListener('click', () => openLikedView());

  // Desktop sidebar navigation
  document.getElementById('sidebarHome')?.addEventListener('click', () => showView('discover'));
  document.getElementById('sidebarSearch')?.addEventListener('click', () => {
    const panel = document.getElementById('searchPanel');
    panel.classList.add('open');
    document.getElementById('searchInput').focus();
  });
  document.getElementById('sidebarLibrary')?.addEventListener('click', () => showView('library'));
  document.getElementById('sidebarLiked')?.addEventListener('click', () => openLikedView());
  document.getElementById('sidebarCreatePlBtn')?.addEventListener('click', () => {
    const createModal = document.getElementById('createPlaylistModal');
    const createInput = document.getElementById('newPlaylistInput');
    createInput.value = '';
    createModal.classList.add('open');
    createInput.focus();
  });
  document.getElementById('sidebarThemeBtn')?.addEventListener('click', toggleTheme);
  document.getElementById('sidebarUserChip')?.addEventListener('click', () => {
    const cur = localStorage.getItem('neuro_user') || 'Hemanth';
    const next = prompt("Enter your name:", cur);
    if (next && next.trim()) {
      localStorage.setItem('neuro_user', next.trim());
      updateGreeting();
      showToast(`Welcome, ${next.trim()}!`);
    }
  });

  document.getElementById('featuredPlayBtn')?.addEventListener('click', () => {
    playSong(SONGS[0], SONGS);
    showToast("Playing NCS Releases");
  });

  document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

  document.getElementById('userAvatar')?.addEventListener('click', () => {
    const cur = localStorage.getItem('neuro_user') || 'Hemanth';
    const next = prompt("Enter your name:", cur);
    if (next && next.trim()) {
      localStorage.setItem('neuro_user', next.trim());
      updateGreeting();
      showToast(`Welcome, ${next.trim()}!`);
    }
  });

  const playerScreen = document.getElementById('playerScreen');
  document.getElementById('miniPlayerBar')?.addEventListener('click', (e) => {
    if (e.target.closest('.mini-btn')) return;
    playerScreen.classList.add('open');
  });
  document.getElementById('collapsePlayerBtn')?.addEventListener('click', () => {
    playerScreen.classList.remove('open');
  });

  document.getElementById('playerPlayPauseBtn')?.addEventListener('click', togglePlay);
  document.getElementById('miniPlayPauseBtn')?.addEventListener('click', togglePlay);
  document.getElementById('playerNextBtn')?.addEventListener('click', nextTrack);
  document.getElementById('miniNextBtn')?.addEventListener('click', nextTrack);
  document.getElementById('playerPrevBtn')?.addEventListener('click', prevTrack);
  document.getElementById('playerShuffleBtn')?.addEventListener('click', toggleShuffle);
  document.getElementById('playerRepeatBtn')?.addEventListener('click', toggleRepeat);
  document.getElementById('playerLikeBtn')?.addEventListener('click', () => toggleLike(S.cur));

  const bar = document.getElementById('playerScrubberBar');
  bar?.addEventListener('click', (e) => {
    const rect = bar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    seekTo(pct);
  });

  document.getElementById('playerVolumeSlider')?.addEventListener('input', (e) => {
    setVolume(e.target.value / 100);
  });
  document.getElementById('playerMuteBtn')?.addEventListener('click', toggleMute);

  const lyricsScreen = document.getElementById('lyricsScreen');
  document.getElementById('openLyricsBtn')?.addEventListener('click', () => lyricsScreen.classList.add('open'));
  document.getElementById('closeLyricsBtn')?.addEventListener('click', () => lyricsScreen.classList.remove('open'));

  document.querySelectorAll('.genre-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.genre-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const g = pill.dataset.genre;
      if (g === 'All') {
        renderRecentRail();
      } else {
        const filtered = SONGS.filter(s => s.genre === g);
        const rail = document.getElementById('recentRail');
        if (rail) {
          rail.innerHTML = '';
          (filtered.length ? filtered : SONGS).forEach(song => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
              <div class="art" style="background:${song.grad}">
                <i data-lucide="${song.icon || 'music'}"></i>
              </div>
              <div class="t">${escapeHtml(song.title)}</div>
              <div class="a">${escapeHtml(song.artist)}</div>
            `;
            card.onclick = () => playSong(song, filtered);
            rail.appendChild(card);
          });
          lucide.createIcons();
        }
      }
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (S.playing) {
        startKeepAliveAudio();
        if (ytPlayer && ytPlayer.playVideo) {
          ytPlayer.playVideo();
        }
      }
    }
  });

  window.addEventListener('pagehide', () => {
    saveState();
  });
}

function updateGreeting() {
  const hr = new Date().getHours();
  let greet = "Good evening";
  if (hr >= 5 && hr < 12) greet = "Good morning";
  else if (hr >= 12 && hr < 17) greet = "Good afternoon";

  const user = localStorage.getItem('neuro_user') || 'Hemanth';
  const hiEl = document.getElementById('greetHi');
  const nameEl = document.getElementById('greetName');
  const avatarEl = document.getElementById('userAvatar');

  if (hiEl) hiEl.textContent = greet;
  if (nameEl) nameEl.textContent = user;
  if (avatarEl) avatarEl.textContent = user.charAt(0).toUpperCase();

  const sName = document.getElementById('sidebarName');
  const sAvatar = document.getElementById('sidebarAvatar');
  if (sName) sName.textContent = user;
  if (sAvatar) sAvatar.textContent = user.charAt(0).toUpperCase();
}

/* ==== 17. MAIN ENTRY POINT ==== */
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initKeepAliveAudio();
  updateGreeting();
  initSearch();
  setupEvents();
  renderAll();
  restoreState();
  loadYTAPI();
  lucide.createIcons();
});
