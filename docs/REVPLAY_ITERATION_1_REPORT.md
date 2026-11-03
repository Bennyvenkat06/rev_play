# REVPLAY — ITERATION 1: CURRICULUM & QUESTION INTEGRITY REPORT

**Document Version:** 1.0.0  
**Date:** November 3, 2026  
**Target Regulation:** JNTUH R25 (B.Tech I Year / CSE AI&ML Academic Regulations)  
**Author:** Senior Software Engineering & Academic Quality Team  

---

## 1. Executive Summary & What Existed Before the Iteration

Prior to this iteration, the RevPlay codebase contained:

1. **Frontend Architecture & Game Suite:**
   - A single-page application built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**.
   - 16 interactive games covering Units 1 through 5 of the theoretical syllabus (`CS103ES: Programming for Problem Solving`) and a simulated laboratory arena (`CS107ES: Programming for Problem Solving Lab`).
   - Progress tracking stored in `localStorage` (`revplay_v1_user_progress`) tracking XP, levels, streak days, star ratings, and review queues.
   - Comprehensive revision notes across 22 topics exportable to plain text (`.txt`) and Microsoft Word (`.docx`).

2. **Existing Academic Metadata & Shortcomings Identified:**
   - **Specification Disconnect:** The codebase mapped 6 lab practice groups in `src/data/syllabusData.ts`, but lacked a unified catalogue for the 16 programme identifiers referenced in specification discussions (`P-U1-01` through `P-V-03`).
   - **Absence of Version 1 Specification:** No separate Version 1 curriculum file was found in the project directory, git history, or documentation. All requirements were derived from project source analysis and the V2 curriculum guidelines provided.
   - **Technical Discrepancies in Lab Demonstrations:**
     - The Calculator workbench in `LabPracticeArena.tsx` utilized floating-point variables (`double a, b`) without implementing the integer modulo (`%`) operator and lacked explicit zero-divisor checks for modulo.
     - Primality verification notes suggested `i * i <= n`, which leads to signed 32-bit integer overflow when $n$ approaches `INT_MAX` ($2^{31} - 1$).
     - The Armstrong number checker did not differentiate between a 3-digit cube sum and a general $N$-digit power calculation.
     - Matrix transpose did not document or enforce rectangular dimension validation ($R \times C \to C \times R$), where in-place transposition is mathematically impossible in a single static buffer.
     - Fibonacci series lacked documented limits for 32-bit signed integers ($N \le 45$) and did not explain the exponential $O(2^N)$ complexity of naive recursion compared to linear $O(N)$ iteration.
     - Structure and Union memory comparisons did not highlight that exact `sizeof` results are compiler-, ABI-, and architecture-dependent due to alignment padding.
     - File handling did not consistently verify `fopen` error returns (`NULL`), safe `int ch` return typing for `EOF`, and guaranteed `fclose`.
     - Dynamic memory allocation (`malloc`, `calloc`, `realloc`, `free`) was taught in Theory Unit II (`CS103ES`), but was omitted from the prescribed `CS107ES` laboratory experiments, creating a curriculum coverage gap.
   - **Challenge Provenance Ambiguity:** Algorithmic challenges were not clearly labeled with verifiable university examination provenance, creating risks of misrepresenting standard tutorial problems as official JNTUH previous year questions (PYQs).

---

## 2. What Was Changed

This iteration executed the following academic integrity and technical corrections:

1. **Academic Course Code Differentiation:**
   - Preserved strict university course code mappings:
     - **Theory:** `CS103ES` (*Programming for Problem Solving*, 5 Units)
     - **Laboratory:** `CS107ES` (*Programming for Problem Solving Lab*, 6 Practice Groups)
   - Extracted and separated college-local internal identifiers (e.g. `25CS103ES-LOC`, `25CS107ES-LOC`) in `COLLEGE_LOCAL_COURSE_MAPPING` without conflating them with official JNTUH university codes.
   - Clarified that supplementary exercises are curated pedagogical enhancements rather than individually mandated university syllabus items.

