# Tasks: Dark Mode Toggle

**Input**: Design documents from `/specs/003-dark-mode/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Only minimal necessary tests included as requested - accessibility, functionality, and performance validation

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create theme directory structure in src/styles/themes/
- [ ] T002 [P] Create src/styles/themes/_light.scss for light theme variables
- [ ] T003 [P] Create src/styles/themes/_dark.scss for dark theme variables
- [ ] T004 Create src/assets/js/theme-manager.js for theme management logic

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core CSS infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Update src/styles/_colors.scss with CSS custom property definitions
- [ ] T006 Import theme files in src/styles/main.scss
- [ ] T007 Add data-theme attribute CSS selectors for light/dark switching
- [ ] T008 [P] Test CSS compilation with npm run build:css

**Checkpoint**: CSS foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Manual Theme Toggle (Priority: P1) 🎯 MVP

**Goal**: Users can manually click a toggle to switch between light and dark themes instantly

**Independent Test**: Click theme toggle button and verify entire page switches theme with proper styling

### Minimal Tests for User Story 1

- [ ] T009 [P] [US1] Create basic theme switching test in tests/integration/test_theme_switching.js

### Implementation for User Story 1

- [ ] T010 [P] [US1] Implement ThemeManager class in src/assets/js/theme-manager.js with toggle functionality
- [ ] T011 [P] [US1] Add theme toggle button HTML to src/templates/base-simple.njk navigation
- [ ] T012 [US1] Initialize theme manager in src/assets/js/main.js with toggle event binding
- [ ] T013 [US1] Add CSS custom property updates for instant theme switching
- [ ] T014 [US1] Add ARIA labels and accessibility attributes to theme toggle

**Checkpoint**: At this point, manual theme toggle should be fully functional and testable independently

---

## Phase 4: User Story 2 - System Preference Detection (Priority: P2)

**Goal**: Website automatically detects and applies user's system color scheme preference on first visit

**Independent Test**: Set system to dark mode, visit site in fresh browser session, verify dark theme applied automatically

### Minimal Tests for User Story 2

- [ ] T015 [P] [US2] Add system preference detection test in tests/integration/test_theme_switching.js

### Implementation for User Story 2

- [ ] T016 [P] [US2] Add prefers-color-scheme media query detection to src/assets/js/theme-manager.js
- [ ] T017 [US2] Implement getSystemPreference() method in ThemeManager class
- [ ] T018 [US2] Update theme initialization to respect system preference when no stored preference exists
- [ ] T019 [US2] Add CSS fallback for system preference detection when JavaScript disabled

**Checkpoint**: At this point, both manual toggle AND automatic system detection should work independently

---

## Phase 5: User Story 3 - Preference Persistence (Priority: P3)

**Goal**: User's manual theme selection is remembered across browser sessions using localStorage

**Independent Test**: Select theme preference, close browser, return and verify preference is maintained

### Minimal Tests for User Story 3

- [ ] T020 [P] [US3] Add localStorage persistence test in tests/integration/test_theme_switching.js

### Implementation for User Story 3

- [ ] T021 [P] [US3] Implement LocalStorageAdapter class in src/assets/js/theme-manager.js
- [ ] T022 [US3] Add save() and load() methods for theme preference persistence
- [ ] T023 [US3] Update ThemeManager to persist user preferences to localStorage
- [ ] T024 [US3] Add graceful fallback when localStorage is unavailable
- [ ] T025 [US3] Implement preference loading on page initialization

**Checkpoint**: All user stories should now be independently functional with persistence

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality validation and improvements that affect multiple user stories

- [ ] T026 [P] Create accessibility contrast validation test in tests/accessibility/test_theme_contrast.js
- [ ] T027 [P] Create performance validation test in tests/performance/test_theme_performance.js  
- [ ] T028 Validate WCAG 2.1 AA contrast ratios for both themes
- [ ] T029 [P] Test theme switching performance meets <100ms requirement
- [ ] T030 [P] Verify JavaScript bundle size stays under 2KB limit
- [ ] T031 Test edge cases: localStorage disabled, system preference changes
- [ ] T032 Run complete test suite with npm test

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 ThemeManager but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Extends US1/US2 but independently testable

### Within Each User Story

- Tests (minimal) can be written before or alongside implementation
- Core ThemeManager implementation before UI integration
- UI components before event binding
- Accessibility attributes after functional implementation

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002, T003)
- CSS custom properties and theme imports can be done in parallel (T005, T006)
- Once Foundational phase completes, US2 and US3 can be developed in parallel with US1
- All minimal tests marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch foundational tasks together:
Task: "Update src/styles/_colors.scss with CSS custom property definitions"
Task: "Import theme files in src/styles/main.scss"

# Launch User Story 1 implementation tasks together:
Task: "Implement ThemeManager class in src/assets/js/theme-manager.js"
Task: "Add theme toggle button HTML to src/templates/base-simple.njk"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (4 tasks, ~30 minutes)
2. Complete Phase 2: Foundational (4 tasks, ~30 minutes - CRITICAL)
3. Complete Phase 3: User Story 1 (6 tasks, ~60 minutes)
4. **STOP and VALIDATE**: Test manual theme toggle independently
5. Deploy/demo basic dark mode functionality

### Incremental Delivery

1. Complete Setup + Foundational → CSS foundation ready (~60 minutes)
2. Add User Story 1 → Manual toggle working → Deploy/Demo (MVP! ~60 minutes)
3. Add User Story 2 → System detection working → Deploy/Demo (~30 minutes)
4. Add User Story 3 → Persistence working → Deploy/Demo (~30 minutes)
5. Each story adds value without breaking previous functionality

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (manual toggle)
   - Developer B: User Story 2 (system detection)
   - Developer C: User Story 3 (persistence) + tests
3. Stories integrate seamlessly due to shared ThemeManager class

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Minimal tests focus on core functionality, accessibility, and performance
- Total estimated time: 2-3 hours as specified in quickstart.md
- CSS custom properties enable instant theme switching without page reload
- localStorage provides persistence without server dependency
- All tasks align with project constitution (minimal JavaScript, static generation, accessibility)
