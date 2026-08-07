export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackMetaEvent(
  eventName: string,
  parameters?: Record<string, string | number | boolean | null>
) {
  if (typeof window === "undefined" || !window.fbq || !META_PIXEL_ID) {
    return;
  }

  window.fbq("track", eventName, parameters ?? {});
}
