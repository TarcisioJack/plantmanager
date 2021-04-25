import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';


import { Header } from '../components/Header';

import waterdrop from '../assets/waterdrop.png';
import colors from '../styles/colors';
import { loadPlant, PlantProps, removePlant } from '../libs/storage';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();

  function handleRemove(plant: PlantProps) {
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
      {
        text: 'Não 🙏',
        style: 'cancel'
      },
      {
        text: 'sim 😢',
        onPress: async () => {
          try {
            await removePlant(plant.id);
            setMyPlants((oldData) =>
              oldData.filter((item) => item.id !== plant.id)
            );
          } catch (error) {
            Alert.alert('Não foi possível remover! 😢');
          }
        }
      }
    ])
  }

  useEffect(() => {
    async function loadStorageData() {
      const plantStoraged = await loadPlant();

      const nextTime = formatDistance(
        new Date(plantStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: pt }
      );

      setNextWatered(
        `Não esqueça de regar a ${plantStoraged[0].name} às ${nextTime}.`
      )

      setMyPlants(plantStoraged);
      setLoading(false);
    }

    loadStorageData();

  },[]);

  if(loading)
  return <Load />

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image 
          source={waterdrop}
          style={styles.spotlightImage}
        />
        <Text style={styles.spotlightText}>
          {nextWatered}
        </Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>
          Próximas regadas
        </Text>

        <FlatList 
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary 
              data={item}
              handleRemove={() => {handleRemove(item)}}
            />
          )}
          showsVerticalScrollIndicator={false}
          // contentContainerStyle={{ flex: 1 }}
        />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 30,
    // paddingTop: 50,
    backgroundColor: colors.background,
    paddingHorizontal: 30
  },

  spotlight: {
    marginTop: -500,
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  spotlightImage: {
    width: 60,
    height: 60
  },

  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },

  plants: {
    flex: 1,
    width: '100%'
  },

  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    marginVertical: 20
  },
});