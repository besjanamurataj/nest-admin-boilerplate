import { Module } from '@nestjs/common';
import { StartupRunnerService } from './startup-runner.service';

@Module({
  providers: [StartupRunnerService],
})
export class StartupModule {}
