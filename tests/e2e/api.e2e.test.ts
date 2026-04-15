import assert from "node:assert/strict";

const baseUrl = Deno.env.get("API_BASE_URL") ?? "http://localhost:3000";

Deno.test("API supports resource lists, record upsert, today lookup, and dump export", async () => {
  await assertOk(`${baseUrl}/tags`);
  await assertOk(`${baseUrl}/substances`);
  await assertOk(`${baseUrl}/activities`);

  const recordResponse = await fetch(`${baseUrl}/records`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      date: "2099-04-15",
      metrics: {
        energy: 4,
        sleepQuality: 3
      },
      structuredNotes: {
        mood: "stable",
        focus: "deep work"
      },
      tags: [
        {
          name: "E2E Headache",
          category: "SYMPTOM"
        }
      ],
      substances: [
        {
          name: "E2E Magnesium",
          type: "SUPPLEMENT",
          defaultDose: "200mg",
          exactDose: "200mg",
          effectDropTime: "NONE",
          experiencedCrash: false
        }
      ],
      activities: [
        {
          name: "E2E Walk",
          notes: "30 minutes"
        }
      ]
    })
  });

  assert.equal(recordResponse.status, 201);

  const record = await recordResponse.json();
  assert.match(record.id, /^[0-9A-HJKMNP-TV-Z]{26}$/);
  assert.equal(record.date, "2099-04-15");
  assert.equal(record.tags[0].name, "E2E Headache");
  assert.equal(record.substances[0].substance.name, "E2E Magnesium");
  assert.equal(record.activities[0].activity.name, "E2E Walk");

  const todayResponse = await fetch(`${baseUrl}/records/today`);
  assert.equal(todayResponse.status, 200);
  await todayResponse.text();

  const dumpResponse = await fetch(`${baseUrl}/export/dump`);
  assert.equal(dumpResponse.status, 200);

  const dump = await dumpResponse.json();
  assert.ok(Array.isArray(dump.records));
  assert.ok(dump.records.some((item: { date: string }) => item.date === "2099-04-15"));
});

async function assertOk(url: string): Promise<void> {
  const response = await fetch(url);
  assert.equal(response.status, 200);
  await response.text();
}
