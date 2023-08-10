// const routes = {
//     home: '/',
//     admin: '/admin',
//     users: '/users',
//     newUSer: '/users/new'
// } as const

// type Route = (typeof routes)[keyof typeof routes]

// const goToRoute = (route: Route) => { }

// goToRoute("/users/new")

interface Assessment {
  course: string;
  title: string;
  content: string;
  lesson: [string];
  updated: string;
}

export default Assessment;
