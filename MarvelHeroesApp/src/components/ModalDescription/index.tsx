import React, {useState} from 'react';
import {ImageBackground} from 'react-native'
import {Container, Image, HeroName, HeroDescription, HeroEvents, HeroSeries, Text} from './styles';
import {HeroItem} from '../../screens/HeroesList'
import { ScrollView } from 'react-native-gesture-handler';
import ImgBackground from './../../assets/bg-modal.png';

interface ModalProps {
  visible: boolean;
  onRequestClose():void;
  touchedHero: HeroItem | undefined;
}

const Description: React.FC <ModalProps> = ({visible, onRequestClose, touchedHero}) => {
  return (
    <Container visible={visible} onRequestClose={onRequestClose}>
      <ImageBackground source={ImgBackground} style={{flex: 1}}>
        <Image source={{uri: `${touchedHero?.thumbnail.path}.${touchedHero?.thumbnail.extension}`}}/>
        <HeroName> {touchedHero?.name} </HeroName>
        <HeroDescription> {touchedHero?.description} </HeroDescription>
        <ScrollView>
        <Text >Events</Text>
        {touchedHero?.events.items.map((event, index)=>{
          return <HeroEvents key={index}> {event.name} </HeroEvents>
        })}
        <Text>Series</Text>
        {touchedHero?.series.items.map((serie, index)=>{
          return <HeroSeries key={index}> {serie.name} </HeroSeries>
        })}
        </ScrollView>
      </ImageBackground>
    </Container>
  );
};

export default Description;
