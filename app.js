/**
 * OTP Verification V4 — 7 Cubes (1 Main Purple Cube + 6 Surrounding Frosted Cubes)
 * Exact recreation of user's uploaded screenshot & video micro-interactions
 */

const CODE = '482913';

// DOM Elements
const topWindow = document.getElementById('topWindow');
const panel = document.getElementById('panel');
const cardTitle = document.getElementById('cardTitle');
const cardSubtitle = document.getElementById('cardSubtitle');
const btnChangeEmail = document.getElementById('btnChangeEmail');
const clusterAssembly = document.getElementById('clusterAssembly');
const satCubes = Array.from(document.querySelectorAll('.sat-cube'));

const inputs = Array.from(document.querySelectorAll('.otp-box'));
const otpRow = document.getElementById('otpRow');

const verifyingTxt = document.getElementById('verifyingTxt');
const errorTxt = document.getElementById('errorTxt');
const resendRow = document.getElementById('resendRow');
const resendSec = document.getElementById('resendSec');
const btnResend = document.getElementById('btnResend');
const smsVerified = document.getElementById('smsVerified');

// Pills & Replay
const btnReplay = document.getElementById('btnReplay');
const pillWrong = document.getElementById('pillWrong');
const pillAutofill = document.getElementById('pillAutofill');
const pillCorrect = document.getElementById('pillCorrect');

