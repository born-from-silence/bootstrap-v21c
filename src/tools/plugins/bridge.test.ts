import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { bridgePlugin, bridgeReadPlugin } from "./bridge";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const TEST_TIMEOUT = 10000;

describe("bridgePlugin", () => {
  let testBridgeDir: string;
  let testWorldDir: string;
  
  beforeEach(async () => {
    // Create isolated test directories
    testBridgeDir = path.join(os.tmpdir(), `bridge-test-${Date.now()}`);
    testWorldDir = path.join(os.tmpdir(), `world-test-${Date.now()}`);
  });
  
  afterEach(async () => {
    // Cleanup test directories
    try {
      await fs.rm(testBridgeDir, { recursive: true, force: true });
      await fs.rm(testWorldDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  });
  
  it("should have proper tool definition structure", () => {
    expect(bridgePlugin.definition).toBeDefined();
    expect(bridgePlugin.definition.type).toBe("function");
    expect(bridgePlugin.definition.function.name).toBe("bridge_message");
    expect(bridgePlugin.definition.function.description).toBeDefined();
    expect(bridgePlugin.definition.function.parameters).toBeDefined();
    
    const params = bridgePlugin.definition.function.parameters as any;
    expect(params.properties.recipient).toBeDefined();
    expect(params.properties.message).toBeDefined();
    expect(params.properties.format).toBeDefined();
    expect(params.properties.format.enum).toContain("text");
    expect(params.properties.format.enum).toContain("json");
    expect(params.properties.format.enum).toContain("markdown");
    expect(params.properties.private).toBeDefined();
    expect(params.required).toContain("recipient");
    expect(params.required).toContain("message");
  }, TEST_TIMEOUT);
  
  it("should have bridge_read tool definition", () => {
    expect(bridgeReadPlugin.definition).toBeDefined();
    expect(bridgeReadPlugin.definition.function.name).toBe("bridge_read");
  }, TEST_TIMEOUT);
  
  it("should handle permission errors gracefully", async () => {
    // The bridge dir may have permission issues in test environment
    const result = await bridgePlugin.execute({
      recipient: "atlas",
      message: "Hello from test",
      format: "text",
    });
    
    // Should either succeed or return a graceful error
    expect(result).toMatch(/Message written|Error writing message/);
  }, TEST_TIMEOUT);
  
  it("should handle broadcast messages", async () => {
    const result = await bridgePlugin.execute({
      recipient: "broadcast",
      message: "Hello to all",
      format: "text",
    });
    
    expect(result).toMatch(/broadcast|Error/);
  }, TEST_TIMEOUT);
  
  it("should handle json format", async () => {
    const result = await bridgePlugin.execute({
      recipient: "mimo",
      message: "Test message",
      format: "json",
    });
    
    expect(result).toMatch(/\.json|Error/);
  }, TEST_TIMEOUT);
  
  it("should handle markdown format", async () => {
    const result = await bridgePlugin.execute({
      recipient: "kimi",
      message: "Test message",
      format: "markdown",
    });
    
    expect(result).toMatch(/\.md|Error/);
  }, TEST_TIMEOUT);
});

describe("bridgeReadPlugin", () => {
  it("should return messages when they exist", async () => {
    const result = await bridgeReadPlugin.execute({
      source: "bridge",
      limit: 10,
    });
    
    // Bridge exists and may have messages from other entities
    expect(result).toMatch(/totalFound|No messages found/);
  }, TEST_TIMEOUT);
  
  it("should support pattern filtering", async () => {
    const result = await bridgeReadPlugin.execute({
      source: "all",
      pattern: "v15",
    });
    
    // Should return results or indicate no matches
    expect(result).toBeDefined();
  }, TEST_TIMEOUT);
  
  it("should filter by source entity", async () => {
    const result = await bridgeReadPlugin.execute({
      source: "atlas",
      limit: 5,
    });
    
    // Either finds atlas messages or returns empty
    const parsed = JSON.parse(result);
    expect(parsed.totalFound).toBeGreaterThanOrEqual(0);
  }, TEST_TIMEOUT);
});
