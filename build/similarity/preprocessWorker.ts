import { parentPort } from 'node:worker_threads';
import { getTokenizer, preprocessText } from './textProcessing';

type TokenizeJob = { index: number; slug?: string; text: string };
type TokenizeWorkerResult = { index: number; tokens: string[]; error?: string };

async function preprocessJobs(jobs: TokenizeJob[]): Promise<TokenizeWorkerResult[]> {
  const tokenizer = await getTokenizer();
  const results: TokenizeWorkerResult[] = [];

  for (const job of jobs) {
    try {
      results.push({
        index: job.index,
        tokens: preprocessText(job.text, tokenizer, job.slug),
      });
    } catch (error) {
      results.push({
        index: job.index,
        tokens: [],
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}

parentPort?.on('message', async (jobs: TokenizeJob[]) => {
  try {
    parentPort?.postMessage({ results: await preprocessJobs(jobs) });
  } catch (error) {
    parentPort?.postMessage({ error: error instanceof Error ? error.message : String(error) });
  } finally {
    parentPort?.close();
  }
});