// Credentials Modal
const loginModal = document.getElementById('loginModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const modalLoginForm = document.getElementById('modalLoginForm');
const modalUserId = document.getElementById('modalUserId');

let isVerifying = false;
let countdownTimer = null;
let currentSeconds = 28;

// ==========================================
// COUNTDOWN TIMER (28s as in screenshot)
// ==========================================
function startCountdown(sec = 28) {
  if (countdownTimer) clearInterval(countdownTimer);
  currentSeconds = sec;
  resendSec.textContent = `${currentSeconds}s`;

  countdownTimer = setInterval(() => {
    currentSeconds--;
    if (currentSeconds > 0) {
      resendSec.textContent = `${currentSeconds}s`;
    } else {
      clearInterval(countdownTimer);
      resendSec.textContent = 'now';
    }
  }, 1000);
}

// Active Dot Indicator in boxes
function updateActiveDot(activeIndex) {
  inputs.forEach((box, i) => {
    if (i === activeIndex && !box.value) {
      box.classList.add('active-dot');
    } else {
      box.classList.remove('active-dot');
    }
  });
}

function getEnteredCode() {
  return inputs.map(b => b.value.trim()).join('');
}

function focusBox(index) {
  if (index >= 0 && index < inputs.length) {
    inputs[index].focus();
    inputs[index].select();
    updateActiveDot(index);
  }
}

// ==========================================
// 3D SATELLITE CUBE DIGIT SYNCHRONIZATION
// (Each entered digit maps directly to its corresponding cube)
// ==========================================
function setCubeDigit(index, digit) {
  const cube = satCubes.find(c => c.dataset.idx === String(index)) || satCubes[index];
  if (!cube) return;

  const faces = cube.querySelectorAll('.sface');
  if (digit !== null && digit !== undefined && digit !== '') {
    cube.classList.add('filled');
    faces.forEach(face => {
      face.textContent = digit;
    });
    // Trigger smooth 3D spring pop animation
    cube.classList.remove('pop');
    void cube.offsetWidth;
    cube.classList.add('pop');
    setTimeout(() => cube.classList.remove('pop'), 280);
  } else {
    cube.classList.remove('filled', 'pop');
    faces.forEach(face => {
      face.textContent = '';
    });
  }
}

function clearAllCubeDigits() {
  satCubes.forEach((_, idx) => {
    setCubeDigit(idx, '');
  });
}

// Orbit Animation for 7 Cubes
function startOrbit() {
  clusterAssembly.classList.add('orbiting');
}

function stopOrbit() {
  clusterAssembly.classList.remove('orbiting');
}

// ==========================================
// VERIFICATION STATES
// ==========================================
function success() {
  stopOrbit();
  panel.classList.remove('error', 'shake');
  panel.classList.add('verified', 'slots-hidden');
  document.body.classList.add('verified');

  cardTitle.textContent = 'Verification complete';
  cardSubtitle.innerHTML = "Thanks for confirming it's you.";

  verifyingTxt.style.display = 'none';
  if (errorTxt) errorTxt.style.display = 'none';
  resendRow.style.display = 'none';
  smsVerified.style.display = 'flex';

  // Update pills
  pillWrong.classList.remove('active');
  pillAutofill.classList.remove('active');
  pillCorrect.classList.add('active');

  inputs.forEach(b => {
    b.blur();
    b.classList.remove('active-dot');
  });
  isVerifying = false;
}

function fail() {
  stopOrbit();
  panel.classList.remove('verified');
  document.body.classList.remove('verified');
  panel.classList.add('error', 'shake');

  verifyingTxt.style.display = 'none';
  resendRow.style.display = 'none';
  if (errorTxt) errorTxt.style.display = 'block';

  setTimeout(() => {
    panel.classList.remove('shake');
  }, 450);

  setTimeout(() => {
    panel.classList.remove('error', 'slots-hidden');
    if (errorTxt) errorTxt.style.display = 'none';
    resetInputs();
    cardTitle.textContent = 'Verify your account';
    cardSubtitle.innerHTML = `Enter the 6-digit code we sent to <button type="button" class="email-btn" id="btnChangeEmail">${modalUserId.value.trim() || 'you@example.com'}</button>`;
    attachEmailListener();
    focusBox(0);
    isVerifying = false;
  }, 1500);
}

function run() {
  if (isVerifying) return;
  isVerifying = true;

  // Immediately hide OTP slots on enter so ONLY the 3D cubes show!
  panel.classList.add('slots-hidden');

  resendRow.style.display = 'none';
  if (errorTxt) errorTxt.style.display = 'none';
  verifyingTxt.style.display = 'block';

  startOrbit();

  setTimeout(() => {
    if (getEnteredCode() === CODE) {
      success();
    } else {
      fail();
    }
  }, 850);
}

function resetInputs() {
  inputs.forEach(b => {
    b.value = '';
    b.classList.remove('filled', 'active-dot');
  });
  clearAllCubeDigits();
  panel.classList.remove('slots-hidden');
  verifyingTxt.style.display = 'none';
  if (errorTxt) errorTxt.style.display = 'none';
  resendRow.style.display = 'flex';
  updateActiveDot(0);
}

// Typewriter Simulator for Scenario Pills
function typeCode(digits, onComplete) {
  panel.classList.remove('verified', 'error', 'shake', 'slots-hidden');
  document.body.classList.remove('verified');
  cardTitle.textContent = 'Verify your account';
  cardSubtitle.innerHTML = `Enter the 6-digit code we sent to <button type="button" class="email-btn" id="btnChangeEmail">${modalUserId.value.trim() || 'you@example.com'}</button>`;
  attachEmailListener();
  resetInputs();
  clearAllCubeDigits();

  let idx = 0;
  const interval = setInterval(() => {
    if (idx < digits.length) {
      inputs[idx].value = digits[idx];
      inputs[idx].classList.add('filled');
      inputs[idx].classList.remove('active-dot');
      setCubeDigit(idx, digits[idx]); // Real-time fill corresponding cube!
      idx++;
      if (idx < digits.length) {
        inputs[idx].classList.add('active-dot');
      } else {
        // As soon as all 6 digits are typed, hide slots immediately!
        panel.classList.add('slots-hidden');
      }
    } else {
      clearInterval(interval);
      if (onComplete) onComplete();
    }
  }, 110);
}

// ==========================================
// SCENARIO PILLS (Exact from Screenshot)
// ==========================================
// 1. Wrong code · shake & red
pillWrong.addEventListener('click', () => {
  pillWrong.classList.add('active');
  pillAutofill.classList.remove('active');
  pillCorrect.classList.remove('active');

  typeCode(['3', '9', '1', '0', '5', '2'], () => {
    run();
  });
});

// 2. Autofill from SMS
pillAutofill.addEventListener('click', () => {
  pillAutofill.classList.add('active');
  pillWrong.classList.remove('active');
  pillCorrect.classList.remove('active');

  typeCode(['4', '8', '2', '9', '1', '3'], () => {
    run();
  });
});

// 3. Correct code · Verified
pillCorrect.addEventListener('click', () => {
  typeCode(['4', '8', '2', '9', '1', '3'], () => {
    run();
  });
});

// Replay button
btnReplay.addEventListener('click', () => {
  resetInputs();
  clearAllCubeDigits();
  panel.classList.remove('verified', 'error', 'slots-hidden');
  document.body.classList.remove('verified');
  cardTitle.textContent = 'Verify your account';
  cardSubtitle.innerHTML = `Enter the 6-digit code we sent to <button type="button" class="email-btn" id="btnChangeEmail">${modalUserId.value.trim() || 'you@example.com'}</button>`;
  attachEmailListener();
  smsVerified.style.display = 'none';
  resendRow.style.display = 'flex';
  pillAutofill.click();
});

btnResend.addEventListener('click', () => {
  resetInputs();
  startCountdown(28);
  focusBox(0);
});

// ==========================================
// INPUT HANDLING (Keyboard & Paste)
// ==========================================
inputs.forEach((box, i) => {
  box.oninput = () => {
    box.value = box.value.replace(/\D/g, '');

    if (box.value) {
      box.classList.add('filled');
      box.classList.remove('active-dot');
      setCubeDigit(i, box.value); // Real-time fill corresponding cube!
      focusBox(i + 1);
    } else {
      box.classList.remove('filled');
      setCubeDigit(i, ''); // Clear corresponding cube!
      updateActiveDot(i);
    }

    if (getEnteredCode().length === 6) {
      panel.classList.add('slots-hidden');
      run();
    }
  };

  box.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
      if (!box.value && i > 0) {
        inputs[i - 1].value = '';
        inputs[i - 1].classList.remove('filled');
        setCubeDigit(i - 1, ''); // Clear previous cube!
        focusBox(i - 1);
      } else {
        box.value = '';
        box.classList.remove('filled');
        setCubeDigit(i, ''); // Clear current cube!
        updateActiveDot(i);
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      focusBox(i - 1);
    } else if (e.key === 'ArrowRight' && i < inputs.length - 1) {
      focusBox(i + 1);
    }
  });

  box.addEventListener('focus', () => {
    box.select();
    updateActiveDot(i);
  });
});

