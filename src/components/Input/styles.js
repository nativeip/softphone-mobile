import styled, { css } from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

export const Container = styled.View`
  width: 100%;
  height: 55px;
  padding: 0 16px;
  background: #eee;
  border-radius: 8px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: #312e38;

  flex-direction: row;
  align-items: center;

  ${props =>
    props.isFocused &&
    css`
      border-color: #ff9000;
    `}
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: #312e38;
  font-size: 14px;
`;

export const Icon = styled(FeatherIcon)`
  margin-right: 16px;
`;
