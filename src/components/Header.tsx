import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	Image,
	View,
  FlatList
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

// import userImg from '../assets/github.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface Member {
	login: string;
	avatar_url: string;
}

export function Header(){
	const [userName, setUserName] = useState<string>();
	const [members, setMembers] = useState<Member[]>([]);

	useEffect(() => {
		async function loadStorageUserName() {
			const user = await AsyncStorage.getItem('@plantmanager:user');
			setUserName(user || '');

		fetch(`https://api.github.com/users/${user}`).then( response => {
			response.json().then(data => {
				setMembers(data);
			})
		})
		}

		loadStorageUserName();
	},[]);

	return (
		<FlatList
      data={[members]}
      keyExtractor={(member) => String(member.login) }
      renderItem={({ item: member }) => (
        <View style={styles.container}>

          <View>
            <Text style={styles.greeting}>Olá,</Text>
			<Text style={styles.userName}>
              {member.name || userName}
            </Text>
          </View>
          <View>
            <Image source={{ uri: member.avatar_url }} style={styles.image}/>
          </View>

        </View>
      )}
		/>
	)
}

const styles = StyleSheet.create({
	container: {
    // flex: 1,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 20,
		marginTop: getStatusBarHeight()
	},

	image: {
		width: 70,
		height: 70,
		borderRadius: 35,
	},

	greeting: {
		fontSize: 24,
		color: colors.heading,
		fontFamily: fonts.text
	},

	userName: {
		fontSize: 26,
		fontFamily: fonts.heading,
		color: colors.heading,
		lineHeight: 40
	},
});