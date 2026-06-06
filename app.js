// Showcase Practice App — v2
// Features: multi-showcase, metronome, per-phrase notes, count-overlay, loop, mirror.
(function () {
  const SC = window.SHOWCASES;
  const showcaseIds = Object.keys(SC);

  // ---- DOM ----
  const $ = (s) => document.querySelector(s);
  const player = $('#player');
  const playBtn = $('#playBtn'); const playIcon = $('#playIcon');
  const prevBtn = $('#prevBtn'); const nextBtn = $('#nextBtn'); const restartBtn = $('#restartBtn');
  const loopBtn = $('#loopBtn'); const countBtn = $('#countBtn'); const mirrorBtn = $('#mirrorBtn');
  const metroBtn = $('#metroBtn'); const metroVol = $('#metroVol');
  const speedPills = $('#speedPills');
  const phraseList = $('#phraseList');
  const phraseEyebrow = $('#phraseEyebrow');
  const phraseTitle = $('#phraseTitle');
  const phraseFocus = $('#phraseFocus');
  const statCounts = $('#statCounts'); const statLen = $('#statLen');
  const countOverlay = $('#countOverlay');
  const countNum = $('#countNum'); const countLabel = $('#countLabel');
  const listProgress = $('#listProgress');
  const passesEl = $('#passes'); const resetPassesBtn = $('#resetPasses');
  const noteBox = $('#noteBox'); const noteSaved = $('#noteSaved'); const clearNoteBtn = $('#clearNote');
  const footerNote = $('#footerNote');
  const brandSubtitle = $('#brandSubtitle');
  const showcaseSelect = $('#showcaseSelect');
  const fullBtn = $('#fullBtn'); const fullModal = $('#fullModal');
  const fullVideo = $('#fullVideo'); const closeFull = $('#closeFull');
  const fullModalTitle = $('#fullModalTitle');

  // SVG icons for play/pause
  const ICON_PLAY  = '<polygon points="6 4 20 12 6 20 6 4"/>';
  const ICON_PAUSE = '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';

  // ---- State (in-memory) ----
  const state = {
    showcaseId: window.DEFAULT_SHOWCASE,
    idx: 0,
    loop: true,
    showCounts: true,
    mirror: false,
    speed: 1,
    metroOn: false,
    metroVol: 0.35,
    // per-showcase memory
    notes: {},   // notes[showcaseId][phraseIdx] = string
    passes: {},  // passes[showcaseId][phraseIdx] = [bool,bool,bool,bool]
  };

  function currentShowcase() { return SC[state.showcaseId]; }
  function currentPhrase() { return currentShowcase().phrases[state.idx]; }
  function currentBeatSec() { return 60 / currentShowcase().bpm; }
  function currentCountsPerBar() { return currentShowcase().countsPerBar || 8; }

  function ensureShowcaseState(id) {
    const sc = SC[id];
    if (!state.notes[id]) state.notes[id] = sc.phrases.map(() => '');
    if (!state.passes[id]) state.passes[id] = sc.phrases.map(() => [false, false, false, false]);
  }

  // ---- Showcase selector ----
  function renderShowcaseSelect() {
    showcaseSelect.innerHTML = '';
    showcaseIds.forEach((id) => {
      const o = document.createElement('option');
      o.value = id; o.textContent = SC[id].title;
      if (id === state.showcaseId) o.selected = true;
      showcaseSelect.appendChild(o);
    });
  }
  showcaseSelect.addEventListener('change', (e) => {
    switchShowcase(e.target.value);
  });
  function switchShowcase(id) {
    if (!SC[id]) return;
    state.showcaseId = id;
    state.idx = 0;
    ensureShowcaseState(id);
    metronome.stop();
    renderList();
    loadPhrase(0, false);
    updateBrandAndFooter();
  }
  function updateBrandAndFooter() {
    const sc = currentShowcase();
    brandSubtitle.textContent = sc.subtitle;
    const beat = currentBeatSec();
    const cpb = currentCountsPerBar();
    footerNote.innerHTML = `Tempo ${sc.bpm.toFixed(1)} BPM · 1 beat ≈ ${beat.toFixed(2)}s · ${cpb}-count phrasing.<br/>Drill in chunks of 2, then chain.`;
    fullModalTitle.textContent = `${sc.title} — Full Run`;
  }

  // ---- Phrase list ----
  function renderList() {
    const sc = currentShowcase();
    phraseList.innerHTML = '';
    sc.phrases.forEach((p, i) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'phrase-item';
      btn.setAttribute('data-testid', `button-phrase-${p.i}`);
      btn.dataset.idx = i;
      btn.innerHTML = `
        <span class="phrase-num">${String(p.i).padStart(2, '0')}</span>
        <span class="phrase-info">
          <div class="phrase-name"><span class="phrase-name-text">${p.name}</span><span class="note-dot" hidden></span></div>
          <div class="phrase-time">${fmtTime(p.start)} – ${fmtTime(p.end)} · ${p.counts} cts</div>
        </span>
        <span class="phrase-check" aria-hidden="true"></span>
      `;
      btn.addEventListener('click', () => loadPhrase(i, true));
      li.appendChild(btn);
      phraseList.appendChild(li);
    });
    updateListActive();
    updateProgress();
  }

  function updateListActive() {
    const id = state.showcaseId;
    [...phraseList.children].forEach((li, i) => {
      const btn = li.firstElementChild;
      btn.classList.toggle('active', i === state.idx);
      const allChecked = state.passes[id][i].every(Boolean);
      btn.classList.toggle('complete', allChecked);
      const hasNote = state.notes[id][i].trim().length > 0;
      btn.querySelector('.note-dot').hidden = !hasNote;
    });
  }
  function updateProgress() {
    const id = state.showcaseId;
    const total = SC[id].phrases.length;
    const done = state.passes[id].filter((arr) => arr.every(Boolean)).length;
    listProgress.textContent = `${done} / ${total} complete`;
  }

  // ---- Phrase loader ----
  function loadPhrase(i, autoplay) {
    const sc = currentShowcase();
    if (i < 0) i = 0;
    if (i >= sc.phrases.length) i = sc.phrases.length - 1;
    state.idx = i;
    const p = sc.phrases[i];
    player.src = p.file;
    player.playbackRate = state.speed;
    player.load();
    phraseEyebrow.textContent = `PHRASE ${p.i} OF ${sc.phrases.length}`;
    phraseTitle.textContent = p.name;
    phraseFocus.textContent = p.focus;
    statCounts.textContent = p.counts;
    statLen.textContent = (p.end - p.start).toFixed(1) + 's';
    countLabel.textContent = currentCountsPerBar() === 6 ? '1-2-3' : 'count';
    updateListActive();
    // Refresh pass checkboxes and notes
    const id = state.showcaseId;
    [...passesEl.querySelectorAll('input')].forEach((cb, idx) => {
      cb.checked = state.passes[id][i][idx];
    });
    noteBox.value = state.notes[id][i];
    if (autoplay) {
      player.play().then(() => setPlayBtn(true)).catch(() => setPlayBtn(false));
    } else {
      setPlayBtn(false);
    }
    // metronome restarts on phrase change
    metronome.resync();
  }

  // ---- Player controls ----
  function setPlayBtn(playing) { playIcon.innerHTML = playing ? ICON_PAUSE : ICON_PLAY; }
  playBtn.addEventListener('click', () => { if (player.paused) player.play(); else player.pause(); });
  player.addEventListener('play', () => { setPlayBtn(true); metronome.resync(); });
  player.addEventListener('pause', () => setPlayBtn(false));
  player.addEventListener('ended', () => {
    if (state.loop) { player.currentTime = 0; player.play(); }
    else setPlayBtn(false);
  });
  prevBtn.addEventListener('click', () => loadPhrase(state.idx - 1, true));
  nextBtn.addEventListener('click', () => loadPhrase(state.idx + 1, true));
  restartBtn.addEventListener('click', () => { player.currentTime = 0; player.play(); });

  // Toggles
  function bindToggle(el, key, onLabel, offLabel, side) {
    el.addEventListener('click', () => {
      state[key] = !state[key];
      el.setAttribute('aria-pressed', String(state[key]));
      el.textContent = state[key] ? onLabel : offLabel;
      if (side) side(state[key]);
    });
  }
  bindToggle(loopBtn, 'loop', 'On', 'Off');
  bindToggle(countBtn, 'showCounts', 'On', 'Off', (v) => countOverlay.classList.toggle('hidden', !v));
  bindToggle(mirrorBtn, 'mirror', 'On', 'Off', (v) => player.classList.toggle('mirrored', v));
  bindToggle(metroBtn, 'metroOn', 'On', 'Off', (v) => { if (v) metronome.start(); else metronome.stop(); });

  metroVol.addEventListener('input', (e) => {
    state.metroVol = parseInt(e.target.value, 10) / 100;
    metronome.setVolume(state.metroVol);
  });

  // Speed
  speedPills.addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    state.speed = parseFloat(t.dataset.speed);
    player.playbackRate = state.speed;
    [...speedPills.children].forEach((b) => b.classList.toggle('active', b === t));
    metronome.resync();
  });

  // ---- Count overlay ----
  let lastBeat = -1;
  player.addEventListener('timeupdate', () => {
    if (!state.showCounts) return;
    const beatSec = currentBeatSec();
    const cpb = currentCountsPerBar();
    const beatPos = player.currentTime / beatSec;
    const beat = Math.floor(beatPos);
    const display = (beat % cpb) + 1;
    if (beat !== lastBeat) {
      lastBeat = beat;
      countNum.textContent = display;
      countOverlay.classList.add('beat');
      setTimeout(() => countOverlay.classList.remove('beat'), 110);
    }
  });
  player.addEventListener('seeked', () => { lastBeat = -1; });
  player.addEventListener('loadeddata', () => { lastBeat = -1; countNum.textContent = '1'; });

  // ---- Passes ----
  passesEl.addEventListener('change', (e) => {
    const cb = e.target;
    if (cb.tagName !== 'INPUT') return;
    const passIdx = parseInt(cb.dataset.pass, 10) - 1;
    state.passes[state.showcaseId][state.idx][passIdx] = cb.checked;
    updateListActive();
    updateProgress();
  });
  resetPassesBtn.addEventListener('click', () => {
    state.passes[state.showcaseId][state.idx] = [false, false, false, false];
    [...passesEl.querySelectorAll('input')].forEach((cb) => (cb.checked = false));
    updateListActive();
    updateProgress();
  });

  // ---- Notes ----
  let savedTimer;
  noteBox.addEventListener('input', () => {
    state.notes[state.showcaseId][state.idx] = noteBox.value;
    updateListActive();
    noteSaved.textContent = 'Saved';
    noteSaved.classList.add('show');
    clearTimeout(savedTimer);
    savedTimer = setTimeout(() => noteSaved.classList.remove('show'), 900);
  });
  clearNoteBtn.addEventListener('click', () => {
    state.notes[state.showcaseId][state.idx] = '';
    noteBox.value = '';
    updateListActive();
  });

  // ---- Full run modal ----
  fullBtn.addEventListener('click', () => {
    const sc = currentShowcase();
    fullVideo.src = sc.full;
    fullModalTitle.textContent = `${sc.title} — Full Run`;
    fullModal.hidden = false;
    fullVideo.play().catch(() => {});
  });
  closeFull.addEventListener('click', closeModal);
  fullModal.addEventListener('click', (e) => { if (e.target === fullModal) closeModal(); });
  function closeModal() { fullVideo.pause(); fullModal.hidden = true; }

  // ---- Keyboard shortcuts ----
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea, select')) return;
    if (e.code === 'Space') { e.preventDefault(); playBtn.click(); }
    else if (e.key === 'ArrowRight') nextBtn.click();
    else if (e.key === 'ArrowLeft') prevBtn.click();
    else if (e.key === 'r' || e.key === 'R') restartBtn.click();
    else if (e.key === 'm' || e.key === 'M') mirrorBtn.click();
    else if (e.key === 'l' || e.key === 'L') loopBtn.click();
    else if (e.key === 'k' || e.key === 'K') metroBtn.click();
  });

  // ---- Metronome (Web Audio API) ----
  const metronome = (function () {
    let ctx = null;
    let gainNode = null;
    let nextNoteTime = 0;     // when (in AudioContext time) the next click is due
    let currentBeat = 0;      // beat counter inside the phrase
    let schedulerId = null;
    const SCHEDULE_AHEAD = 0.1;     // seconds
    const LOOKAHEAD_MS = 25;

    function ensure() {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        ctx = new AC();
        gainNode = ctx.createGain();
        gainNode.gain.value = state.metroVol;
        gainNode.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
      return true;
    }
    function setVolume(v) {
      if (gainNode) gainNode.gain.setTargetAtTime(v, ctx.currentTime, 0.02);
    }
    // Click sound — short pitched envelope. Higher pitch on count 1 (downbeat).
    function click(time, isDownbeat) {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isDownbeat ? 1500 : 900, time);
      env.gain.setValueAtTime(0, time);
      env.gain.linearRampToValueAtTime(1, time + 0.001);
      env.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
      osc.connect(env); env.connect(gainNode);
      osc.start(time); osc.stop(time + 0.06);
    }
    function scheduler() {
      if (!ctx) return;
      const beatSec = currentBeatSec() / state.speed;  // metronome follows playback speed
      const cpb = currentCountsPerBar();
      while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
        const isDownbeat = (currentBeat % cpb) === 0;
        click(nextNoteTime, isDownbeat);
        nextNoteTime += beatSec;
        currentBeat++;
      }
    }
    function start() {
      if (!ensure()) return;
      stop(true);
      resync();
      schedulerId = setInterval(scheduler, LOOKAHEAD_MS);
    }
    function stop(silent) {
      if (schedulerId) { clearInterval(schedulerId); schedulerId = null; }
      currentBeat = 0;
    }
    function resync() {
      if (!ctx || !state.metroOn) return;
      // Align next click with the current playback position rounded UP to next beat.
      const beatSec = currentBeatSec() / state.speed;
      const pos = player.currentTime / (currentBeatSec()); // beats elapsed (in real time)
      const wholeBeats = Math.floor(pos);
      const beatsUntilNext = (wholeBeats + 1) - pos;
      nextNoteTime = ctx.currentTime + beatsUntilNext * beatSec;
      currentBeat = wholeBeats + 1; // the upcoming beat's index, 0-based
    }
    return { start, stop, setVolume, resync };
  })();

  // ---- Utils ----
  function fmtTime(s) {
    const m = Math.floor(s / 60);
    const r = (s - m * 60);
    return `${m}:${r.toFixed(1).padStart(4, '0')}`;
  }

  // ---- Init ----
  showcaseIds.forEach(ensureShowcaseState);
  renderShowcaseSelect();
  renderList();
  updateBrandAndFooter();
  loadPhrase(0, false);
})();
