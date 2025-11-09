import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/agents", async (req, res) => {
    const agents = await storage.getAllAgents();
    res.json(agents);
  });

  app.get("/api/agents/payments", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const payments = await storage.getRecentAgentPayments(limit);
    res.json(payments);
  });

  app.get("/api/agents/activity", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const activity = await storage.getRecentAgentActivity(limit);
    res.json(activity);
  });

  app.get("/api/agents/stats", async (req, res) => {
    const stats = await storage.getAgentStats();
    res.json(stats);
  });

  const httpServer = createServer(app);

  return httpServer;
}
