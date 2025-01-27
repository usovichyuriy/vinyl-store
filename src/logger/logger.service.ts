import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LOG_LEVELS } from './constants/logger.constants';
import { Log } from 'database/models/log.model';
import { SEQUELIZE_PROVIDERS_KEYS } from 'src/sequelize/sequelize.constants';
import { LOGGER_RESPONSE_MESSAGES } from './constants/logger-response.messages';

@Injectable()
class LoggerService {
  constructor(
    @Inject(SEQUELIZE_PROVIDERS_KEYS.LOGS_REPOSITORY)
    private logsRepository: typeof Log,
  ) {}

  private mapLogs(logsObjects: Log[]): string[] {
    const logs = logsObjects.map((log) => {
      return `[${log.logDate}] ${log.level}: ${log.action} ${log.model} with id = ${log.modelId} by user ${log.userId}`;
    });
    return logs;
  }

  async createLog(
    action: string,
    model: string,
    modelId: number,
    userId: number,
  ): Promise<void> {
    const newLog = {
      id: undefined,
      logDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
      level: LOG_LEVELS.INFO,
      action,
      model,
      modelId,
      userId,
    };
    await this.logsRepository.create(newLog);
  }

  async getLogs(): Promise<string[]> {
    const logsObjects = await this.logsRepository.findAll();

    if (!logsObjects) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: LOGGER_RESPONSE_MESSAGES.LOGS_NOT_FOUND,
      });
    }

    return this.mapLogs(logsObjects);
  }
}
export default LoggerService;
