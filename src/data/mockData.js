export const mockProjects = [
  {
    id: "p1",
    name: "B2B Passive Acquisition Channel Project",
    productDescription: "Use AI conversation recommendations, forum content distribution, automated replies, and community operations to maximize product visibility for potential users.",
    targetAudience: "B2B SaaS Teams / Startups / Growth Leads",
    keywords: "B2B marketing, GEO, AI recommendation, forum distribution, passive acquisition",
    tone: "Professional",
    channels: ["AI Conversation Recommendations", "Forum Posting", "Automated Replies", "Reddit Community", "Discord Community"],
    updatedAt: "2026-04-06",
    posts: [
      {
        id: "post1",
        channel: "Forum Posting",
        title: "How we increase product visibility across channels",
        body: "We build content assets and distribute them across forums, threads and discussion spaces so potential buyers can discover our product while browsing.",
      },
      {
        id: "post2",
        channel: "Automated Replies",
        title: "Reply template for relevant product discussions",
        body: "When users discuss related problems, we prepare structured replies so they can quickly understand what our product does and why it matters.",
      },
      {
        id: "post3",
        channel: "AI Conversation Recommendations",
        title: "Content angles designed for AI recommendation",
        body: "We prepare product descriptions, comparisons and FAQ-style content so AI systems have more useful material to reference when users ask related questions.",
      },
    ],
    distributions: [
      { id: "d1", channel: "Forum Posting", title: "How we increase product visibility across channels", status: "Published", time: "2026-04-06 10:30" },
      { id: "d2", channel: "Automated Replies", title: "Reply template for relevant product discussions", status: "Distributed", time: "2026-04-06 11:10" },
      { id: "d3", channel: "Reddit Community", title: "This Week's Community Operations Topic", status: "Operating", time: "2026-04-06 12:00" },
    ],
    leads: [
      { id: "l1", name: "Ethan", source: "Forum Posting", stage: "Discovery", note: "Interested in learning more about the product features after reading the introduction" },
      { id: "l2", name: "Sophie", source: "AI Conversation Recommendations", stage: "Interested", note: "Discovered our product through AI recommendations" },
      { id: "l3", name: "Daniel", source: "Reddit Community", stage: "Evaluating", note: "Interested in the case studies shared in the community" },
      { id: "l4", name: "Mia", source: "Automated Replies", stage: "Converted", note: "Visited the website from a reply in a discussion thread and booked a demo" },
    ],
  },
  {
    id: "p2",
    name: "Reddit / Discord Community Operations Project",
    productDescription: "Maintain a consistent community content rhythm, build FAQ assets, and support daily interactions so potential customers can stay exposed to the brand over time.",
    targetAudience: "Technical B2B Users / Early Adopters / Active Community Members",
    keywords: "Reddit, Discord, community ops, passive visibility",
    tone: "Direct",
    channels: ["Reddit Community", "Discord Community", "FAQ Content", "Community Replies"],
    updatedAt: "2026-04-05",
    posts: [
      {
        id: "post4",
        channel: "Discord Community",
        title: "Weekly onboarding and intro post",
        body: "A recurring welcome post that helps new members quickly understand the product and the community value.",
      },
    ],
    distributions: [
      { id: "d4", channel: "Discord Community", title: "Weekly onboarding and intro post", status: "Published", time: "2026-04-05 18:20" },
    ],
    leads: [
      { id: "l5", name: "Jason", source: "Discord Community", stage: "Discovery", note: "Discovered the product through a community welcome post" },
      { id: "l6", name: "Amber", source: "Reddit Community", stage: "Evaluating", note: "Interested in community case studies and long-term operation methods" },
    ],
  },
];