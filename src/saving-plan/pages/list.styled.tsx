import styled from "styled-components";
import { List, ListProps } from "./list";

export const StyledList = styled(List)<ListProps>`
  & .header {
    display: flex;
    flex-direction: row;
    gap: 1em;
  }
`;