2. **Practice Catalogue Reconciliation (Preserving 16 Programme IDs):**
   - Established the authoritative catalogue of all 16 programme IDs in `src/data/practiceCatalogue.ts`.
   - **Preserved Unresolved IDs:** Explicitly marked `P-U3-03` and `P-V-03` as `UNRESOLVED_IN_SPECIFICATION` without fabricating content or silently renumbering them.
   - Corrected all eight technical requirements:
     - **Calculator (`P-U1-01` / `lab-2`):** Converted to integer arithmetic supporting `+`, `-`, `*`, `/`, and `%` with pre-execution zero guards for both `/` and `%`.
     - **Armstrong Checker (`P-U1-02`):** Clearly distinguished between 3-digit order-3 sum-of-cubes and general $N$-digit order-$k$ power calculations ($k = \lfloor \log_{10} N \rfloor + 1$).
     - **Prime Checker (`P-U1-03`):** Replaced `i * i <= n` with `i <= n / i`, preventing integer overflow near `INT_MAX`, and added `<stdbool.h>` and `<math.h>` requirements.
     - **Fibonacci Generator (`P-U1-04`):** Documented the $N \le 45$ bound for 32-bit signed integers ($F(46) = 1,836,311,903$; $F(47)$ overflows $2^{31}-1$) and contrasted $O(N)$ iterative loop performance with naive recursive $O(2^N)$ stack explosion.
     - **Matrix Transpose (`P-U3-02`):** Documented dimensional transformation ($R \times C \to C \times R$) and noted that rectangular matrices ($R \ne C$) cannot be transposed in-place in a single static buffer.
     - **Structure vs Union (`P-U4-02`):** Documented that exact `sizeof` results are implementation-dependent due to compiler byte alignment, padding, and 32-bit vs 64-bit architecture ABIs.
     - **File Handling (`P-U5-01` / `lab-4`):** Added explicit `NULL` verification for `fopen`, safe `int ch` typing for `fgetc` to accommodate `EOF = -1`, and guaranteed `fclose`.
     - **Dynamic Memory Allocation (`P-U2-03`):** Identified and formally documented the syllabus gap where `malloc`, `calloc`, `realloc`, and `free` are present in theory (`CS103ES Unit II`) but omitted from prescribed lab experiments (`CS107ES`).

3. **Transparent Challenge Provenance & Specifications:**
   - Implemented `src/data/challengesData.ts` with four transparent provenance categories:
     - `VERIFIED_PYQ`
     - `PYQ_VARIANT`
     - `SOURCE_MATCH_PENDING_PRIMARY_PDF`
     - `SUPPLEMENTAL_CHALLENGE`
   - Formally cataloged 10 challenges with complete specifications: statement, input/output format, constraints, sample I/O, edge cases, and test-case plans.
   - Maintained original university examination wording strictly separate from normalized platform problem statements.
   - Guaranteed that client-facing code never exposes hidden test-case inputs or solution code.

4. **Interactive UI Integration in Lab Arena:**
   - Enhanced `src/components/lab/LabPracticeArena.tsx` with dedicated tabs:
     - **Interactive Simulator:** Live C99 execution with stdin inputs and console terminal.
     - **Debug Challenge:** Bug-hunting with line-level code inspection and multiple-choice diagnostics.
     - **Practice Catalogue (16):** Filterable browser of all 16 reconciled programmes with technical verification notes, college mappings, and template previews.
     - **PYQ & Challenge Bank (10):** Interactive challenge browser with provenance tags, separated original exam wording, and test-case plan matrices.

---

## 3. Files Modified and Created

