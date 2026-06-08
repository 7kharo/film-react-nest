import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class DevLogger extends ConsoleLogger {
  protected formatPid(pid: number): string {
    return `[Nest] ${pid}  - `;
  }

  protected formatContext(context: string): string {
    return context ? `[${context}] ` : '';
  }
}