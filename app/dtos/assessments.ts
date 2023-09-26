import type { TimeRangePickerProps, DatePickerProps } from "antd";
type AssessmentType = {
  key?: string,
  title: string,
  course: string,
  chapter: string,
  group: number,
  bootcamp: boolean,
  description: string,
  cohort: string,
  objectives: string[],
  dueDate: string
}
export default AssessmentType;
