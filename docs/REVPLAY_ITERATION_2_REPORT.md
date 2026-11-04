# REVPLAY — ITERATION 2: FOUR EXPERIENCES & ARCHITECTURE REPORT

**Document Version:** 2.0.0  
**Date:** November 4, 2026  
**Target Regulation:** JNTUH R25 (B.Tech I Year / CSE AI&ML Academic Regulations)  
**Academic Courses:**
- **Theory:** `CS103ES: Programming for Problem Solving` (5 Units)
- **Laboratory:** `CS107ES: Programming for Problem Solving Lab` (6 Practice Groups)

---

## 1. Original Architecture Audit

Prior to Iteration 2, an in-depth audit of the codebase revealed several architectural and curriculum discrepancies:

1. **Top-Level Navigation Flaws**:
   - Navigation was organized around `Home`, `Syllabus World`, `CS107ES Lab Arena`, `Revision Notes Library`, and `Coverage Matrix`.
   - The five theory units (`CS103ES`) and laboratory practice groups (`CS107ES`) were conflated under a single `WorldMap` component as if the lab were merely a 6th unit of the theoretical syllabus.
   - Practice and Challenge modes did not exist as distinct, independent experiences within each academic section.

2. **Programme Catalogue Inaccuracies**:
   - Earlier implementation mappings in `src/data/practiceCatalogue.ts` suffered from significant ID misalignments:
     - `P-U1-01` was incorrectly mapped to "Switch-Based Arithmetic Calculator" (should be "Largest of Three").
     - `P-U1-02` was mapped to "Armstrong Number Checker" (should be "Reverse Integer").
     - `P-U1-04` was mapped to "Fibonacci Sequence Generation" (should be "Armstrong Number Checker").
     - `P-U3-02` was mapped to "Matrix Transpose" (should be "2D Matrix Multiplication").
     - `P-U3-04` was mapped to "String Palindrome" (should be "Transpose of Matrix").
     - `P-U4-01` was mapped to "Recursive Factorial & Euclidean GCD" (should be "Recursive Fibonacci").
     - `P-U4-02` was mapped to "Structure vs Union Memory Layout" (should be "Student Grade Management using Structs").
     - `P-U4-03` and `P-V-04` were omitted or misnumbered.
   - Dynamic Memory Allocation (`malloc`, `calloc`, `realloc`, `free`) was assigned an invented lab programme ID despite being absent from prescribed `CS107ES` lab experiments.

3. **Laboratory Experience Conflation**:
   - The Lab Arena mixed the interactive workbench, bug hunt, practice catalogue, and challenge bank into a single tabbed component rather than offering dedicated Practice and Challenge experiences.

4. **Compiler Simulation Ambiguity**:
   - Earlier iterations lacked an explicit compiler service interface that truthfully distinguishes between local simulation and actual remote sandboxed execution, risking confusing simulation models with live GCC compilation.

---

## 2. Revised Application Architecture

RevPlay has been re-architected strictly around the non-negotiable two academic sections and four distinct learning experiences:

```
                                  REVPLAY PLATFORM
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
   THEORY (CS103ES)            LABORATORY (CS107ES)              REVISION & PROGRESS
   ├── Practice Mode           ├── Practice Mode                 ├── Revision Library (22 Notes)
   └── Challenge Mode          └── Challenge Mode                └── Progress & Coverage Matrix
```

### Top-Level Navigation Structure:
1. **Home**: Cinematic entrance, pedagogical overview, real-time learner statistics, and one-click direct access cards into all 4 experiences.
2. **Theory (`CS103ES`)**:
   - **Practice Mode**: 5-unit curriculum navigation, concept cards, interactive game missions, worked examples, knowledge checks, and revision note links.
   - **Challenge Mode**: Independent assessment suite with 7 distinct question formats, unit filtering, difficulty controls, timer, scoring, and C99 standard citations.
3. **Laboratory (`CS107ES`)**:
   - **Practice Mode**: Complete existing Lab Arena with Interactive Simulator, C99 simulations, Debug Challenge, 16 Reconciled Practice Catalogue, and DOCX notes export.
   - **Challenge Mode**: Brand-new online IDE layout with Challenge Browser, Split Problem Panel, C Code Editor with line numbers, custom stdin, Run, Submit, and honest compiler service status.
