import { theme } from "antd";
export const Colors = {
  Primary: "#82C803",
  Secondary: "#10243E",
  Black: "#171717",
  White: "#fafafa",
  SmokeWhite: "rgba(38, 38, 38, 0.05)",
};
export const config = {
  token: {
    colorPrimary: "#1890ff",
  },
};

export const Styles = {
  Input: {
    borderRadius: 30,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Colors.Primary,
  },
  TextArea: {},
  Radio: {},
  Check: {},
  Button: {
    Filled: {
      background: Colors.Primary,
      borderStyle: "solid",
      borderRadius: 30,
      color: "white",
      cursor: "pointer",
    },
    Outline: { borderRadius: 30 },
    Subtle: { borderRadius: 30 },
    Text: {
      borderWidth: 0,
      borderRadius: 30,
    },
  },
};
