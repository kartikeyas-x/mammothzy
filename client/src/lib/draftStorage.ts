import { type InsertActivity } from "@shared/schema";

const DRAFT_STORAGE_KEY = "activity-form-draft";

export const saveDraft = (data: Partial<InsertActivity>) => {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save draft:", error);
  }
};

export const loadDraft = (): Partial<InsertActivity> | null => {
  try {
    const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error("Failed to load draft:", error);
    return null;
  }
};

export const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear draft:", error);
  }
};
