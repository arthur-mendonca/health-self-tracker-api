import assert from "node:assert/strict";

import { CreateActivityService } from "../../src/modules/activity/application/use-cases/CreateActivityService.ts";
import type { ActivityRepositoryPort } from "../../src/modules/activity/application/ports/out/ActivityRepositoryPort.ts";
import type { Activity } from "../../src/modules/activity/domain/entities/Activity.ts";
import { CreateSubstanceService } from "../../src/modules/substance/application/use-cases/CreateSubstanceService.ts";
import type { SubstanceRepositoryPort } from "../../src/modules/substance/application/ports/out/SubstanceRepositoryPort.ts";
import type { Substance } from "../../src/modules/substance/domain/entities/Substance.ts";
import { CreateTagService } from "../../src/modules/tag/application/use-cases/CreateTagService.ts";
import type { TagRepositoryPort } from "../../src/modules/tag/application/ports/out/TagRepositoryPort.ts";
import type { Tag } from "../../src/modules/tag/domain/entities/Tag.ts";

Deno.test("CreateTagService generates a ULID-backed tag", async () => {
  const repository = new FakeTagRepository();
  const service = new CreateTagService(repository);

  const tag = await service.execute({
    name: "Headache",
    category: "SYMPTOM"
  });

  assert.match(tag.id, /^[0-9A-HJKMNP-TV-Z]{26}$/);
  assert.equal(tag.name, "Headache");
  assert.equal(tag.category, "SYMPTOM");
});

Deno.test("CreateSubstanceService generates a ULID-backed substance", async () => {
  const repository = new FakeSubstanceRepository();
  const service = new CreateSubstanceService(repository);

  const substance = await service.execute({
    name: "Magnesium",
    type: "SUPPLEMENT",
    defaultDose: "200mg"
  });

  assert.match(substance.id, /^[0-9A-HJKMNP-TV-Z]{26}$/);
  assert.equal(substance.name, "Magnesium");
  assert.equal(substance.type, "SUPPLEMENT");
  assert.equal(substance.defaultDose, "200mg");
});

Deno.test("CreateActivityService generates a ULID-backed activity", async () => {
  const repository = new FakeActivityRepository();
  const service = new CreateActivityService(repository);

  const activity = await service.execute({
    name: "Walk"
  });

  assert.match(activity.id, /^[0-9A-HJKMNP-TV-Z]{26}$/);
  assert.equal(activity.name, "Walk");
});

class FakeTagRepository implements TagRepositoryPort {
  async create(tag: Tag): Promise<Tag> {
    return tag;
  }

  async list(): Promise<Tag[]> {
    return [];
  }
}

class FakeSubstanceRepository implements SubstanceRepositoryPort {
  async create(substance: Substance): Promise<Substance> {
    return substance;
  }

  async list(): Promise<Substance[]> {
    return [];
  }
}

class FakeActivityRepository implements ActivityRepositoryPort {
  async create(activity: Activity): Promise<Activity> {
    return activity;
  }

  async list(): Promise<Activity[]> {
    return [];
  }
}

