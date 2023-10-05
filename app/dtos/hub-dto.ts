interface NewIssue {
  title: string;
  descriptions: string;
  tags: [string];
  code: [
    {
      title: string;
      code: string;
    }
  ];
}
export default NewIssue;
