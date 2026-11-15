/* YOUNGSANGNOL — 공통 스크립트 (의존성 없음) */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- 모바일 메뉴 ---------- */
  var btn = $('.menu-btn'), nav = $('.nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  }

  /* ---------- 탭 (역할별 보기) ---------- */
  $$('.tabs').forEach(function (box) {
    var buttons = $$('.tab-list button', box);
    var panels = $$('.tab-panel', box);
    function show(id, focus) {
      buttons.forEach(function (b) {
        var on = b.getAttribute('aria-controls') === id;
        b.setAttribute('aria-selected', on);
        b.tabIndex = on ? 0 : -1;
        if (on && focus) b.focus();
      });
      panels.forEach(function (p) { p.hidden = p.id !== id; });
    }
    buttons.forEach(function (b, i) {
      b.addEventListener('click', function () {
        show(b.getAttribute('aria-controls'));
        try { history.replaceState(null, '', '#' + b.getAttribute('aria-controls')); } catch (e) {}
      });
      b.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = buttons[(i + 1) % buttons.length];
        if (e.key === 'ArrowLeft') n = buttons[(i - 1 + buttons.length) % buttons.length];
        if (n) { e.preventDefault(); show(n.getAttribute('aria-controls'), true); }
      });
    });
    var hash = location.hash.slice(1);
    var initial = panels.some(function (p) { return p.id === hash; }) ? hash : panels[0].id;
    show(initial);
    window.addEventListener('hashchange', function () {
      var h = location.hash.slice(1);
      if (panels.some(function (p) { return p.id === h; })) show(h);
    });
  });

  /* ---------- 체크리스트 (브라우저에 저장) ---------- */
  var store = {
    get: function () { try { return JSON.parse(localStorage.getItem('ysn-checks') || '{}'); } catch (e) { return {}; } },
    set: function (o) { try { localStorage.setItem('ysn-checks', JSON.stringify(o)); } catch (e) {} }
  };
  $$('.checks').forEach(function (group) {
    var boxes = $$('input[type=checkbox]', group);
    var count = $('.count', group);
    var saved = store.get();
    var page = location.pathname.split('/').pop() || 'index.html';
    boxes.forEach(function (b, i) {
      var key = page + ':' + (group.dataset.id || 'g') + ':' + i;
      b.dataset.key = key;
      b.checked = !!saved[key];
      b.addEventListener('change', function () {
        var s = store.get();
        if (b.checked) s[key] = 1; else delete s[key];
        store.set(s); update();
      });
    });
    function update() {
      if (!count) return;
      var n = boxes.filter(function (b) { return b.checked; }).length;
      count.textContent = n + ' / ' + boxes.length;
    }
    var reset = $('.reset', group);
    if (reset) reset.addEventListener('click', function () {
      var s = store.get();
      boxes.forEach(function (b) { b.checked = false; delete s[b.dataset.key]; });
      store.set(s); update();
    });
    update();
  });

  /* ---------- 목차 하이라이트 ---------- */
  var tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          tocLinks.forEach(function (a) { a.classList.remove('active'); });
          map[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* ---------- 등장 효과 ---------- */
  var rev = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { threshold: .12 });
    rev.forEach(function (el) { ro.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- 히어로 타임코드 ---------- */
  var tc = $('#tc');
  if (tc) {
    var t0 = Date.now(), fps = 24;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    setInterval(function () {
      var f = Math.floor((Date.now() - t0) / 1000 * fps);
      tc.textContent = pad(Math.floor(f / (fps * 3600))) + ':' + pad(Math.floor(f / (fps * 60)) % 60) + ':' + pad(Math.floor(f / fps) % 60) + ':' + pad(f % fps);
    }, 1000 / fps);
  }

  /* ---------- 노출 계산기 ---------- */
  var ex = $('#exposure');
  if (ex) {
    var A = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
    var S = [24, 30, 48, 50, 60, 96, 100, 120, 250, 500, 1000, 2000];
    var I = [100, 200, 400, 800, 1600, 3200, 6400, 12800];
    var fill = function (sel, arr, fmt, def) {
      arr.forEach(function (v) {
        var o = document.createElement('option'); o.value = v; o.textContent = fmt(v);
        if (v === def) o.selected = true; sel.appendChild(o);
      });
    };
    var el = {
      a: $('#ex-a'), s: $('#ex-s'), i: $('#ex-i'), nd: $('#ex-nd'), fps: $('#ex-fps'),
      rel: $('#ex-rel'), relNote: $('#ex-rel-note'), ang: $('#ex-ang'), angNote: $('#ex-ang-note'), pin: $('#ex-pin')
    };
    fill(el.a, A, function (v) { return 'f/' + v; }, 2.8);
    fill(el.s, S, function (v) { return '1/' + v; }, 48);
    fill(el.i, I, function (v) { return 'ISO ' + v; }, 800);
    var calc = function () {
      var N = parseFloat(el.a.value), t = 1 / parseFloat(el.s.value), iso = parseFloat(el.i.value);
      var nd = parseFloat(el.nd.value), fps = parseFloat(el.fps.value);
      var gain = (t / (1 / 48)) * (iso / 800) * Math.pow(2.8 / N, 2) / Math.pow(2, nd);
      var st = Math.log(gain) / Math.LN2;
      var sign = st > 0 ? '+' : '';
      el.rel.textContent = sign + st.toFixed(1) + ' 스톱';
      var note;
      if (Math.abs(st) < 0.25) note = '기준(f/2.8 · 1/48 · ISO 800)과 같은 밝기입니다.';
      else if (st > 0) note = '기준보다 ' + st.toFixed(1) + '스톱 밝아요. 하이라이트가 날아가지 않는지 제브라/웨이브폼을 확인하세요.';
      else note = '기준보다 ' + Math.abs(st).toFixed(1) + '스톱 어두워요. 섀도에 노이즈가 올라올 수 있어요.';
      el.relNote.textContent = note;
      el.pin.style.left = (Math.max(-4, Math.min(4, st)) + 4) / 8 * 100 + '%';
      var angle = 360 * fps * t;
      el.ang.textContent = angle.toFixed(0) + '°';
      var an;
      if (angle > 220) an = '모션 블러가 많이 생겨 몽글몽글하고 꿈결 같은 느낌이에요.';
      else if (angle >= 150) an = '180° 근처 — 사람 눈에 가장 자연스러운 모션 블러(시네마 룩)입니다.';
      else if (angle >= 60) an = '블러가 줄어 또렷하고 거친 느낌. 액션·전투 장면에서 쓰는 질감이에요.';
      else an = '블러가 거의 없어 뚝뚝 끊겨 보입니다(스타카토). 의도가 아니라면 피하세요.';
      el.angNote.textContent = '셔터 앵글 ' + angle.toFixed(0) + '° · ' + an;
    };
    [el.a, el.s, el.i, el.nd, el.fps].forEach(function (c) { c.addEventListener('input', calc); });
    calc();
  }

  /* ---------- 피사계 심도 계산기 ---------- */
  var dof = $('#dof');
  if (dof) {
    var d = {
      sensor: $('#dof-sensor'), f: $('#dof-f'), fOut: $('#dof-f-out'),
      n: $('#dof-n'), s: $('#dof-s'), sOut: $('#dof-s-out'),
      near: $('#dof-near'), far: $('#dof-far'), total: $('#dof-total'), hyper: $('#dof-hyper'),
      note: $('#dof-note'), zone: $('#dof-zone'), subj: $('#dof-subj')
    };
    [1.4, 1.8, 2, 2.8, 4, 5.6, 8, 11, 16].forEach(function (v) {
      var o = document.createElement('option'); o.value = v; o.textContent = 'f/' + v; if (v === 2.8) o.selected = true; d.n.appendChild(o);
    });
    var fmt = function (m) { return m >= 100 ? '∞' : (m < 1 ? (m * 100).toFixed(0) + ' cm' : m.toFixed(2) + ' m'); };
    var run = function () {
      var c = parseFloat(d.sensor.value);            // 허용 착란원 (mm)
      var f = parseFloat(d.f.value);                 // mm
      var N = parseFloat(d.n.value);
      var s = parseFloat(d.s.value) * 1000;          // mm
      d.fOut.textContent = f + ' mm';
      d.sOut.textContent = (s / 1000).toFixed(1) + ' m';
      var H = f * f / (N * c) + f;
      var near = s * (H - f) / (H + s - 2 * f);
      var far = s >= H ? Infinity : s * (H - f) / (H - s);
      d.near.textContent = fmt(near / 1000);
      d.far.textContent = far === Infinity ? '∞ (무한대)' : fmt(far / 1000);
      d.hyper.textContent = fmt(H / 1000);
      var span = far === Infinity ? Infinity : (far - near) / 1000;
      d.total.textContent = span === Infinity ? '∞' : fmt(span);
      var msg;
      if (span === Infinity) msg = '초점 거리 뒤쪽이 전부 선명해요. 풍경·와이드 샷에 적합합니다.';
      else if (span < 0.15) msg = '아주 얕은 심도 — 눈 한쪽에만 초점이 맞을 수 있어요. 포커스 풀러/모니터 필수.';
      else if (span < 0.6) msg = '얕은 심도 — 인물 분리가 잘 되지만 움직임에는 초점 실패 위험이 있어요.';
      else if (span < 3) msg = '중간 심도 — 대부분의 인터뷰·대화 장면에서 다루기 편한 범위입니다.';
      else msg = '깊은 심도 — 배경까지 또렷해요. 인물 분리가 필요하면 조리개를 열거나 거리를 좁히세요.';
      d.note.textContent = msg;
      // 시각화 (0 ~ 12m 축)
      var max = 12, farV = far === Infinity ? max : Math.min(far / 1000, max);
      d.zone.style.left = Math.min(near / 1000, max) / max * 100 + '%';
      d.zone.style.width = Math.max(0, (farV - Math.min(near / 1000, max))) / max * 100 + '%';
      d.subj.style.left = Math.min(s / 1000, max) / max * 100 + '%';
    };
    [d.sensor, d.f, d.n, d.s].forEach(function (c) { c.addEventListener('input', run); });
    run();
  }

  /* ---------- 샷 사이즈 시뮬레이터 ---------- */
  var sim = $('#shotsim');
  if (sim) {
    var shots = {
      ls:  { h: 300, cy: -10,  name: '롱 샷 (LS)',            use: '인물 + 공간. 인물이 환경 속 어디에 있는지 보여줄 때.' },
      fs:  { h: 215, cy: -2,   name: '풀 샷 (FS)',            use: '머리부터 발끝까지. 동작과 의상, 블로킹을 전달.' },
      ks:  { h: 135, cy: -28,  name: '니 샷 (무릎 위)',        use: '동작을 살리면서 표정도 놓치지 않는 균형 샷.' },
      ms:  { h: 96,  cy: -48,  name: '미디엄 샷 (MS · 허리 위)', use: '대화·상호작용의 기본. 제스처와 표정이 같이 읽혀요.' },
      mcu: { h: 62,  cy: -62,  name: '미디엄 클로즈업 (MCU · 가슴 위)', use: '인터뷰 기본 샷. 감정을 따라가기 좋은 거리.' },
      cu:  { h: 40,  cy: -70,  name: '클로즈업 (CU)',          use: '얼굴. 감정의 변화와 반응을 보여줄 때.' },
      ecu: { h: 14,  cy: -73,  name: '익스트림 클로즈업 (ECU)', use: '눈·입·손 같은 디테일. 긴장·강조·인서트.' }
    };
    var svg = $('#shotsim-svg'), label = $('#shotsim-name'), use = $('#shotsim-use');
    var cur = { x: -160, y: -90, w: 320, h: 180 };
    function setVB(v) { svg.setAttribute('viewBox', v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h); }
    var raf;
    function go(key) {
      var s = shots[key], w = s.h * 16 / 9;
      var to = { x: -w / 2, y: s.cy - s.h / 2, w: w, h: s.h };
      var from = { x: cur.x, y: cur.y, w: cur.w, h: cur.h }, t0 = null, dur = 650;
      cancelAnimationFrame(raf);
      var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = reduce ? 1 : Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        cur = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, w: from.w + (to.w - from.w) * e, h: from.h + (to.h - from.h) * e };
        setVB(cur);
        if (p < 1) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
      label.textContent = s.name; use.textContent = s.use;
      $$('#shotsim-btns button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.shot === key); });
    }
    $$('#shotsim-btns button').forEach(function (b) { b.addEventListener('click', function () { go(b.dataset.shot); }); });
    setVB({ x: -266.7, y: -160, w: 533.4, h: 300 });
    cur = { x: -266.7, y: -160, w: 533.4, h: 300 };
    go('ms');
  }
})();
