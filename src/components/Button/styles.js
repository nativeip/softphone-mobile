import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  padding: 0 20px;
  border-radius: 8px;
  background-color: ${props => (props.color ? props.color : '#2d486a')};
  margin-top: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  padding: ${props => (props.padding ? `${props.padding}px` : '20px')} 5px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
`;
