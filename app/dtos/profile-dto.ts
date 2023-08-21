interface Profile {
  fullName: string,
  description: string,
  email: string,
  location: string,
  socials: [{
    label: string,
    url: string,
  }],
  stats: {
    hubThreads: number,
    hbResponses: number,
  }
}

export default Profile