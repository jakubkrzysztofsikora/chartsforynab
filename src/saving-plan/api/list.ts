import { DatabaseService } from "../services/database-service";

export const list = (page: number, limit: number, db: DatabaseService) => {
  return db.list(page, limit) || [];
};