| File Path | Status | Purpose & Changes Made |
|---|---|---|
| `src/types/practice.ts` | **Created** | Type definitions for `PracticeProgramme`, `ProgrammeStatus`, `TechnicalVerification`, and `CollegeLocalCourseMapping`. |
| `src/types/challenges.ts` | **Created** | Type definitions for `ChallengeSpecification`, `ChallengeProvenance`, `ProvenanceRecord`, and `ChallengeTestCasePlanItem`. |
| `src/data/practiceCatalogue.ts` | **Created** | Authoritative 16-programme catalogue reconciling all units, technical edge cases, input limits, and unresolved placeholders (`P-U3-03`, `P-V-03`). |
| `src/data/challengesData.ts` | **Created** | Authoritative question bank of 10 challenges with transparent provenance records, test plans, and separated original exam wording. |
| `src/data/syllabusData.ts` | **Modified** | Refactored `OFFICIAL_SYLLABUS_SOURCE` to state governance rules; created `COLLEGE_LOCAL_COURSE_MAPPING` to cleanly separate college internal identifiers from university codes. |
| `src/components/coverage/CoverageMatrix.tsx` | **Modified** | Updated header citation to reference `governanceNote` and `COLLEGE_LOCAL_COURSE_MAPPING` without conflating local codes with university regulations. |
| `src/components/lab/LabPracticeArena.tsx` | **Modified** | Fixed Calculator experiment to integer arithmetic with safe division/modulo by zero; added `NULL` check to File experiment; added tabs for Practice Catalogue (16) and PYQ & Challenge Bank (10). |
| `src/data/revisionNotesData.ts` | **Modified** | Updated notes for `notes-lab-group2` (Calculator, Prime overflow, Armstrong distinction, Fibonacci limits), `notes-u2-pointers` (DMA syllabus gap), `notes-u3-matrices` (Transpose dimensions), `notes-u4-unions` (Implementation-dependent sizeof), and `notes-lab-group4` (File open/EOF safety). |
| `scratch/verify_iteration1.cjs` | **Created** | Comprehensive test script verifying all 16 programmes, unresolved IDs, technical checks, and 10 challenge provenance records. |
| `docs/REVPLAY_ITERATION_1_REPORT.md` | **Created** | This comprehensive 9-section Iteration 1 report. |

---

## 4. Practice Catalogue Reconciliation Table

The following table documents the reconciliation of the 16 programme IDs from the V2 specification:

