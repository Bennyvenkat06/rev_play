/**
 * RevPlay Compiler Service Interface
 * 
 * Provides a typed interface for executing and evaluating C code.
 * Per Iteration 2 requirements:
 * "Do not create a fake compiler or display fabricated successful results.
 * If a genuine compiler backend is not yet connected, build the frontend against
 * a clearly defined compiler-service interface. Display a truthful
 * not-configured/service-unavailable state rather than pretending compilation succeeded.
 * Iteration 3 will connect the real execution service (FastAPI + Judge0)."
 */

export type ExecutionVerdict = 
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'COMPILATION_ERROR'
  | 'RUNTIME_ERROR'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'PENDING'
  | 'SYSTEM_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'NOT_CONFIGURED';

export interface RunCodeRequest {
  sourceCode: string;
  stdin: string;
  language?: string; // 'c' / 'c99'
  timeoutMs?: number;
}

export interface RunCodeResponse {
  verdict: ExecutionVerdict;
  stdout: string;
  stderr: string;
  compileOutput: string;
  exitCode: number | null;
  executionTimeMs: number | null;
  memoryKb: number | null;
  isBackendConnected: boolean;
  message: string;
}

export interface SubmitSolutionRequest {
  challengeId: string;
  sourceCode: string;
  language?: string;
}

export interface SubmitSolutionResponse {
  verdict: ExecutionVerdict;
  totalTestCases: number;
  passedTestCases: number;
  failedCaseIndex: number | null;
  compileOutput: string;
  executionTimeMs: number | null;
  isBackendConnected: boolean;
  message: string;
}

export class CompilerService {
  private static backendUrl: string | null = (import.meta as any).env?.VITE_BACKEND_API_URL || null;

  /**
   * Check if an authoritative compiler backend is configured.
   */
  public static isConfigured(): boolean {
    return Boolean(this.backendUrl && this.backendUrl.trim().length > 0);
  }

  /**
   * Run student C code with custom standard input.
   * If backend is unconfigured, truthfully returns NOT_CONFIGURED without fabrication.
   */
  public static async runCode(req: RunCodeRequest): Promise<RunCodeResponse> {
    if (!this.isConfigured()) {
      return {
        verdict: 'NOT_CONFIGURED',
        stdout: '',
        stderr: '',
        compileOutput: 
          '[RevPlay Compiler Notice]\n' +
          'No remote isolated C execution service is currently configured on this frontend.\n' +
          'Status: Live compiler backend is scheduled for Iteration 3 (FastAPI + Judge0 on Cloud Run).\n' +
          'RevPlay does NOT fabricate compilation results or mock terminal output.',
        exitCode: null,
        executionTimeMs: null,
        memoryKb: null,
        isBackendConnected: false,
        message: 'Isolated execution backend is scheduled for Iteration 3. No fake compilation was performed.'
      };
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/v1/compiler/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req)
      });

      if (!response.ok) {
        return {
          verdict: 'SYSTEM_ERROR',
          stdout: '',
          stderr: `Server returned HTTP ${response.status}: ${response.statusText}`,
          compileOutput: '',
          exitCode: null,
          executionTimeMs: null,
          memoryKb: null,
          isBackendConnected: true,
          message: 'Execution service responded with a server error.'
        };
      }

      return await response.json();
    } catch (err: any) {
      return {
        verdict: 'SERVICE_UNAVAILABLE',
        stdout: '',
        stderr: `Failed to connect to execution service at ${this.backendUrl}: ${err?.message || 'Network error'}`,
        compileOutput: '',
        exitCode: null,
        executionTimeMs: null,
        memoryKb: null,
        isBackendConnected: false,
        message: 'Could not establish connection to the remote compiler sandbox.'
      };
    }
  }

  /**
   * Submit student solution for server-side evaluation against hidden tests.
   * Hidden test cases are never evaluated in the browser.
   */
  public static async submitSolution(req: SubmitSolutionRequest): Promise<SubmitSolutionResponse> {
    if (!this.isConfigured()) {
      return {
        verdict: 'NOT_CONFIGURED',
        totalTestCases: 0,
        passedTestCases: 0,
        failedCaseIndex: null,
        compileOutput: 
          '[RevPlay Submission Notice]\n' +
          'Evaluator sandbox is not connected to a remote verification worker.\n' +
          'Hidden test cases and authoritative verdicts are evaluated exclusively server-side in Iteration 3.\n' +
          'Client-side evaluation is prohibited by RevPlay academic integrity guidelines.',
        executionTimeMs: null,
        isBackendConnected: false,
        message: 'Authoritative evaluation backend is scheduled for Iteration 3.'
      };
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/v1/compiler/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req)
      });

      if (!response.ok) {
        return {
          verdict: 'SYSTEM_ERROR',
          totalTestCases: 0,
          passedTestCases: 0,
          failedCaseIndex: null,
          compileOutput: `Server returned HTTP ${response.status}: ${response.statusText}`,
          executionTimeMs: null,
          isBackendConnected: true,
          message: 'Evaluation service encountered an error.'
        };
      }

      return await response.json();
    } catch (err: any) {
      return {
        verdict: 'SERVICE_UNAVAILABLE',
        totalTestCases: 0,
        passedTestCases: 0,
        failedCaseIndex: null,
        compileOutput: `Submission service unreachable at ${this.backendUrl}: ${err?.message || 'Network error'}`,
        executionTimeMs: null,
        isBackendConnected: false,
        message: 'Could not connect to evaluation service.'
      };
    }
  }
}

