(() => {
  const cfg = window.ESC_CONFIG;
  let lang = localStorage.getItem('escLang') || 'ar';
  let current = 0;
  let contrastMode = 0;

  const screens = [...document.querySelectorAll('.screen')];
  const $ = (id) => document.getElementById(id);
  const i18n = {
    ar:{smartGuide:'الدليل الذكي للوصول إلى المركز',welcomeTitle:'مرحبًا بك',welcomeText:'اتبع الإرشادات خطوة بخطوة للوصول بسهولة إلى مقر مركز الخدمات التربوية.',start:'ابدأ الرحلة',scanCheckpoint:'📷 مسح رمز نقطة إرشادية',privacy:'لا يحتاج التطبيق إلى تسجيل الدخول ولا يجمع بيانات شخصية.',routeMap:'عرض المسار',listen:'استمع إلى الإرشاد',previous:'السابق',next:'التالي',finish:'إنهاء',needHelp:'لم أجد الطريق',continueRoute:'متابعة الإرشاد',helpTitle:'هل تحتاج إلى مساعدة؟',callCenter:'اتصل بالمركز',choosePoint:'اختر موقعك الحالي',step:'الخطوة',of:'من'},
    en:{smartGuide:'Smart indoor guide to the center',welcomeTitle:'Welcome',welcomeText:'Follow the step-by-step directions to reach the Educational Services Center easily.',start:'Start route',scanCheckpoint:'📷 Scan checkpoint QR',privacy:'No sign-in is required and no personal data is collected.',routeMap:'View route',listen:'Listen to directions',previous:'Previous',next:'Next',finish:'Finish',needHelp:'I cannot find the way',continueRoute:'Continue directions',helpTitle:'Need help?',callCenter:'Call the center',choosePoint:'Choose your current location',step:'Step',of:'of'}
  };

  function show(id){screens.forEach(s=>s.classList.toggle('active',s.id===id));window.scrollTo({top:0,behavior:'smooth'});}
  function routeText(step,key){return step[key+(lang==='ar'?'Ar':'En')];}
  function setLang(next){
    lang=next;localStorage.setItem('escLang',lang);
    document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    $('langBtn').textContent=lang==='ar'?'EN':'ع';
    document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=i18n[lang][el.dataset.i18n]);
    $('helpMessage').textContent=lang==='ar'?cfg.helpMessageAr:cfg.helpMessageEn;
    renderStep();renderTimeline();
  }
  function icon(type){
    const common='fill="none" stroke="currentColor" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"';
    const fill='fill="currentColor"';
    if(type==='stairs') return `<svg viewBox="0 0 180 140" aria-hidden="true"><path ${common} d="M15 118h32V92h31V66h31V40h35"/><path ${common} d="M125 20h28v28"/><path ${common} d="M153 20l-50 50"/></svg>`;
    if(type==='right') return `<svg viewBox="0 0 180 120"><path ${fill} d="M12 46h101V17l55 43-55 43V74H12z"/></svg>`;
    if(type==='left-turn') return `<svg viewBox="0 0 180 135"><path ${common} d="M142 115V63c0-22-10-32-32-32H46"/><path ${fill} d="M58 6L8 31l50 25z"/></svg>`;
    if(type==='straight') return `<svg viewBox="0 0 150 150"><path ${fill} d="M56 142V57H24L75 7l51 50H94v85z"/></svg>`;
    return `<svg viewBox="0 0 160 150"><path ${common} d="M80 137s45-43 45-82a45 45 0 10-90 0c0 39 45 82 45 82z"/><circle cx="80" cy="55" r="17" ${fill}/><path ${common} d="M57 107l14 14 31-35"/></svg>`;
  }
  function renderStep(){
    const step=cfg.route[current]; if(!step)return;
    $('stepCount').textContent=`${i18n[lang].step} ${current+1} ${i18n[lang].of} ${cfg.route.length}`;
    $('progressBar').style.width=`${((current+1)/cfg.route.length)*100}%`;
    $('directionIcon').innerHTML=icon(step.icon);
    $('stepTitle').textContent=routeText(step,'title');
    $('stepDetail').textContent=routeText(step,'detail');
    $('stepFooter').textContent=routeText(step,'footer');
    $('prevBtn').disabled=current===0;
    $('prevBtn').style.opacity=current===0?'.45':'1';
    $('nextBtn').textContent=current===cfg.route.length-1?i18n[lang].finish:i18n[lang].next;
  }
  function renderTimeline(){
    $('routeTimeline').innerHTML=cfg.route.map((s,i)=>`<div class="timeline-item ${i===current?'current':''}"><div class="timeline-node">${i+1}</div><div class="timeline-copy"><strong>${routeText(s,'title')}</strong><span>${routeText(s,'detail')}</span></div></div>`).join('');
  }
  function renderPointChooser(){
    $('pointChooser').innerHTML=cfg.route.map((s,i)=>`<button class="point-choice" data-index="${i}">${i+1}. ${routeText(s,'title')}</button>`).join('');
    $('pointChooser').querySelectorAll('button').forEach(btn=>btn.onclick=()=>{current=Number(btn.dataset.index);renderStep();show('routeScreen');});
  }
  function speak(){
    if(!('speechSynthesis' in window))return;
    speechSynthesis.cancel();
    const s=cfg.route[current];
    const u=new SpeechSynthesisUtterance(`${routeText(s,'title')}. ${routeText(s,'detail')}`);
    u.lang=lang==='ar'?'ar-EG':'en-US';u.rate=.9;speechSynthesis.speak(u);
  }
  function startFromUrl(){
    const id=new URLSearchParams(location.search).get('start');
    const idx=cfg.route.findIndex(s=>s.id===id);
    if(idx>=0){current=idx;renderStep();show('routeScreen');}
  }
  $('startBtn').onclick=()=>{current=0;renderStep();show('routeScreen')};
  $('langBtn').onclick=()=>setLang(lang==='ar'?'en':'ar');
  $('accessBtn').onclick=()=>{contrastMode=(contrastMode+1)%3;document.body.classList.toggle('large-text',contrastMode===1);document.body.classList.toggle('high-contrast',contrastMode===2)};
  $('nextBtn').onclick=()=>{if(current<cfg.route.length-1){current++;renderStep()}else{show('welcomeScreen')}};
  $('prevBtn').onclick=()=>{if(current>0){current--;renderStep()}};
  $('mapBtn').onclick=()=>{renderTimeline();show('mapScreen')};
  $('closeMapBtn').onclick=$('backToRouteBtn').onclick=()=>show('routeScreen');
  $('speakBtn').onclick=speak;
  $('helpBtn').onclick=()=>{renderPointChooser();show('helpScreen')};
  $('closeHelpBtn').onclick=()=>show('routeScreen');
  $('choosePointBtn').onclick=()=>{$('pointChooser').hidden=!$('pointChooser').hidden};
  if(cfg.contactPhone){$('callBtn').hidden=false;$('callBtn').href=`tel:${cfg.contactPhone}`;}
// ================================
// QR Camera Scanner
// ================================

let qrScanner = null;
let qrScannerRunning = false;
let qrHandled = false;

async function openQrScanner() {
qrHandled = false;
    const scannerPanel = $('scannerPanel');

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

    // إظهار مكان الكاميرا
    scannerPanel.hidden = false;

    // إنشاء قارئ QR
    qrScanner = new Html5Qrcode('qrReader');

    try {
        await qrScanner.start(
            { facingMode: 'environment' },
            {
                fps: 10,
                qrbox: {
                    width: 230,
                    height: 230
                }
            },

            async function (decodedText) {

    if (qrHandled) {
        return;
    }

    qrHandled = true;

    await closeQrScanner();

   const id = new URL(decodedText).searchParams.get('start');

const index = cfg.route.findIndex(step => step.id === id);

if (index >= 0) {
    current = index;
    renderStep();
    show('routeScreen');
  }
},

            function () {
                // لا نفعل شيئًا أثناء بحث الكاميرا عن الرمز
            }
        );

        qrScannerRunning = true;

    } catch (error) {
        console.error('Camera start error:', error);

        scannerPanel.hidden = true;
        qrScanner = null;

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

// ربط الأزرار بوظائف الكاميرا
const scanQrButton = $('scanBtn');
const closeQrButton = $('closeScannerBtn');

if (scanQrButton) {
    scanQrButton.addEventListener('click', openQrScanner);
}

if (closeQrButton) {
    closeQrButton.addEventListener('click', closeQrScanner);
}

  if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
setLang(lang);
startFromUrl();

// تشغيل حركة الشعار
const logo = $('escLogo');

if (logo) {
    logo.classList.add('animate');
}

})();
document.querySelectorAll('.btn, button').forEach(button => {

    button.addEventListener('click', function (e) {

        const ripple = document.createElement('span');

        ripple.classList.add('ripple');

        const rect = this.getBoundingClientRect();

        const size = Math.max(rect.width, rect.height);

        ripple.style.width = ripple.style.height = size + 'px';

        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';

        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

        this.appendChild(ripple);

        ripple.addEventListener('animationend', () => ripple.remove());

    });

});
