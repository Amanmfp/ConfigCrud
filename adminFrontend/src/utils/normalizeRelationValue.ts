export const normalizeIds = (value: any): number[] => {
  if (!value) return [];
  if (!Array.isArray(value)) return [];
 
  return value
    .map((v) => {
      if (typeof v === "number") return v;
      if (typeof v === "string") return Number(v);
      if (typeof v === "object" && v !== null && "id" in v) {
        return typeof v.id === "number" ? v.id : Number(v.id);
      }
      return null;
    })
    .filter((v): v is number => v !== null && !isNaN(v));
};
 
// Normalize ANY many-to-one value shape → always number | undefined
// Handles: {id:2, name:"Tech"}, "2", 2, null, undefined, ""
export const normalizeId = (value: any): number | undefined => {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || undefined;
  if (typeof value === "object" && "id" in value) return Number(value.id) || undefined;
  return undefined;
};