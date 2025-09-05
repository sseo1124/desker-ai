import { createIdGenerator } from "ai";
import { TTL_INFO } from "@/config/constants";
import ls from "localstorage-slim";

const VISITOR_ID_KEY = "desker-visitor-ai";
const generateVisitorId = createIdGenerator({ prefix: "visitor" });

export const getOrSetVisitorId = () => {
  const existingId = ls.get(VISITOR_ID_KEY);

  if (existingId) {
    ls.set(VISITOR_ID_KEY, existingId, {
      ttl: TTL_INFO.SESSION_STORAGE_VISITOR,
    });
    return existingId;
  }

  const newVisitorId = generateVisitorId();
  ls.set(VISITOR_ID_KEY, newVisitorId, {
    ttl: TTL_INFO.SESSION_STORAGE_VISITOR,
  });

  return newVisitorId;
};
