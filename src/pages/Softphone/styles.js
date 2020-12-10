import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  background-color: #fafafa;
  flex: 1;
  padding: 20px;
  justify-content: flex-end;
`;

export const NumberContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Number = styled.Text`
  color: #666;
  font-size: 35px;
  text-align: center;
  color: #389400;
  flex: 1;
`;

export const Erase = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

export const Divisor = styled.View`
  border: 0.5px solid #333;
  margin: 0 10px 10px 10px;
`;

export const DialPad = styled.FlatList`
  flex-grow: 0;
  margin: 0 10px 0 5px;
`;

export const DialNumberContainer = styled.View`
  flex-grow: 1;
  flex-basis: 0;
  margin: 5px 10px;
`;

export const DialNumber = styled.TouchableOpacity`
  margin: 0 10px;
  border: 1px solid #ddd;
  background-color: #f0f0f0;
  border-radius: 35px;
  height: 70px;
  width: 70px;
  justify-content: center;
  align-items: center;
`;

export const DialNumberText = styled.Text`
  color: #444;
  font-size: 35px;
`;

export const CallContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin: 10px;
`;

export const CallButton = styled.TouchableOpacity`
  margin: 0 10px;
  border-radius: 35px;
  height: 70px;
  width: 70px;
  background-color: ${props => props.background};
  align-items: center;
  justify-content: center;
`;
