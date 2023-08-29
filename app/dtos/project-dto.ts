export default interface Project {
  key?: string,
  description: string,
  framework: string,
  githubUrl: string,
  livesiteUrl: string,
  tags?: [{ tag: string }],
  title: string
}
  // projectIcon: string,
  // projectScreenshot: string,