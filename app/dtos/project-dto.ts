export default interface Project {
  description: string,
  framework: string,
  githubUrl: string,
  livesiteUrl: string,
  tags?: [{ tag: string }],
  title: string
}
