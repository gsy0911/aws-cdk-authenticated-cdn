// Fallback type for the git-ignored configuration.json (copy from configuration.example.json).
// Lets the project type-check on a fresh clone; the real file is still required for bundling.
declare module "*/configuration.json" {
  const value: unknown;
  export default value;
}
