import React, {useEffect, useState} from 'react';
import md5 from 'md5';
import {FlatList, View, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeroesItem from '../../components/HeroesItem';
import Description from '../../components/ModalDescription';
import api from '../../services/api';
import {Label} from './styles';

import Background from '../../assets/bg-favorite.png';

const CounterHeroes = 100;

export interface HeroItem {
  id: number;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  events: Content;
  series: Content;
}
interface EventSummary {
  name: string;
}
interface Content {
  available: number;
  returned: number;
  collectionURI: string;
  items: EventSummary[];
}

const Favorites = () => {
  const private_key = '16054b8676397e756f32eb9f7e046e9aba8ff7a7';
  const public_key = 'f59b847961cec317a25fb4ef49d6a938';

  const timeStamp = 'timeStamp';
  const hash = md5(timeStamp + private_key + public_key);
  const [heroes, setHeroes] = useState<HeroItem[]>([]);
  const [offset, setoffset] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [touchedHero, setTouchedHero] = useState<HeroItem | undefined>();
  const [favoritedHeroIds, setFavoriteHeroIds] = useState<number[]>([]);

  const getHeroes = async () => {
    const response = await api(
      `/characters?&ts=${timeStamp}&apikey=${public_key}&hash=${hash}&limit=${CounterHeroes}`,
    );
    const newHeroes = response.data.data.results;
    setHeroes((previousHeroes) => [...previousHeroes, ...newHeroes]);
  };

  const unfavoritingHero = async (heroId: number) => {
    const newFavoriteHeroesIds = favoritedHeroIds.filter((id) => id != heroId);
    const parsedFavoriteString = JSON.stringify(newFavoriteHeroesIds);
    await AsyncStorage.setItem('@favorited', parsedFavoriteString);
    setFavoriteHeroIds(newFavoriteHeroesIds);
  };

  useEffect(() => {
    getHeroes();
  }, [offset]);

  useEffect(() => {
    AsyncStorage.getItem('@favorited').then((favorites) => {
      if (favorites !== null) {
        const parsedFavoriteIds = JSON.parse(favorites);
        setFavoriteHeroIds(parsedFavoriteIds);
      }
    });
  }, []);

  const favoritedHeroes = heroes.filter((hero) =>
    favoritedHeroIds.includes(hero.id),
  );

  return (
    <View style={{flex: 1}}>
      <ImageBackground source={Background} style={{flex: 1}}>
        <Label>Your Favorited Heroes</Label>
        <FlatList
          data={favoritedHeroes}
          keyExtractor={(i, index) => index.toString()}
          numColumns={2}
          renderItem={({item}) => (
            <HeroesItem
              name={item.name}
              path={item.thumbnail.path}
              extension={item.thumbnail.extension}
              onHeroPress={() => {
                setModalVisible(true);
                setTouchedHero(item);
              }}
              onHeroFavorite={() => {
                const isFavorited = favoritedHeroIds.includes(item.id);
                if (isFavorited) {
                  unfavoritingHero(item.id);
                }
              }}
              isFavorited={favoritedHeroIds.includes(item.id)}
            />
          )}
        />
        <Description
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
          touchedHero={touchedHero}
        />
      </ImageBackground>
    </View>
  );
};

export default Favorites;
