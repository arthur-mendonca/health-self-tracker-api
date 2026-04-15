import assert from "node:assert/strict";

import {
  dateOnlyInTimeZone,
  formatDateOnly,
  todayDateOnlyInSaoPaulo
} from "../../src/shared/utils/date.ts";

Deno.test("dateOnlyInTimeZone returns the calendar date in the requested timezone", () => {
  const nearUtcMidnight = new Date("2026-04-15T01:30:00.000Z");

  assert.equal(formatDateOnly(dateOnlyInTimeZone(nearUtcMidnight, "UTC")), "2026-04-15");
  assert.equal(formatDateOnly(dateOnlyInTimeZone(nearUtcMidnight, "America/Sao_Paulo")), "2026-04-14");
});

Deno.test("todayDateOnlyInSaoPaulo uses America/Sao_Paulo instead of UTC", () => {
  const nearUtcMidnight = new Date("2026-04-15T01:30:00.000Z");

  assert.equal(formatDateOnly(todayDateOnlyInSaoPaulo(nearUtcMidnight)), "2026-04-14");
});
