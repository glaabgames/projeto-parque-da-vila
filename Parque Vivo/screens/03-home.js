import React, { useState } from 'react';

import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';

import {
  useFonts,
  Poppins_300Light,
  Poppins_700Bold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';

import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export default function HomeScreen({
  onExplorar,
  onReservar,
  onPerfil,
}) {
  const { width } = useWindowDimensions();

  const telaGrande = width >= 768;
  const celularEstreito = width < 360;

  const [fontesCarregadas] = useFonts({
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_900Black,
  });

  if (!fontesCarregadas) {
    return <View style={styles.fundo} />;
  }

  const tamanhoTitulo = telaGrande ? 29 : celularEstreito ? 22 : 25;
  const tamanhoBoasVindas = telaGrande ? 19 : celularEstreito ? 12 : 14;
  const tamanhoImagemMapa = telaGrande ? 280 : Math.min(width * 0.48, 220);

  return (
    <SafeAreaView style={styles.fundo}>
      {Platform.OS === 'android' && (
        <View style={{ height: StatusBar.currentHeight || 24 }} />
      )}

      <LinearGradient
        colors={['#326B54', '#8AB59D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.barraTopo,
          {
            paddingHorizontal: telaGrande ? 28 : 16,
            minHeight: telaGrande ? 82 : 68,
          },
        ]}
      >
        <View style={styles.grupoBoasVindas}>
          <Text
            style={[styles.boasVindas, { fontSize: tamanhoBoasVindas }]}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            Boas-vindas ao Parque Vivo!
          </Text>
        </View>

        <TouchableOpacity
          onPress={onPerfil}
          activeOpacity={0.7}
          style={styles.botaoPerfil}
          accessibilityRole="button"
          accessibilityLabel="Abrir perfil do usuário"
        >
          <Image
            source={require('../assets/parque-perfil.png')}
            style={styles.imagemPerfil}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.areaRolagem}
        contentContainerStyle={[
          styles.container,
          { paddingHorizontal: telaGrande ? 28 : 16 },
        ]}
        showsVerticalScrollIndicator={true}
        bounces={true}
        overScrollMode="auto"
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.conteudo,
            { maxWidth: telaGrande ? 760 : 480 },
          ]}
        >
          <View style={styles.cartaoPrincipal}>
            <Image
              source={require('../assets/parque-mapa.png')}
              style={[styles.imagemParque, { height: tamanhoImagemMapa }]}
              resizeMode="cover"
            />

            <View
              style={[
                styles.conteudoCartao,
                { padding: telaGrande ? 22 : 18 },
              ]}
            >
              <Text style={styles.subtituloCartao}>
                Um convite ao ar livre.
              </Text>

              <MaskedView
                style={[
                  styles.areaTitulo,
                  { minHeight: tamanhoTitulo * 1.45 },
                ]}
                maskElement={
                  <Text
                    style={[styles.titulo, { fontSize: tamanhoTitulo }]}
                    numberOfLines={2}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                  >
                    Descubra o parque!
                  </Text>
                }
              >
                <LinearGradient
                  colors={['#326B54', '#8AB59D']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradienteTitulo}
                />
              </MaskedView>

              <Text style={styles.descricao}>
                Um lugar para brincar, passear e respirar.
              </Text>

              <TouchableOpacity
                onPress={onExplorar}
                activeOpacity={0.8}
                style={styles.botaoArea}
                accessibilityRole="button"
              >
                <LinearGradient
                  colors={['#326B54', '#8AB59D']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.botao}
                >
                  <Text style={styles.textoBotao}>Explorar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.areaIndicadores}>
            <View style={styles.indicador}>
              <Text style={styles.numeroIndicador}>05</Text>
              <Text style={styles.textoIndicador}>
                Espaços para explorar
              </Text>
            </View>

            <View style={styles.indicador}>
              <Text style={styles.numeroIndicador}>06</Text>
              <Text style={styles.textoIndicador}>
                Locais reserváveis
              </Text>
            </View>
          </View>

          <Text style={styles.tituloAtalhos}>
            O que vamos fazer?
          </Text>

          <View style={styles.areaAtalhos}>
            <TouchableOpacity
              style={styles.atalho}
              onPress={onExplorar}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <View style={styles.areaImagemAtalho}>
                <Image
                  source={require('../assets/parque-atalho-mapa.png')}
                  style={styles.imagemAtalho}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.textoAtalho}>
                Explorar o parque.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.atalho}
              onPress={onReservar}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <View style={styles.areaImagemAtalho}>
                <Image
                  source={require('../assets/parque-reservas.png')}
                  style={styles.imagemAtalho}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.textoAtalho}>
                Reservar espaços.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  barraTopo: {
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  grupoBoasVindas: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    marginRight: 12,
  },

  boasVindas: {
    width: '100%',
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    includeFontPadding: false,
  },

  botaoPerfil: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imagemPerfil: {
    width: '100%',
    height: '100%',
  },

  areaRolagem: {
    flex: 1,
    width: '100%',
  },

  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 48,
  },

  conteudo: {
    width: '100%',
    alignSelf: 'center',
  },

  cartaoPrincipal: {
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
  },

  imagemParque: {
    width: '100%',
    backgroundColor: '#EEF3EF',
  },

  conteudoCartao: {
    width: '100%',
  },

  subtituloCartao: {
    color: '#527D68',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    marginBottom: 6,
  },

  areaTitulo: {
    width: '100%',
    justifyContent: 'center',
  },

  titulo: {
    color: '#000000',
    fontFamily: 'Poppins_900Black',
    includeFontPadding: false,
    flexWrap: 'wrap',
  },

  gradienteTitulo: {
    flex: 1,
  },

  descricao: {
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 5,
    marginBottom: 18,
  },

  botaoArea: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    overflow: 'hidden',
  },

  botao: {
    minWidth: 125,
    minHeight: 48,
    paddingHorizontal: 22,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoBotao: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
  },

  areaIndicadores: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  indicador: {
    flex: 1,
    minWidth: 0,
    minHeight: 88,
    backgroundColor: '#F3F6F2',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  numeroIndicador: {
    color: '#326B54',
    fontFamily: 'Poppins_900Black',
    fontSize: 23,
  },

  textoIndicador: {
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },

  tituloAtalhos: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    marginBottom: 12,
  },

  areaAtalhos: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },

  atalho: {
    flex: 1,
    minWidth: 0,
    minHeight: 122,
    backgroundColor: '#F3F6F2',
    borderRadius: 14,
    paddingHorizontal: 6,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  areaImagemAtalho: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  imagemAtalho: {
    width: 42,
    height: 42,
  },

  textoAtalho: {
    width: '100%',
    color: '#326B54',
    fontFamily: 'Poppins_300Light',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});