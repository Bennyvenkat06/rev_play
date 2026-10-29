import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Sparkles, 
  Terminal, 
  Cpu, 
  HelpCircle, 
  Sliders, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Zap,
  Info
} from 'lucide-react';
import { soundManager } from '../../utils/sound';

export interface ExecutionTraceStep {
  lineIndex: number; // 0-based index into codeLines
  description: string;
  variables: Record<string, number | string>;
  conditionResult?: boolean | null;
  skippedExpr?: string; // e.g. "++y (Skipped by Short-Circuit)"
  branchTaken?: string;
  output?: string;
}

export interface InteractiveExecutionPanelProps {
  isCorrect: boolean;
  selectedLabel: string;
  correctLabel: string;
  explanation: string;
  codeLines: string[];
  steps: ExecutionTraceStep[];
  conceptName?: string;
  initialVariables?: Record<string, number>;
  supportedParameters?: {
    key: string;
    label: string;
    min: number;
    max: number;
    step: number;
    description: string;
  }[];
  simulationRunner?: (params: Record<string, number>) => {
    steps: ExecutionTraceStep[];
    finalOutput: string;
  };
  onNext?: () => void;
  nextLabel?: string;
}

export const InteractiveExecutionPanel: React.FC<InteractiveExecutionPanelProps> = ({
  isCorrect,
  selectedLabel,
  correctLabel,
  explanation,
  codeLines,
  steps: initialSteps,
  conceptName = 'C Program Flow',
  initialVariables = {},
  supportedParameters,
  simulationRunner,
  onNext,
  nextLabel = 'Next Level'
}) => {
  const [activeTab, setActiveTab] = useState<'trace' | 'why' | 'simulate'>('trace');
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Trace playback state
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulation parameters state
  const [simParams, setSimParams] = useState<Record<string, number>>(initialVariables);
  const [activeSteps, setActiveSteps] = useState<ExecutionTraceStep[]>(initialSteps);

  // When initialSteps change, reset
  useEffect(() => {
    setActiveSteps(initialSteps);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [initialSteps]);

  // Handle Play/Pause continuous step playback
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setTimeout(() => {
        if (currentStepIdx < activeSteps.length - 1) {
          setCurrentStepIdx(prev => prev + 1);
          soundManager.playClick();
        } else {
          setIsPlaying(false);
        }
      }, 1100);
    } else if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
    }

    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, currentStepIdx, activeSteps.length]);

  const currentStep = activeSteps[currentStepIdx] || activeSteps[0];

  const handleStepPrev = () => {
    soundManager.playClick();
    setIsPlaying(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const handleStepNext = () => {
    soundManager.playClick();
    setIsPlaying(false);
    if (currentStepIdx < activeSteps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handleReplay = () => {
    soundManager.playClick();
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    soundManager.playClick();
    setIsPlaying(false);
    setCurrentStepIdx(0);
    if (simulationRunner) {
      setSimParams(initialVariables);
      const res = simulationRunner(initialVariables);
      setActiveSteps(res.steps);
    } else {
      setActiveSteps(initialSteps);
    }
  };

  const handleRunCustomSimulation = (updatedParams: Record<string, number>) => {
    setSimParams(updatedParams);
    if (simulationRunner) {
      soundManager.playClick();
      const res = simulationRunner(updatedParams);
      setActiveSteps(res.steps);
      setCurrentStepIdx(0);
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full bg-slate-950/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300">
      {/* Feedback Banner with Accordion Header */}
      <div 
        className={`p-4 flex items-center justify-between gap-4 border-b cursor-pointer select-none transition-colors ${
          isCorrect 
            ? 'bg-emerald-950/40 border-emerald-800/60 hover:bg-emerald-950/60' 
            : 'bg-rose-950/40 border-rose-800/60 hover:bg-rose-950/60'
        }`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
            isCorrect ? 'bg-emerald-600 text-white shadow-lg glow-neon' : 'bg-rose-600 text-white'
          }`}>
            {isCorrect ? <Check className="w-5 h-5 stroke-[2.5]" /> : <X className="w-5 h-5 stroke-[2.5]" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-black tracking-wide ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                {isCorrect ? 'Correct Decision!' : 'Incorrect Choice'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                • {conceptName}
              </span>
            </div>

            <div className="text-xs text-slate-300 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Your answer: <strong className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>{selectedLabel}</strong></span>
              {!isCorrect && (
                <span>Correct answer: <strong className="text-emerald-400">{correctLabel}</strong></span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-cyan-400 hover:text-cyan-300 font-mono hidden sm:inline">
            {isCollapsed ? 'Expand Interactive Explanation' : 'Collapse Panel'}
          </span>
          <button 
            type="button"
            className="p-1.5 rounded-lg bg-slate-900/80 text-slate-400 hover:text-white"
            aria-label="Toggle explanation panel"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Interactive Body */}
      {!isCollapsed && (
        <div className="p-5 space-y-5">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('trace');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'trace'
                    ? 'bg-cyan-600 text-slate-950 font-bold glow-cyan shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>1. Step Trace</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('why');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'why'
                    ? 'bg-cyan-600 text-slate-950 font-bold glow-cyan shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>2. Why This Happens</span>
              </button>

              {supportedParameters && supportedParameters.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab('simulate');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'simulate'
                      ? 'bg-cyan-600 text-slate-950 font-bold glow-cyan shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>3. Try the Simulation</span>
                </button>
              )}
            </div>

            {/* Step Controls (when on trace tab) */}
            {activeTab === 'trace' && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 mr-1">
                  Step {currentStepIdx + 1} of {activeSteps.length}
                </span>

                <button
                  type="button"
                  disabled={currentStepIdx === 0}
                  onClick={handleStepPrev}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-30 text-slate-300 hover:text-white transition-colors"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setIsPlaying(!isPlaying);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-cyan-300 hover:bg-slate-700 flex items-center gap-1"
                  title={isPlaying ? 'Pause Playback' : 'Play Continuous Steps'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-cyan-300" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  type="button"
                  disabled={currentStepIdx === activeSteps.length - 1}
                  onClick={handleStepNext}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-30 text-slate-300 hover:text-white transition-colors"
                  title="Next Step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleReplay}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 hover:bg-slate-800 transition-colors"
                  title="Replay from Step 1"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* VIEW 1: STEP TRACE */}
          {activeTab === 'trace' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Synchronized Source Code with Active Line Highlight (7 Cols) */}
                <div className="lg:col-span-7 bg-[#05070d] rounded-xl border border-slate-800 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Curated Program Simulation (C99)</span>
                    <span className="text-cyan-400">Line {currentStep.lineIndex + 1} Active</span>
                  </div>
                  <div className="p-3 font-mono text-xs space-y-1 overflow-x-auto leading-relaxed">
                    {codeLines.map((line, idx) => {
                      const isActive = idx === currentStep.lineIndex;
                      return (
                        <div
                          key={idx}
                          className={`px-2.5 py-1 rounded transition-all flex items-center gap-3 ${
                            isActive
                              ? 'bg-cyan-950/90 border border-cyan-500 text-cyan-200 font-bold shadow-md glow-cyan'
                              : 'text-slate-400 hover:text-slate-300'
                          }`}
                        >
                          <span className="text-[10px] text-slate-600 select-none w-5 text-right shrink-0">
                            {idx + 1}
                          </span>
                          <span className="whitespace-pre">{line}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Variable Inspector & Step Annotation (5 Cols) */}
                <div className="lg:col-span-5 space-y-3">
                  {/* Step Explanation Annotation */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Step {currentStepIdx + 1} Action
                      </span>
                      {currentStep.branchTaken && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Route: {currentStep.branchTaken}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {currentStep.description}
                    </p>

                    {/* Short Circuit Visual Indicator */}
                    {currentStep.skippedExpr && (
                      <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-mono flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                        <span><strong>Short-Circuit Skip:</strong> {currentStep.skippedExpr}</span>
                      </div>
                    )}
                  </div>

                  {/* Execution State (Variable Inspector) */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                        Variable Inspector (Execution State)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Illustrative Simulated Model</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(currentStep.variables).map(([key, val]) => (
                        <div key={key} className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center font-mono">
                          <span className="text-[10px] text-slate-400 block">{key}</span>
                          <span className="text-base font-bold text-emerald-400">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* stdout Console Output */}
                  <div className="bg-[#05070d] p-3 rounded-xl border border-slate-800 font-mono text-xs">
                    <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      <span>stdout terminal console:</span>
                    </div>
                    <div className="text-cyan-300 min-h-[20px] font-bold">
                      {currentStep.output ? (
                        <span>{currentStep.output}</span>
                      ) : (
                        <span className="text-slate-600 italic font-normal">(No output generated yet)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: WHY THIS HAPPENS */}
          {activeTab === 'why' && (
            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  Understanding the Underlying C Logic
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {explanation}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="text-cyan-400 font-bold font-mono">Standard C Language Specification:</div>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  <li>In C (ISO C99/C11/C17 §6.5.14), the logical OR operator <code>||</code> guarantees left-to-right evaluation.</li>
                  <li>There is a sequence point after evaluation of the first operand.</li>
                  <li>If the first operand compares unequal to 0 (evaluates to true), the second operand is <strong>not evaluated</strong> (short-circuit evaluation).</li>
                  <li>Because the second operand <code>++y</code> is never evaluated, no side effects take place, and variable <code>y</code> retains its initial value <code>0</code>.</li>
                </ul>
              </div>
            </div>
          )}

          {/* VIEW 3: TRY THE SIMULATION (Interactive Parameter Manipulation) */}
          {activeTab === 'simulate' && supportedParameters && supportedParameters.length > 0 && (
            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Live Experiment Sandbox
                </h4>
                <p className="text-xs text-slate-400">
                  Adjust the initial variable values below to observe how program flow and short-circuit evaluation change in real time.
                </p>
              </div>

              {/* Parameter Sliders / Radios */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                {supportedParameters.map((param) => {
                  const currentVal = simParams[param.key] ?? param.min;
                  return (
                    <div key={param.key} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-300 font-semibold">{param.label}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-bold">
                          {param.key} = {currentVal}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={currentVal}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const updated = { ...simParams, [param.key]: val };
                          handleRunCustomSimulation(updated);
                        }}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-500">{param.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Instant Comparison Note */}
              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/80 text-xs text-cyan-200">
                <strong>Experiment Tip:</strong> Try setting <code>x = 0</code>. Notice that because the left operand is now false (0), the logical OR cannot short-circuit! It must evaluate the right operand <code>++y</code>, incrementing <code>y</code> to <code>1</code>.
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                >
                  Reset to Default
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('trace');
                    handleReplay();
                  }}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors glow-cyan"
                >
                  View Step Trace with Custom Values →
                </button>
              </div>
            </div>
          )}

          {/* Action Footer */}
          {onNext && (
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Simulation verified against C standard specification
              </span>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onNext();
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
              >
                <span>{nextLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

