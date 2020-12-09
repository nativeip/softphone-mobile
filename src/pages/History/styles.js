import styled from 'styled-components/native';

export const Container = styled.View`
  padding: 20px 10px 0 10px;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Loading = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const LoadingText = styled.Text`
  font-size: 18px;
  color: #aaa;
  text-align: center;
`;

export const CallsList = styled.FlatList`
  flex: 1;
  width: 100%;
`;

export const CallContainer = styled.TouchableOpacity`
  border-radius: 5px;
  padding: 10px;
  margin: 3px 0;
  border: 1px solid #ccc;
`;

export const InfoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TimeContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CallTimer = styled.Text`
  font-size: 15px;
  margin-left: 5px;
`;

export const CallerContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CallNumber = styled.Text`
  font-size: 15px;
  font-weight: bold;
`;

export const CallName = styled.Text`
  font-size: 15px;
  margin-left: 5px;
`;

export const PhoneContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const PhoneNumber = styled.Text`
  font-size: 14px;
  margin-left: 5px;
`;

export const SearchContainer = styled.View`
  width: 100%;
`;

export const Search = styled.TextInput`
  width: 100%;
  border: 1px solid #ccc;
  font-size: 18px;
  margin-bottom: 10px;
  border-radius: 5px;
  padding: 8px 38px 8px 8px;
`;

export const ClearSearch = styled.TouchableOpacity`
  position: absolute;
  align-self: flex-end;
  margin: 10px;
  padding-right: 10px;
`;
