export type Opportunity = {
  id: string;
  title: string;
  type: "Internship" | "Full-time";
  department: string;
  location: string;
  summary: string;
  responsibilities: string[];
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "full-stack-developer-intern",
    title: "Full Stack Developer Intern",
    type: "Internship",
    department: "Technology",
    location: "Vadodara",
    summary: "Work on real Plan My Baraat website and CRM features while learning how production-ready applications are designed, developed and tested.",
    responsibilities: [
      "Build responsive interfaces with React and Next.js",
      "Work with APIs, Supabase and application data",
      "Test, debug and improve live product features",
    ],
  },
];