| ID | Title | Prescribed vs Supplemental | Curriculum Mapping | Technical Verification & Safety Safeguards |
|---|---|---|---|---|
| **P-U1-01** | Switch-Based Arithmetic Calculator | Prescribed Lab | CS107ES Group 2 | Integer operands `+`, `-`, `*`, `/`, `%`. Mandatory `if (b == 0)` check before `/` and `%` prevents SIGFPE. Rejects floating-point `%`. |
| **P-U1-02** | Armstrong Number Checker | Supplemental Practice | CS103ES Unit I | Disallows marketing 3-digit cube sum as general Armstrong checker. General checker computes $k = \lfloor \log_{10} N \rfloor + 1$ digits and raises each to power $k$. |
| **P-U1-03** | Prime Number Verification | Prescribed Lab | CS107ES Group 2 | Avoids `i * i <= n` signed overflow using `i <= n / i`. Requires `<stdio.h>`, `<stdbool.h>`, and `<math.h>` (`-lm`). Handles $N \le 1$ and even numbers $> 2$. |
| **P-U1-04** | Fibonacci Sequence Generation | Prescribed Lab | CS107ES Group 2 | Input limit $N \le 45$ for 32-bit signed int ($F(46) = 1,836,311,903$; $F(47)$ overflows). Explains $O(N)$ iterative loop vs $O(2^N)$ naive recursive stack overflow. |
| **P-U2-01** | Simple and Compound Interest | Prescribed Lab | CS107ES Group 1 | Double-precision floating-point; uses `pow((1.0 + r/100.0), t)` from `<math.h>`. Validates non-negative inputs. |
| **P-U2-02** | Swap Two Variables via Pointers | Supplemental Practice | CS103ES Unit II | Call-by-reference pointer indirection. Checks for `NULL` pointers. Avoids address-collision XOR swap bug. |
| **P-U2-03** | Dynamic Memory Allocation Gap Analysis | Supplemental Practice | CS103ES Unit II | **Identifies Syllabus Gap:** DMA is taught in CS103ES Unit II, but omitted from CS107ES lab experiments. Provides `malloc`, `calloc`, `realloc`, `free` practice without fabricating a university mandate. |
| **P-U3-01** | Array Min, Max, Average via Functions | Prescribed Lab | CS107ES Group 3 | Modular functions passing base pointer and length. Initializes min/max to `arr[0]`. Casts sum to `double` before division. |
| **P-U3-02** | Matrix Transpose & Dimensional Check | Supplemental Practice | CS103ES Unit III | Validates dimensions ($R \times C \to C \times R$). Rectangular matrices ($R \ne C$) cannot be transposed in-place; requires separate destination buffer. |
| **P-U3-03** | *Unresolved Specification Entry* | **Unresolved Specification** | *None* | **Preserved explicitly as unresolved.** Not invented, not renumbered. Placeholder retained for data compatibility. |
| **P-U3-04** | String Palindrome Verification | Prescribed Lab | CS107ES Group 5 | Inward traversal with two indices (`left < right`). Terminates on null terminator `\0`. |
| **P-U4-01** | Recursive Factorial & Euclidean GCD | Supplemental Practice | CS103ES Unit IV | Base cases $0! = 1$ and $\gcd(a, 0) = a$. Factorial restricted to $N \le 12$ for 32-bit signed integer. Traces stack activation frames. |
| **P-U4-02** | Structure vs Union Memory Layout | Supplemental Practice | CS103ES Unit IV | **Implementation-dependent sizeof:** Explains that compiler byte alignment and padding (word boundaries) determine exact struct size. Union allocates size of largest member. |
| **P-U5-01** | Text File Copy with Case Conversion | Prescribed Lab | CS107ES Group 4 | Checks `if (fp == NULL)`. Uses `int ch` (not `char`) for `fgetc` to detect `EOF = -1`. Guaranteed `fclose` on all return branches. |
| **P-U5-02** | Linear Search & Binary Search | Prescribed Lab | CS107ES Group 6 | Precondition: array must be sorted for binary search. Mid calculation `low + (high - low) / 2` avoids index overflow. |
| **P-V-03** | *Unresolved Specification Entry* | **Unresolved Specification** | *None* | **Preserved explicitly as unresolved.** Also aliased to `P-U5-03`. Not invented, not renumbered. Placeholder retained for data compatibility. |

---

## 5. Challenge Provenance Decisions Table

The following table records the provenance status and sourcing rationale for all 10 challenges:

