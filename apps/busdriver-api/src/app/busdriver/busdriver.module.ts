import { Module, Logger } from '@nestjs/common';
import { BusdriverController } from './busdriver.controller';
import { BusdriverGateway } from './busdriver.gateway';
import { BusdriverService } from './busdriver.service';

@Module({
  providers: [BusdriverGateway, BusdriverService, BusdriverGateway, Logger],
  controllers: [BusdriverController]
})
export class BusdriverModule {}
