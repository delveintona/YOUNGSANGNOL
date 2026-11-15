/* ==========================================================================
   YOUNGSANGNOL, script.js
   --------------------------------------------------------------------------
   1) CONTENT : 사이트의 모든 텍스트와 사진 교체 정보 (여기만 고치면 화면에 반영됩니다)
   2) 렌더링  : CONTENT 를 HTML 로
   3) 모션    : Lenis 부드러운 스크롤 + GSAP ScrollTrigger
   4) 데모    : 노출(웨이브폼과 폴스컬러) / 화이트밸런스 캔버스
   ========================================================================== */
(() => {
  'use strict';

  /* ======================================================================
     1) CONTENT: 텍스트는 이 객체만 수정하세요
     ====================================================================== */
  const CONTENT = {
    site: {
      mark: '영상놀',
      logo: { src: '', alt: '영상놀' },     // 로고 파일 경로를 넣으면 글자 대신 로고가 나옵니다 (예: 'assets/logo.svg')
      title: '찍기 전에, 찍는 동안, 찍고 난 뒤까지.',
      sentence: '영상놀에서 처음 영상을 찍어 보는 분을 위한 촬영과 연출 가이드입니다.',
      actions: [
        { label: '프리 프로덕션 읽기', href: '#pre', primary: true },
        { label: '노출 데모 해 보기', href: '#exposure' }
      ],
      tocFoot: '영상놀 동아리<br>촬영 가이드',
      totalMinutes: 12            // 타임코드용 가상 러닝타임(분). 스크롤 0~100%가 이 길이에 대응
    },

    /* 사진 교체: src 를 채우면 해당 슬롯의 대체 사진이 내 사진으로 바뀝니다.
       alt 는 화면 낭독용 설명이니 어떤 사진인지 적어 주세요. 캡션은 사진 아래에 보입니다. */
    images: {
      hero:     { src: '', alt: '어두운 촬영 현장에서 카메라를 잡고 있는 촬영 스태프' },
      location: { src: '', alt: '로케이션 헌팅 중 창으로 들어오는 빛의 방향을 확인하는 모습', caption: '로케이션 헌팅, 창과 빛의 방향' },
      set:      { src: '', alt: '촬영 현장에서 배우 동선을 맞추는 블로킹 장면', caption: '현장 세팅' },
      edit:     { src: '', alt: '편집실에서 타임라인과 컬러 모니터를 보는 작업 사진', caption: '편집실과 믹스' }
    },

    intro: {
      statement: '영상을 처음 찍어 보는 분도 따라 할 수 있게, 촬영 전부터 편집까지의 순서를 정리했습니다.',
      rest: [
        '프리, 프로, 포스트 순서로 읽으면 한 편의 영상이 어떻게 만들어지는지 흐름이 보입니다.',
        '배우고 싶은 부분부터 골라 읽어도 됩니다. 노출과 화이트밸런스는 직접 슬라이더를 움직여 확인해 보세요.'
      ]
    },

    /* 좌측 목차. sub: true 는 들여쓴 하위 항목 */
    toc: [
      { id: 'intro',     no: '00', label: '소개' },
      { id: 'pre',       no: '01', label: '프리 프로덕션' },
      { id: 'prod',      no: '02', label: '프로덕션' },
      { id: 'timeline',  no: '',   label: '현장 하루', sub: true },
      { id: 'exposure',  no: '',   label: '노출', sub: true },
      { id: 'wb',        no: '',   label: '화이트밸런스', sub: true },
      { id: 'directing', no: '',   label: '연출 체크', sub: true },
      { id: 'post',      no: '03', label: '포스트 프로덕션' },
      { id: 'outro',     no: '',   label: '마무리' }
    ],

    scenes: {
      pre: {
        num: '01', code: 'PRE', ko: '프리 프로덕션', kicker: '촬영 날 할 결정을, 촬영 날 전에 끝내기',
        lead: '현장에서 고민하는 시간은 곧 돈이고 체력입니다. 준비가 잘 된 현장은 조용하고 빠릅니다.'
      },
      prod: {
        num: '02', code: 'PROD', ko: '프로덕션', kicker: '실제로 카메라가 돌아가는 날',
        lead: '계획을 현실에 맞게 조정하면서, 편집하는 사람이 쓸 수 있는 소스를 가장 빠르고 안전하게 확보합니다.'
      },
      post: {
        num: '03', code: 'POST', ko: '포스트 프로덕션', kicker: '찍어 온 것을 한 편으로 완성하기',
        lead: '편집의 목표는 컷을 이어 붙이는 것이 아니라 이야기의 리듬을 만드는 것입니다.'
      }
    },

    /* 프리 프로덕션: 연출 / 촬영 / 제작 */
    pre: [
      { en: 'Directing', ko: '연출', items: [
        { t: '대본 해석', d: '장면마다 인물의 목적과 감정선을 한 문장으로 적어 둡니다.' },
        { t: '톤과 레퍼런스', d: '말로만 합의한 느낌은 반드시 엇갈립니다. 이미지로 정합니다.' },
        { t: '콘티와 샷리스트', d: '컷마다 사이즈, 앵글, 움직임, 우선순위를 정리합니다.' },
        { t: '블로킹', d: '배우 동선과 카메라 위치를 로케이션에서 미리 맞춰 봅니다.' }
      ]},
      { en: 'Camera', ko: '촬영', items: [
        { t: '로케이션 헌팅', d: '촬영 시간대에 직접 가서 해 방향, 전기, 소음, 반사를 확인합니다.' },
        { t: '장비 선정', d: '샷리스트에서 역산해 렌즈, 삼각대, 짐벌, 마이크를 정합니다.' },
        { t: '조명 계획', d: '자연광을 기준으로 필요한 조명, ND, 디퓨전을 산정합니다.' },
        { t: '테스트 촬영', d: '카메라와 LUT를 편집 프로그램까지 통과시켜 룩을 확정합니다.' }
      ]},
      { en: 'Production', ko: '제작', items: [
        { t: '일정', d: '씬 순서가 아니라 장소와 조명 조건으로 묶어 스케줄을 짭니다.' },
        { t: '예산', d: '예비비 10%를 처음부터 넣어 둡니다.' },
        { t: '섭외와 허가', d: '출연자, 장소, 촬영 허가와 초상권, 저작권 동의를 챙깁니다.' },
        { t: '안전과 콜시트', d: '집합 시간, 연락처, 일몰, 가까운 병원까지 한 장에 담습니다.' }
      ]}
    ],

    /* 프로덕션: 현장 하루 (가로 스크롤) */
    day: {
      en: 'A day on set', ko: '촬영 현장 하루',
      cards: [
        { time: '07:30', en: 'Call', ko: '콜타임', d: '집합과 안전 브리핑. 오늘의 목표 컷과 우선순위, 위험 요소를 3분 안에 공유합니다.' },
        { time: '08:30', en: 'Setup', ko: '세팅', d: '블로킹을 먼저 보고 카메라와 조명을 세웁니다. 스탠드인으로 노출과 초점을 확인합니다.' },
        { time: '10:30', en: 'Rehearsal', ko: '리허설', d: '실제 속도로 연기와 카메라 무빙을 맞춥니다. 포커스 마크, 마이크 위치, 그림자를 점검합니다.' },
        { time: '11:00', en: 'Takes', ko: '테이크', d: '슬레이트, 액션, 컷. 연기, 기술, 소리, 연결, 네 가지가 통과해야 OK입니다.' },
        { time: '18:00', en: 'Wrap', ko: '랩', d: '룸톤 30초를 녹음하고 장비 수량과 원상복구를 확인한 뒤 철수합니다.' },
        { time: '19:00', en: 'Backup', ko: '백업', d: '복사본이 2개 이상 생기기 전에는 카드를 지우지 않습니다. 촬영 일지도 남깁니다.' }
      ]
    },

    exposure: {
      en: 'Exposure', ko: '노출',
      lead: '조리개, ISO, 셔터를 움직여 보세요. 얼굴이 적정 범위에 오는지, 창문이 얼마나 날아가는지 눈이 아니라 웨이브폼으로 확인하는 연습입니다.',
      baseline: 'f/2.8, ISO 800, 1/48 (24p, 180° 셔터) 대비',
      note: '노출은 하이라이트를 지키고, 얼굴을 기준으로 맞춥니다. 영상에서는 셔터를 프레임레이트의 2배 분의 1로 고정하고, 밝기는 조명, ND, ISO로 조절합니다. 이 데모의 밝기는 설명용 근사 모델입니다.',
      falseLegend: [
        ['--fc-crush', '0~3% 뭉개짐'], ['--fc-dark', '3~20% 어두움'], ['--color-muted', '중간 톤'],
        ['--fc-green', '42~50% 중간 회색'], ['--fc-skin', '56~76% 피부 톤'], ['--fc-warn', '90~97% 밝음'], ['--fc-clip', '98% 이상 클리핑']
      ]
    },

    wb: {
      en: 'White balance', ko: '화이트밸런스',
      lead: '화이트밸런스는 흰색을 흰색으로 만드는 값이 아니라 화면 색의 기준점입니다. 현장 조명과 카메라 설정이 같을 때 중립이 됩니다.',
      lights: [
        { k: 3200, name: '텅스텐 3200K' }, { k: 4300, name: '형광등 4300K' },
        { k: 5600, name: '주광 5600K' }, { k: 6500, name: '흐린 날 6500K' }
      ],
      note: '오토 WB는 끄고 K 값으로 고정하세요. 한 씬 안에서는 바꾸지 않고, 혼합광은 젤(CTB, CTO)이나 조명 색온도로 먼저 정리합니다.',
      /* 색 차트(반사율). 이름, 색 */
      chart: [
        ['흰색', '#f2f2f0'], ['회색 18%', '#808080'], ['빨강', '#bf3a2b'], ['초록', '#2f8f58'],
        ['파랑', '#2f6fb5'], ['노랑', '#e0b030'], ['피부', '#d6a785'], ['검정', '#2a2a2c']
      ]
    },

    directing: {
      en: 'Directing check', ko: '컷마다 확인할 것',
      lead: '스크롤을 내리면 체크가 하나씩 채워집니다. 컷이 끝날 때마다 이 일곱 가지를 눈으로 훑습니다.',
      checks: [
        { en: 'Eyeline', ko: '시선', d: 'A가 화면 오른쪽을 보면 B는 왼쪽을 봅니다. 카메라 높이도 시선 높이에 맞춥니다.' },
        { en: 'Screen direction', ko: '화면 방향', d: '좌에서 우로 걷던 인물은 다음 컷에서도 같은 방향이어야 합니다.' },
        { en: 'The axis', ko: '180도 룰', d: '두 인물을 잇는 선의 한쪽에만 카메라를 둡니다. 넘으면 좌우가 뒤바뀝니다.' },
        { en: 'Props', ko: '소품', d: '컵의 음료 양, 문서의 페이지, 휴대폰 화면까지 앞 컷과 같은지 봅니다.' },
        { en: 'Costume', ko: '의상', d: '단추, 소매, 머리카락, 땀과 눈물의 정도를 연속성 사진과 대조합니다.' },
        { en: 'Timing', ko: '대사 타이밍', d: '말 속도와 쉬는 지점이 컷마다 같아야 편집에서 바꿔 붙일 수 있습니다.' },
        { en: 'Match', ko: '액션 연결', d: '동작 중간에서 컷을 자를 수 있게, 시작과 끝 위치와 속도를 맞춥니다.' }
      ]
    },

    post: {
      en: 'Post pipeline', ko: '포스트 프로덕션 순서',
      lead: '픽처 락(편집 확정) 전에는 사운드와 컬러를 마무리하지 않습니다. 순서를 지키면 되돌아가는 일이 줄어듭니다.',
      steps: [
        { n: '01', en: 'Backup', ko: '데이터 백업 (3벌)', d: '원본과 복사본 2개를 서로 다른 저장장치에 둡니다. 파일 개수와 용량을 확인한 뒤에만 카드를 포맷합니다.', badges: ['원본', '복사본 A', '복사본 B'] },
        { n: '02', en: 'Edit', ko: '편집', d: '셀렉, 러프 컷, 파인 컷 순서. 러프에서는 구조를, 파인에서는 호흡과 이음새를 봅니다.' },
        { n: '03', en: 'Color', ko: '컬러', d: '1차 보정으로 노출과 화이트밸런스를 통일한 뒤 룩을 입힙니다. 마지막에 스킨 톤과 컷 매칭을 점검합니다.' },
        { n: '04', en: 'Sound', ko: '사운드', d: '대사 정리, 효과음, 음악, 믹스 순서. 대사가 가장 크게 들리고 음악은 그 아래에 깝니다.' },
        { n: '05', en: 'Deliver', ko: '납품', d: '플랫폼 규격에 맞춰 출력하고, 출력한 파일을 처음부터 끝까지 다시 봅니다. 마스터는 따로 보관합니다.' }
      ],
      know: {
        title: '포스트를 알면 현장이 달라진다',
        items: [
          { tag: '편집', t: '컷 앞뒤로 3~5초 여유', d: '트랜지션과 음악 맞춤 편집의 선택지가 생깁니다.' },
          { tag: '사운드', t: '씬마다 룸톤 30초', d: '대사 사이 빈 소리를 자연스럽게 채우고 컷 간 소리 이질감을 줄입니다.' },
          { tag: '컬러', t: '노출과 WB를 씬 안에서 통일', d: '컷마다 색이 튀지 않아 컬러 작업 시간이 크게 줄어듭니다.' },
          { tag: '편집', t: '인서트와 컷어웨이 확보', d: '어색한 연결이나 초점이 아쉬운 컷을 가릴 수 있는 탈출구가 됩니다.' },
          { tag: '싱크', t: '슬레이트와 싱크 포인트', d: '멀티캠과 별도 녹음을 정확히 맞출 수 있습니다.' },
          { tag: '합성', t: '클린 플레이트 5~10초', d: '지우기와 합성 작업이 훨씬 쉬워집니다.' }
        ]
      }
    },

    outro: {
      quote: '컷은 이어붙일 때를 위해 찍는다.',
      cite: '영상놀',
      button: '영상놀에 문의하기',
      mail: 'mailto:hello@example.com'      // 실제 이메일 주소로 바꾸세요
    },

    footer: {
      links: [{ label: '상세 가이드(체크리스트와 계산기)', href: 'guide/index.html' }, { label: 'GitHub', href: 'https://github.com/delveintona/YOUNGSANGNOL' }]
    }
  };

  /* ======================================================================
     2) 유틸과 렌더링
     ====================================================================== */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // CSS 토큰(--color-*)을 [r,g,b] 로 읽는다. 캔버스는 CSS 변수를 직접 못 쓰기 때문
  const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  probe.canvas.width = probe.canvas.height = 1;
  const tok = (name) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    probe.clearRect(0, 0, 1, 1); probe.fillStyle = v; probe.fillRect(0, 0, 1, 1);
    const d = probe.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2]];
  };

  const sceneHead = (s) => `<h2 class="ko" data-reveal>${esc(s.kicker)}</h2><p class="lead" data-reveal>${esc(s.lead)}</p>`;
  const subHead = (d) => `<h2 data-reveal>${esc(d.en)}</h2><p class="lead" data-reveal><b>${esc(d.ko)}.</b> ${esc(d.lead)}</p>`;

  function render() {
    const C = CONTENT;

    // 히어로
    const markHtml = C.site.logo.src ? `<img src="${esc(C.site.logo.src)}" alt="${esc(C.site.logo.alt)}" class="logo">` : esc(C.site.mark);
    $('#heroMark').innerHTML = markHtml;
    $('.toc__brand').innerHTML = markHtml;
    $('.foot__mark').innerHTML = markHtml;
    $('#heroTitle').textContent = C.site.title;
    $('#heroSentence').textContent = C.site.sentence;
    $('#heroActions').innerHTML = C.site.actions.map((a) =>
      `<a class="btn ${a.primary ? 'btn--primary' : ''}" href="${esc(a.href)}">${esc(a.label)}</a>`).join('');

    // 목차
    $('#tocList').innerHTML = C.toc.map((t) =>
      `<li class="${t.sub ? 'sub' : ''}"><a href="#${t.id}" data-target="${t.id}">${t.no ? `<span>${esc(t.no)}</span>` : ''}${esc(t.label)}</a></li>`).join('');
    $('#tocFoot').innerHTML = C.site.tocFoot;

    // 소개
    $('#introStatement').textContent = C.intro.statement;
    $('#introRest').innerHTML = C.intro.rest.map((p) => `<p data-reveal>${esc(p)}</p>`).join('');

    // 챕터 타이틀: 큰 번호, 코드, 한글 제목
    Object.entries(C.scenes).forEach(([key, s]) => {
      $(`.chapter[data-chapter="${key}"] .chapter__inner`).innerHTML =
        `<span class="chapter__num figure" aria-hidden="true">${esc(s.num)}</span>` +
        `<div class="chapter__code" aria-hidden="true">${esc(s.code)}</div>` +
        `<h2 class="chapter__title ko" id="${key}Title">${esc(s.ko)}</h2>`;
    });
    $('#preHead').innerHTML = sceneHead(C.scenes.pre);
    $('#prodHead').innerHTML = sceneHead(C.scenes.prod);

    // 프리: 세 열
    $('#preCards').innerHTML = C.pre.map((c) =>
      `<article class="sheet__col" data-reveal><h3>${esc(c.en)}</h3><p class="ko-sub">${esc(c.ko)}</p>` +
      `<ul class="rows">${c.items.map((i) => `<li><b>${esc(i.t)}</b><span>${esc(i.d)}</span></li>`).join('')}</ul></article>`).join('');

    // 현장 하루
    const D = C.day;
    $('#dayHead').innerHTML = `<h2>${esc(D.en)}</h2><p class="note">${esc(D.ko)}</p>`;
    $('#dayTrack').innerHTML = D.cards.map((c) =>
      `<article class="day" role="listitem"><div><span class="day__time figure">${esc(c.time)}</span><h3>${esc(c.en)}</h3><p class="ko-sub">${esc(c.ko)}</p><p>${esc(c.d)}</p></div></article>`).join('');

    // 노출, 화이트밸런스, 연출
    $('#expHead').innerHTML = subHead(C.exposure);
    $('#wbHead').innerHTML = subHead(C.wb);
    $('#dirHead').innerHTML = subHead(C.directing);
    $('#expNote').textContent = C.exposure.note;
    $('#wbNote').textContent = C.wb.note;
    $('#falseLegend').innerHTML = C.exposure.falseLegend.map(([c, t]) => `<li style="--sw: var(${c})"><i></i>${esc(t)}</li>`).join('');
    $('#lightSeg').innerHTML = C.wb.lights.map((l) => `<button class="btn btn--small" type="button" data-k="${l.k}" aria-pressed="${l.k === 5600}">${esc(l.name)}</button>`).join('');
    $('#dirChecks').innerHTML = C.directing.checks.map((c) =>
      `<li><span class="box" aria-hidden="true"></span><div><h3>${esc(c.en)}</h3><p class="ko-sub">${esc(c.ko)}</p><p>${esc(c.d)}</p></div></li>`).join('');
    $('#dirTotal').textContent = '/ ' + C.directing.checks.length;

    // 포스트
    $('#postHead').innerHTML = `<h2 data-reveal>${esc(C.post.en)}</h2><p class="lead" data-reveal><b>${esc(C.post.ko)}.</b> ${esc(C.post.lead)}</p>`;
    $('#postSteps').insertAdjacentHTML('beforeend', C.post.steps.map((s) =>
      `<article class="vt__item" data-reveal><span class="vt__n figure">${esc(s.n)}</span><div><h3>${esc(s.en)}</h3><p class="ko-sub">${esc(s.ko)}</p><p>${esc(s.d)}</p>` +
      (s.badges ? `<ul class="copies">${s.badges.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : '') + `</div></article>`).join(''));
    const K = C.post.know;
    $('#postKnow').innerHTML = `<h2 class="ko" data-reveal>${esc(K.title)}</h2><dl>` +
      K.items.map((i) => `<div class="know__row" data-reveal><dt>${esc(i.tag)}</dt><dd><h3 class="ko">${esc(i.t)}</h3><p>${esc(i.d)}</p></dd></div>`).join('') + `</dl>`;

    // 마무리와 푸터
    const O = C.outro;
    $('#outroBox').innerHTML = `<blockquote data-reveal class="ko">${esc(O.quote)}</blockquote><cite data-reveal>${esc(O.cite)}</cite><a class="btn btn--primary" href="${esc(O.mail)}" data-reveal>${esc(O.button)}</a>`;
    const fl = $('#footLinks'); fl.style.display = 'flex'; fl.style.gap = 'var(--space-lg)';
    fl.innerHTML = C.footer.links.map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join('');

    // 사진 캡션, 사진 교체
    $('#capLocation').textContent = C.images.location.caption;
    $('#capSet').textContent = C.images.set.caption;
    $('#capEdit').textContent = C.images.edit.caption;
    const swap = {};
    Object.entries(C.images).forEach(([k, v]) => { if (v.src) swap[k] = { src: v.src, alt: v.alt }; });
    if (Object.keys(swap).length && window.hallmarkSlots) window.hallmarkSlots(swap);
  }

  /* ======================================================================
     3) 모션: HUD, 목차, Lenis, GSAP
     ====================================================================== */
  let lenis = null;
  let hTrigger = null;                       // 가로 스크롤 ScrollTrigger (목차 이동에 사용)

  // 스크롤 위치 기반 UI: 진행선, 타임코드, 목차 하이라이트
  function initHud() {
    const bar = $('#progress'), tcEl = $('#hudTc'), sceneEl = $('#hudScene'), toc = $('#toc');
    const links = $$('#tocList a');
    const targets = $$('[data-scene]');       // 문서 순서대로
    const pad2 = (n) => String(n).padStart(2, '0');
    let ticking = false, lastScene = '';

    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - innerHeight);
      const p = clamp(scrollY / max, 0, 1);
      bar.style.transform = `scaleX(${p})`;

      // 타임코드: 스크롤 진행률 x 가상 러닝타임(24fps)
      const frames = Math.floor(p * CONTENT.site.totalMinutes * 60 * 24);
      tcEl.textContent = `${pad2(Math.floor(frames / 86400))}:${pad2(Math.floor(frames / 1440) % 60)}:${pad2(Math.floor(frames / 24) % 60)}:${pad2(frames % 24)}`;

      // 현재 섹션: 화면 45% 지점을 지난 마지막 target
      let cur = targets[0];
      targets.forEach((t) => { if (t.getBoundingClientRect().top <= innerHeight * 0.45) cur = t; });
      const sc = cur.dataset.scene;
      if (sc !== lastScene) { sceneEl.textContent = sc; lastScene = sc; }
      links.forEach((a) => a.setAttribute('aria-current', String(a.dataset.target === cur.id)));
      const active = links.find((a) => a.dataset.target === cur.id);
      if (active && innerWidth < 1024) active.scrollIntoView({ inline: 'center', block: 'nearest' });

      // 히어로를 벗어나면 목차 등장
      toc.classList.toggle('is-on', scrollY > innerHeight * 0.55);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    update();
  }

  // 앵커 클릭: 부드럽게 이동 (가로 스크롤 구간은 pin 시작 위치로)
  function initAnchors() {
    $$('#tocList a, .toc__brand, #heroActions a').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      let y = el.getBoundingClientRect().top + scrollY;
      if (id === 'timeline' && hTrigger) y = hTrigger.start;
      if (innerWidth < 1024 && !['pre', 'prod', 'post', 'hero'].includes(id)) y -= 56;
      if (lenis) lenis.scrollTo(y, { duration: 1.4 }); else scrollTo({ top: y, behavior: 'auto' });
      history.replaceState(null, '', '#' + id);
    }));
  }

  function initMotion() {
    const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    // 라이브러리 로드 실패나 모션 감소 설정이면 정적 레이아웃으로 폴백
    if (!hasGsap || reduce) {
      document.documentElement.classList.add('no-motion');
      $('#timeline').classList.add('hscroll--native');
      $$('#dirChecks li').forEach((li) => li.classList.add('is-done'));
      $('#dirCount').textContent = CONTENT.directing.checks.length;
      const fill = $('#vtFill'); if (fill) fill.style.transform = 'scaleY(1)';
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Lenis 부드러운 스크롤 (ScrollTrigger와 동기화)
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // 히어로: 워드마크, 제목, 문장과 버튼 순서로 등장. 스크롤하면 배경이 확대되며 어두워짐
    const hi = [$('.hero__top'), ...$$('.hero__inner > *')];
    gsap.set(hi, { opacity: 0, y: 24 });
    gsap.to(hi, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.35, delay: 0.25 });
    gsap.fromTo('.hero__bg [data-slot] img', { scale: 1 }, { scale: 1.1, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.fromTo('#heroShade', { opacity: 0.35 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 30%', scrub: true } });
    gsap.to('.hero__inner', { y: -60, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: '30% top', end: 'bottom top', scrub: true } });

    // 챕터 전환: 가운데에 크게 등장, 잠시 머물고, 위로 올라가며 사라짐
    $$('.chapter').forEach((ch) => {
      const inner = $('.chapter__inner', ch);
      const tl = gsap.timeline({ scrollTrigger: { trigger: ch, start: 'top 65%', end: 'bottom bottom', scrub: true } });
      tl.fromTo(inner, { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.28 })
        .to(inner, { opacity: 1, duration: 0.3 })
        .to(inner, { opacity: 0, y: -180, ease: 'power2.in', duration: 0.42 });
    });

    // 등장 효과: 뷰포트에 들어오면 24px 올라오며 페이드인, 0.1초 간격
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%', once: true, interval: 0.1, batchMax: 6,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, overwrite: true })
    });

    // 사진 패럴랙스: 천천히 움직임
    $$('.plate [data-slot] img').forEach((img) => {
      gsap.fromTo(img, { scale: 1.12, yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: img.closest('[data-slot]'), start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // 가로 스크롤(pin): 현장 하루 타임라인
    const sec = $('#timeline'), track = $('#dayTrack');
    const dist = () => Math.max(0, track.scrollWidth - sec.clientWidth);
    const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: {
      trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true
    }});
    hTrigger = tween.scrollTrigger;

    // 연출 체크리스트: 스크롤 진행에 따라 한 줄씩 체크
    const items = $$('#dirChecks li'), count = $('#dirCount');
    ScrollTrigger.create({
      trigger: '#dirChecks', start: 'top 65%', end: 'bottom 55%', scrub: true,
      onUpdate: (self) => {
        const n = Math.round(self.progress * items.length);
        items.forEach((li, i) => li.classList.toggle('is-done', i < n));
        count.textContent = n;
      }
    });

    // 포스트 수직 타임라인: 스크롤에 따라 선이 채워짐
    gsap.to('#vtFill', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#postSteps', start: 'top 70%', end: 'bottom 60%', scrub: true } });

    // 폰트와 이미지가 늦게 로드돼도 위치를 다시 계산
    const refresh = () => ScrollTrigger.refresh();
    addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  }

  /* ======================================================================
     4) 데모: 노출 (웨이브폼과 폴스컬러)
     ====================================================================== */
  function initExposure() {
    const W = 320, H = 180, WH = 150;
    const AP = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
    const ISO = [100, 200, 400, 800, 1600, 3200, 6400];
    const SH = [24, 30, 48, 60, 100, 120, 250, 500];
    const BASE = { ap: 2, iso: 3, sh: 2 };

    const cv = $('#expCanvas'), wv = $('#waveCanvas');
    const ctx = cv.getContext('2d'), wctx = wv.getContext('2d');
    const $ap = $('#ctlAp'), $iso = $('#ctlIso'), $sh = $('#ctlSh');
    const out = $('#expReadout'), tag = $('#expTag'), btnF = $('#btnFalse');
    let falseOn = false;

    // 색은 모두 CSS 토큰에서 읽는다
    const INK = tok('--color-ink'), MUTED = tok('--color-muted'), ACCENT = tok('--color-accent'), RULE = tok('--color-rule');
    const FC = { crush: tok('--fc-crush'), dark: tok('--fc-dark'), green: tok('--fc-green'), skin: tok('--fc-skin'), warn: tok('--fc-warn'), clip: tok('--fc-clip') };

    // 장면의 밝기(선형 값)를 한 번만 계산. 0.18 근처가 중간 회색, 1.0 이상은 클리핑
    const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
    const lum = new Float32Array(W * H);
    const HEAD = { cx: 0.36, cy: 0.42, rx: 0.085, ry: 0.13 };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const u = x / W, v = y / H;
      let l = 0.05 + 0.05 * (1 - v) * (0.5 + 0.5 * u);                  // 벽
      if (v > 0.8) l = 0.03;                                            // 바닥
      // 창문(오른쪽): 아주 밝은 영역과 창틀
      const inWin = sm(0.678, 0.682, u) * (1 - sm(0.898, 0.902, u)) * sm(0.138, 0.142, v) * (1 - sm(0.498, 0.502, v));
      const frame = Math.max(1 - sm(0.006, 0.012, Math.abs(u - 0.79)), 1 - sm(0.006, 0.012, Math.abs(v - 0.32)));
      l = l + inWin * (4.0 - 3.6 * frame);
      l += 0.12 * Math.exp(-(Math.pow((u - 0.79) * 3, 2) + Math.pow((v - 0.32) * 4, 2)));   // 창 주변 번짐
      // 인물: 몸(어두운 재킷), 목, 머리(피부), 머리카락
      const body = Math.hypot((u - HEAD.cx) / 0.2, (v - 0.98) / 0.42);
      l = l * sm(0.97, 1.0, body) + 0.03 * (1 - sm(0.97, 1.0, body));
      const neck = (1 - sm(0.028, 0.032, Math.abs(u - HEAD.cx))) * sm(0.52, 0.54, v) * (1 - sm(0.64, 0.66, v));
      l = l * (1 - neck) + 0.2 * neck;
      const r = Math.hypot((u - HEAD.cx) / HEAD.rx, (v - HEAD.cy) / HEAD.ry);
      const side = clamp((u - HEAD.cx) / HEAD.rx, -1, 1);            // 창문(오른쪽)이 더 밝게
      let skin = 0.5 * (0.72 + 0.28 * side);
      if (v < HEAD.cy - 0.06) skin = 0.03;                           // 머리카락
      l = l * sm(0.94, 1.0, r) + skin * (1 - sm(0.94, 1.0, r));
      lum[y * W + x] = l;
    }
    // 고정 노이즈 (ISO에 비례해 세기만 바꿈)
    const noise = new Float32Array(W * H); let seed = 7;
    for (let i = 0; i < noise.length; i++) { seed = (seed * 16807) % 2147483647; noise[i] = (seed / 2147483647 - 0.5) * 2; }
    const skinIdx = Math.floor(HEAD.cy * H) * W + Math.floor(HEAD.cx * W);

    // 폴스컬러 매핑
    const fc = (d) => {
      if (d < 0.03) return FC.crush; if (d < 0.2) return FC.dark;
      if (d < 0.42) { const g = d * 255 | 0; return [g, g, g]; }
      if (d < 0.5) return FC.green; if (d < 0.56) return MUTED;
      if (d < 0.76) return FC.skin; if (d < 0.9) return INK;
      return d < 0.98 ? FC.warn : FC.clip;
    };

    const img = ctx.createImageData(W, H);
    const acc = new Uint16Array(W * WH);
    const wimg = wctx.createImageData(W, WH);

    function draw() {
      const N = AP[$ap.value], iso = ISO[$iso.value], s = SH[$sh.value];
      const stops = Math.log2((48 / s) * (iso / 800) * Math.pow(2.8 / N, 2));  // 기준 대비 스톱
      const g = Math.pow(2, stops);
      const namp = 0.012 * Math.sqrt(iso / 400);
      acc.fill(0);
      let clip = 0, crush = 0, skinD = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = y * W + x;
        let d = Math.pow(clamp(lum[i] * g, 0, 1), 1 / 2.2);
        d = clamp(d + noise[i] * namp * (1 - d * 0.6), 0, 1);
        if (d >= 0.985) clip++; else if (d < 0.04) crush++;
        if (i === skinIdx) skinD = d;
        const wy = Math.round((1 - d) * (WH - 1));
        if (acc[wy * W + x] < 65535) acc[wy * W + x]++;
        const o = i * 4;
        if (falseOn) { const c = fc(d); img.data[o] = c[0]; img.data[o + 1] = c[1]; img.data[o + 2] = c[2]; }
        else { img.data[o] = d * INK[0]; img.data[o + 1] = d * INK[1]; img.data[o + 2] = d * INK[2]; }   // 잉크색 기준의 따뜻한 흑백
        img.data[o + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);

      // 웨이브폼
      for (let i = 0; i < W * WH; i++) {
        const a = Math.min(1, acc[i] * 0.15), o = i * 4;
        wimg.data[o] = INK[0] * a; wimg.data[o + 1] = INK[1] * a; wimg.data[o + 2] = INK[2] * a; wimg.data[o + 3] = 255;
      }
      wctx.putImageData(wimg, 0, 0);
      wctx.fillStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},.12)`;      // 피부 톤 권장 구간 60~70%
      wctx.fillRect(0, (1 - 0.7) * WH, W, 0.1 * WH);
      wctx.strokeStyle = `rgb(${RULE[0]},${RULE[1]},${RULE[2]})`; wctx.fillStyle = `rgb(${MUTED[0]},${MUTED[1]},${MUTED[2]})`; wctx.font = '9px Barlow, sans-serif'; wctx.lineWidth = 1;
      [0, 0.25, 0.5, 0.75, 1].forEach((p) => {
        const y = Math.round((1 - p) * (WH - 1)) + 0.5;
        wctx.beginPath(); wctx.moveTo(0, y); wctx.lineTo(W, y); wctx.stroke();
        wctx.fillText(Math.round(p * 100), W - 22, clamp(y - 2, 9, WH - 2));
      });

      // 읽기 값과 안내
      const skinPct = Math.round(skinD * 100), clipPct = (clip / (W * H) * 100).toFixed(0), crushPct = (crush / (W * H) * 100).toFixed(0);
      const verdict = skinPct < 52 ? ['bad', '어두움 (언더)'] : skinPct < 58 ? ['warn', '조금 어두움'] : skinPct <= 72 ? ['ok', '적정'] : skinPct <= 80 ? ['warn', '조금 밝음'] : ['bad', '밝음 (오버)'];
      tag.textContent = verdict[0] === 'ok' ? '적정' : (skinPct < 58 ? '언더' : '오버');
      const sgn = stops > 0 ? '+' : '';
      const shutterNote = s === 48 ? '180° 기준 (24p)' : (s === 60 ? '플리커 대응으로 흔한 선택' : '영상에서는 가급적 고정');
      const row = (k, v, cls = '') => `<div><dt>${k}</dt><dd class="${cls}">${v}</dd></div>`;
      out.innerHTML =
        row('기준 대비', `${sgn}${stops.toFixed(1)} 스톱`) +
        row('얼굴 (권장 60~70%)', `${skinPct}% ${verdict[1]}`, verdict[0]) +
        row('하이라이트 클리핑', `${clipPct}%`, clipPct > 12 ? 'warn' : '') +
        row('섀도 뭉개짐', `${crushPct}%`, crushPct > 40 ? 'warn' : '') +
        row('셔터', shutterNote);
      $('#outAp').textContent = 'f/' + N; $('#outIso').textContent = iso; $('#outSh').textContent = '1/' + s;
    }

    [$ap, $iso, $sh].forEach((el) => el.addEventListener('input', draw));
    const legend = $('#falseLegend'); legend.dataset.off = '';
    btnF.addEventListener('click', () => {
      falseOn = !falseOn; btnF.setAttribute('aria-pressed', falseOn);
      if (falseOn) legend.removeAttribute('data-off'); else legend.dataset.off = ''; draw();
    });
    $('#btnReset').addEventListener('click', () => { $ap.value = BASE.ap; $iso.value = BASE.iso; $sh.value = BASE.sh; draw(); });
    draw();
  }

  /* ======================================================================
     5) 데모: 화이트밸런스 (켈빈 슬라이더)
     ====================================================================== */
  function initWB() {
    const W = 320, H = 180;
    const cv = $('#wbCanvas'), ctx = cv.getContext('2d');
    const slider = $('#kelvin'), outK = $('#outK'), tag = $('#wbTag'), out = $('#wbReadout');
    let light = 5600;

    // 중립 조명 아래의 색 차트(반사율)를 그려 둔다: 배경 위에 4 x 2 패치
    const paper = tok('--color-paper-2');
    ctx.fillStyle = `rgb(${paper[0]},${paper[1]},${paper[2]})`; ctx.fillRect(0, 0, W, H);
    const cols = 4, pw = 70, ph = 70, gx = 10, gy = 14, ox = (W - (cols * pw + (cols - 1) * gx)) / 2, oy = 14;
    ctx.font = '600 10px "Pretendard Variable", Barlow, sans-serif'; ctx.textBaseline = 'bottom';
    CONTENT.wb.chart.forEach(([name, col], i) => {
      const x = ox + (i % cols) * (pw + gx), y = oy + Math.floor(i / cols) * (ph + gy + 6);
      ctx.fillStyle = col; ctx.fillRect(x, y, pw, ph);
    });
    const base = ctx.getImageData(0, 0, W, H);      // 라벨은 보정 뒤에 덧그린다
    const dst = ctx.createImageData(W, H);
    const labelInk = tok('--color-ink');

    // 색온도를 RGB 로 (Tanner Helland 근사). 0~1
    const kRGB = (k) => {
      const t = k / 100; let r, g, b;
      if (t <= 66) { r = 255; g = 99.4708025861 * Math.log(t) - 161.1195681661; b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307; }
      else { r = 329.698727446 * Math.pow(t - 60, -0.1332047592); g = 288.1221695283 * Math.pow(t - 60, -0.0755148492); b = 255; }
      return [clamp(r, 0, 255) / 255, clamp(g, 0, 255) / 255, clamp(b, 0, 255) / 255];
    };

    function draw() {
      const set = +slider.value;
      const L = kRGB(light), S = kRGB(set);
      let gain = [L[0] / S[0], L[1] / S[1], L[2] / S[2]];
      const y = 0.2126 * gain[0] + 0.7152 * gain[1] + 0.0722 * gain[2];   // 밝기 유지를 위해 정규화
      gain = gain.map((v) => v / y);
      for (let i = 0; i < base.data.length; i += 4) {
        dst.data[i] = clamp(base.data[i] * gain[0], 0, 255);
        dst.data[i + 1] = clamp(base.data[i + 1] * gain[1], 0, 255);
        dst.data[i + 2] = clamp(base.data[i + 2] * gain[2], 0, 255);
        dst.data[i + 3] = 255;
      }
      ctx.putImageData(dst, 0, 0);
      ctx.fillStyle = `rgb(${labelInk[0]},${labelInk[1]},${labelInk[2]})`; ctx.textBaseline = 'top';
      CONTENT.wb.chart.forEach(([name], i) => {
        ctx.fillText(name, ox + (i % cols) * (pw + gx), oy + Math.floor(i / cols) * (ph + gy + 6) + ph + 2);
      });
      outK.textContent = set + 'K'; tag.textContent = `설정 ${set}K, 조명 ${light}K`;
      const diff = set - light;
      const res = Math.abs(diff) < 300 ? ['ok', '거의 중립. 흰 카드가 희게 보입니다']
        : diff < 0 ? ['warn', '푸르게(차갑게) 보임. 설정이 조명보다 낮음'] : ['warn', '노랗게(따뜻하게) 보임. 설정이 조명보다 높음'];
      const row = (k, v, cls = '') => `<div><dt>${k}</dt><dd class="${cls}">${v}</dd></div>`;
      out.innerHTML = row('카메라 설정', `${set}K`) + row('현장 조명', `${light}K`) + row('차이', `${diff > 0 ? '+' : ''}${diff}K`) + row('결과', res[1], res[0]);
    }
    slider.addEventListener('input', draw);
    $$('#lightSeg button').forEach((b) => b.addEventListener('click', () => {
      light = +b.dataset.k; $$('#lightSeg button').forEach((x) => x.setAttribute('aria-pressed', x === b)); draw();
    }));
    draw();
  }

  /* ======================================================================
     시작
     ====================================================================== */
  render();
  initExposure();
  initWB();
  initHud();
  initAnchors();
  const start = () => { initMotion(); if (location.hash) { const el = document.getElementById(location.hash.slice(1)); if (el) setTimeout(() => el.scrollIntoView(), 200); } };
  if (document.readyState === 'complete') start(); else addEventListener('load', start);
})();
