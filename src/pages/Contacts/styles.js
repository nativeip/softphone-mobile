import styled from 'styled-components/native';

export const Container = styled.View`
  padding: 20px 10px 0 10px;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ContactsList = styled.FlatList`
  flex: 1;
  width: 100%;
`;

export const ContactContainer = styled.TouchableOpacity`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 3px 0;
`;

export const ContactNameContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`;

export const ContactName = styled.Text`
  font-size: 15px;
  margin-left: 5px;
  font-weight: bold;
  color: #ff9532;
`;

export const PhoneContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const PhoneNumber = styled.Text`
  font-size: 14px;
  margin-left: 5px;
`;