4. **Revision Library**: 22 comprehensive syllabus revision notes with text download and Word document (`.docx`) packing.
5. **Progress & Coverage**: HUD stats header, user level, streak, XP, star ratings, mistake remedial review queue, and official JNTUH R25 coverage matrix with college-local mappings.

---

## 3. Four Experiences Implemented

| Academic Section | Mode | Purpose | Key Components & Mechanics |
|---|---|---|---|
| **Theory** | **Practice** | Guided visual learning & conceptual understanding | 5-unit syllabus navigator (`Unit 1` to `Unit 5`), concept cards, interactive game launchers (`PredictTheOutput`, `BranchRunner`, `LoopReactor`, `PointerLab`, etc.), code examples, and DOCX export. |
| **Theory** | **Challenge** | Independent assessment & conceptual diagnostics | 7 question formats: Multiple Choice, Multiple Select, Output Prediction, Code Tracing, Find the Error, Fill in Missing Step, Conceptual Reasoning. Timed assessment mode, real-time feedback, and ISO/IEC C99 references. |
| **Laboratory** | **Practice** | Learn & practise C programming | 6 prescribed laboratory groups with interactive simulator workbenches (8-bit binary, quadratic roots, pointer reverse array, file uppercase copy, palindrome, selection sort descending), line-level bug hunt, and 16 reconciled practice programmes. |
| **Laboratory** | **Challenge** | Independent problem solving & code authoring | Compact online coding environment: Challenge Browser, Problem Statement & Constraints Panel, C Code Editor (C99 GCC starter code, line numbers), Console Panel with custom stdin, Run Code, Submit Solution, and truthful compiler service interface. |

---

## 4. Navigation & Routing Changes

### Direct URL Hash Addressability:
The application now supports deep linking and direct navigation through hash synchronization:
- `#/home` — Home dashboard
- `#/theory/practice` — Theory Section in Practice Mode
- `#/theory/challenge` — Theory Section in Challenge Mode
- `#/laboratory/practice` — Laboratory Section in Practice Mode
- `#/laboratory/challenge` — Laboratory Section in Challenge Mode
- `#/notes` — Revision Library
- `#/progress` — Progress and Coverage Matrix

Backward-compatible aliases (`#/syllabus` maps to `#/theory/practice`, `#/lab` maps to `#/laboratory/practice`, `#/coverage` maps to `#/progress`) ensure that existing bookmarks and links continue to function without breaking.

---

## 5. Existing Features Preserved

All working features from Iteration 1 have been fully retained:
1. **Cinematic Intro**: Overlay and animation on first visit/browser refresh (`CinematicIntro.tsx`).
2. **Audio Feedback**: Synthesized sound manager with click, correct, error, and completion SFX, synced with user preference toggle.
3. **Smooth Scroll**: Lenis smooth scroll respecting `prefers-reduced-motion`.
4. **16 Interactive Theory Games**: All Unit 1–5 games (`BranchRunner`, `PredictTheOutput`, `LoopReactor`, `FlowchartBuilder`, `PointerLab`, `CallStackChallenge`, `FunctionPipeline`, `ArrayForge`, `MatrixMission`, `StringPuzzleLab`, `RecursionMaze`, `StructureBuilder`, `MemoryLayoutChallenge`, `SortingRace`, `BinarySearchArena`, `FileDetective`).
5. **Interactive Execution Panel**: Line-by-line stepping with variable inspector, parameter sliders, and logical short-circuit highlights (`InteractiveExecutionPanel.tsx`).
6. **22 Revision Notes & Dual Export**: Plain-text (`.txt`) and genuine Microsoft Word (`.docx`) file generation.
7. **Mistakes Remedial Review Modal**: Diagnostic mistake logging, question replay, and note referencing (`MistakesReviewModal.tsx`).
8. **User Progress**: LocalStorage persistence (`revplay_v1_user_progress`) tracking level, XP, stars, streak, and review queue without progress resets.

---

## 6. Authoritative V2 Programme Catalogue Reconciliation

