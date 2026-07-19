(() => {
  const cfg = window.ESC_CONFIG;

  let lang = localStorage.getItem('escLang') || 'ar';
  let current = 0;
  let contrastMode = 0;

  const screens = [...document.querySelectorAll('.screen')];
  const $ = (id) => document.getElementById(id);

  const i18n = {
    ar: {
      smartGuide: 'الدليل الذكي للوصول إلى المركز',
      welcomeTitle: 'مرحبًا بك',
      welcomeText:
        'اتبع الإرشادات خطوة بخطوة للوصول بسهولة إلى مقر مركز الخدمات التربوية.',
      start: 'ابدأ الرحلة',
      scanCheckpoint: '📷 مسح رمز نقطة إرشادية',
      privacy:
        'لا يحتاج التطبيق إلى تسجيل الدخول ولا يجمع بيانات شخصية.',
      routeMap: 'عرض المسار',
      listen: 'استمع إلى الإرشاد',
      previous: 'السابق',
      next: 'التالي',
      finish: 'إنهاء',
      needHelp: 'لم أجد الطريق',
      continueRoute: 'متابعة الإرشاد',
      helpTitle: 'هل تحتاج إلى مساعدة؟',
      callCenter: 'اتصل بالمركز',
      choosePoint: 'اختر موقعك الحالي',
      step: 'الخطوة',
      of: 'من'
    },

    en: {
      smartGuide: 'Smart indoor guide to the center',
      welcomeTitle: 'Welcome',
      welcomeText:
        'Follow the step-by-step directions to reach the Educational Services Center easily.',
      start: 'Start route',
      scanCheckpoint: '📷 Scan checkpoint QR',
      privacy:
        'No sign-in is required and no personal data is collected.',
      routeMap: 'View route',
      listen: 'Listen to directions',
      previous: 'Previous',
      next: 'Next',
      finish: 'Finish',
      needHelp: 'I cannot find the way',
      continueRoute: 'Continue directions',
      helpTitle: 'Need help?',
      callCenter: 'Call the center',
      choosePoint: 'Choose your current location',
      step: 'Step',
      of: 'of'
    }
  };

  function show(id) {
    screens.forEach((screen) => {
      screen.classList.toggle('active', screen.id === id);
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function routeText(step, key) {
    return step[key + (lang === 'ar' ? 'Ar' : 'En')];
  }

  function setLang(nextLang) {
    lang = nextLang;

    localStorage.setItem('escLang', lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    $('langBtn').textContent = lang === 'ar' ? 'EN' : 'ع';

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;

      if (i18n[lang][key]) {
        element.textContent = i18n[lang][key];
      }
    });

    $('helpMessage').textContent =
      lang === 'ar'
        ? cfg.helpMessageAr
        : cfg.helpMessageEn;

    renderStep();
    renderTimeline();
  }

  function icon(type) {
    const common =
      'fill="none" stroke="currentColor" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"';

    const fill = 'fill="currentColor"';

    if (type === 'stairs') {
      return `
        <svg viewBox="0 0 180 140" aria-hidden="true">
          <path ${common} d="M15 118h32V92h31V66h31V40h35"/>
          <path ${common} d="M125 20h28v28"/>
          <path ${common} d="M153 20l-50 50"/>
        </svg>
      `;
    }

    if (type === 'right') {
      return `
        <svg viewBox="0 0 180 120" aria-hidden="true">
          <path ${fill} d="M12 46h101V17l55 43-55 43V74H12z"/>
        </svg>
      `;
    }

    if (type === 'left-turn') {
      return `
        <svg viewBox="0 0 180 135" aria-hidden="true">
          <path ${common} d="M142 115V63c0-22-10-32-32-32H46"/>
          <path ${fill} d="M58 6L8 31l50 25z"/>
        </svg>
      `;
    }

    if (type === 'straight') {
      return `
        <svg viewBox="0 0 150 150" aria-hidden="true">
          <path ${fill} d="M56 142V57H24L75 7l51 50H94v85z"/>
        </svg>
      `;
    }

    return `
      <svg viewBox="0 0 160 150" aria-hidden="true">
        <path ${common} d="M80 137s45-43 45-82a45 45 0 10-90 0c0 39 45 82 45 82z"/>
        <circle cx="80" cy="55" r="17" ${fill}/>
        <path ${common} d="M57 107l14 14 31-35"/>
      </svg>
    `;
  }

  function renderStep() {
    const step = cfg.route[current];

    if (!step) {
      return;
    }

    $('stepCount').textContent =
      `${i18n[lang].step} ${current + 1} ` +
      `${i18n[lang].of} ${cfg.route.length}`;

    $('progressBar').style.width =
      `${((current + 1) / cfg.route.length) * 100}%`;

    $('directionIcon').innerHTML = icon(step.icon);
    $('stepTitle').textContent = routeText(step, 'title');
    $('stepDetail').textContent = routeText(step, 'detail');
    $('stepFooter').textContent = routeText(step, 'footer');

    $('prevBtn').disabled = current === 0;
    $('prevBtn').style.opacity = current === 0 ? '.45' : '1';

    $('nextBtn').textContent =
      current === cfg.route.length - 1
        ? i18n[lang].finish
        : i18n[lang].next;
  }

  function renderTimeline() {
    $('routeTimeline').innerHTML = cfg.route
      .map((step, index) => {
        const currentClass = index === current ? 'current' : '';

        return `
          <div class="timeline-item ${currentClass}">
            <div class="timeline-node">${index + 1}</div>

            <div class="timeline-copy">
              <strong>${routeText(step, 'title')}</strong>
              <span>${routeText(step, 'detail')}</span>
            </div>
          </div>
        `;
      })
      .join('');
  }

  function renderPointChooser() {
    $('pointChooser').innerHTML = cfg.route
      .map((step, index) => {
        return `
          <button class="point-choice" data-index="${index}">
            ${index + 1}. ${routeText(step, 'title')}
          </button>
        `;
      })
      .join('');

    $('pointChooser')
      .querySelectorAll('button')
      .forEach((button) => {
        button.onclick = () => {
          current = Number(button.dataset.index);

          renderStep();
          show('routeScreen');
        };
      });
  }

  function speak() {
    if (!('speechSynthesis' in window)) {
      return;
    }

    speechSynthesis.cancel();

    const step = cfg.route[current];

    const utterance = new SpeechSynthesisUtterance(
      `${routeText(step, 'title')}. ${routeText(step, 'detail')}`
    );

    utterance.lang = lang === 'ar' ? 'ar-EG' : 'en-US';
    utterance.rate = 0.9;

    speechSynthesis.speak(utterance);
  }

  function goToCheckpoint(id) {
    const index = cfg.route.findIndex((step) => step.id === id);

    if (index >= 0) {
      current = index;

      renderStep();
      show('routeScreen');

      return true;
    }

    return false;
  }

  function startFromUrl() {
    const id = new URLSearchParams(window.location.search).get('start');

    if (id) {
      goToCheckpoint(id);
    }
  }

  $('startBtn').onclick = () => {
    current = 0;

    renderStep();
    show('routeScreen');
  };

  $('langBtn').onclick = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  $('accessBtn').onclick = () => {
    contrastMode = (contrastMode + 1) % 3;

    document.body.classList.toggle(
      'large-text',
      contrastMode === 1
    );

    document.body.classList.toggle(
      'high-contrast',
      contrastMode === 2
    );
  };

  $('nextBtn').onclick = () => {
    if (current < cfg.route.length - 1) {
      current += 1;
      renderStep();
    } else {
      show('welcomeScreen');
    }
  };

  $('prevBtn').onclick = () => {
    if (current > 0) {
      current -= 1;
      renderStep();
    }
  };

  $('mapBtn').onclick = () => {
    renderTimeline();
    show('mapScreen');
  };

  $('closeMapBtn').onclick = () => {
    show('routeScreen');
  };

  $('backToRouteBtn').onclick = () => {
    show('routeScreen');
  };

  $('speakBtn').onclick = speak;

  $('helpBtn').onclick = () => {
    renderPointChooser();
    show('helpScreen');
  };

  $('closeHelpBtn').onclick = () => {
    show('routeScreen');
  };

  $('choosePointBtn').onclick = () => {
    $('pointChooser').hidden = !$('pointChooser').hidden;
  };

  if (cfg.contactPhone) {
    $('callBtn').hidden = false;
    $('callBtn').href = `tel:${cfg.contactPhone}`;
  }

  // =================================
  // QR Camera Scanner
  // =================================

  let qrScanner = null;
  let qrScannerRunning = false;
  let qrHandled = false;

  async function openQrScanner() {
    const scannerPanel = $('scannerPanel');

    qrHandled = false;

    if (!scannerPanel || qrScannerRunning) {
      return;
    }

    if (typeof Html5Qrcode === 'undefined') {
      alert(
        lang === 'ar'
          ? 'تعذر تحميل قارئ QR. تأكد من اتصال الإنترنت ثم حدّث الصفحة.'
          : 'QR reader could not be loaded. Check your internet connection and refresh.'
      );

      return;
    }

    scannerPanel.hidden = false;

    qrScanner = new Html5Qrcode('qrReader');

    try {
      await qrScanner.start(
        {
          facingMode: 'environment'
        },
        {
          fps: 10,
          qrbox: {
            width: 230,
            height: 230
          }
        },

        async function onQrCodeSuccess(decodedText) {
          if (qrHandled) {
            return;
          }

          qrHandled = true;

          await closeQrScanner();

          try {
            const scannedUrl = new URL(
              decodedText,
              window.location.href
            );

            const checkpointId =
              scannedUrl.searchParams.get('start');

            if (!checkpointId) {
              alert(
                lang === 'ar'
                  ? 'رمز QR لا يحتوي على نقطة إرشادية صحيحة.'
                  : 'The QR code does not contain a valid checkpoint.'
              );

              return;
            }

            const found = goToCheckpoint(checkpointId);

            if (!found) {
              alert(
                lang === 'ar'
                  ? 'لم يتم العثور على هذه النقطة في مسار التطبيق.'
                  : 'This checkpoint was not found in the route.'
              );
            }
          } catch (error) {
            console.error('QR URL error:', error);

            alert(
              lang === 'ar'
                ? 'رمز QR غير صالح. يرجى تجربة رمز آخر.'
                : 'The QR code is invalid. Please try another code.'
            );
          }
        },

        function onQrCodeScanFailure() {
          // لا نفعل شيئًا أثناء بحث الكاميرا عن الرمز
        }
      );

      qrScannerRunning = true;
    } catch (error) {
      console.error('Camera start error:', error);

      scannerPanel.hidden = true;
      qrScanner = null;
      qrScannerRunning = false;

      alert(
        lang === 'ar'
          ? 'تعذر تشغيل الكاميرا. اسمح للموقع باستخدام الكاميرا ثم حاول مجددًا.'
          : 'Unable to start the camera. Allow camera access and try again.'
      );
    }
  }

  async function closeQrScanner() {
    const scannerPanel = $('scannerPanel');

    try {
      if (qrScanner && qrScannerRunning) {
        await qrScanner.stop();
        qrScanner.clear();
      }
    } catch (error) {
      console.error('Camera stop error:', error);
    }

    qrScannerRunning = false;
    qrScanner = null;

    if (scannerPanel) {
      scannerPanel.hidden = true;
    }
  }

  const scanQrButton = $('scanBtn');
  const closeQrButton = $('closeScannerBtn');

  if (scanQrButton) {
    scanQrButton.addEventListener(
      'click',
      openQrScanner
    );
  }

  if (closeQrButton) {
    closeQrButton.addEventListener(
      'click',
      closeQrScanner
    );
  }

  // تسجيل Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .catch((error) => {
          console.error('Service Worker error:', error);
        });
    });
  }

  setLang(lang);
  startFromUrl();

  // تشغيل حركة الشعار
  const logo = $('escLogo');

  if (logo) {
    logo.classList.add('animate');
  }
})();

// =================================
// Ripple animation
// =================================

document
  .querySelectorAll('.btn, button')
  .forEach((button) => {
    button.addEventListener('click', function (event) {
      const ripple = document.createElement('span');

      ripple.classList.add('ripple');

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;

      ripple.style.left =
        `${event.clientX - rect.left - size / 2}px`;

      ripple.style.top =
        `${event.clientY - rect.top - size / 2}px`;

      this.appendChild(ripple);

      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    });
  });