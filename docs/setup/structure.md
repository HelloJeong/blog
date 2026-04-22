# 저장소 구조

## 저장소 목적

한국어로 작성된 개발 학습용 블로그입니다. 글은 Markdown으로 작성하고, 실행 가능한 `index.js` 예제와 짝을 이룹니다. 빌드 시스템, 패키지 매니저, 테스트 러너가 없으며 — 글은 바로 읽고 쓰는 형태이고, 예제 파일은 `node <category>/examples/<folder>/index.js`로 즉석에서 실행할 수 있습니다.

글은 주제(카테고리) 단위의 최상위 폴더로 묶고, 예제 코드는 해당 카테고리 폴더 안의 `examples/` 하위에 둡니다. 현재는 `javascript-core/` 카테고리만 작성 중이며, 이후 다른 카테고리가 추가될 수 있습니다.

## 디렉터리 구조

- `<category>/NN-topic.md` — 해당 카테고리의 글 본문. 파일은 `NN-` 번호로 정렬하며, 같은 카테고리 안에서 순서를 관리합니다.
  - 예: `javascript-core/01-...` ~ `javascript-core/12-...`
- `<category>/examples/NN-topic/` — 같은 카테고리 안에서 글이 참조하는 실행 가능한 샘플 코드. 글에서는 `./examples/{folder}/index.js` 경로로 링크합니다.
  - 예: `javascript-core/examples/01-engine-runtime/index.js`
- `README.md` — 공식 목차. 상태 아이콘(📝 작성 예정 / ✍️ 작성 중 / ✅ 작성 완료)이 각 글의 진행 상태를 반영합니다.
- `<category>/CLAUDE.md` — 해당 카테고리 글 작성 컨벤션(요약 체크리스트). 그 카테고리 하위 파일을 수정할 때 자동으로 로드됩니다. 상세 규칙은 `docs/feature/` 하위 문서에 있습니다.
  - 예: `javascript-core/CLAUDE.md` ↔ `docs/feature/javascript-core-writing.md`
- `docs/` — 본 문서를 포함한 저장소 운영 관련 문서 모음.
