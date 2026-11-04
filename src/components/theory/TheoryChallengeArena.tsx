import React, { useState, useEffect, useMemo } from 'react';
import { THEORY_QUESTION_BANK } from '../../data/theoryChallengeData';
import { TheoryQuestion, TheoryQuestionType, TheoryDifficulty } from '../../types/theoryChallenge';
import { soundManager } from '../../utils/sound';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Filter,
  Check,
  X,
  Code2,
  Terminal,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface TheoryChallengeArenaProps {
  onOpenNotes?: (notesId: string) => void;
  onRecordScore?: (xp: number) => void;
}

export const TheoryChallengeArena: React.FC<TheoryChallengeArenaProps> = ({
  onOpenNotes,
  onRecordScore
}) => {
  // Filters
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Assessment Mode State
  const [isTimedMode, setIsTimedMode] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(300); // 5 min default
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Active Question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  
  // Selected answers: questionId -> array of selected optionIds
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  // Submitted status: questionId -> boolean
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  // Show hint
  const [showHint, setShowHint] = useState<boolean>(false);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return THEORY_QUESTION_BANK.filter(q => {
      if (selectedUnit !== 'ALL' && q.unitId !== selectedUnit) return false;
      if (selectedDifficulty !== 'ALL' && q.difficulty !== selectedDifficulty) return false;
      if (selectedType !== 'ALL' && q.type !== selectedType) return false;
      return true;
    });
  }, [selectedUnit, selectedDifficulty, selectedType]);

  // Keep index within bounds
  useEffect(() => {
    if (currentQuestionIndex >= filteredQuestions.length) {
      setCurrentQuestionIndex(0);
    }
    setShowHint(false);
  }, [filteredQuestions.length, currentQuestionIndex]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimedMode && timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            soundManager.playError();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimedMode, timerActive, timerSeconds]);

  const currentQ: TheoryQuestion | undefined = filteredQuestions[currentQuestionIndex];
  const currentSelectedOpts = (currentQ && answers[currentQ.id]) || [];
  const isCurrentSubmitted = Boolean(currentQ && submitted[currentQ.id]);

  // Handle option click
  const handleToggleOption = (optId: string) => {
    if (!currentQ || isCurrentSubmitted) return;
    soundManager.playClick();

    if (currentQ.type === 'MULTIPLE_SELECT') {
      const exists = currentSelectedOpts.includes(optId);
      const updated = exists 
        ? currentSelectedOpts.filter(id => id !== optId) 
        : [...currentSelectedOpts, optId];
      setAnswers(prev => ({ ...prev, [currentQ.id]: updated }));
    } else {
      // Single select
      setAnswers(prev => ({ ...prev, [currentQ.id]: [optId] }));
    }
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (!currentQ || currentSelectedOpts.length === 0 || isCurrentSubmitted) return;
    
    // Check correctness
    const correctOptIds = currentQ.options.filter(o => o.isCorrect).map(o => o.id);
    const isCorrect = 
      correctOptIds.length === currentSelectedOpts.length &&
      correctOptIds.every(id => currentSelectedOpts.includes(id));

    setSubmitted(prev => ({ ...prev, [currentQ.id]: true }));

    if (isCorrect) {
      soundManager.playCorrect();
      if (onRecordScore) onRecordScore(30);
    } else {
      soundManager.playError();
    }
  };

  // Stats
  const answeredCount = Object.keys(submitted).length;
  const correctCount = useMemo(() => {
    return Object.entries(submitted).filter(([qId, isSub]) => {
      if (!isSub) return false;
      const q = THEORY_QUESTION_BANK.find(it => it.id === qId);
      if (!q) return false;
      const userSel = answers[qId] || [];
      const correct = q.options.filter(o => o.isCorrect).map(o => o.id);
      return correct.length === userSel.length && correct.every(id => userSel.includes(id));
    }).length;
  }, [submitted, answers]);

  const handleNext = () => {
    soundManager.playClick();
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowHint(false);
    }
  };

  const handlePrev = () => {
    soundManager.playClick();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowHint(false);
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setAnswers({});
    setSubmitted({});
    setCurrentQuestionIndex(0);
    setShowHint(false);
    setTimerSeconds(300);
    setTimerActive(false);
  };

  // Format type name nicely
  const formatTypeName = (type: TheoryQuestionType) => {
    switch (type) {
      case 'MCQ': return 'Multiple Choice';
      case 'MULTIPLE_SELECT': return 'Multiple Select';
      case 'OUTPUT_PREDICTION': return 'Output Prediction';
      case 'CODE_TRACING': return 'Code Tracing';
      case 'FIND_THE_ERROR': return 'Find the Error';
      case 'FILL_MISSING_STEP': return 'Fill the Missing Step';
      case 'CONCEPTUAL_REASONING': return 'Conceptual Reasoning';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Assessment Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono bg-purple-950 text-purple-300 border border-purple-800">
                CS103ES THEORY
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                CHALLENGE ARENA
              </span>
              <span className="text-xs font-mono text-slate-400">
                Independent Assessment & Problem Solving
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-display">
              Conceptual Diagnostic Challenges
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Rigorous problem solving covering output prediction, code tracing, error hunting, and C99 semantic reasoning.
            </p>
          </div>

          {/* Assessment Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Timed Mode Toggle */}
            <button
              onClick={() => {
                soundManager.playClick();
                setIsTimedMode(!isTimedMode);
                setTimerActive(!isTimedMode);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition-all ${
                isTimedMode
                  ? 'bg-amber-950 text-amber-300 border-amber-700 glow-amber'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>
                {isTimedMode
                  ? `${Math.floor(timerSeconds / 60)}:${String(timerSeconds % 60).padStart(2, '0')}`
                  : 'Timed Mode'}
              </span>
            </button>

            {/* Score Capsule */}
            <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">Solved:</span>
              <span className="text-emerald-400 font-bold">{correctCount}</span>
              <span className="text-slate-600">/</span>
              <span className="text-white">{filteredQuestions.length}</span>
            </div>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Reset Assessment"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-mono flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Unit:
            </span>
            {['ALL', 'unit-1', 'unit-2', 'unit-3', 'unit-4', 'unit-5'].map(u => (
              <button
                key={u}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedUnit(u);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                  selectedUnit === u
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
                  setSelectedDifficulty(d);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all ${
                  selectedDifficulty === d
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

      {/* Main Question Display */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <p className="text-sm">No questions match the selected filter criteria.</p>
          <button
            onClick={() => {
              setSelectedUnit('ALL');
              setSelectedDifficulty('ALL');
              setSelectedType('ALL');
            }}
            className="px-4 py-2 bg-slate-800 rounded-xl text-white text-xs hover:bg-slate-700"
          >
            Reset Filters
          </button>
        </div>
      ) : currentQ ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Question Header & Provenance */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                Q{currentQuestionIndex + 1} of {filteredQuestions.length}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-purple-950 text-purple-300 border border-purple-800">
                Unit {currentQ.unitNumber}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300">
                {formatTypeName(currentQ.type)}
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                currentQ.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                currentQ.difficulty === 'Medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {currentQ.difficulty}
              </span>
            </div>

            {/* Honest Provenance Badge */}
            <div className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
              {currentQ.provenance}
            </div>
          </div>

          {/* Topic & Prompt */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Topic: {currentQ.topic}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.prompt}
            </h2>
          </div>

          {/* Optional Code Snippet Panel */}
          {currentQ.codeSnippet && (
            <div className="bg-[#05070d] rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>source_snippet.c</span>
                </div>
                <span className="text-[10px] text-slate-500">C99 Standard Code</span>
              </div>
              <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono text-cyan-200 overflow-x-auto leading-relaxed">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Answer Options Grid */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>
                {currentQ.type === 'MULTIPLE_SELECT'
                  ? 'Select all correct options:'
                  : 'Select the best answer:'}
              </span>
              {currentQ.hint && !isCurrentSubmitted && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{showHint ? 'Hide Hint' : 'View Hint'}</span>
                </button>
              )}
            </div>

            {showHint && currentQ.hint && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl text-xs text-amber-200 font-sans animate-in fade-in">
                <strong>Pedagogical Hint:</strong> {currentQ.hint}
              </div>
            )}

            <div className="grid grid-cols-1 gap-2.5">
              {currentQ.options.map((opt) => {
                const isSelected = currentSelectedOpts.includes(opt.id);
                let btnStyle = 'bg-slate-950 hover:bg-slate-800/80 text-slate-200 border-slate-800';

                if (isCurrentSubmitted) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-300 font-bold glow-neon';
                  } else if (isSelected && !opt.isCorrect) {
                    btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-300';
                  } else {
                    btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-40';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-md font-semibold';
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isCurrentSubmitted}
                    onClick={() => handleToggleOption(opt.id)}
                    className={`p-4 rounded-2xl border text-left font-sans text-xs sm:text-sm transition-all flex items-start justify-between gap-3 ${btnStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold ${
                        isSelected 
                          ? 'border-cyan-400 bg-cyan-500 text-slate-950' 
                          : 'border-slate-700 bg-slate-900 text-slate-400'
                      }`}>
                        {currentQ.type === 'MULTIPLE_SELECT' ? (
                          isSelected ? '✓' : ''
                        ) : (
                          opt.id.replace('opt-', '')
                        )}
                      </div>
                      <span className="leading-relaxed font-mono">{opt.text}</span>
                    </div>

                    {isCurrentSubmitted && (
                      <div className="shrink-0 mt-0.5">
                        {opt.isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                        {isSelected && !opt.isCorrect && <X className="w-4 h-4 text-rose-400" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row: Submit or Next */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === filteredQuestions.length - 1}
                className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {!isCurrentSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={currentSelectedOpts.length === 0}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 glow-cyan flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Submit Answer</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center gap-2"
              >
                <span>Continue to Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* In-depth Explanation Card after submission */}
          {isCurrentSubmitted && (
            <div className="p-5 sm:p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Academic Explanation & C Standard Verification</span>
                </div>
                {currentQ.cStandardRef && (
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                    {currentQ.cStandardRef}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Question Grid Navigator */}
          <div className="pt-4 border-t border-slate-800">
            <div className="text-[11px] font-mono text-slate-500 mb-2">Question Grid Navigation:</div>
            <div className="flex flex-wrap gap-1.5">
              {filteredQuestions.map((q, idx) => {
                const isAnswered = Boolean(submitted[q.id]);
                const isCur = idx === currentQuestionIndex;
                let pillStyle = 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white';

                if (isCur) {
                  pillStyle = 'bg-cyan-600 text-slate-950 font-bold border-cyan-400';
                } else if (isAnswered) {
                  const correct = q.options.filter(o => o.isCorrect).map(o => o.id);
                  const userSel = answers[q.id] || [];
                  const isRight = correct.length === userSel.length && correct.every(id => userSel.includes(id));
                  pillStyle = isRight 
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                    : 'bg-rose-950 text-rose-400 border-rose-800';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      soundManager.playClick();
                      setCurrentQuestionIndex(idx);
                      setShowHint(false);
                    }}
                    className={`w-7 h-7 rounded-lg border text-xs font-mono font-semibold flex items-center justify-center transition-all ${pillStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

