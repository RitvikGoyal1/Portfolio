export type DesignId = "forma" | "signature";
// Each deployment prerenders its own design. Query parameters compare only these two.
export const defaultDesign: DesignId =
  import.meta.env.VITE_SITE_DESIGN === "signature" ? "signature" : "forma";
export const homeAnchors =
  defaultDesign === "signature"
    ? { work: "sig-work", about: "sig-story" }
    : { work: "work", about: "about" };
