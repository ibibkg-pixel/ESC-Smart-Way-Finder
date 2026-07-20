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
      start: 'ابدأ من المدخل الرئيسي',
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
      start: 'Start from the main entrance',
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

    const langButton = $('langBtn');

    if (langButton) {
      langButton.textContent = lang === 'ar' ? 'EN' : 'ع';
    }

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;

      if (i18n[lang][key]) {
        element.textContent = i18n[lang][key];
      }
    });

    const helpMessage = $('helpMessage');

    if (helpMessage) {
      helpMessage.textContent =
        lang === 'ar'
          ? cfg.helpMessageAr
          : cfg.helpMessageEn;
    }

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
    if (!cfg || !Array.isArray(cfg.route)) {
      return;
    }

    const step = cfg.route[current];

    if (!step) {
      return;
    }

    const stepCount = $('stepCount');
    const progressBar = $('progressBar');
    const directionIcon = $('directionIcon');
    const stepTitle = $('stepTitle');
    const stepDetail = $('stepDetail');
    const stepFooter = $('stepFooter');
    const prevButton = $('prevBtn');
    const nextButton = $('nextBtn');

    if (stepCount) {
      stepCount.textContent =
        `${i18n[lang].step} ${current + 1} ` +
        `${i18n[lang].of} ${cfg.route.length}`;
    }

    if (progressBar) {
      progressBar.style.width =
        `${((current + 1) / cfg.route.length) * 100}%`;
    }

    if (directionIcon) {
      directionIcon.innerHTML = icon(step.icon);
    }

    if (stepTitle) {
      stepTitle.textContent = routeText(step, 'title');
    }

    if (stepDetail) {
      stepDetail.textContent = routeText(step, 'detail');
    }

    if (stepFooter) {
      stepFooter.textContent = routeText(step, 'footer');
    }

    if (prevButton) {
      prevButton.disabled = current === 0;
      prevButton.style.opacity = current === 0 ? '0.45' : '1';
    }

    if (nextButton) {
      nextButton.textContent =
        current === cfg.route.length - 1
          ? i18n[lang].finish
          : i18n[lang].next;
    }
  }

  function renderTimeline() {
    const routeTimeline = $('routeTimeline');

    if (
      !routeTimeline ||
      !cfg ||
      !Array.isArray(cfg.route)
    ) {
      return;
    }

    routeTimeline.innerHTML = cfg.route
      .map((step, index) => {
        const currentClass =
          index === current ? 'current' : '';

        return `
          <div class="timeline-item ${currentClass}">
            <div class="timeline-node">
              ${index + 1}
            </div>

            <div class="timeline-copy">
              <strong>
                ${routeText(step, 'title')}
              </strong>

              <span>
                ${routeText(step, 'detail')}
              </span>
            </div>
          </div>
        `;
      })
      .join('');
  }

  function renderPointChooser() {
    const pointChooser = $('pointChooser');

    if (
      !pointChooser ||
      !cfg ||
      !Array.isArray(cfg.route)
    ) {
      return;
    }

    pointChooser.innerHTML = cfg.route
      .map((step, index) => {
        return `
          <button
            class="point-choice"
            type="button"
            data-index="${index}"
          >
            ${index + 1}. ${routeText(step, 'title')}
          </button>
        `;
      })
      .join('');

    pointChooser
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
    if (
      !('speechSynthesis' in window) ||
      !cfg ||
      !Array.isArray(cfg.route)
    ) {
      return;
    }

    const step = cfg.route[current];

    if (!step) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      `${routeText(step, 'title')}. ${routeText(step, 'detail')}`
    );

    utterance.lang =
      lang === 'ar' ? 'ar-EG' : 'en-US';

    utterance.rate = 0.9;

    window.speechSynthesis.speak(utterance);
  }

  function goToCheckpoint(checkpointId) {
    if (
      !checkpointId ||
      !cfg ||
      !Array.isArray(cfg.route)
    ) {
      return false;
    }

    const index = cfg.route.findIndex(
      (step) => step.id === checkpointId
    );

    if (index < 0) {
      return false;
    }

    current = index;

    renderStep();
    show('routeScreen');

    return true;
  }

  function startFromUrl() {
    const checkpointId =
      new URLSearchParams(window.location.search)
        .get('start');

    if (checkpointId) {
      goToCheckpoint(checkpointId);
    }
  }

  const startButton = $('startBtn');

  if (startButton) {
    startButton.onclick = () => {
      current = 0;

      renderStep();
      show('routeScreen');
    };
  }

  const langButton = $('langBtn');

  if (langButton) {
    langButton.onclick = () => {
      setLang(lang === 'ar' ? 'en' : 'ar');
    };
  }

  const accessButton = $('accessBtn');

  if (accessButton) {
    accessButton.onclick = () => {
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
  }

  const nextButton = $('nextBtn');

  if (nextButton) {
    nextButton.onclick = () => {
      if (current < cfg.route.length - 1) {
        current += 1;
        renderStep();
      } else {
        current = 0;
        renderStep();
        show('welcomeScreen');
      }
    };
  }

  const previousButton = $('prevBtn');

  if (previousButton) {
    previousButton.onclick = () => {
      if (current > 0) {
        current -= 1;
        renderStep();
      }
    };
  }

  const mapButton = $('mapBtn');

  if (mapButton) {
    mapButton.onclick = () => {
      renderTimeline();
      show('mapScreen');
    };
  }

  const closeMapButton = $('closeMapBtn');

  if (closeMapButton) {
    closeMapButton.onclick = () => {
      show('routeScreen');
    };
  }

  const backToRouteButton = $('backToRouteBtn');

  if (backToRouteButton) {
    backToRouteButton.onclick = () => {
      show('routeScreen');
    };
  }

  const speakButton = $('speakBtn');

  if (speakButton) {
    speakButton.onclick = speak;
  }

  const helpButton = $('helpBtn');

  if (helpButton) {
    helpButton.onclick = () => {
      renderPointChooser();
      show('helpScreen');
    };
  }

  const closeHelpButton = $('closeHelpBtn');

  if (closeHelpButton) {
    closeHelpButton.onclick = () => {
      show('routeScreen');
    };
  }

  const choosePointButton = $('choosePointBtn');

  if (choosePointButton) {
    choosePointButton.onclick = () => {
      const pointChooser = $('pointChooser');

      if (pointChooser) {
        pointChooser.hidden = !pointChooser.hidden;
      }
    };
  }

  const callButton = $('callBtn');

  if (callButton && cfg.contactPhone) {
    callButton.hidden = false;
    callButton.href = `tel:${cfg.contactPhone}`;
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .catch((error) => {
          console.error(
            'Service Worker registration error:',
            error
          );
        });
    });
  }

  setLang(lang);
  startFromUrl();

  const logo = $('escLogo');

  if (logo) {
    logo.classList.add('animate');
  }
})();

document
  .querySelectorAll('.btn, button, a.primary-btn')
  .forEach((button) => {
    button.addEventListener(
      'click',
      function (event) {
        const ripple =
          document.createElement('span');

        ripple.classList.add('ripple');

        const rect =
          this.getBoundingClientRect();

        const size =
          Math.max(rect.width, rect.height);

        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;

        ripple.style.left =
          `${event.clientX - rect.left - size / 2}px`;

        ripple.style.top =
          `${event.clientY - rect.top - size / 2}px`;

        this.appendChild(ripple);

        ripple.addEventListener(
          'animationend',
          () => {
            ripple.remove();
          }
        );
      }
    );
  });