import assert from "node:assert/strict";

import { DeleteActivityService } from "../../src/modules/activity/application/use-cases/DeleteActivityService.ts";
import { CreateActivityService } from "../../src/modules/activity/application/use-cases/CreateActivityService.ts";
import { UpdateActivityService } from "../../src/modules/activity/application/use-cases/UpdateActivityService.ts";
import type {
  ActivityRepositoryPort,
  UpdateActivityData
} from "../../src/modules/activity/application/ports/out/ActivityRepositoryPort.ts";
import { Activity } from "../../src/modules/activity/domain/entities/Activity.ts";
import { CreateSubstanceService } from "../../src/modules/substance/application/use-cases/CreateSubstanceService.ts";
import { DeleteSubstanceService } from "../../src/modules/substance/application/use-cases/DeleteSubstanceService.ts";
import { UpdateSubstanceService } from "../../src/modules/substance/application/use-cases/UpdateSubstanceService.ts";
import type {
  SubstanceRepositoryPort,
  UpdateSubstanceData
} from "../../src/modules/substance/application/ports/out/SubstanceRepositoryPort.ts";
import { Substance } from "../../src/modules/substance/domain/entities/Substance.ts";
import { CreateTagService } from "../../src/modules/tag/application/use-cases/CreateTagService.ts";
import { DeleteTagService } from "../../src/modules/tag/application/use-cases/DeleteTagService.ts";
import { UpdateTagService } from "../../src/modules/tag/application/use-cases/UpdateTagService.ts";
import type { TagRepositoryPort, UpdateTagData } from "../../src/modules/tag/application/ports/out/TagRepositoryPort.ts";
import { Tag } from "../../src/modules/tag/domain/entities/Tag.ts";

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

Deno.test("UpdateTagService updates a tag by id", async () => {
  const repository = new FakeTagRepository();
  const createService = new CreateTagService(repository);
  const updateService = new UpdateTagService(repository);

  const tag = await createService.execute({
    name: "Headache",
    category: "SYMPTOM"
  });

  const updated = await updateService.execute({
    id: tag.id,
    name: "Migraine",
    category: "TRIGGER"
  });

  assert.ok(updated);
  assert.equal(updated.id, tag.id);
  assert.equal(updated.name, "Migraine");
  assert.equal(updated.category, "TRIGGER");
});

Deno.test("UpdateTagService returns null for missing tag", async () => {
  const repository = new FakeTagRepository();
  const service = new UpdateTagService(repository);

  const updated = await service.execute({
    id: "missing",
    name: "Migraine"
  });

  assert.equal(updated, null);
});

Deno.test("DeleteTagService deletes a tag by id", async () => {
  const repository = new FakeTagRepository();
  const createService = new CreateTagService(repository);
  const deleteService = new DeleteTagService(repository);

  const tag = await createService.execute({
    name: "Headache",
    category: "SYMPTOM"
  });

  assert.equal(await deleteService.execute(tag.id), true);
  assert.equal(await deleteService.execute(tag.id), false);
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

Deno.test("UpdateSubstanceService updates a substance by id", async () => {
  const repository = new FakeSubstanceRepository();
  const createService = new CreateSubstanceService(repository);
  const updateService = new UpdateSubstanceService(repository);

  const substance = await createService.execute({
    name: "Magnesium",
    type: "SUPPLEMENT",
    defaultDose: "200mg"
  });

  const updated = await updateService.execute({
    id: substance.id,
    name: "Ibuprofen",
    type: "MEDICATION",
    defaultDose: "400mg"
  });

  assert.ok(updated);
  assert.equal(updated.id, substance.id);
  assert.equal(updated.name, "Ibuprofen");
  assert.equal(updated.type, "MEDICATION");
  assert.equal(updated.defaultDose, "400mg");
});

Deno.test("UpdateSubstanceService returns null for missing substance", async () => {
  const repository = new FakeSubstanceRepository();
  const service = new UpdateSubstanceService(repository);

  const updated = await service.execute({
    id: "missing",
    name: "Ibuprofen"
  });

  assert.equal(updated, null);
});

Deno.test("DeleteSubstanceService deletes a substance by id", async () => {
  const repository = new FakeSubstanceRepository();
  const createService = new CreateSubstanceService(repository);
  const deleteService = new DeleteSubstanceService(repository);

  const substance = await createService.execute({
    name: "Magnesium",
    type: "SUPPLEMENT",
    defaultDose: "200mg"
  });

  assert.equal(await deleteService.execute(substance.id), true);
  assert.equal(await deleteService.execute(substance.id), false);
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

Deno.test("UpdateActivityService updates an activity by id", async () => {
  const repository = new FakeActivityRepository();
  const createService = new CreateActivityService(repository);
  const updateService = new UpdateActivityService(repository);

  const activity = await createService.execute({
    name: "Walk"
  });

  const updated = await updateService.execute({
    id: activity.id,
    name: "Run"
  });

  assert.ok(updated);
  assert.equal(updated.id, activity.id);
  assert.equal(updated.name, "Run");
});

Deno.test("UpdateActivityService returns null for missing activity", async () => {
  const repository = new FakeActivityRepository();
  const service = new UpdateActivityService(repository);

  const updated = await service.execute({
    id: "missing",
    name: "Run"
  });

  assert.equal(updated, null);
});

Deno.test("DeleteActivityService deletes an activity by id", async () => {
  const repository = new FakeActivityRepository();
  const createService = new CreateActivityService(repository);
  const deleteService = new DeleteActivityService(repository);

  const activity = await createService.execute({
    name: "Walk"
  });

  assert.equal(await deleteService.execute(activity.id), true);
  assert.equal(await deleteService.execute(activity.id), false);
});

class FakeTagRepository implements TagRepositoryPort {
  private tags = new Map<string, Tag>();

  async create(tag: Tag): Promise<Tag> {
    this.tags.set(tag.id, tag);
    return tag;
  }

  async list(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }

  async update(id: string, data: UpdateTagData): Promise<Tag | null> {
    const current = this.tags.get(id);

    if (!current) {
      return null;
    }

    const updated = Tag.rehydrate({
      id: current.id,
      name: data.name ?? current.name,
      category: data.category ?? current.category,
      createdAt: current.createdAt
    });

    this.tags.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.tags.delete(id);
  }
}

class FakeSubstanceRepository implements SubstanceRepositoryPort {
  private substances = new Map<string, Substance>();

  async create(substance: Substance): Promise<Substance> {
    this.substances.set(substance.id, substance);
    return substance;
  }

  async list(): Promise<Substance[]> {
    return Array.from(this.substances.values());
  }

  async update(id: string, data: UpdateSubstanceData): Promise<Substance | null> {
    const current = this.substances.get(id);

    if (!current) {
      return null;
    }

    const updated = Substance.rehydrate({
      id: current.id,
      name: data.name ?? current.name,
      type: data.type ?? current.type,
      defaultDose: data.defaultDose === undefined ? current.defaultDose : data.defaultDose
    });

    this.substances.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.substances.delete(id);
  }
}

class FakeActivityRepository implements ActivityRepositoryPort {
  private activities = new Map<string, Activity>();

  async create(activity: Activity): Promise<Activity> {
    this.activities.set(activity.id, activity);
    return activity;
  }

  async list(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async update(id: string, data: UpdateActivityData): Promise<Activity | null> {
    const current = this.activities.get(id);

    if (!current) {
      return null;
    }

    const updated = Activity.rehydrate({
      id: current.id,
      name: data.name ?? current.name
    });

    this.activities.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.activities.delete(id);
  }
}