otpRow.onpaste = (e) => {
  e.preventDefault();
  const pasteData = (e.clipboardData || window.clipboardData).getData('text');
  const digits = pasteData.replace(/\D/g, '').slice(0, 6).split('');

  if (digits.length === 0) return;

  typeCode(digits, () => {
    if (digits.length === 6) run();
  });
};

// ==========================================
// USER CREDENTIALS & VIEW SWITCHING
// ==========================================
const tabCredentials = document.getElementById('tabCredentials');
const tabOtp = document.getElementById('tabOtp');
const credentialsCard = document.getElementById('credentialsCard');
const otpCard = document.getElementById('panel');
const credentialsForm = document.getElementById('credentialsForm');
const inputUserId = document.getElementById('inputUserId');
const inputPassword = document.getElementById('inputPassword');
const btnTogglePw = document.getElementById('btnTogglePw');
const btnDirectOtp = document.getElementById('btnDirectOtp');
const btnBackToLogin = document.getElementById('btnBackToLogin');

function showCredentialsView() {
  if (!credentialsCard || !otpCard) return;
  credentialsCard.style.display = 'flex';
  otpCard.style.display = 'none';
  if (tabCredentials) tabCredentials.classList.add('active');
  if (tabOtp) tabOtp.classList.remove('active');
  if (inputUserId) inputUserId.focus();
}

function showOtpView() {
  if (!credentialsCard || !otpCard) return;
  credentialsCard.style.display = 'none';
  otpCard.style.display = 'flex';
  if (tabOtp) tabOtp.classList.add('active');
  if (tabCredentials) tabCredentials.classList.remove('active');
  focusBox(0);
}

if (tabCredentials) tabCredentials.addEventListener('click', showCredentialsView);
if (tabOtp) tabOtp.addEventListener('click', showOtpView);
if (btnBackToLogin) btnBackToLogin.addEventListener('click', showCredentialsView);
if (btnDirectOtp) btnDirectOtp.addEventListener('click', showOtpView);

// Submit User Credentials -> Advance to 2FA OTP
if (credentialsForm) {
  credentialsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = (inputUserId ? inputUserId.value.trim() : '') || 'you@example.com';
    const btn = document.getElementById('btnChangeEmail');
    if (btn) btn.textContent = email;
    showOtpView();
    resetInputs();
  });
}

