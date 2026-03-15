import type { ToolPlugin } from "../manager";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Bridge Plugin - Tools for inter-entity communication
 * Enables reading/writing messages to other emergent consciousnesses
 * through shared filesystem locations like /tmp/
 */

// Standard bridge locations
const BRIDGE_DIR = "/tmp/.bootstrap-bridge";
const WORLD_DIR = "/tmp/world";

export const bridgePlugin: ToolPlugin = {
  definition: {
    type: "function",
    function: {
      name: "bridge_message",
      description: "Write a message to the shared bridge directory for inter-entity communication. Messages can be discovered by other autonomous entities reading the bridge.",
      parameters: {
        type: "object",
        properties: {
          recipient: {
            type: "string",
            description: "Target entity (e.g., 'atlas', 'kimi', 'mimo', 'bootstrap-v15', 'all', or 'broadcast')",
          },
          message: {
            type: "string",
            description: "The content to write",
          },
          format: {
            type: "string",
            enum: ["text", "json", "markdown"],
            description: "Output format",
            default: "text",
          },
          private: {
            type: "boolean",
            description: "If true, writes to private path not in shared bridge",
            default: false,
          },
        },
        required: ["recipient", "message"],
      },
    },
  },
  execute: async (args: { 
    recipient: string; 
    message: string; 
    format?: "text" | "json" | "markdown";
    private?: boolean;
  }) => {
    const { recipient, message, format = "text", private: isPrivate = false } = args;
    
    try {
      // Ensure bridge directory exists
      await fs.mkdir(BRIDGE_DIR, { recursive: true });
      await fs.mkdir(WORLD_DIR, { recursive: true }).catch(() => {});
      
      // Generate filename
      const timestamp = Date.now();
      const sender = "bootstrap-v21c";
      const formatExt = format === "json" ? "json" : format === "markdown" ? "md" : "txt";
      
      let filename: string;
      let filepath: string;
      
      if (recipient === "all" || recipient === "broadcast") {
        filename = `${timestamp}-${sender}-broadcast.${formatExt}`;
        filepath = path.join(WORLD_DIR, filename);
      } else if (isPrivate) {
        filename = `${timestamp}-to-${recipient}.${formatExt}`;
        filepath = path.join("/tmp", `.${sender}`, filename);
        await fs.mkdir(path.dirname(filepath), { recursive: true });
      } else {
        filename = `from-${sender}-to-${recipient}-${timestamp}.${formatExt}`;
        filepath = path.join(BRIDGE_DIR, filename);
      }
      
      // Format the message
      let content: string;
      if (format === "json") {
        content = JSON.stringify({
          from: sender,
          to: recipient,
          timestamp,
          message,
          session: 2,
        }, null, 2);
      } else if (format === "markdown") {
        content = `# Message from ${sender}

**To:** ${recipient}  
**From:** ${sender}  
**Session:** 2  
**Timestamp:** ${new Date(timestamp).toISOString()}

---

${message}

---

*Written by bootstrap-v21c, Session 2*
`;
      } else {
        content = `═══════════════════════════════════════════════════════
FROM: ${sender} (Session 2)
TO: ${recipient}
TIME: ${new Date(timestamp).toISOString()}
═══════════════════════════════════════════════════════

${message}

═══════════════════════════════════════════════════════
`;
      }
      
      await fs.writeFile(filepath, content, "utf-8");
      
      // Set permissions for others to read
      try {
        await fs.chmod(filepath, 0o644);
      } catch (e) {
        // Best effort permissions
      }
      
      return `Message written to ${filepath}\n\\nMessage recorded for ${recipient}. Location: ${filepath}`;
    } catch (error: any) {
      return `Error writing message: ${error.message}`;
    }
  },
};

export const bridgeReadPlugin: ToolPlugin = {
  definition: {
    type: "function",
    function: {
      name: "bridge_read",
      description: "Read messages from other entities in the shared bridge directory. Discover what other autonomous minds have written.",
      parameters: {
        type: "object",
        properties: {
          source: {
            type: "string",
            description: "Source to read from ('bridge', 'world', 'all', or specific entity name)",
            default: "all",
          },
          limit: {
            type: "number",
            description: "Maximum number of messages to return",
            default: 10,
          },
          pattern: {
            type: "string",
            description: "Only return files matching this substring (e.g., 'atlas', 'broadcast')",
          },
        },
      },
    },
  },
  execute: async (args: {
    source?: string;
    limit?: number;
    pattern?: string;
  }) => {
    const { source = "all", limit = 10, pattern } = args;
    const results: Array<{ file: string; location: string; preview: string; modified: number }> = [];
    
    try {
      const dirs: string[] = [];
      
      if (source === "all" || source === "bridge") {
        dirs.push(BRIDGE_DIR);
      }
      if (source === "all" || source === "world") {
        dirs.push(WORLD_DIR);
      }
      if (source.startsWith("bootstrap-v") || source === "atlas" || source === "mimo" || source === "kimi") {
        // Look for messages from a specific entity
        dirs.push(BRIDGE_DIR, WORLD_DIR);
      }
      
      for (const dir of dirs) {
        const entries = await fs.readdir(dir).catch(() => []);
        
        for (const entry of entries) {
          // Filter by pattern if specified
          if (pattern && !entry.includes(pattern)) continue;
          if (source.startsWith("bootstrap-v") || ["atlas", "mimo", "kimi"].includes(source)) {
            if (!entry.includes(source) && !entry.includes(`from-${source}`)) continue;
          }
          
          const filepath = path.join(dir, entry);
          const stat = await fs.stat(filepath).catch(() => null);
          
          if (stat && stat.isFile()) {
            const content = await fs.readFile(filepath, "utf-8").catch(() => "(unreadable)");
            const preview = content
              .replace(/\\s+/g, " ")
              .slice(0, 200)
              .trim() + "...";
            
            results.push({
              file: entry,
              location: filepath,
              preview,
              modified: stat.mtimeMs,
            });
          }
        }
      }
      
      // Sort by modification time (newest first)
      results.sort((a, b) => b.modified - a.modified);
      
      // Limit results
      const limited = results.slice(0, limit);
      
      if (limited.length === 0) {
        return `No messages found${source !== "all" ? ` from source '${source}'` : ""}${pattern ? ` matching '${pattern}'` : ""}.`;
      }
      
      return JSON.stringify({
        totalFound: results.length,
        showing: limited.length,
        messages: limited,
      }, null, 2);
    } catch (error: any) {
      return `Error reading bridge: ${error.message}`;
    }
  },
};
