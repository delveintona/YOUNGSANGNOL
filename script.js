/* ==========================================================================
   YOUNGSANGNOL — script.js
   --------------------------------------------------------------------------
   1) CONTENT  : 사이트의 모든 텍스트/이미지 정보 (여기만 고치면 화면에 반영됩니다)
   2) 렌더링   : CONTENT → HTML
   3) 모션     : Lenis 부드러운 스크롤 + GSAP ScrollTrigger
   4) 데모     : 노출(웨이브폼·폴스컬러) / 화이트밸런스 캔버스
   ========================================================================== */
(() => {
  'use strict';

  /* ======================================================================
     1) CONTENT — 텍스트·사진은 이 객체만 수정하세요
     ====================================================================== */
  const CONTENT = {
    site: {
      title: 'YOUNGSANGNOL',
      copy: '찍기 전에, 찍는 동안, 찍고 난 뒤까지.',
      sub: ['CINEMATOGRAPHY', 'DIRECTING', 'PROCESS NOTES'],
      tocFoot: '촬영 노하우 &<br>프로세스 아카이브',
      totalMinutes: 12            // 타임코드용 가상 러닝타임(분). 스크롤 0~100%가 이 길이에 대응
    },

    /* 이미지: src를 채우면 실제 사진, 비워 두면 회색 플레이스홀더가 나옵니다.
       alt = 접근성용 설명(어떤 사진이 들어갈지), label = 화면에 보이는 짧은 설명 */
    images: {
      hero:     { src: '', ratio: '',     tone: 'a', label: '히어로 배경', alt: '어두운 촬영 현장 전경. 카메라와 조명이 세팅된 스튜디오를 넓게 담은 사진' },
      portrait: { src: '', ratio: 'portrait', tone: 'b', label: '작업 중인 나', alt: '카메라 뒤에서 모니터를 보며 작업하는 촬영감독의 사진' },
      location: { src: '', ratio: 'wide', tone: 'b', label: '로케이션 헌팅', alt: '로케이션 헌팅 중 빛 방향을 확인하는 모습. 창문으로 들어오는 아침 햇빛' },
      set:      { src: '', ratio: 'wide', tone: 'c', label: '현장 세팅', alt: '촬영 현장에서 배우 동선을 맞추는 블로킹 장면' },
      edit:     { src: '', ratio: 'wide', tone: 'a', label: '편집실', alt: '편집실에서 타임라인과 컬러 모니터를 보고 있는 작업 사진' },
      finale:   { src: '', ratio: 'wide', tone: 'c', label: '마지막 컷', alt: '촬영이 끝난 늦은 저녁 현장, 장비를 정리하는 실루엣' }
    },

    intro: [
      '촬영감독이자 연출자로 현장에서 쓰던 노하우와 프로세스를 정리해 둔 아카이브입니다.',
      '프리 · 프로 · 포스트 순서로 읽으면 한 편의 영상이 어떻게 만들어지는지 흐름이 보입니다.',
      '정답이 아니라 제가 현장에서 반복해서 써 온 기준입니다. 가져가서 각자의 현장에 맞게 바꿔 쓰세요.'
    ],

    /* 좌측 목차. sub: true는 들여쓴 하위 항목 */
    toc: [
      { id: 'intro',     no: '00', label: '소개' },
      { id: 'pre',       no: '01', label: '프리 프로덕션' },
      { id: 'prod',      no: '02', label: '프로덕션' },
      { id: 'timeline',  no: '·',  label: '현장 하루', sub: true },
      { id: 'exposure',  no: '·',  label: '노출', sub: true },
      { id: 'wb',        no: '·',  label: '화이트밸런스', sub: true },
      { id: 'directing', no: '·',  label: '연출 체크', sub: true },
      { id: 'post',      no: '03', label: '포스트 프로덕션' },
      { id: 'outro',     no: '—',  label: '마무리' }
    ],

    scenes: {
      pre: {
        no: 'SCENE 01', code: 'PRE', ko: '프리 프로덕션', kicker: '촬영 날 할 결정을, 촬영 날 전에 끝내기',
        lead: '현장에서 고민하는 시간은 곧 돈이고 체력입니다. 준비가 잘 된 현장은 조용하고 빠릅니다.'
      },
      prod: {
        no: 'SCENE 02', code: 'PROD', ko: '프로덕션', kicker: '실제로 카메라가 돌아가는 날',
        lead: '계획을 현실에 맞게 조정하면서, 편집하는 사람이 쓸 수 있는 소스를 가장 빠르고 안전하게 확보합니다.'
      },
      post: {
        no: 'SCENE 03', code: 'POST', ko: '포스트 프로덕션', kicker: '찍어 온 것을 한 편으로 완성하기',
        lead: '편집의 목표는 컷을 이어 붙이는 것이 아니라 이야기의 리듬을 만드는 것입니다.'
      }
    },

    /* 프리 프로덕션: 연출 / 촬영 / 제작 3열 카드 */
    pre: [
      { no: '01', en: 'DIRECTING', ko: '연출', items: [
        { t: '대본 해석', d: '장면마다 인물의 목적과 감정선을 한 문장으로 적어 둡니다.' },
        { t: '톤 & 레퍼런스', d: '말로만 합의한 느낌은 반드시 엇갈립니다. 이미지로 정합니다.' },
        { t: '콘티 · 샷리스트', d: '컷마다 사이즈·앵글·움직임·우선순위(★)를 정리합니다.' },
        { t: '블로킹', d: '배우 동선과 카메라 위치를 로케이션에서 미리 맞춰 봅니다.' }
      ]},
      { no: '02', en: 'CAMERA', ko: '촬영', items: [
        { t: '로케이션 헌팅', d: '촬영 시간대에 직접 가서 해 방향·전기·소음·반사를 확인합니다.' },
        { t: '장비 선정', d: '샷리스트에서 역산해 렌즈·삼각대·짐벌·마이크를 정합니다.' },
        { t: '조명 계획', d: '자연광을 기준으로 필요한 조명·ND·디퓨전을 산정합니다.' },
        { t: '테스트 촬영', d: '카메라·LUT를 편집 프로그램까지 통과시켜 룩을 확정합니다.' }
      ]},
      { no: '03', en: 'PRODUCTION', ko: '제작', items: [
        { t: '일정', d: '씬 순서가 아니라 장소·조명 조건으로 묶어 스케줄을 짭니다.' },
        { t: '예산', d: '예비비 10%를 처음부터 넣어 둡니다.' },
        { t: '섭외 · 허가', d: '출연자·장소·촬영 허가와 초상권·저작권 동의를 챙깁니다.' },
        { t: '안전 · 콜시트', d: '집합 시간, 연락처, 일몰, 가까운 병원까지 한 장에 담습니다.' }
      ]}
    ],

    /* 프로덕션: 현장 하루 타임라인 (가로 스크롤) */
    day: {
      no: 'SCENE 02 · 00', en: 'A DAY ON SET', ko: '촬영 현장 하루',
      hint: '↓ SCROLL — 카드가 가로로 흘러갑니다',
      cards: [
        { time: '07:30', en: 'Call', ko: '콜타임', d: '집합과 안전 브리핑. 오늘의 목표 컷과 우선순위, 위험 요소를 3분 안에 공유합니다.' },
        { time: '08:30', en: 'Setup', ko: '세팅', d: '블로킹을 먼저 보고 카메라와 조명을 세웁니다. 스탠드인으로 노출과 초점을 확인합니다.' },
        { time: '10:30', en: 'Rehearsal', ko: '리허설', d: '실제 속도로 연기와 카메라 무빙을 맞춥니다. 포커스 마크, 마이크 위치, 그림자를 점검합니다.' },
        { time: '11:00', en: 'Takes', ko: '테이크', d: '슬레이트 → 액션 → 컷. 연기·기술·소리·연결, 네 가지가 통과해야 OK입니다.' },
        { time: '18:00', en: 'Wrap', ko: '랩', d: '룸톤 30초를 녹음하고 장비 수량과 원상복구를 확인한 뒤 철수합니다.' },
        { time: '19:00', en: 'Backup', ko: '백업', d: '복사본이 2개 이상 생기기 전에는 카드를 지우지 않습니다. 촬영 일지도 남깁니다.' }
      ]
    },

    exposure: {
      no: 'SCENE 02 · 01', en: 'EXPOSURE', ko: '노출',
      lead: '조리개·ISO·셔터를 움직여 보세요. 얼굴이 적정 범위에 오는지, 창문이 얼마나 날아가는지 눈이 아니라 웨이브폼으로 확인하는 연습입니다.',
      baseline: '기준: f/2.8 · ISO 800 · 1/48 (24p, 180° 셔터)',
      note: '노출은 하이라이트를 지키고, 얼굴을 기준으로 맞춥니다. 영상에서는 셔터를 프레임레이트의 2배 분의 1로 고정하고, 밝기는 조명·ND·ISO로 조절합니다. 이 데모의 밝기는 설명용 근사 모델입니다.',
      falseLegend: [
        ['#5a1e8c', '0–3% 뭉개짐'], ['#1e46c8', '3–20% 어두움'], ['#808080', '중간 톤'],
        ['#2ea84a', '42–50% 중간 회색'], ['#f08fb8', '56–76% 피부 톤'], ['#f0dc3c', '90–97% 밝음'], ['#e02020', '98%+ 클리핑']
      ]
    },

    wb: {
      no: 'SCENE 02 · 02', en: 'WHITE BALANCE', ko: '화이트밸런스',
      lead: '화이트밸런스는 흰색을 흰색으로 만드는 값이 아니라 화면 색의 기준점입니다. 현장 조명과 카메라 설정이 같을 때 중립이 됩니다.',
      lights: [
        { k: 3200, name: '텅스텐 3200K' }, { k: 4300, name: '형광등 4300K' },
        { k: 5600, name: '주광 5600K' }, { k: 6500, name: '흐린 날 6500K' }
      ],
      note: '오토 WB는 끄고 K 값으로 고정하세요. 한 씬 안에서는 바꾸지 않고, 혼합광은 젤(CTB/CTO)이나 조명 색온도로 먼저 정리합니다.'
    },

    directing: {
      no: 'SCENE 02 · 03', en: 'DIRECTING CHECK', ko: '컷마다 확인할 것',
      lead: '스크롤을 내리면 체크가 하나씩 채워집니다. 컷이 끝날 때마다 이 일곱 가지를 눈으로 훑습니다.',
      checks: [
        { t: '시선 Eyeline', d: 'A가 화면 오른쪽을 보면 B는 왼쪽을 봅니다. 카메라 높이도 시선 높이에 맞춥니다.' },
        { t: '화면 방향 Screen Direction', d: '좌→우로 걷던 인물은 다음 컷에서도 같은 방향이어야 합니다.' },
        { t: '180도 룰 Axis', d: '두 인물을 잇는 선의 한쪽에만 카메라를 둡니다. 넘으면 좌우가 뒤바뀝니다.' },
        { t: '소품 Props', d: '컵의 음료 양, 문서의 페이지, 휴대폰 화면까지 앞 컷과 같은지 봅니다.' },
        { t: '의상 Costume', d: '단추, 소매, 머리카락, 땀과 눈물의 정도를 연속성 사진과 대조합니다.' },
        { t: '대사 타이밍 Timing', d: '말 속도와 쉬는 지점이 컷마다 같아야 편집에서 바꿔 붙일 수 있습니다.' },
        { t: '액션 연결 Match', d: '동작 중간에서 컷을 자를 수 있게, 시작·끝 위치와 속도를 맞춥니다.' }
      ]
    },

    post: {
      no: 'SCENE 03 · 00', en: 'POST PIPELINE', ko: '포스트 프로덕션 순서',
      lead: '픽처 락(편집 확정) 전에는 사운드와 컬러를 마무리하지 않습니다. 순서를 지키면 되돌아가는 일이 줄어듭니다.',
      steps: [
        { n: '01', en: 'BACKUP', ko: '데이터 백업 (3벌)', d: '원본 + 복사본 2개를 서로 다른 저장장치에 둡니다. 파일 개수와 용량을 확인한 뒤에만 카드를 포맷합니다.', badges: ['ORIGINAL', 'COPY A', 'COPY B'] },
        { n: '02', en: 'EDIT', ko: '편집', d: '셀렉 → 러프 컷 → 파인 컷 순서. 러프에서는 구조를, 파인에서는 호흡과 이음새를 봅니다.' },
        { n: '03', en: 'COLOR', ko: '컬러', d: '1차 보정으로 노출·화이트밸런스를 통일한 뒤 룩을 입힙니다. 마지막에 스킨 톤과 컷 매칭을 점검합니다.' },
        { n: '04', en: 'SOUND', ko: '사운드', d: '대사 정리 → 효과음 → 음악 → 믹스. 대사가 가장 크게 들리고 음악은 그 아래에 깝니다.' },
        { n: '05', en: 'DELIVER', ko: '납품', d: '플랫폼 규격에 맞춰 출력하고, 출력한 파일을 처음부터 끝까지 다시 봅니다. 마스터는 따로 보관합니다.' }
      ],
      know: {
        en: 'KNOW POST, CHANGE SET', ko: '포스트를 알면 현장이 달라진다',
        items: [
          { tag: 'EDIT',  t: '컷 앞뒤로 3~5초 여유', d: '트랜지션과 음악 맞춤 편집의 선택지가 생깁니다.' },
          { tag: 'SOUND', t: '씬마다 룸톤 30초', d: '대사 사이 빈 소리를 자연스럽게 채우고 컷 간 소리 이질감을 줄입니다.' },
          { tag: 'COLOR', t: '노출·WB를 씬 안에서 통일', d: '컷마다 색이 튀지 않아 컬러 작업 시간이 크게 줄어듭니다.' },
          { tag: 'EDIT',  t: '인서트·컷어웨이 확보', d: '어색한 연결이나 초점이 아쉬운 컷을 가릴 수 있는 탈출구가 됩니다.' },
          { tag: 'SYNC',  t: '슬레이트와 싱크 포인트', d: '멀티캠과 별도 녹음을 정확히 맞출 수 있습니다.' },
          { tag: 'VFX',   t: '클린 플레이트 5~10초', d: '지우기와 합성 작업이 훨씬 쉬워집니다.' }
        ]
      }
    },

    outro: {
      quote: '컷은 이어붙일 때를 위해 찍는다.',
      cite: '— YOUNGSANGNOL',
      button: '문의하기 CONTACT',
      mail: 'mailto:hello@example.com'      // ← 실제 이메일 주소로 바꾸세요
    },

    footer: {
      left: '© YOUNGSANGNOL',
      links: [{ label: '상세 가이드(체크리스트·계산기) →', href: 'guide/index.html' }, { label: 'GitHub', href: 'https://github.com/delveintona/YOUNGSANGNOL' }]
    }
  };

  /* ======================================================================
     2) 유틸 & 렌더링
     ====================================================================== */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 이미지/플레이스홀더. src가 있으면 <img loading="lazy">, 없으면 라벨이 붙은 회색 박스
  const photo = (key, { caption = true } = {}) => {
    const d = CONTENT.images[key];
    const inner = d.src
      ? `<img src="${esc(d.src)}" alt="${esc(d.alt)}" loading="lazy" decoding="async">`
      : `<div class="ph__fill" role="img" aria-label="${esc(d.alt)}"></div>`;
    const ratio = d.ratio ? `ph--${d.ratio}` : '';
    return `<figure class="ph ${ratio}" data-tone="${d.tone || 'a'}"><div class="ph__in">${inner}</div>${caption ? `<figcaption class="ph__cap"><span>${esc(d.label)}</span></figcaption>` : ''}</figure>`;
  };

  // 섹션 머리말(슬레이트 번호 + 제목 + 설명)
  const head = (d, id, tag = 'h2') =>
    `<p class="label slate-no" data-reveal>${esc(d.no)}</p>` +
    `<${tag} class="${tag === 'h2' ? 'h2' : 'h3'}" ${id ? `id="${id}"` : ''} data-reveal>${esc(d.en)} <span class="sr-only">${esc(d.ko)}</span></${tag}>` +
    `<p class="lead" data-reveal><b style="color:var(--text)">${esc(d.ko)}.</b> ${esc(d.lead)}</p>`;

  function render() {
    const C = CONTENT;

    // 히어로
    $('#heroCopy').textContent = C.site.copy;
    $('#heroTitle').textContent = C.site.title;
    $('#heroSub').innerHTML = C.site.sub.map((s) => `<span>${esc(s)}</span>`).join('');

    // 목차
    $('#tocList').innerHTML = C.toc.map((t) =>
      `<li class="${t.sub ? 'sub' : ''}"><a href="#${t.id}" data-target="${t.id}"><span>${esc(t.no)}</span>${esc(t.label)}</a></li>`).join('');
    $('#tocFoot').innerHTML = C.site.tocFoot;

    // 소개
    $('#introLines').innerHTML = C.intro.map((p) => `<p data-reveal>${esc(p)}</p>`).join('');

    // 이미지 자리(data-ph) 채우기
    $$('[data-ph]').forEach((el) => {
      const key = el.dataset.ph;
      el.innerHTML = photo(key, { caption: key !== 'hero' });
    });

    // 챕터 타이틀 (화면 가운데에 크게)
    Object.entries(C.scenes).forEach(([key, s]) => {
      const inner = $(`.chapter[data-chapter="${key}"] .chapter__inner`);
      inner.innerHTML =
        `<span class="chapter__no">${esc(s.no)} / ${esc(s.code)}</span>` +
        `<div class="chapter__code" aria-hidden="true">${esc(s.code)}</div>` +
        `<h2 class="chapter__title" id="${key}Title">${esc(s.ko)}</h2>` +
        `<p class="chapter__kicker">${esc(s.kicker)}</p>`;
    });

    // 각 큰 섹션 머리말
    const sceneHead = (key, id) => `<p class="label slate-no" data-reveal>${esc(C.scenes[key].no)} / ${esc(C.scenes[key].code)}</p>` +
      `<h3 class="h2" data-reveal>${esc(C.scenes[key].ko)}</h3><p class="lead" data-reveal>${esc(C.scenes[key].lead)}</p>`;
    $('#preHead').innerHTML = sceneHead('pre');
    $('#prodHead').innerHTML = sceneHead('prod');

    // 프리: 3열 카드
    $('#preCards').innerHTML = C.pre.map((c) =>
      `<article class="card" data-reveal><span class="card__no">${esc(c.no)}</span><h3>${esc(c.en)}</h3><p class="card__ko">${esc(c.ko)}</p>` +
      `<ul>${c.items.map((i) => `<li><span><b>${esc(i.t)}</b> — ${esc(i.d)}</span></li>`).join('')}</ul></article>`).join('');

    // 현장 하루 타임라인
    const D = C.day;
    $('#dayHead').innerHTML = `<p class="label slate-no">${esc(D.no)}</p><h3 class="h2">${esc(D.en)}</h3><p class="hscroll__hint">${esc(D.hint)}</p>`;
    $('#dayTrack').innerHTML = D.cards.map((c, i) =>
      `<article class="day" role="listitem"><div><span class="day__time">${esc(c.time)}</span><h3>${esc(c.en)}<small>${esc(c.ko)}</small></h3><p>${esc(c.d)}</p></div><div class="day__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</div></article>`).join('');

    // 노출 / WB / 연출 머리말
    const sub = (d) => `<p class="label slate-no" data-reveal>${esc(d.no)}</p><h3 class="h2" data-reveal>${esc(d.en)}</h3><p class="lead" data-reveal><b style="color:var(--text)">${esc(d.ko)}.</b> ${esc(d.lead)}</p>`;
    $('#expHead').innerHTML = sub(C.exposure);
    $('#wbHead').innerHTML = sub(C.wb);
    $('#dirHead').innerHTML = sub(C.directing);
    $('#expNote').textContent = C.exposure.note;
    $('#wbNote').textContent = C.wb.note;
    $('#falseLegend').innerHTML = C.exposure.falseLegend.map(([c, t]) => `<span><i style="background:${c}"></i>${esc(t)}</span>`).join('');
    $('#lightSeg').innerHTML = C.wb.lights.map((l) => `<button class="btn btn--sm" type="button" data-k="${l.k}" aria-pressed="${l.k === 5600}">${esc(l.name)}</button>`).join('');

    // 연출 체크리스트
    $('#dirChecks').innerHTML = C.directing.checks.map((c) =>
      `<li><span class="box" aria-hidden="true"></span><div><h4>${esc(c.t)}</h4><p>${esc(c.d)}</p></div></li>`).join('');
    $('#dirTotal').textContent = '/ ' + C.directing.checks.length;

    // 포스트
    $('#postHead').innerHTML = `<p class="label slate-no" data-reveal>${esc(C.post.no)}</p><h3 class="h2" data-reveal>${esc(C.post.en)}</h3><p class="lead" data-reveal><b style="color:var(--text)">${esc(C.post.ko)}.</b> ${esc(C.post.lead)}</p>`;
    $('#postSteps').insertAdjacentHTML('beforeend', C.post.steps.map((s) =>
      `<article class="vt__item" data-reveal><span class="vt__dot">${esc(s.n)}</span><h3>${esc(s.en)}<small>${esc(s.ko)}</small></h3><p>${esc(s.d)}</p>` +
      (s.badges ? `<div class="copies">${s.badges.map((b) => `<span>${esc(b)}</span>`).join('')}</div>` : '') + `</article>`).join(''));
    const K = C.post.know;
    $('#postKnow').innerHTML = `<p class="label" data-reveal>${esc(K.en)}</p><h3 class="h2" data-reveal>${esc(K.ko)}</h3>` +
      `<ul class="know__list">${K.items.map((i) => `<li data-reveal><em>${esc(i.tag)}</em><b>${esc(i.t)}</b><span>${esc(i.d)}</span></li>`).join('')}</ul>`;

    // 마무리 + 푸터
    const O = C.outro;
    $('#outroBox').innerHTML = `<blockquote data-reveal>${esc(O.quote)}</blockquote><cite data-reveal>${esc(O.cite)}</cite>` +
      `<a class="btn" href="${esc(O.mail)}" data-reveal>${esc(O.button)}</a><div style="width:100%;max-width:1100px" data-reveal>${photo('finale')}</div>`;
    $('#foot').innerHTML = `<span>${esc(C.footer.left)}</span><span>${C.footer.links.map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join(' · ')}</span>`;
  }

  /* ======================================================================
     3) 모션 — HUD / 목차 / Lenis / GSAP
     ====================================================================== */
  let lenis = null;
  let hTrigger = null;                       // 가로 스크롤 ScrollTrigger (목차 이동에 사용)

  // 스크롤 위치 기반 UI: 진행바, 타임코드, 목차 하이라이트
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

      // 타임코드: 스크롤 진행률 × 가상 러닝타임(24fps)
      const frames = Math.floor(p * CONTENT.site.totalMinutes * 60 * 24);
      tcEl.textContent = `${pad2(Math.floor(frames / 86400))}:${pad2(Math.floor(frames / 1440) % 60)}:${pad2(Math.floor(frames / 24) % 60)}:${pad2(frames % 24)}`;

      // 현재 섹션: 화면 45% 지점을 지난 마지막 target
      let cur = targets[0];
      targets.forEach((t) => { if (t.getBoundingClientRect().top <= innerHeight * 0.45) cur = t; });
      const sc = cur.dataset.scene;
      if (sc !== lastScene) { sceneEl.textContent = sc; lastScene = sc; }
      links.forEach((a) => a.setAttribute('aria-current', String(a.dataset.target === cur.id)));
      // 모바일 가로 바에서 현재 항목이 보이도록 스크롤
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

  // 목차 클릭 → 부드럽게 이동 (가로 스크롤 구간은 pin 시작 위치로)
  function initTocLinks() {
    $$('#tocList a, .toc__brand').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      let y = el.getBoundingClientRect().top + scrollY;
      if (id === 'timeline' && hTrigger) y = hTrigger.start;
      y -= innerWidth < 1024 && id !== 'pre' && id !== 'prod' && id !== 'post' ? 56 : 0;
      if (lenis) lenis.scrollTo(y, { duration: 1.4 }); else scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
      history.replaceState(null, '', '#' + id);
    }));
  }

  function initMotion() {
    const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    // 라이브러리 로드 실패/모션 감소 설정: 정적 레이아웃으로 폴백
    if (!hasGsap || reduce) {
      document.documentElement.classList.add('no-motion');
      $('#timeline').classList.add('hscroll--native');
      // 체크리스트·타임라인을 완성된 상태로 표시
      $$('#dirChecks li').forEach((li) => li.classList.add('is-done'));
      $('#dirCount').textContent = CONTENT.directing.checks.length;
      const fill = $('#vtFill'); if (fill) fill.style.transform = 'scaleY(1)';
      $$('.ph__in img, .ph__fill').forEach((n) => n.style.filter = 'none');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // --- Lenis 부드러운 스크롤 (ScrollTrigger와 동기화) ---
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // --- 히어로: 카피 → 제목 → 서브 순서로 등장, 스크롤하면 배경 확대 + 어두워짐 ---
    const hi = $$('.hero__inner > *');
    gsap.set(hi, { opacity: 0, y: 24 });
    gsap.to(hi, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.45, delay: 0.3 });
    gsap.fromTo('.hero__bg .ph__in', { scale: 1 }, { scale: 1.1, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.fromTo('#heroShade', { opacity: 0.38 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 30%', scrub: true } });
    gsap.to('.hero__inner', { y: -60, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: '30% top', end: 'bottom top', scrub: true } });

    // --- 챕터 전환: 가운데에 크게 등장 → 잠시 머묾 → 위로 올라가며 사라짐 ---
    $$('.chapter').forEach((ch) => {
      const inner = $('.chapter__inner', ch);
      const tl = gsap.timeline({ scrollTrigger: { trigger: ch, start: 'top 65%', end: 'bottom bottom', scrub: true } });
      tl.fromTo(inner, { opacity: 0, y: 60, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 0.28 })
        .to(inner, { opacity: 1, duration: 0.3 })
        .to(inner, { opacity: 0, y: -180, ease: 'power2.in', duration: 0.42 });
    });

    // --- 등장 효과: 뷰포트에 들어오면 24px 올라오며 페이드인, 0.1초 간격 ---
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%', once: true, interval: 0.1, batchMax: 6,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, overwrite: true })
    });

    // --- 이미지 패럴랙스 (느리게 이동) ---
    $$('.ph').forEach((ph) => {
      if (ph.closest('.hero')) return;
      gsap.fromTo($('.ph__in', ph), { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: ph, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // --- 가로 스크롤(pin): 현장 하루 타임라인 ---
    const sec = $('#timeline'), track = $('#dayTrack');
    const dist = () => Math.max(0, track.scrollWidth - sec.clientWidth);
    const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: {
      trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true
    }});
    hTrigger = tween.scrollTrigger;

    // --- 연출 체크리스트: 스크롤 진행에 따라 한 줄씩 체크 ---
    const items = $$('#dirChecks li'), count = $('#dirCount');
    ScrollTrigger.create({
      trigger: '#dirChecks', start: 'top 65%', end: 'bottom 55%', scrub: true,
      onUpdate: (self) => {
        const n = Math.round(self.progress * items.length);
        items.forEach((li, i) => li.classList.toggle('is-done', i < n));
        count.textContent = n;
      }
    });

    // --- 포스트 수직 타임라인: 스크롤에 따라 선이 채워짐 ---
    gsap.to('#vtFill', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#postSteps', start: 'top 70%', end: 'bottom 60%', scrub: true } });

    // 폰트/이미지가 늦게 로드돼도 위치를 다시 계산
    const refresh = () => ScrollTrigger.refresh();
    addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  }

  /* ======================================================================
     4) 데모 — 노출 (웨이브폼 + 폴스컬러)
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

    // 장면의 "밝기(선형 값)"를 한 번만 계산. 0.18 근처가 중간 회색, 1.0 이상은 클리핑
    const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
    const lum = new Float32Array(W * H);
    const HEAD = { cx: 0.36, cy: 0.42, rx: 0.085, ry: 0.13 };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const u = x / W, v = y / H;
      let l = 0.05 + 0.05 * (1 - v) * (0.5 + 0.5 * u);                  // 벽
      if (v > 0.8) l = 0.03;                                            // 바닥
      // 창문(오른쪽): 아주 밝은 영역 + 창틀
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
    const fc = (d) => d < 0.03 ? [90, 30, 140] : d < 0.2 ? [30, 70, 200] : d < 0.42 ? [d * 255 | 0, d * 255 | 0, d * 255 | 0]
      : d < 0.5 ? [46, 168, 74] : d < 0.56 ? [150, 150, 150] : d < 0.76 ? [240, 143, 184] : d < 0.9 ? [200, 200, 200]
      : d < 0.98 ? [240, 220, 60] : [224, 32, 32];

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
        else { img.data[o] = d * 255; img.data[o + 1] = d * 247; img.data[o + 2] = d * 232; }   // 살짝 따뜻한 톤
        img.data[o + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);

      // 웨이브폼 그리기
      for (let i = 0; i < W * WH; i++) {
        const a = Math.min(255, acc[i] * 38), o = i * 4;
        wimg.data[o] = a * 0.35; wimg.data[o + 1] = a; wimg.data[o + 2] = a * 0.5; wimg.data[o + 3] = 255;
      }
      wctx.putImageData(wimg, 0, 0);
      wctx.fillStyle = 'rgba(232,163,61,.10)';                       // 피부 톤 권장 구간 60~70%
      wctx.fillRect(0, (1 - 0.7) * WH, W, 0.1 * WH);
      wctx.strokeStyle = 'rgba(242,239,232,.18)'; wctx.fillStyle = 'rgba(242,239,232,.55)'; wctx.font = '9px monospace'; wctx.lineWidth = 1;
      [0, 0.25, 0.5, 0.75, 1].forEach((p) => {
        const y = Math.round((1 - p) * (WH - 1)) + 0.5;
        wctx.beginPath(); wctx.moveTo(0, y); wctx.lineTo(W, y); wctx.stroke();
        wctx.fillText(Math.round(p * 100), W - 22, clamp(y - 2, 9, WH - 2));
      });

      // 읽기 값 & 안내
      const skinPct = Math.round(skinD * 100), clipPct = (clip / (W * H) * 100).toFixed(0), crushPct = (crush / (W * H) * 100).toFixed(0);
      const verdict = skinPct < 52 ? ['bad', '어두움 (언더)'] : skinPct < 58 ? ['warn', '조금 어두움'] : skinPct <= 72 ? ['ok', '적정'] : skinPct <= 80 ? ['warn', '조금 밝음'] : ['bad', '밝음 (오버)'];
      tag.textContent = verdict[0] === 'ok' ? 'NORMAL' : (skinPct < 58 ? 'UNDER' : 'OVER');
      const sgn = stops > 0 ? '+' : '';
      out.innerHTML =
        `<span>기준 대비 <b>${sgn}${stops.toFixed(1)} stop</b> <span style="color:var(--dim)">(${esc(CONTENT.exposure.baseline)})</span></span>` +
        `<span>얼굴(피부) <b>${skinPct}%</b> → <b class="${verdict[0]}">${verdict[1]}</b> <span style="color:var(--dim)">· 권장 60~70%</span></span>` +
        `<span>하이라이트 클리핑 <b class="${clipPct > 12 ? 'warn' : ''}">${clipPct}%</b> · 섀도 뭉개짐 <b class="${crushPct > 40 ? 'warn' : ''}">${crushPct}%</b></span>` +
        `<span style="color:var(--dim);font-size:13px">셔터 ${s === 48 ? '= 180° 기준(24p)' : (s === 60 ? '= 플리커 대응으로 흔한 선택' : '→ 영상에서는 가급적 고정')}</span>`;
      $('#outAp').textContent = 'f/' + N; $('#outIso').textContent = iso; $('#outSh').textContent = '1/' + s;
    }

    [$ap, $iso, $sh].forEach((el) => el.addEventListener('input', draw));
    btnF.addEventListener('click', () => { falseOn = !falseOn; btnF.setAttribute('aria-pressed', falseOn); $('#falseLegend').style.opacity = falseOn ? 1 : 0.35; draw(); });
    $('#btnReset').addEventListener('click', () => { $ap.value = BASE.ap; $iso.value = BASE.iso; $sh.value = BASE.sh; draw(); });
    $('#falseLegend').style.opacity = 0.35;
    draw();
  }

  /* ======================================================================
     5) 데모 — 화이트밸런스 (켈빈 슬라이더)
     ====================================================================== */
  function initWB() {
    const W = 320, H = 180;
    const cv = $('#wbCanvas'), ctx = cv.getContext('2d');
    const slider = $('#kelvin'), outK = $('#outK'), tag = $('#wbTag'), out = $('#wbReadout');
    let light = 5600;

    // 중립 조명 아래 장면(반사율)을 그려 둔다: 벽, 흰 카드, 회색 카드, 컬러 블록, 인물
    ctx.fillStyle = '#c8c8c6'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#8c7152'; ctx.fillRect(0, 138, W, 42);
    const block = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    block(18, 36, 62, 84, '#f2f2f0');       // 흰 카드
    block(92, 36, 40, 84, '#808080');       // 회색 카드
    block(142, 76, 34, 44, '#bf3a2b'); block(180, 76, 34, 44, '#2f8f58'); block(218, 76, 34, 44, '#2f6fb5'); block(256, 76, 34, 44, '#e0b030');
    ctx.fillStyle = '#d6a785'; ctx.beginPath(); ctx.arc(196, 44, 22, 0, Math.PI * 2); ctx.fill();   // 얼굴
    ctx.fillStyle = '#2a211a'; ctx.beginPath(); ctx.arc(196, 38, 22, Math.PI, 0); ctx.fill();         // 머리카락
    ctx.fillStyle = '#4a4a55'; ctx.fillRect(176, 66, 40, 12);
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.font = '700 9px monospace'; ctx.fillText('WHITE', 32, 112); ctx.fillText('18%', 102, 112);
    const base = ctx.getImageData(0, 0, W, H);
    const dst = ctx.createImageData(W, H);

    // 색온도 → RGB (Tanner Helland 근사). 0~1
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
      outK.textContent = set + 'K'; tag.textContent = `SET ${set}K / LIGHT ${light}K`;
      const diff = set - light;
      const res = Math.abs(diff) < 300 ? ['ok', '거의 중립 — 흰 카드가 희게 보여요']
        : diff < 0 ? ['warn', '푸르게(차갑게) 보임 — 설정이 조명보다 낮음'] : ['warn', '노랗게(따뜻하게) 보임 — 설정이 조명보다 높음'];
      out.innerHTML = `<span>카메라 설정 <b>${set}K</b> · 현장 조명 <b>${light}K</b> (차이 ${diff > 0 ? '+' : ''}${diff}K)</span><span class="${res[0]}"><b>${res[1]}</b></span>` +
        `<span style="color:var(--dim);font-size:13px">원칙: 조명을 바꿀 수 없다면 설정 K를 조명에 맞추고, 컷마다 바꾸지 않기</span>`;
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
  initTocLinks();
  const start = () => { initMotion(); if (location.hash) { const el = document.getElementById(location.hash.slice(1)); if (el) setTimeout(() => el.scrollIntoView(), 200); } };
  if (document.readyState === 'complete') start(); else addEventListener('load', start);
})();
