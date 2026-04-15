import { Activity } from "../../../domain/entities/Activity.ts";

export class ActivityPrismaMapper {
  static toDomain(model: { id: string; name: string }): Activity {
    return Activity.rehydrate({
      id: model.id,
      name: model.name
    });
  }
}