The 16 practice programmes have been completely reconciled to the authoritative V2 specification in `src/data/practiceCatalogue.ts`:

| Programme ID | Authoritative V2 Title | Prescribed vs Supplemental | Curriculum Mapping | Technical Verification & Safeguards |
|---|---|---|---|---|
| **P-U1-01** | Largest of Three | Prescribed Lab | CS107ES Group 1 | Relational branching; handles identical values, negative inputs, and 32-bit integer limits. |
| **P-U1-02** | Reverse Integer | Prescribed Lab | CS107ES Group 1 | Iterative `% 10` digit extraction and `* 10` accumulation; overflow safeguards against reversing numbers $> 2^{31}-1$. |
| **P-U1-03** | Menu-Driven Calculator | Prescribed Lab | CS107ES Group 2 | Integer arithmetic `+`, `-`, `*`, `/`, `%`; pre-checks `b == 0` before `/` and `%` to prevent `SIGFPE`. |
| **P-U1-04** | Armstrong Number Checker | Prescribed Lab | CS107ES Group 2 | Computes general $N$-digit order $k = \lfloor \log_{10} N \rfloor + 1$ power sum; integer power prevents floating-point inaccuracies. |
| **P-U2-01** | Modular Prime & Leap Year | Prescribed Lab | CS107ES Group 2 | Avoids `i * i <= n` signed overflow using `i <= n / i`; Gregorian century leap year rule ($400$ vs $100$ and $4$). |
| **P-U2-02** | Pass-by-Reference Variable Swapping | Prescribed Lab | CS107ES Group 3 | Pointer indirection; verifies `NULL` pointers; avoids address-collision self-clearing bug. |
| **P-U2-03** | Pointer Arithmetic & Array Passing | Prescribed Lab | CS107ES Group 3 | Byte scaling rule ($p + i$ advances by $i \times \text{sizeof}(T)$); array parameter decay to pointer. |
| **P-U3-01** | 1D Array Statistics | Prescribed Lab | CS107ES Group 3 | Single-pass min, max, average via functions; sum accumulated in `long long`; casts to `double` for precision. |
| **P-U3-02** | 2D Matrix Multiplication | Prescribed Lab | CS107ES Group 3 | Validates inner dimension precondition ($c_1 = r_2$); halts with clean error message if dimensions mismatch. |
| **P-U3-03** | *Unresolved in Specification* | **Unresolved Specification** | *None* | **Preserved explicitly as unresolved.** Content not fabricated; placeholder retained for data compatibility. |
| **P-U3-04** | Transpose of Matrix | Prescribed Lab | CS107ES Group 3 | Enforces rectangular dimension transformation ($R \times C \to C \times R$); documents why in-place transposition is impossible in a single static buffer. |
| **P-U4-01** | Recursive Fibonacci | Prescribed Lab | CS107ES Group 2 | Documents exponential $O(2^N)$ recursion tree vs linear $O(N)$ loop; input bound $N \le 40$ prevents stack exhaustion. |
| **P-U4-02** | Student Grade Management using Structs | Supplemental Practice | CS103ES Unit IV | User-defined `typedef struct`; member access via dot (`.`) and arrow (`->`) operators; array of structs. |
| **P-U4-03** | Structure vs Union Memory Comparison | Supplemental Practice | CS103ES Unit IV | Documents compiler byte alignment padding and word boundaries; shows union overlapping base addresses. |
| **P-V-01** | File Copy & Character Count | Prescribed Lab | CS107ES Group 4 | Checks `fopen == NULL`; uses `int ch` for `fgetc` to accommodate `EOF = -1`; guaranteed `fclose` on all branches. |
| **P-V-02** | Linear vs Binary Search | Prescribed Lab | CS107ES Group 6 | Precondition: array sorted for binary search; mid calculation `low + (high - low) / 2` avoids integer overflow. |
| **P-V-03** | *Unresolved in Specification* | **Unresolved Specification** | *None* | **Preserved explicitly as unresolved.** Content not fabricated; placeholder retained for data compatibility. |
| **P-V-04** | Insertion Sort | Prescribed Lab | CS107ES Group 6 | Stable in-place sorting; builds sorted partition by shifting elements $> key$; $O(N)$ best-case for presorted arrays. |

