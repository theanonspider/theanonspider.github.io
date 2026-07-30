/* ============================================================
   script.js — AnonSpider
   Toute la logique du site, du terminal d'accès
   au shell interactif.
   ============================================================ */

(function() {

  /* ==========================================================
     TERMINAL D'ACCÈS (splash)
     ========================================================== */
  const terminal = document.getElementById('access-terminal');
  const logContainer = document.getElementById('log-container');
  const passwordPrompt = document.getElementById('password-prompt');
  const passwordInput = document.getElementById('password-input');
  const passwordStatus = document.getElementById('password-status');
  const skipBtn = document.getElementById('skip-btn');

  const bootLogs = [
    { text: '[<span class="highlight">BOOT</span>] Loading AnonSpider core...', delay: 200 },
    { text: '[<span class="highlight">NET</span>] Establishing Tor circuit (0x7F3A)...', delay: 400 },
    { text: '[<span class="highlight">CRYPTO</span>] Verifying PGP keyring (4096-bit)...', delay: 600 },
    { text: '[<span class="highlight">MEM</span>] Scanning memory zones... <span class="alert">OK</span>', delay: 800 },
    { text: '[<span class="highlight">FIREWALL</span>] Bypassing IDS/IPS... <span class="alert">BYPASSED</span>', delay: 1000 },
    { text: '[<span class="highlight">STATUS</span>] <span style="color:var(--phosphor);">System ready. Awaiting authentication.</span>', delay: 1200 }
  ];

  let logIndex = 0;

  function displayNextLog() {
    if (logIndex >= bootLogs.length) {
      passwordPrompt.style.display = 'block';
      passwordInput.focus();
      return;
    }
    const log = bootLogs[logIndex];
    const div = document.createElement('div');
    div.className = 'log-line';
    div.innerHTML = log.text;
    logContainer.appendChild(div);
    logIndex++;
    setTimeout(displayNextLog, log.delay);
  }

  setTimeout(displayNextLog, 300);

  const SECRET_PASSWORDS = ['root', '0x7F3A'];

  function handlePassword() {
    const input = passwordInput.value.trim();
    if (input === '') {
      passwordStatus.textContent = '⛔ Enter a password.';
      passwordStatus.className = 'denied';
      return;
    }
    if (SECRET_PASSWORDS.includes(input.toLowerCase())) {
      passwordStatus.innerHTML = '✅ [GRANTED] — Root level — Welcome, Commander.';
      passwordStatus.className = 'granted';
    } else {
      passwordStatus.innerHTML = '✅ [ACCESS] — Standard user — Welcome.';
      passwordStatus.className = 'granted';
    }
    setTimeout(() => {
      terminal.classList.add('hidden');
      startClockAndCounters();
      setTimeout(() => {
        const termInput = document.getElementById('term-input');
        if (termInput) termInput.focus();
      }, 300);
    }, 600);
  }

  passwordInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handlePassword();
    }
  });

  skipBtn.addEventListener('click', function() {
    terminal.classList.add('hidden');
    passwordInput.value = '';
    startClockAndCounters();
    setTimeout(() => {
      const termInput = document.getElementById('term-input');
      if (termInput) termInput.focus();
    }, 300);
  });

  /* ==========================================================
     HORLOGE / UPTIME / VISITEURS
     ========================================================== */
  let startTime = Date.now();
  let clockInterval, uptimeInterval;

  function startClockAndCounters() {
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
    updateUptime();
    uptimeInterval = setInterval(updateUptime, 60000);
    const visitorsEl = document.getElementById('visitors');
    const randomVisitors = Math.floor(Math.random() * (9999 - 1337 + 1)) + 1337;
    visitorsEl.textContent = randomVisitors;
  }

  function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent =
      String(now.getUTCHours()).padStart(2, '0') + ':' +
      String(now.getUTCMinutes()).padStart(2, '0') + ':' +
      String(now.getUTCSeconds()).padStart(2, '0');
  }

  function updateUptime() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('uptime').textContent =
      String(Math.floor(elapsed / 3600)).padStart(2, '0') + 'h ' +
      String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0') + 'min';
  }

  document.querySelector('footer')?.addEventListener('dblclick', function() {
    alert('[ACCESS GRANTED] Root key: 0xDEADBEEFCAFEBABE');
  });

  console.log('%c[AnonSpider] %cTerminal unlocked.', 'color: #00ff41; font-size: 14px;', 'color: #8A94A0;');

  /* ==========================================================
     TERMINAL INTERACTIF (shell + easter eggs)
     ========================================================== */
  const termInput = document.getElementById('term-input');
  const termOutput = document.getElementById('term-output');

  const fortunes = [
    '"The quieter you become, the more you are able to hear." — Kali Linux',
    '"To hack is to explore the limits of the possible."',
    '"Privacy is not an option, it\'s a right."',
    '"The best way to predict the future is to create it." — Alan Kay',
    '"Hack the planet!" — Hackers (1995)'
  ];

  function addTermLine(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    termOutput.appendChild(div);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function processCommand(cmd) {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed === '') return;

    addTermLine(`<span class="prompt">$</span> <span class="response">${cmd}</span>`);

    switch (trimmed) {
      // commandes officielles (visibles dans help)
      case 'help':
        addTermLine(`<span class="response">Available commands: <span class="highlight-green">help, whoami, status, scan, ls, cat, contacts, clear</span></span>`);
        break;
      case 'whoami':
        addTermLine(`<span class="response">> anonspider — hacktivist — root</span>`);
        break;
      case 'status':
        const uptime = document.getElementById('uptime').textContent;
        addTermLine(`<span class="response">> System: <span class="highlight-green">ONLINE</span> — Uptime: ${uptime} — Connections: 0x7F3A</span>`);
        break;
      case 'scan':
        addTermLine(`<span class="response">> Scanning 192.168.1.0/24... <span class="highlight-green">3 hosts up</span> (192.168.1.1, 192.168.1.42, 192.168.1.1337)</span>`);
        break;
      case 'ls':
        addTermLine(`<span class="response">> LegalHarvest/  Recon-X/  GhostTunnel/  NexusScan/  ShadowProxy/  C2-Framework/</span>`);
        break;
      case 'cat legalharvest':
      case 'cat legalharvest/':
        addTermLine(`<span class="response">> Modular data harvesting implant. Encrypted C2, DNS/HTTPS exfiltration. FUD against major AVs.</span>`);
        break;
      case 'cat recon-x':
      case 'cat recon-x/':
        addTermLine(`<span class="response">> Automated OSINT reconnaissance toolkit for attack surface mapping.</span>`);
        break;
      case 'cat ghosttunnel':
      case 'cat ghosttunnel/':
        addTermLine(`<span class="response">> Pivoting and tunneling tool for air-gapped and heavily segmented environments.</span>`);
        break;
      case 'contacts':
        addTermLine(`<span class="response">> Email: <span class="highlight-green">anon.spider@proton.me</span> — PGP: <span class="highlight-red">0x7F3A 9B1C DEAD BEEF 1337</span></span>`);
        break;
      case 'clear':
        termOutput.innerHTML = '';
        break;

      // ==========================================================
      // EASTER EGGS (cachés, pas dans help)
      // ==========================================================
      case 'matrix':
        addTermLine(`<span class="response">> <span class="highlight-green">01100100 01100001 01110100 01100001 00100000 01100110 01110010 01100101 01100101 01100100 01101111 01101101</span></span>`);
        addTermLine(`<span class="response">> <span class="highlight-red">Wake up, Neo...</span></span>`);
        break;
      case 'sudo':
        addTermLine(`<span class="response">> <span class="highlight-red">Nice try, Commander. You already have root.</span></span>`);
        break;
      case 'coffee':
        addTermLine(`<span class="response">> Brewing... ☕ — Coffee loaded. System ready.</span>`);
        break;
      case '42':
        addTermLine(`<span class="response">> The answer to life, the universe, and everything.</span>`);
        break;
      case 'chucknorris':
        addTermLine(`<span class="response">> Chuck Norris doesn't hack. He fixes the vulnerability by looking at it.</span>`);
        break;
      case 'doge':
        addTermLine(`<span class="response">> Such hack. Very stealth. Wow.</span>`);
        break;
      case 'uname':
        addTermLine(`<span class="response">> AnonSpider — Linux 0x1337 — #HackThePlanet</span>`);
        break;
      case 'fortune':
        const randomIndex = Math.floor(Math.random() * fortunes.length);
        addTermLine(`<span class="response">> ${fortunes[randomIndex]}</span>`);
        break;

      default:
        addTermLine(`<span class="response">> Command not found: <span class="highlight-red">${cmd}</span>. Type <span class="highlight-green">help</span> for available commands.</span>`);
        break;
    }

    termInput.value = '';
    termInput.focus();
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  termInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      processCommand(termInput.value);
    }
  });

  document.querySelector('.interactive-terminal')?.addEventListener('click', function() {
    termInput.focus();
  });

  console.log('%c[Interactive Shell] %cReady — easter eggs included.', 'color: #00ff41;', 'color: #8A94A0;');

})();
