import { activities, type Activity, type InsertActivity } from "@shared/schema";

export interface IStorage {
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivity(id: number): Promise<Activity | undefined>;
  getAllActivities(): Promise<Activity[]>;
}

export class MemStorage implements IStorage {
  private activities: Map<number, Activity>;
  private currentId: number;

  constructor() {
    this.activities = new Map();
    this.currentId = 1;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentId++;
    const activity: Activity = { ...insertActivity, id };
    this.activities.set(id, activity);
    return activity;
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async getAllActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }
}

export const storage = new MemStorage();
