# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

A Korean-language JavaScript core concepts study blog. Content is authored as Markdown, paired with runnable `index.js` examples. There is no build system, package manager, or test runner — posts are written and read directly, and example files can be run ad-hoc with `node examples/<folder>/index.js`.

## Structure (what lives where)

- `javascript-core/NN-topic.md` — the blog posts (12 planned, numbered 01–12).
- `examples/NN-topic/` — runnable sample code referenced from the matching post. Folder name aligns with the post number, and the post links here via `../examples/{folder}/index.js`.
- `README.md` — the canonical index / 목차. Status icons (📝 작성 예정 / ✍️ 작성 중 / ✅ 작성 완료) reflect each post's state.
- `javascript-core/CLAUDE.md` — **post-writing conventions** (header template, 존댓말/반말 split, section flow, code/diagram rules, `## 정리` closing, 150–400줄 분량). Auto-loaded when editing files under `javascript-core/`.
- `.cursor/rules/*.mdc` — the same conventions in Cursor's native format. Kept in sync with the `CLAUDE.md` files above so either editor works.

When adding a new post, add both the `javascript-core/NN-*.md` file AND a matching `examples/NN-*/` folder, then add a row to the README 목차 table.

## README 목차 동기화 규칙

`javascript-core/` 글의 상태가 바뀌면 반드시 `README.md` 목차 테이블의 상태 컬럼을 업데이트합니다.

| 상태 | 의미                           |
| ---- | ------------------------------ |
| 📝   | 작성 예정 (소제목만 있는 상태) |
| ✍️   | 작성 중 (본문 작성이 시작됨)   |
| ✅   | 작성 완료                      |

동기화 규칙:

- 글 본문 내용이 추가되면 `📝 → ✍️`로 변경
- 글 작성이 끝나면 `✍️ → ✅`로 변경
- 새 글이 추가되면 README 목차 테이블에 행 추가
- 글 제목/번호가 변경되면 README 목차에도 반영

## Existing posts to mirror

`01-javascript-engine-and-runtime.md` and `02-execution-context.md` are the reference implementations of the conventions — when in doubt about structure, formatting, or depth, match their style.
