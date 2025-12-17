import { type ChildProcess, spawn } from 'node:child_process';
import { join } from 'node:path';

import * as Log from '~/tools/logger';

import { OGP_CONFIG } from './config';

export class OGPServerManager {
  private serverProcess: ChildProcess | null = null;
  private readonly serverUrl: string;

  constructor() {
    this.serverUrl = `${OGP_CONFIG.server.host}:${OGP_CONFIG.server.port}`;
  }

  async start(): Promise<void> {
    if (this.serverProcess) {
      throw new Error('Server is already running');
    }

    Log.info('OGP Server', 'Starting...');

    const serverPath = join(__dirname, 'server.tsx');
    this.serverProcess = spawn('node', ['--require', 'esbuild-register', serverPath], {
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false,
    });

    this.attachLogging();

    Log.info('OGP Server', `Waiting for ready at ${this.serverUrl}...`);
    await this.waitForReady();
    Log.info('OGP Server', 'Ready');
  }

  async stop(): Promise<void> {
    if (!this.serverProcess || this.serverProcess.killed) {
      return;
    }

    Log.info('OGP Server', 'Stopping...');

    this.serverProcess.kill('SIGTERM');

    await Promise.race([
      new Promise<void>((resolve) => {
        this.serverProcess?.on('exit', () => resolve());
      }),
      new Promise<void>((resolve) => setTimeout(resolve, OGP_CONFIG.server.shutdownTimeout)),
    ]);

    if (!this.serverProcess.killed) {
      this.serverProcess.kill('SIGKILL');
    }

    this.serverProcess = null;
    Log.info('OGP Server', 'Stopped');
  }

  private attachLogging(): void {
    if (!this.serverProcess) return;

    this.serverProcess.stdout?.on('data', (data) => {
      const message = data.toString().trim();
      if (message) {
        Log.info('[Server]', message);
      }
    });

    this.serverProcess.stderr?.on('data', (data) => {
      const message = data.toString().trim();
      if (message) {
        Log.error('[Server]', message);
      }
    });
  }

  private async waitForReady(): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < OGP_CONFIG.server.readyTimeout) {
      try {
        const response = await fetch(this.serverUrl, {
          signal: AbortSignal.timeout(OGP_CONFIG.server.healthCheckTimeout),
        });

        if (response.ok) {
          return;
        }
      } catch {
        await new Promise((resolve) => setTimeout(resolve, OGP_CONFIG.server.readyCheckInterval));
      }
    }

    throw new Error(`Server not ready after ${OGP_CONFIG.server.readyTimeout}ms`);
  }
}
