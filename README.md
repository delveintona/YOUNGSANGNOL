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

그다음 브라우저에서 http://localhost:8000 을 엽니다. (`index.html`을 더블클릭해도 열립니다.)

## 내용 추가하기

- **새 섹션**: 해당 페이지의 `<section id="...">`를 복사해 추가하고, 왼쪽 `<aside class="toc">` 목록에 링크를 한 줄 추가합니다.
- **체크리스트**: `<div class="checks" data-id="고유이름">` 안에 `<label class="check">` 항목을 추가합니다. 체크 상태는 방문자의 브라우저에 저장됩니다.
- **역할 탭**: `.tabs` 안의 `button`과 `.tab-panel`을 같은 `id`로 짝지어 추가합니다.
- **새 페이지**: 기존 페이지를 복사한 뒤 모든 페이지의 `<nav class="nav">`에 링크를 추가합니다.

## 배포 (GitHub Pages)

저장소 Settings → Pages → Source를 `Deploy from a branch`, 브랜치 `main` / 폴더 `/ (root)`로 설정하면 `https://delveintona.github.io/YOUNGSANGNOL/` 에서 볼 수 있습니다.
