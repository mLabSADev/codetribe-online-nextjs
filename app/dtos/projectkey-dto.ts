export default interface ProjectKey {
    "key": string,
    "description": string,
    "framework": string,
    "githubUrl": string,
    "livesiteUrl": string,
    "tags"?: [{ tag: string }],
    "title": string
  }