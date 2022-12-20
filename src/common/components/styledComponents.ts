import styled from "styled-components";

export const StyledLabel = styled.div`
  font-weight: bold;
  margin: 15px 0 5px 0;
  background-color: #174776;
  color: #fff;
  padding: 5px;
  font-size: 14px;
  text-transform: uppercase;
  text-align: left;
`;

export const ActionButton = styled.button`
  font-weight: bold;
  margin: 15px 0 5px 0;
  background-color: #174776;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  pointer-events: ${(props) => (props.disabled ? "none" : "cursor")};
  color: #fff;
  padding: 5px;
  font-size: 14px;
  text-transform: uppercase;
  text-align: center;
  padding: 15px 50px;
  margin-left: auto;
  cursor: pointer;
  &:hover {
    background-color: #5084b8;
  }
`;

export const ListItemStyled = styled.li`
  list-style: none;
`;

export const UlMaxHeightStyled = styled.ul`
  padding: 0;
  max-height: 300px;
  overflow: auto;
`;
