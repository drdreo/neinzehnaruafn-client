import { Module } from '@nestjs/common';
import { BusdriverModule } from '../busdriver/busdriver.module';

@Module({
  imports: [BusdriverModule]
})
export class AppModule {

}


