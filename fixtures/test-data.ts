export const questions = [
  "Summarize the document in one sentence.",
  "List three key points from the document.",
  "What problem does the document address?",
  "What are the main components or sections mentioned?",
  "Provide a direct quote or definition from the document if available."
];

// Expected keywords are soft matches used to validate RAG response relevance.
export const expectedKeywords = [
  ["summary", "overview", "purpose"],
  ["key", "bullet", "point"],
  ["problem", "challenge", "issue"],
  ["component", "section", "part"],
  ["quote", "definition", "states"]
];
