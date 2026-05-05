export const normalizeIds = (value: any): string[] => {
  if (!value) return [];
  if (!Array.isArray(value)) return [];
 
  return value
    .map((v) => {
      if (typeof v === "number") return String(v);
      if (typeof v === "string") return v;
      if (typeof v === "object" && v !== null) {
        if ("_id" in v) return String((v as any)._id);
        if ("id" in v) return String((v as any).id);
      }
      return null;
    })
    .filter((v): v is string => v !== null && v.length > 0);
};
 
// Normalize ANY many-to-one value shape → always string | undefined
// Handles: {_id:"..."}, {id:"..."}, "id", null, undefined, ""
export const normalizeId = (value: any): string | undefined => {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if ("_id" in (value as any)) return String((value as any)._id);
    if ("id" in (value as any)) return String((value as any).id);
  }
  return undefined;
};