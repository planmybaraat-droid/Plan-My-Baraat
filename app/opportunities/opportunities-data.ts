export type Opportunity = {
  id: "sales-executive" | "video-editor";
  title: string;
  type: "Full-time";
  department: string;
  location: string;
  summary: string;
  responsibilities: string[];
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "sales-executive",
    title: "Sales Executive (Female)",
    type: "Full-time",
    department: "Sales",
    location: "Vadodara",
    summary: "Own lead follow-ups, understand wedding requirements and help families choose the right Plan My Baraat experience.",
    responsibilities: ["Call and follow up with qualified enquiries", "Understand requirements and present suitable packages", "Maintain clear sales updates and client communication"],
  },
  {
    id: "video-editor",
    title: "Video Editor",
    type: "Full-time",
    department: "Creative",
    location: "Vadodara",
    summary: "Create polished reels, wedding films and social content with strong storytelling, pace and reliable delivery.",
    responsibilities: ["Edit wedding, event and brand content", "Deliver platform-ready reels and videos on schedule", "Maintain consistent quality across fast-moving projects"],
  },
];

export function findOpportunity(id: string) {
  return OPPORTUNITIES.find((role) => role.id === id);
}
