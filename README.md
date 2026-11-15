# YOUNGSANGNOL

촬영 노하우 & 프로세스 아카이브. 프리 프로덕션 → 프로덕션 → 포스트 프로덕션, 그리고 촬영(노출·화이트밸런스·초점)과 연출(샷·컨티뉴이티) 노하우를 정리한 정적 웹사이트입니다.

빌드 도구 없이 HTML/CSS/JS만 사용합니다.

## 구조

```
index.html              홈
pre-production.html     01 프리 프로덕션
production.html         02 프로덕션
post-production.html    03 포스트 프로덕션
camera.html             촬영 노하우 (노출/심도 계산기 포함)
directing.html          연출 노하우 (샷 사이즈 시뮬레이터 포함)
assets/style.css        공통 스타일
assets/app.js           공통 스크립트 (탭, 체크리스트, 계산기)
```

## 로컬에서 보기

```bash
python -m http.server 8000
```

그다음 브라우저에서 http://localhost:8000 을 엽니다. (`index.html`을 더블클릭해도 열립니다. CDN(GSAP/Lenis) 때문에 인터넷 연결이 필요합니다.)

## 내용 추가하기

- **새 섹션**: 해당 페이지의 `<section id="...">`를 복사해 추가하고, 왼쪽 `<aside class="toc">` 목록에 링크를 한 줄 추가합니다.
- **체크리스트**: `<div class="checks" data-id="고유이름">` 안에 `<label class="check">` 항목을 추가합니다. 체크 상태는 방문자의 브라우저에 저장됩니다.
- **역할 탭**: `.tabs` 안의 `button`과 `.tab-panel`을 같은 `id`로 짝지어 추가합니다.
- **새 페이지**: 기존 페이지를 복사한 뒤 모든 페이지의 `<nav class="nav">`에 링크를 추가합니다.

## 배포 (GitHub Pages)

저장소 Settings → Pages → Source를 `Deploy from a branch`, 브랜치 `main` / 폴더 `/ (root)`로 설정하면 `https://delveintona.github.io/YOUNGSANGNOL/` 에서 볼 수 있습니다.

## 새 구조 (원페이지)

- `index.html` / `style.css` / `script.js` — 스크롤형 메인 사이트. 모든 텍스트·이미지는 `script.js` 맨 위 `CONTENT` 객체에서 수정합니다.
- `guide/` — 이전 멀티페이지 상세 가이드(체크리스트·계산기).

## Vercel 배포

빌드 과정이 없는 정적 사이트라 설정은 `vercel.json`에 들어 있습니다.

1. vercel.com 에서 **Add New → Project** 를 누르고 GitHub의 `delveintona/YOUNGSANGNOL` 저장소를 가져옵니다.
2. Framework Preset은 **Other**, Build Command와 Output Directory는 비워 둡니다(`vercel.json`이 지정합니다).
3. **Deploy** 를 누르면 끝입니다. 이후 `main`에 푸시할 때마다 자동으로 다시 배포됩니다.

`.vercelignore`가 작업 기록 폴더(`.hallmark`, `.claude`)를 배포에서 뺍니다.
