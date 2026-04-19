import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Env – must be set before any module that reads process.env at import time
// ---------------------------------------------------------------------------
process.env.TWILIO_ACCOUNT_SID = "ACtest";
process.env.TWILIO_AUTH_TOKEN = "test-auth-token";
process.env.TWILIO_PHONE_NUMBER = "+15555555555";
process.env.BASE_URL = "http://localhost:3000";
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// -- Twilio --
const mockMessagesCreate = vi.fn();

vi.mock("twilio", () => ({
  Twilio: vi.fn().mockImplementation(function () {
    return { messages: { create: mockMessagesCreate } };
  }),
}));

// -- Supabase --
// We build a flexible mock that lets each test configure return values.
type MockChain = {
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

function createMockChain(): MockChain {
  const chain: MockChain = {
    select: vi.fn(),
    eq: vi.fn(),
    single: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  };

  chain.select.mockImplementation(() => ({
    eq: chain.eq,
    single: chain.single,
  }));
  chain.eq.mockImplementation(() => ({
    single: chain.single,
    select: chain.select,
  }));
  chain.update.mockImplementation(() => ({
    eq: chain.eq,
    select: chain.select,
  }));
  chain.insert.mockResolvedValue({ error: null });

  return chain;
}

let routesChain: MockChain;
let notificationLogChain: MockChain;
let mockRpc: ReturnType<typeof vi.fn>;

vi.mock("@/lib/supabase/server", () => ({
  createAdminSupabaseClient: () => {
    const routesChainLocal = routesChain;
    const notifChainLocal = notificationLogChain;

    return {
      from: (table: string) => {
        if (table === "routes") return routesChainLocal;
        if (table === "notification_log") return notifChainLocal;
        throw new Error(`Unexpected table: ${table}`);
      },
      rpc: mockRpc,
    };
  },
}));

// ---------------------------------------------------------------------------
// Import handler (after mocks)
// ---------------------------------------------------------------------------
import { PATCH } from "@/app/api/routes/[id]/publish/route";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const ROUTE_ID = "route-001";
const HUB_ID = "hub-001";

const fakeHub = { id: HUB_ID, name: "Valley Hub", phone: "+15559990000", email: "valley@hub.com" };

const fakeRoute = {
  id: ROUTE_ID,
  title: "Valley Run",
  hub_id: HUB_ID,
  start_lat: 37.7749,
  start_lng: -122.4194,
  end_lat: 37.8044,
  end_lng: -122.2712,
  start_time: "2026-05-01T09:00:00Z",
  end_time: "2026-05-01T17:00:00Z",
  route_polyline: "abc123",
  notes: null,
  published: false,
  created_at: "2026-04-19T00:00:00Z",
  hubs: fakeHub,
};

const fakeFarmers = [
  {
    farmer_id: "farmer-001",
    farmer_name: "Alice",
    phone: "+15551110001",
    address_text: "123 Farm Rd",
    latitude: 37.78,
    longitude: -122.41,
    min_distance_miles: 0.5,
  },
  {
    farmer_id: "farmer-002",
    farmer_name: "Bob",
    phone: "+15551110002",
    address_text: "456 Barn Ln",
    latitude: 37.79,
    longitude: -122.39,
    min_distance_miles: 2.3,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function callPatch(id: string = ROUTE_ID) {
  const req = new Request(`http://localhost/api/routes/${id}/publish`, {
    method: "PATCH",
  });
  const ctx = { params: Promise.resolve({ id }) };
  return PATCH(req, ctx);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("PATCH /api/routes/:id/publish", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    routesChain = createMockChain();
    notificationLogChain = createMockChain();
    mockRpc = vi.fn();

    // Default: Twilio create succeeds
    mockMessagesCreate.mockResolvedValue({
      sid: "SM-test-sid",
      status: "queued",
    });
  });

  // -----------------------------------------------------------------------
  // 1. Happy path — sends SMS to all matched farmers
  // -----------------------------------------------------------------------
  it("sends SMS to all matched farmers and returns 200", async () => {
    // First .select().eq().single() returns route
    // Second .update().eq().single() returns published route
    routesChain.single
      .mockResolvedValueOnce({ data: fakeRoute, error: null })
      .mockResolvedValueOnce({
        data: { ...fakeRoute, published: true, hubs: fakeHub },
        error: null,
      });

    mockRpc.mockResolvedValue({ data: fakeFarmers, error: null });

    const response = await callPatch();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.farmers_notified).toBe(2);
    expect(json.notifications).toHaveLength(2);

    // Twilio called once per farmer
    expect(mockMessagesCreate).toHaveBeenCalledTimes(2);

    // Correct phone numbers
    expect(mockMessagesCreate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ to: "+15551110001", from: "+15555555555" }),
    );
    expect(mockMessagesCreate).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ to: "+15551110002", from: "+15555555555" }),
    );

    // Proximity matching called with route points and default radius
    expect(mockRpc).toHaveBeenCalledWith("find_farmers_near_route_points", {
      route_points: [
        { lat: 37.7749, lng: -122.4194 },
        { lat: 37.8044, lng: -122.2712 },
      ],
      radius_miles: 10,
    });

    // Notification log entries inserted
    expect(notificationLogChain.insert).toHaveBeenCalledTimes(2);

    // Route marked as published
    expect(routesChain.update).toHaveBeenCalledWith({ published: true });
  });

  // -----------------------------------------------------------------------
  // 2. No farmers nearby
  // -----------------------------------------------------------------------
  it("publishes route with 0 notifications when no farmers are nearby", async () => {
    routesChain.single
      .mockResolvedValueOnce({ data: fakeRoute, error: null })
      .mockResolvedValueOnce({
        data: { ...fakeRoute, published: true, hubs: fakeHub },
        error: null,
      });

    mockRpc.mockResolvedValue({ data: [], error: null });

    const response = await callPatch();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.farmers_notified).toBe(0);
    expect(json.notifications).toHaveLength(0);
    expect(mockMessagesCreate).not.toHaveBeenCalled();
  });

  // -----------------------------------------------------------------------
  // 3. Route not found
  // -----------------------------------------------------------------------
  it("returns 404 when route does not exist", async () => {
    routesChain.single.mockResolvedValueOnce({
      data: null,
      error: { message: "not found" },
    });

    const response = await callPatch();

    expect(response.status).toBe(404);
    expect(mockMessagesCreate).not.toHaveBeenCalled();
  });

  // -----------------------------------------------------------------------
  // 4. Route already published
  // -----------------------------------------------------------------------
  it("returns 409 when route is already published", async () => {
    routesChain.single.mockResolvedValueOnce({
      data: { ...fakeRoute, published: true },
      error: null,
    });

    const response = await callPatch();

    expect(response.status).toBe(409);
    expect(mockMessagesCreate).not.toHaveBeenCalled();
  });

  // -----------------------------------------------------------------------
  // 5. Twilio partial failure
  // -----------------------------------------------------------------------
  it("handles partial Twilio failure — one SMS fails, one succeeds", async () => {
    routesChain.single
      .mockResolvedValueOnce({ data: fakeRoute, error: null })
      .mockResolvedValueOnce({
        data: { ...fakeRoute, published: true, hubs: fakeHub },
        error: null,
      });

    mockRpc.mockResolvedValue({ data: fakeFarmers, error: null });

    // First SMS succeeds, second fails
    mockMessagesCreate
      .mockResolvedValueOnce({ sid: "SM-ok", status: "queued" })
      .mockRejectedValueOnce(new Error("Twilio rate limit"));

    const response = await callPatch();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.farmers_notified).toBe(1);
    expect(json.notifications).toHaveLength(2);

    const statuses = json.notifications.map((n: { status: string }) => n.status);
    expect(statuses).toContain("sent");
    expect(statuses).toContain("failed");
  });

  // -----------------------------------------------------------------------
  // 6. SMS content correctness
  // -----------------------------------------------------------------------
  it("includes hub name, date, response URL, and contact info in SMS body", async () => {
    routesChain.single
      .mockResolvedValueOnce({ data: fakeRoute, error: null })
      .mockResolvedValueOnce({
        data: { ...fakeRoute, published: true, hubs: fakeHub },
        error: null,
      });

    mockRpc.mockResolvedValue({ data: [fakeFarmers[0]], error: null });

    await callPatch();

    expect(mockMessagesCreate).toHaveBeenCalledTimes(1);

    const body: string = mockMessagesCreate.mock.calls[0][0].body;

    expect(body).toContain("Valley Hub");
    expect(body).toContain("/respond?route=route-001&farmer=farmer-001");
    expect(body).toContain("+15559990000");
    expect(body).toContain("valley@hub.com");
  });

  // -----------------------------------------------------------------------
  // 7. Proximity matching failure
  // -----------------------------------------------------------------------
  it("returns 500 when proximity matching fails", async () => {
    routesChain.single.mockResolvedValueOnce({ data: fakeRoute, error: null });

    mockRpc.mockResolvedValue({
      data: null,
      error: { message: "rpc function error" },
    });

    const response = await callPatch();

    expect(response.status).toBe(500);
    expect(mockMessagesCreate).not.toHaveBeenCalled();
  });
});
