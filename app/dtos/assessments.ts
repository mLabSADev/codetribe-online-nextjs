// const routes = {
//     home: '/',
//     admin: '/admin',
//     users: '/users',
//     newUSer: '/users/new'
// } as const

// type Route = (typeof routes)[keyof typeof routes]

// const goToRoute = (route: Route) => { }

// goToRoute("/users/new")

interface AssessmentType {
  key?: string,
  title: string,
  course: string,
  lesson: string,
  description: string,
  objectives: string[],
  created: string,
  dueDate: string
}

export default AssessmentType;
