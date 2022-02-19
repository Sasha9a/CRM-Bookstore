import { BaseService } from "@crm/api/core/services/base.service";
import { Traffic } from "@crm/shared/schemas/traffic.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

/** Сервис выполняющие операции с БД трафиком */
@Injectable()
export class TrafficService extends BaseService<Traffic> {

  public constructor(@InjectModel(Traffic.name) private readonly trafficModel: Model<Traffic>) {
    super(trafficModel);
  }

}