### Dynamic Memory Allocation (DMA) Coverage Gap:
- **Status**: Documented explicitly under `GAP-DMA-U2` as a curriculum coverage gap item.
- **Analysis**: JNTUH R25 officially mandates DMA (`malloc`, `calloc`, `realloc`, `free`) in the Theory syllabus (`CS103ES Unit II`), but omits any dedicated experiments from the Laboratory syllabus (`CS107ES`).
- **Resolution**: Provided as an authorized supplementary module bridging the gap without inventing a false university lab code.

### Backward Compatibility Mapping:
A `LEGACY_PROGRAMME_ID_MAP` has been implemented in `src/data/practiceCatalogue.ts` so any previously saved attempts or local progress using legacy identifiers automatically resolve to their authoritative V2 counterparts.

---

## 7. Truthful Compiler Service Interface

Per Iteration 2 instructions:
> "Do not create a fake compiler or display fabricated successful results. If a genuine compiler backend is not yet connected, build the frontend against a clearly defined compiler-service interface. Display a truthful not-configured/service-unavailable state rather than pretending compilation succeeded."

The frontend now integrates `src/services/compilerService.ts`:
- **Run Code**: Intended for running C99 code with student-supplied custom standard input.
- **Submit Solution**: Intended for submitting C99 code to remote verification against hidden test cases.
- **Truthful Status**: When `VITE_BACKEND_API_URL` is unconfigured, the console truthfully displays:
  ```
  [RevPlay Compiler Notice]
  No remote isolated C execution service is currently configured on this frontend.
  Status: Live compiler backend is scheduled for Iteration 3 (FastAPI + Judge0 on Cloud Run).
  RevPlay does NOT fabricate compilation results or mock terminal output.
  ```
- **Integrity Guarantee**: Hidden test cases and reference solutions are completely excluded from client bundles.

---

## 8. Tests and Verification Results

### 1. TypeScript Compilation Check (`npx tsc --noEmit`)
- **Status:** PASSED (Exit code 0).
- Zero type errors across all newly created components (`TheorySection`, `TheoryChallengeArena`, `LabSection`, `LabChallengeArena`, `ProgressSection`), data modules, and compiler interfaces.

### 2. Production Build (`npm run build` / `vite build`)
- **Status:** PASSED (Exit code 0).
- Module transformation: 1,636 modules transformed.
- Bundle output:
  - `dist/index.html` (1.16 kB, gzip: 0.66 kB)
  - `dist/assets/index-NISYUKyn.css` (59.17 kB, gzip: 10.41 kB)
  - `dist/assets/index-DGnrhwNN.js` (904.17 kB, gzip: 239.07 kB)
- Build duration: 10.03 seconds.

### 3. Iteration 2 Master Verification Script (`scratch/verify_iteration2.cjs`)
- **Status:** PASSED (Exit code 0, 35/35 checks passed).
- Verified:
  1. All 16 authoritative V2 programme titles and IDs match exactly.
  2. `P-U3-03` and `P-V-03` are preserved as unresolved placeholders.
  3. DMA coverage gap is explicitly documented under `GAP-DMA-U2`.
  4. `LEGACY_PROGRAMME_ID_MAP` is present and functional.
  5. Top-level navigation mounts `home`, `theory`, `laboratory`, `notes`, and `progress`.
  6. Theory Section provides 5-unit navigation, Practice Mode, and Challenge Mode.
  7. Theory Question Bank covers all 5 units with all 7 question types and honest provenance.
  8. Laboratory Section preserves full `LabPracticeArena` in Practice Mode and integrates `LabChallengeArena` in Challenge Mode.
  9. Code editor, custom stdin console, Run, and Submit buttons are mounted.
  10. CompilerService returns truthful `NOT_CONFIGURED` without fabricated execution.
  11. Production dist assets exist and are verified.

### 4. DOCX Document Generation Test (`scratch/test_docx_generation.cjs`)
- **Status:** PASSED (Exit code 0).
- Generated 9,875-byte `.docx` document successfully using `docx` Packer.