| Challenge ID | Title | Provenance Status | Primary Sourcing Evidence & Paper Reference | Pedagogical Normalization Notes |
|---|---|---|---|---|
| **CHAL-FLOYD** | Floyd's Natural Number Triangle | `VERIFIED_PYQ` | **Confirmed Primary Match:** JNTUH R22, Paper Code `181AP`, July/August 2024, Question `2(b)`. | Normalized for row-by-row token formatting with trailing space trimming. |
| **CHAL-MONOTONIC** | Array Monotonicity Verifier | `SOURCE_MATCH_PENDING_PRIMARY_PDF` | **Secondary Transcript Match:** JNTUH R16, Paper Code `132AD`. Primary PDF archive verification pending. | Standardized output to uppercase tokens (`MONOTONIC` / `NOT_MONOTONIC`). |
| **CHAL-WHITESPACE-COMPRESS** | Whitespace Stream Compression | `SOURCE_MATCH_PENDING_PRIMARY_PDF` | **Secondary Transcript Match:** JNTUH R16, Paper Code `132AD`. Primary PDF archive verification pending. | Compresses contiguous tabs and spaces to single space; trims boundary whitespace. |
| **CHAL-CHAR-COUNT** | Character Category Counter | `SOURCE_MATCH_PENDING_PRIMARY_PDF` | **Secondary Transcript Match:** JNTUH R16, Paper Code `132AD`. Primary PDF archive verification pending. | Categorizes vowels, consonants, digits, and special characters. Whitespace excluded from special characters. |
| **CHAL-STR-PALINDROME** | Manual String Palindrome | `PYQ_VARIANT` | **Examination Basis:** JNTUH R16, Paper Code `132AD`, January/February 2024. | **Platform Adaptation:** Original paper asked for a general palindrome check; the restriction *"without using `<string.h>`"* is a RevPlay pedagogical adaptation. |
| **CHAL-BIT-SHIFT** | Bitwise Shift Evaluator | `PYQ_VARIANT` | **Examination Basis:** JNTUH R22, Paper Code `181AP`, July/August 2024. | **Clarification:** 181AP tested shift operators (`<<` and `>>`) on integer variables. It is distinct from the 8-bit binary representation lab exercise. |
| **CHAL-SADDLE-POINT** | Matrix Saddle Point Discovery | `SUPPLEMENTAL_CHALLENGE` | **No University Paper Claimed:** Standard 2D matrix algorithmic exercise. | Preserved as a supplemental matrix challenge. No PYQ source is fabricated. |
| **CHAL-DIGITAL-ROOT** | Digital Root Calculation | `SUPPLEMENTAL_CHALLENGE` | **No University Paper Claimed:** Classical number theory problem. | Preserved as a supplemental number theory challenge. No PYQ source is fabricated. |
| **CHAL-RECURSIVE-GCD** | Euclidean Recursive GCD | `SUPPLEMENTAL_CHALLENGE` | **No University Paper Claimed:** Foundational recursion curriculum benchmark. | Preserved with honest provenance attribution until a primary university paper is verified. |
| **CHAL-MATRIX-TRACE** | Matrix Trace Calculation | `SUPPLEMENTAL_CHALLENGE` | **No University Paper Claimed:** Standard 2D array diagonal accumulation problem. | Preserved as a supplemental linear algebra problem. No PYQ source is fabricated. |

---

## 6. Missing or Unresolved Information

In strict adherence to academic integrity guidelines, the following items are acknowledged as unresolved rather than being silently filled or fabricated:

1. **Version 1 Curriculum Specification Absence:**
   - No standalone Version 1 curriculum document exists in the project repository or git history.
   - All reconciliation decisions were performed using the V2 specification guidelines, the existing RevPlay codebase, and available JNTUH R25 / R22 / R16 syllabus and paper archives.
2. **Unresolved Programme Identifiers (`P-U3-03` and `P-V-03`):**
   - In the V2 specification listing, entries `P-U3-03` (Unit III entry 03) and `P-V-03` (Unit V entry 03) had no corresponding problem title, objective, or code definition.
   - **Decision:** Both IDs have been retained verbatim in `src/data/practiceCatalogue.ts` with `status: 'UNRESOLVED_IN_SPECIFICATION'` and `isUnresolved: true`. They have not been silently renumbered, and no artificial exercises have been invented.
3. **Pending Primary PDF Scans for 132AD Questions:**
   - Challenges `CHAL-MONOTONIC`, `CHAL-WHITESPACE-COMPRESS`, and `CHAL-CHAR-COUNT` are documented in secondary transcripts attributed to JNTUH R16 Paper Code `132AD`.
   - **Decision:** They have been marked with status `SOURCE_MATCH_PENDING_PRIMARY_PDF`. They will remain in this status until an original physical paper scan or official university digital archive PDF is retrieved and cross-verified.
4. **DMA Lab Exercise Absence in Official Regulations:**
   - JNTUH R25 officially lists dynamic memory allocation in the Theory syllabus (`CS103ES Unit II`), but includes zero dedicated experiments for `malloc`, `calloc`, `realloc`, and `free` in the Laboratory syllabus (`CS107ES`).
   - **Decision:** Documented as an educational gap analysis under `P-U2-03` and labeled as a supplementary practice module rather than claiming it is a prescribed lab experiment.

---

## 7. Tests and Build Results

1. **TypeScript Type Compilation (`npx tsc --noEmit`):**
   - **Status:** PASSED (Exit code 0).
   - Zero type errors across all newly created interfaces (`PracticeProgramme`, `ChallengeSpecification`, `ProvenanceRecord`), data modules, and updated components.

