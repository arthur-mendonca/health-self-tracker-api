import assert from "node:assert/strict";

const baseUrl = Deno.env.get("API_BASE_URL") ?? "http://localhost:3000";
const authEmail = Deno.env.get("AUTH_USER_EMAIL") ?? "user@example.com";
const authPassword = Deno.env.get("AUTH_USER_PASSWORD") ?? "local-password";

Deno.test("API protects business routes with verified JWT", async () => {
  const response = await fetch(`${baseUrl}/tags`);

  assert.equal(response.status, 401);
  await response.text();
});

Deno.test("API supports resource lists, record upsert, today lookup, and dump export", async () => {
  const token = await getApiToken();

  await assertOk(`${baseUrl}/tags`, token);
  await assertOk(`${baseUrl}/substances`, token);
  await assertOk(`${baseUrl}/activities`, token);

  const tagName = `E2E CRUD Tag ${Date.now()}`;
  const createTagResponse = await fetch(`${baseUrl}/tags`, {
    method: "POST",
    headers: {
      "authorization": `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: tagName,
      category: "GENERAL"
    })
  });
  assert.equal(createTagResponse.status, 201);

  const createdTag = await createTagResponse.json();
  assert.match(createdTag.id, /^[0-9A-HJKMNP-TV-Z]{26}$/);
  assert.equal(createdTag.name, tagName);

  const updateTagResponse = await fetch(`${baseUrl}/tags/${createdTag.id}`, {
    method: "PATCH",
    headers: {
      "authorization": `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: `${tagName} Updated`,
      category: "TRIGGER"
    })
  });
  assert.equal(updateTagResponse.status, 200);

  const updatedTag = await updateTagResponse.json();
  assert.equal(updatedTag.id, createdTag.id);
  assert.equal(updatedTag.name, `${tagName} Updated`);
  assert.equal(updatedTag.category, "TRIGGER");

  const deleteTagResponse = await fetch(`${baseUrl}/tags/${createdTag.id}`, {
    method: "DELETE",
    headers: {
      "authorization": `Bearer ${token}`
    }
  });
  assert.equal(deleteTagResponse.status, 204);
  await deleteTagResponse.text();

  const missingDeleteTagResponse = await fetch(`${baseUrl}/tags/${createdTag.id}`, {
    method: "DELETE",
    headers: {
      "authorization": `Bearer ${token}`
    }
  });
  assert.equal(missingDeleteTagResponse.status, 404);
  await missingDeleteTagResponse.text();

  const substanceName = `E2E CRUD Substance ${Date.now()}`;
  const createSubstanceResponse = await fetch(`${baseUrl}/substances`, {
    method: "POST",
    headers: {
      "authorization": `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: substanceName,
      type: "SUPPLEMENT",
      defaultDose: "200mg"
    })
  });
  assert.equal(createSubstanceResponse.status, 201);

  const createdSubstance = await createSubstanceResponse.json();
  assert.match(createdSubstance.id, /^[0-9A-HJKMNP-TV-Z]{26}$/);
  assert.equal(createdSubstance.name, substanceName);

  const updateSubstanceResponse = await fetch(`${baseUrl}/substances/${createdSubstance.id}`, {
    method: "PATCH",
    headers: {
      "authorization": `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: `${substanceName} Updated`,
      type: "MEDICATION",
      defaultDose: "400mg"
    })
  });
  assert.equal(updateSubstanceResponse.status, 200);

  const updatedSubstance = await updateSubstanceResponse.json();
  assert.equal(updatedSubstance.id, createdSubstance.id);
  assert.equal(updatedSubstance.name, `${substanceName} Updated`);
  assert.equal(updatedSubstance.type, "MEDICATION");
  assert.equal(updatedSubstance.defaultDose, "400mg");

  const deleteSubstanceResponse = await fetch(`${baseUrl}/substances/${createdSubstance.id}`, {
    method: "DELETE",
    headers: {
      "authorization": `Bearer ${token}`
    }
  });
  assert.equal(deleteSubstanceResponse.status, 204);
  await deleteSubstanceResponse.text();

  const missingDeleteSubstanceResponse = await fetch(`${baseUrl}/substances/${createdSubstance.id}`, {
    method: "DELETE",
    headers: {
      "authorization": `Bearer ${token}`
    }
  });
  assert.equal(missingDeleteSubstanceResponse.status, 404);
  await missingDeleteSubstanceResponse.text();

  const activityName = `E2E CRUD Activity ${Date.now()}`;
  const createActivityResponse = await fetch(`${baseUrl}/activities`, {
    method: "POST",
    headers: {
      "authorization": `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: activityName
    })
  });
  assert.equal(createActivityResponse.status, 201);

  const createdActivity = await createActivityResponse.json();
  assert.match(createdActivity.id, /^[0-9A-HJKMNP-TV-Z]{26}$/);
  assert.equal(createdActivity.name, activityName);

  const updateActivityResponse = await fetch(`${baseUrl}/activities/${createdActivity.id}`, {
    method: "PATCH",
    headers: {
      "authorization": `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: `${activityName} Updated`
    })
  });
  assert.equal(updateActivityResponse.status, 200);

  const updatedActivity = await updateActivityResponse.json();
  assert.equal(updatedActivity.id, createdActivity.id);
  assert.equal(updatedActivity.name, `${activityName} Updated`);

  const deleteActivityResponse = await fetch(`${baseUrl}/activities/${createdActivity.id}`, {
    method: "DELETE",
    headers: {
      "authorization": `Bearer ${token}`
    }
  });
  assert.equal(deleteActivityResponse.status, 204);
  await deleteActivityResponse.text();

  const missingDeleteActivityResponse = await fetch(`${baseUrl}/activities/${createdActivity.id}`, {
    method: "DELETE",
    headers: {
      "authorization": `Bearer ${token}`
    }
  });
  assert.equal(missingDeleteActivityResponse.status, 404);
  await missingDeleteActivityResponse.text();

  const recordResponse = await fetch(`${baseUrl}/records`, {
    method: "POST",
    headers: {
      "authorization": `Bearer ${token}`,
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

  const emptyDateResponse = await fetch(`${baseUrl}/records?date=1990-01-01`, authHeaders(token));
  assert.equal(emptyDateResponse.status, 200);
  assert.deepEqual(await emptyDateResponse.json(), []);

  const byDateResponse = await fetch(`${baseUrl}/records?date=2099-04-15`, authHeaders(token));
  assert.equal(byDateResponse.status, 200);
  const byDate = await byDateResponse.json();
  assert.equal(byDate.length, 1);
  assert.equal(byDate[0].date, "2099-04-15");

  const byRangeResponse = await fetch(
    `${baseUrl}/records?startDate=2099-04-01&endDate=2099-04-30`,
    authHeaders(token)
  );
  assert.equal(byRangeResponse.status, 200);
  const byRange = await byRangeResponse.json();
  assert.ok(byRange.some((item: { date: string }) => item.date === "2099-04-15"));

  const todayResponse = await fetch(`${baseUrl}/records/today`, authHeaders(token));
  assert.equal(todayResponse.status, 200);
  await todayResponse.text();

  const dumpResponse = await fetch(`${baseUrl}/export/dump`, authHeaders(token));
  assert.equal(dumpResponse.status, 200);

  const dump = await dumpResponse.json();
  assert.ok(Array.isArray(dump.records));
  assert.ok(dump.records.some((item: { date: string }) => item.date === "2099-04-15"));

  const csvResponse = await fetch(`${baseUrl}/export/dump.csv`, authHeaders(token));
  assert.equal(csvResponse.status, 200);
  assert.ok(csvResponse.headers.get("content-type")?.includes("text/csv"));

  const csv = await csvResponse.text();
  assert.ok(csv.startsWith("\"id\",\"date\",\"metrics\""));
  assert.ok(csv.includes("2099-04-15"));
});

Deno.test("API rejects invalid DTO payloads", async () => {
  const token = await getApiToken();

  await assertBadRequest(`${baseUrl}/tags`, token, {
    name: "",
    category: "UNKNOWN"
  });

  await assertBadRequest(`${baseUrl}/substances`, token, {
    name: "Invalid substance",
    type: "UNKNOWN"
  });

  await assertBadRequest(`${baseUrl}/activities`, token, {
    name: ""
  });

  await assertBadRequest(`${baseUrl}/records`, token, {
    date: "not-a-date",
    tags: [
      {
        name: "Invalid tag",
        category: "UNKNOWN",
        extra: true
      }
    ],
    substances: [
      {
        name: "Invalid substance",
        type: "SUPPLEMENT",
        exactDose: ""
      }
    ]
  });

  const invalidQueryResponse = await fetch(
    `${baseUrl}/records?date=2026-04-15&startDate=2026-04-01`,
    authHeaders(token)
  );
  assert.equal(invalidQueryResponse.status, 400);
  await invalidQueryResponse.text();
});

async function getApiToken(): Promise<string> {
  const loginResponse = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      email: authEmail,
      password: authPassword
    })
  });
  assert.equal(loginResponse.status, 201);

  const login = await loginResponse.json() as { token: string };
  assert.ok(login.token);
  return login.token;
}

async function assertOk(url: string, token: string): Promise<void> {
  const response = await fetch(url, authHeaders(token));
  assert.equal(response.status, 200);
  await response.text();
}

async function assertBadRequest(url: string, token: string, body: unknown): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "authorization": `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });

  assert.equal(response.status, 400);
  await response.text();
}

function authHeaders(token: string): RequestInit {
  return {
    headers: {
      "authorization": `Bearer ${token}`
    }
  };
}