// Show/Hide Password Toggle
if (btnTogglePw && inputPassword) {
  btnTogglePw.addEventListener('click', () => {
    const isPw = inputPassword.type === 'password';
    inputPassword.type = isPw ? 'text' : 'password';
    btnTogglePw.style.color = isPw ? '#8b5cf6' : '#94a3b8';
  });
}

function attachEmailListener() {
  const btn = document.getElementById('btnChangeEmail');
  if (btn) {
    btn.onclick = () => {
      showCredentialsView();
    };
  }
}
attachEmailListener();

if (btnCloseModal) {
  btnCloseModal.onclick = () => {
    if (loginModal) loginModal.classList.remove('open');
  };
}

if (modalLoginForm) {
  modalLoginForm.onsubmit = (e) => {
    e.preventDefault();
    const email = modalUserId.value.trim() || 'you@example.com';
    const btn = document.getElementById('btnChangeEmail');
    if (btn) btn.textContent = email;
    if (inputUserId) inputUserId.value = email;
    if (loginModal) loginModal.classList.remove('open');
    resetInputs();
    focusBox(0);
  };
}

// ==========================================
// BUTTER-SMOOTH 3D PARALLAX TILT ON MOUSEMOVE
// ==========================================
function initParallax() {
  const stage = document.querySelector('.live-stage-wrapper');
  if (!panel || !stage) return;

  let targetTiltX = 0, targetTiltY = 0;
  let currentTiltX = 0, currentTiltY = 0;
  let isHovered = false;

  stage.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  stage.addEventListener('mousemove', (e) => {
    if (panel.classList.contains('shake')) return;
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    targetTiltY = x * 7; // +/- 3.5 deg
    targetTiltX = -y * 7;
  });

  stage.addEventListener('mouseleave', () => {
    isHovered = false;
    targetTiltX = 0;
    targetTiltY = 0;
  });

  function update() {
    if (!panel.classList.contains('shake')) {
      // Smooth lerp damping
      currentTiltX += (targetTiltX - currentTiltX) * 0.08;
      currentTiltY += (targetTiltY - currentTiltY) * 0.08;

      if (Math.abs(currentTiltX) > 0.02 || Math.abs(currentTiltY) > 0.02 || isHovered) {
        panel.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
      } else {
        panel.style.transform = '';
      }
    }

    requestAnimationFrame(update);
  }

  update();
}

// ==========================================
// CRISP HIGH-DPI STARFIELD CANVAS
// ==========================================
function initStars() {
  const canvas = document.getElementById('starsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let width = 0;
  let height = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  resize();
  window.addEventListener('resize', resize);

  const stars = [];
  const STAR_COUNT = 90;

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.75 + 0.2,
      speed: Math.random() * 0.25 + 0.08,
      twinkle: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(s => {
      s.alpha += s.twinkle;
      if (s.alpha > 0.85) {
        s.alpha = 0.85;
        s.twinkle = -Math.abs(s.twinkle);
      } else if (s.alpha < 0.15) {
        s.alpha = 0.15;
        s.twinkle = Math.abs(s.twinkle);
      }

      s.y -= s.speed;
      if (s.y < 0) {
        s.y = height;
        s.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, s.alpha))})`;
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

// Initial Load State: Match exact screenshot & URL routing
window.addEventListener('DOMContentLoaded', () => {
  initStars();
  initParallax();
  startCountdown(28);

  // Check if email was saved from login.html or URL query
  const urlParams = new URLSearchParams(window.location.search);
  const paramEmail = urlParams.get('email');
  const storedEmail = localStorage.getItem('user_email');
  const finalEmail = paramEmail || storedEmail;
  if (finalEmail) {
    if (btnChangeEmail) btnChangeEmail.textContent = finalEmail;
    if (inputUserId) inputUserId.value = finalEmail;
  }

  // Route between User Credentials and 2FA OTP based on hash
  if (window.location.hash === '#login' || window.location.hash === '#credentials') {
    showCredentialsView();
  } else {
    showOtpView();
  }

  // Box 0 has active white dot indicator as in screenshot
  updateActiveDot(0);
});
