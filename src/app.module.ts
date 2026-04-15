import { Module } from "npm:@nestjs/common@10.4.15";

import { ActivityModule } from "./modules/activity/activity.module.ts";
import { DailyRecordModule } from "./modules/daily-record/daily-record.module.ts";
import { ExportModule } from "./modules/export/export.module.ts";
import { SubstanceModule } from "./modules/substance/substance.module.ts";
import { TagModule } from "./modules/tag/tag.module.ts";
import { PrismaModule } from "./shared/infrastructure/prisma/prisma.module.ts";

@Module({
  imports: [
    PrismaModule,
    TagModule,
    SubstanceModule,
    ActivityModule,
    DailyRecordModule,
    ExportModule
  ]
})
export class AppModule {}