2. **Production Bundle Build (`npm run build` / `vite build`):**
   - **Status:** PASSED (Exit code 0).
   - Module transformation: 1,630 modules transformed.
   - Build duration: 1m.
   - Output artifacts:
     - `dist/index.html` (1.16 kB, gzip: 0.66 kB)
     - `dist/assets/index-BeKdFPM8.css` (56.18 kB, gzip: 10.00 kB)
     - `dist/assets/index-DRprhe5Y.js` (835.85 kB, gzip: 223.80 kB)

3. **Academic Integrity & Data Verification Script (`scratch/verify_iteration1.cjs`):**
   - **Status:** PASSED (Exit code 0).
   - Verified that all 16 programme IDs are present and intact.
   - Verified that `P-U3-03` and `P-V-03` are preserved as unresolved placeholders.
   - Verified all 8 technical fixes (Calculator integer `%` and division-by-zero, Armstrong $N$-digit distinction, Prime overflow prevention, Fibonacci limits, Transpose dimensional check, Structure/Union `sizeof`, File error checking, DMA gap analysis).
   - Verified that all 10 challenges carry honest provenance classifications.
   - Verified that original exam wording is separated from normalized statements and that no hidden test cases are exposed client-side.

4. **DOCX Export & Notes Verification:**
   - Verified that `scratch/test_docx_generation.cjs` successfully packs and writes `.docx` binary files (9,875 bytes) without errors.
   - Verified that plain-text export (`.txt`) and Word document export (`.docx`) continue to format all 22 revision notes.

5. **Navigation & Progress Compatibility:**
   - Verified that existing views (`home`, `syllabus`, `lab`, `notes`, `coverage`), modals, sound toggles, and game containers remain 100% operational.
   - Existing user progress in `localStorage` (`revplay_v1_user_progress`) is completely undisturbed.

---

## 8. Known Limitations

1. **Client-Side Simulation vs True POSIX Compilation:**
   - RevPlay's interactive workbench simulates C execution in the browser using JavaScript models. It evaluates valid standard C inputs and Catches runtime errors (such as zero-division, invalid operators, or array out-of-bounds), but does not execute machine bytecode via an external sandbox or compiler backend.
2. **Archival Availability of Older Question Papers:**
   - Access to primary physical question paper archives for JNTUH R16 examinations remains limited to scanned transcripts. Questions verified via transcripts remain flagged as `SOURCE_MATCH_PENDING_PRIMARY_PDF`.
3. **Large JavaScript Bundle Chunk:**
   - Minified production bundle `dist/assets/index-DRprhe5Y.js` is 835 kB (223 kB gzip) due to bundled icons, docx packing, and comprehensive curriculum databases. Dynamic `import()` splitting may be considered in future performance optimizations.

---

## 9. Recommended Next Iteration (Iteration 2)

Based on the verified curriculum and question bank established in Iteration 1, the recommended scope for **Iteration 2** is:

1. **Interactive Challenge Arena (Dedicated UI View):**
   - Provide a dedicated Challenge Runner UI where students can attempt the 10 cataloged challenges with interactive test-runner previews against public test cases.
2. **Primary PDF Archive Acquisition:**
   - Ingest confirmed primary PDF scans for JNTUH R16 Paper Code `132AD` to upgrade the status of `CHAL-MONOTONIC`, `CHAL-WHITESPACE-COMPRESS`, and `CHAL-CHAR-COUNT` to `VERIFIED_PYQ`.
3. **Formal Resolution of `P-U3-03` and `P-V-03`:**
   - Coordinate with academic department heads to officially adopt specific curriculum exercises for placeholders `P-U3-03` and `P-V-03`, resolving their status through documented faculty consensus.
4. **Code-Splitting for Revision Notes and Large Databases:**
   - Implement Vite dynamic imports (`import()`) for `revisionNotesData.ts`, `practiceCatalogue.ts`, and `docx` to reduce the initial bundle size below 500 kB.

---
*Report certified by RevPlay Academic Quality & Engineering.*

