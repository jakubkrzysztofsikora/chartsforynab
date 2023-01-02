import styled from "styled-components";
import { Textfield, TextfieldProps } from "./textfield";

export const StyledTextfield = styled(Textfield)<TextfieldProps>`
  &.clean {
    opacity: 0.4;
  }

  & .MuiInput-root {
    & input {
      text-align: center;
    }

    &:before,
    &:hover:before {
      border: 0;
    }
  }
`;
