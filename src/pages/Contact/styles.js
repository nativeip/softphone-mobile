import styled from 'styled-components/native';

export const Container = styled.View`
  margin: 20px;
  flex: 1;
`;

export const AvatarContainer = styled.View`
  margin-top: 10px;
  justify-content: center;
  align-items: center;
`;

export const Avatar = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  justify-content: center;
  margin-bottom: 10px;
`;

export const Title = styled.Text`
  font-size: 18px;
  border-bottom-color: #666;
  color: #444;
  border-bottom-width: 1px;
  padding-bottom: 5px;
  margin-bottom: 10px;
  font-weight: bold;
`;

export const ContactNameContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`;

export const ContactName = styled.Text`
  font-size: 18px;
  margin-left: 5px;
  font-weight: bold;
  color: #ff9532;
`;

export const PhoneContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

export const PhoneNumber = styled.Text`
  font-size: 16px;
  margin-left: 5px;
`;

export const Controls = styled.View`
  flex: 1;
  justify-content: flex-end;
`;