---

## 9. Visual UI Layout & Responsiveness Walkthrough

The UI has been designed with responsive layouts and accessible touch targets:

1. **Desktop Navigation (`Navbar.tsx`)**:
   - Pinned sticky HUD at top with backdrop blur (`rgba(8,13,27,0.85)`).
   - Brand logo with gradient glow and JNTUH R25 subtitle.
   - Distinct nav tabs: `Home`, `Theory` (with `CS103ES` badge), `Laboratory` (with `CS107ES` badge), `Revision Library`, and `Progress`.
   - Compact stats capsule showing user Level and XP.
   - SFX mute toggle with 40x40px minimum touch target.
   - Pinned 2px scroll progress bar indicating page depth.

2. **Mobile Layout (Responsive Drawer)**:
   - On screens `< 1024px`, desktop buttons collapse into a mobile menu drawer.
   - All interactive controls adhere to minimum touch targets.
   - Editor and console stack vertically on smaller displays and split horizontally on desktop.

3. **Theory Section**:
   - Integrated Mode Switcher at top: `Practice Mode` (cyan glow) vs `Challenge Mode` (indigo glow).
   - **Practice Mode**: 5-unit region selector pills (`Unit 1` to `Unit 5`) displaying completed topic counts; interactive topic cards with description, syllabus citation, game simulation launcher, and Word (`.docx`) / Text (`.txt`) export buttons.
   - **Challenge Mode**: Diagnostic challenge suite with unit filters, difficulty selector, timer toggle, question grid navigation, C99 source code snippet panel, single/multi-select option cards with instant visual verification, and in-depth academic explanations with ISO/IEC citations.

4. **Laboratory Section**:
   - Integrated Mode Switcher at top: `Practice Mode` vs `Challenge Mode`.
   - **Practice Mode**: Retains the full interactive workbench with numeric converter, quadratic equation solver, pointer array reversal, uppercase file copy pipeline, palindrome checker, and selection sort descending; plus bug hunt diagnostics and 16-programme catalogue.
   - **Challenge Mode**: Clean 12-column IDE layout:
     - Left column (4 cols): Filterable challenge browser with difficulty badges and provenance labels (`Verified JNTUH PYQ`, `PYQ Variant`, etc.).
     - Right column (8 cols): Formal problem statement, input/output formats, constraints, sample test cases, C99 code editor with line numbers and starter template, and interactive console with custom stdin textarea, Run Code, Submit Solution, and truthful compiler status.

---

## 10. Iteration 3 Implementation Plan

With the frontend architecture fully verified, the foundation is prepared for **Iteration 3: Firebase Authentication, Secure C Execution Sandbox & Cloud Persistence**:

1. **Firebase Authentication**:
   - Implement Firebase Auth SDK with Google sign-in and Email/Password.
   - Maintain Firebase UID as the stable account key.
   - Support seamless local-to-cloud progress merging for guest learners.

2. **Cloud Firestore Persistence**:
   - Persist user profiles, theory progress, laboratory challenge submissions, and mistake queues.
   - Implement deny-by-default Firestore security rules preventing unauthorized data mutations.

3. **Secure FastAPI Backend (Google Cloud Run)**:
   - Authenticate requests by verifying Firebase ID tokens (`firebase-admin`).
   - Maintain authoritative challenge verification, timing, and rate limiting.
   - Store and protect hidden test cases entirely server-side.

4. **Isolated C Execution Service (Judge0)**:
   - Connect authenticated RevPlay backend to Judge0 sandbox.
   - Provide two distinct endpoints:
     - `POST /api/v1/compiler/run`: executes user code with custom stdin within sandbox limits.
     - `POST /api/v1/compiler/submit`: evaluates user code against hidden server test cases and returns official verdicts (`ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `COMPILATION_ERROR`, etc.).
   - Enforce memory (128 MB), CPU time (2.0s), wall time (5.0s), and filesystem restrictions.
   - Ensure secrets (Judge0 API keys) remain exclusively on the server, never exposed in `VITE_` frontend variables.

---

*Report certified by RevPlay Product Architecture & Engineering Team.*

