import React, { useState, useEffect } from 'react';
import { CHALLENGES_QUESTION_BANK } from '../../data/challengesData';
import { ChallengeSpecification, ChallengeProvenance } from '../../types/challenges';
import { CompilerService, RunCodeResponse, SubmitSolutionResponse } from '../../services/compilerService';
import { soundManager } from '../../utils/sound';
import {
  Code2,
  Terminal,
  Play,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Filter,
  Check,
  X,
  Clock,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Send,
  HelpCircle,
  Copy,
  RotateCcw,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

interface LabChallengeArenaProps {
  onOpenNotes?: (notesId: string) => void;
}

export const LabChallengeArena: React.FC<LabChallengeArenaProps> = ({
  onOpenNotes
}) => {
  // Challenge Selection
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    CHALLENGES_QUESTION_BANK[0]?.id || 'CHAL-FLOYD'
  );

  // Filters
  const [unitFilter, setUnitFilter] = useState<string>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [provenanceFilter, setProvenanceFilter] = useState<string>('ALL');

  // Filtered challenges
  const filteredChallenges = CHALLENGES_QUESTION_BANK.filter(c => {
    if (unitFilter !== 'ALL' && c.unitId !== unitFilter) return false;
    if (difficultyFilter !== 'ALL' && c.difficulty !== difficultyFilter) return false;
    if (provenanceFilter !== 'ALL' && c.provenance.status !== provenanceFilter) return false;
    return true;
  });

  const activeChallenge = 
    CHALLENGES_QUESTION_BANK.find(c => c.id === selectedChallengeId) ||
    filteredChallenges[0] ||
    CHALLENGES_QUESTION_BANK[0];

  // Default C starter template
  const generateStarterCode = (challenge: ChallengeSpecification) => {
    return `// ==========================================================
// RevPlay Programming Challenge: ${challenge.title}
// Academic Unit: ${challenge.unitId.toUpperCase()} | Difficulty: ${challenge.difficulty}
// ==========================================================
#include <stdio.h>

int main(void) {
    // Read standard input and print formatted solution
    
    return 0;
}
`;
  };

  // Editor State per challenge
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const currentCode = codeMap[activeChallenge.id] ?? generateStarterCode(activeChallenge);

  // Custom Stdin State
  const [customStdin, setCustomStdin] = useState<string>(
    activeChallenge.sampleIO[0]?.input || ''
  );

  // Update sample stdin when challenge changes
  useEffect(() => {
    if (activeChallenge.sampleIO.length > 0) {
      setCustomStdin(activeChallenge.sampleIO[0].input);
    }
  }, [activeChallenge.id]);

  // Console Execution State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<RunCodeResponse | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmitSolutionResponse | null>(null);
  const [consoleTab, setConsoleTab] = useState<'input' | 'output' | 'testcases'>('output');

  // Handle Code Change
  const handleCodeChange = (newCode: string) => {
    setCodeMap(prev => ({ ...prev, [activeChallenge.id]: newCode }));
  };

  // Run Code (Student custom input)
  const handleRunCode = async () => {
    soundManager.playClick();
    setIsRunning(true);
    setSubmissionResult(null);
    setConsoleTab('output');

    try {
      const result = await CompilerService.runCode({
        sourceCode: currentCode,
        stdin: customStdin,
        language: 'c99'
      });
      setExecutionResult(result);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Solution (Server hidden test cases)
  const handleSubmitSolution = async () => {
    soundManager.playClick();
    setIsSubmitting(true);
    setExecutionResult(null);
    setConsoleTab('output');

    try {
      const result = await CompilerService.submitSolution({
        challengeId: activeChallenge.id,
        sourceCode: currentCode,
        language: 'c99'
      });
      setSubmissionResult(result);
      if (result.verdict === 'ACCEPTED') {
        soundManager.playCorrect();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format line numbers for code editor
  const codeLines = currentCode.split('\n');

  // Provenance Label Helper
  const getProvenanceBadge = (prov: ChallengeSpecification['provenance']) => {
    switch (prov.status) {
      case 'VERIFIED_PYQ':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
            ✓ Verified JNTUH PYQ
          </span>
        );
      case 'PYQ_VARIANT':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
            PYQ Variant / Adaptation
          </span>
        );
      case 'SOURCE_MATCH_PENDING_PRIMARY_PDF':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
            Transcript Match (PDF Pending)
          </span>
        );
      case 'SUPPLEMENTAL_CHALLENGE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-slate-400 border border-slate-700">
            Supplemental Challenge
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & IDE Introduction */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                CS107ES LABORATORY
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                CHALLENGE ARENA
              </span>
              <span className="text-xs font-mono text-slate-400">
                Independent Programming Environment
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-display">
              Algorithmic Problem Workbench
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Read formal problem specifications, write clean C99 solutions with line-level editing, execute custom standard input, and submit against verified test criteria.
            </p>
          </div>

          {/* Compiler Service Status Badge */}
          <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-2 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <div className="text-left">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Compiler Architecture</div>
              <div className="text-amber-300 font-semibold">Ready for Iteration 3 (Judge0)</div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-mono flex items-center gap-1">
              <Filter className="w-3 h-3" /> Unit:
            </span>
            {['ALL', 'unit-1', 'unit-2', 'unit-3', 'unit-4', 'unit-5'].map(u => (
              <button
                key={u}
                onClick={() => {
                  soundManager.playClick();
                  setUnitFilter(u);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                  unitFilter === u
                    ? 'bg-cyan-600 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {u === 'ALL' ? 'All Units' : `Unit ${u.replace('unit-', '')}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono">Difficulty:</span>
            {['ALL', 'Easy', 'Medium', 'Hard'].map(d => (
              <button
                key={d}
                onClick={() => {
                  soundManager.playClick();
                  setDifficultyFilter(d);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all ${
                  difficultyFilter === d
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-950 text-slate-500 hover:text-slate-300 border border-slate-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split Interface: Challenge Browser & Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: Challenge Browser (4 cols on lg) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Available Problems ({filteredChallenges.length})</span>
            </span>
          </div>

          <div className="space-y-2 max-h-[820px] overflow-y-auto pr-1">
            {filteredChallenges.map((challenge) => {
              const isSelected = challenge.id === activeChallenge.id;

              return (
                <button
                  key={challenge.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedChallengeId(challenge.id);
                    setExecutionResult(null);
                    setSubmissionResult(null);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-xl glow-cyan scale-[1.01]'
                      : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                      {challenge.id}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      challenge.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      challenge.difficulty === 'Medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {challenge.title}
                  </h3>

                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{challenge.unitId.toUpperCase()}</span>
                    <span>{challenge.topicTag}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/60">
                    {getProvenanceBadge(challenge.provenance)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Problem Panel, Editor & Console (8 cols on lg) */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* Problem Specification Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            {/* Title & Provenance Record */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {activeChallenge.id}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {activeChallenge.topicTag}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white font-display">
                  {activeChallenge.title}
                </h2>
              </div>
              <div>
                {getProvenanceBadge(activeChallenge.provenance)}
              </div>
            </div>

            {/* Problem Statement */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                Problem Statement
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {activeChallenge.normalizedStatement}
              </p>
            </div>

            {/* Input & Output Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-cyan-400 font-bold block">Input Format:</span>
                <p className="text-slate-300 leading-relaxed font-sans text-xs">
                  {activeChallenge.inputFormat}
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-indigo-400 font-bold block">Output Format:</span>
                <p className="text-slate-300 leading-relaxed font-sans text-xs">
                  {activeChallenge.outputFormat}
                </p>
              </div>
            </div>

            {/* Constraints */}
            <div className="space-y-1.5 text-xs font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-amber-400 font-bold block">Constraints:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {activeChallenge.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Sample I/O */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                Sample Test Cases
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeChallenge.sampleIO.map((sample, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      Sample Case #{idx + 1}
                    </span>
                    <div>
                      <span className="text-cyan-400 text-[10px] block">Standard Input:</span>
                      <pre className="p-2 bg-slate-900 rounded text-cyan-200 text-xs overflow-x-auto mt-0.5">
                        {sample.input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-emerald-400 text-[10px] block">Standard Output:</span>
                      <pre className="p-2 bg-slate-900 rounded text-emerald-200 text-xs overflow-x-auto mt-0.5">
                        {sample.output}
                      </pre>
                    </div>
                    {sample.explanation && (
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed pt-1 border-t border-slate-800/80">
                        {sample.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Code Editor Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Editor Toolbar */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">solution.c</span>
                <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  C99 (GCC)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCodeChange(generateStarterCode(activeChallenge))}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[11px] transition-colors flex items-center gap-1"
                  title="Reset to starter code"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Code</span>
                </button>
              </div>
            </div>

            {/* Textarea Editor with Line Numbers */}
            <div className="flex bg-[#06080e] min-h-[380px] text-xs sm:text-sm font-mono relative">
              {/* Line Numbers Column */}
              <div className="w-12 py-4 select-none text-slate-600 bg-[#04060a] border-r border-slate-800/60 text-right pr-3 font-mono leading-relaxed shrink-0">
                {codeLines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Editable Code Buffer */}
              <textarea
                value={currentCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="flex-1 p-4 bg-transparent text-cyan-200 outline-none resize-none font-mono leading-relaxed selection:bg-cyan-600 selection:text-black w-full"
                placeholder="// Write your C program here..."
                spellCheck={false}
                rows={Math.max(16, codeLines.length + 2)}
              />
            </div>

            {/* Run & Submit Action Row */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Run uses custom input; Submit evaluates against test cases.</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Run Code Button */}
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <Play className={`w-3.5 h-3.5 fill-white ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Compiling & Running...' : 'Run Code'}</span>
                </button>

                {/* Submit Solution Button */}
                <button
                  onClick={handleSubmitSolution}
                  disabled={isRunning || isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 glow-cyan flex items-center gap-2"
                >
                  <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-bounce' : ''}`} />
                  <span>{isSubmitting ? 'Evaluating...' : 'Submit Solution'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Console / Execution Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-0">
            {/* Console Tabs */}
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConsoleTab('output')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    consoleTab === 'output'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Console Output
                </button>

                <button
                  onClick={() => setConsoleTab('input')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    consoleTab === 'input'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Custom Standard Input
                </button>
              </div>

              <span className="text-[10px] text-slate-500">Interactive Console</span>
            </div>

            {/* Custom Input Tab */}
            {consoleTab === 'input' && (
              <div className="p-4 bg-[#05070d] space-y-2">
                <span className="text-xs font-mono text-slate-400 block">
                  Provide custom stdin stream for "Run Code":
                </span>
                <textarea
                  value={customStdin}
                  onChange={(e) => setCustomStdin(e.target.value)}
                  className="w-full h-28 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200 outline-none resize-none selection:bg-cyan-600 selection:text-black"
                  placeholder="Enter inputs to pass to scanf()..."
                />
              </div>
            )}

            {/* Output Tab */}
            {consoleTab === 'output' && (
              <div className="p-4 bg-[#05070d] min-h-[140px] text-xs font-mono leading-relaxed space-y-3">
                {executionResult ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                      <span className="text-slate-400 font-bold">Execution Status:</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        executionResult.verdict === 'NOT_CONFIGURED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        executionResult.verdict === 'ACCEPTED' ? 'bg-emerald-950 text-emerald-300' :
                        'bg-rose-950 text-rose-300'
                      }`}>
                        {executionResult.verdict}
                      </span>
                    </div>

                    {executionResult.compileOutput && (
                      <pre className="text-amber-300/90 whitespace-pre-wrap">
                        {executionResult.compileOutput}
                      </pre>
                    )}

                    {executionResult.stdout && (
                      <div>
                        <span className="text-emerald-400 text-[10px] block mb-1">Standard Output:</span>
                        <pre className="p-3 bg-slate-950 rounded-xl text-emerald-200 whitespace-pre-wrap border border-slate-800">
                          {executionResult.stdout}
                        </pre>
                      </div>
                    )}

                    {executionResult.stderr && (
                      <div>
                        <span className="text-rose-400 text-[10px] block mb-1">Standard Error:</span>
                        <pre className="p-3 bg-slate-950 rounded-xl text-rose-300 whitespace-pre-wrap border border-slate-800">
                          {executionResult.stderr}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : submissionResult ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                      <span className="text-slate-400 font-bold">Evaluation Verdict:</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        submissionResult.verdict === 'NOT_CONFIGURED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        submissionResult.verdict === 'ACCEPTED' ? 'bg-emerald-950 text-emerald-300' :
                        'bg-rose-950 text-rose-300'
                      }`}>
                        {submissionResult.verdict}
                      </span>
                    </div>

                    <pre className="text-amber-300/90 whitespace-pre-wrap">
                      {submissionResult.compileOutput}
                    </pre>
                  </div>
                ) : (
                  <div className="text-slate-500 py-6 text-center">
                    Click <strong className="text-slate-400">"Run Code"</strong> to test with custom stdin, or <strong className="text-slate-400">"Submit Solution"</strong> to evaluate against test criteria.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

