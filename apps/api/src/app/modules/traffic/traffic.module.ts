import { TrafficController } from "@crm/api/modules/traffic/traffic.controller";
import { TrafficService } from "@crm/api/modules/traffic/traffic.service";
import { UserModule } from "@crm/api/modules/user/user.module";
import { Traffic, TrafficSchema } from "@crm/shared/schemas/traffic.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Traffic.name, schema: TrafficSchema }]),
    UserModule
  ],
  controllers: [TrafficController],
  providers: [TrafficService],
  exports: [TrafficService]
})
export class TrafficModule {}
