import { type User, type InsertUser, type Agent, type AgentPayment, type AgentActivity } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllAgents(): Promise<Agent[]>;
  getRecentAgentPayments(limit?: number): Promise<AgentPayment[]>;
  getRecentAgentActivity(limit?: number): Promise<AgentActivity[]>;
  getAgentStats(): Promise<{
    totalAgents: number;
    activeAgents: number;
    totalVolume: string;
    totalTransactions: number;
    uniqueDeployers: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private agents: Agent[];
  private agentPayments: AgentPayment[];
  private agentActivity: AgentActivity[];

  constructor() {
    this.users = new Map();
    
    this.agents = [];
    this.agentPayments = [];
    this.agentActivity = [];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllAgents(): Promise<Agent[]> {
    return this.agents;
  }

  async getRecentAgentPayments(limit: number = 10): Promise<AgentPayment[]> {
    return this.agentPayments
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getRecentAgentActivity(limit: number = 20): Promise<AgentActivity[]> {
    return this.agentActivity
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getAgentStats(): Promise<{
    totalAgents: number;
    activeAgents: number;
    totalVolume: string;
    totalTransactions: number;
    uniqueDeployers: number;
  }> {
    const totalAgents = this.agents.length;
    const activeAgents = this.agents.filter(a => a.status === 'active').length;
    const totalVolume = this.agentPayments
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
      .toFixed(2);
    const totalTransactions = this.agentPayments.length;
    const uniqueDeployers = new Set(this.agentPayments.map(p => p.deployer)).size;

    return {
      totalAgents,
      activeAgents,
      totalVolume,
      totalTransactions,
      uniqueDeployers,
    };
  }
}

export const storage = new MemStorage();
