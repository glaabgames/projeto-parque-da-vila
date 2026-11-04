// Importa o React e as ferramentas para guardar informações na tela.
import React, { useState } from 'react';

// Importa os componentes do React Native:
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

// Importa as fontes do google fonts:
import {
  useFonts,
  Poppins_300Light,
  Poppins_700Bold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';

// Importa o gradiente linear:
import { LinearGradient } from 'expo-linear-gradient';

// Importa a máscara para o gradiente:
import MaskedView from '@react-native-masked-view/masked-view';

// Tela de splash do aplicativo:
export default function SplashScreen({ onEntrar }) {
  // Dimensões da tela
  const { width, height } = useWindowDimensions();

  // Ajustes para celular e computador:
  const telaGrande = width >= 768;
  const telaBaixa = height < 700;

  // Tamanho da imagem:
  const larguraImagem = Math.min(
    // Se a tela for grande, usa 340, caso contrário, usa 88% da largura da tela.
    telaGrande ? 340 : width * 0.88,
    telaGrande ? 340 : 350
  );

  // Tamanho do título:
  const tamanhoTitulo = telaGrande ? 38 : width < 360 ? 29 : 33;

  // Carrega as fontes:
  const [fontesCarregadas] = useFonts({
    // Fonte "Poppins" com diferentes pesos:
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_900Black,
  });

  // Aguarda o carregamento das fontes:
  if (!fontesCarregadas) {
    // Retorna uma tela vazia enquanto as fontes não são carregadas.
    return <View style={styles.container} />;
  }

  // Renderiza a tela de splash:
  return (
    <ScrollView
    // Ajusta o estilo do ScrollView de acordo com a tela.
      contentContainerStyle={[
        styles.container,
        {
          // Ajusta a altura mínima do ScrollView para ocupar toda a tela.
          minHeight: height,
          paddingHorizontal: telaGrande ? 28 : 22,
          paddingVertical: telaBaixa ? 16 : telaGrande ? 32 : 26,
        },
      ]}
      // Desativa a barra de rolagem vertical:
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.conteudo}>
        {/* Título do parque com degradê: */}
        <MaskedView
          style={{
            width: telaGrande ? 330 : 300,
            height: tamanhoTitulo + 12,
          }}
          maskElement={
            <Text style={[styles.titulo, { fontSize: tamanhoTitulo }]}>
              Parque Vivo
            </Text>
          }
        >
          {/* Gradiente linear: */}
          <LinearGradient
            colors={['#326B54', '#8AB59D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradiente}
          />
        </MaskedView>

        {/* Imagem de boas-vindas do parque: */}
        <Image
          source={require('../assets/parque-boas-vindas.png')}
          style={{
            // Ajusta o tamanho da imagem de acordo com a largura calculada.
            width: larguraImagem,
            height: larguraImagem * 0.92,
            marginTop: telaGrande ? 14 : 12,
            marginBottom: telaGrande ? 20 : 16,
          }}
          resizeMode="contain"
        />

        {/* Subtítulo da tela de splash: */}
        <Text
          style={[
            styles.subtitulo,
            {
              // Ajusta o tamanho da fonte e o espaçamento do subtítulo de acordo com a tela.
              fontSize: telaGrande ? 23 : width < 360 ? 18 : 21,
              lineHeight: telaGrande ? 33 : 30,
              marginBottom: telaGrande ? 10 : 8,
            },
          ]}
        >
          Planeje seu próximo passeio!
        </Text>

        {/* Descrição da tela de splash: */}
        <Text
          style={[
            styles.descricao,
            {
              // Ajusta o tamanho da fonte e o espaçamento da descrição de acordo com a tela.
              fontSize: telaGrande ? 15 : 14,
              lineHeight: telaGrande ? 23 : 22,
              marginTop: 2,
            },
          ]}
        >
          Conheça o parque e planeje seu passeio.
        </Text>

        {/* Botão "Começar": */}
        <TouchableOpacity
        // Chama a função onEntrar quando o botão é pressionado.
          onPress={onEntrar}
          activeOpacity={0.8}
          // Ajusta o estilo do botão de acordo com a tela.
          style={[
            styles.botaoArea,
            {
              marginTop: telaBaixa ? 22 : telaGrande ? 30 : 27,
            },
          ]}
        >
          <LinearGradient
            colors={['#326B54', '#8AB59D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.botao}
          >
            <Text style={styles.textoBotao}>Começar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Estilos da tela:
const styles = StyleSheet.create({
  // Container principal da tela:
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Conteúdos da tela:
  conteudo: {
    // Ajusta a largura máxima do conteúdo e centraliza os itens.
    width: '100%',
    maxWidth: 430,
    alignItems: 'center',
  },

  // Título do parque:
  titulo: {
    // Ajusta a cor, fonte e alinhamento do título.
    color: '#000000',
    fontFamily: 'Poppins_900Black',
    textAlign: 'center',
    includeFontPadding: false,
  },

  // Gradiente do título:
  gradiente: {
    // Ajusta o gradiente para ocupar todo o espaço do título.
    flex: 1,
  },

  // Subtítulo da tela:
  subtitulo: {
    // Ajusta a cor, fonte e alinhamento do subtítulo.
    color: '#527D68',
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
  },

  // Descrição da tela:
  descricao: {
    // Ajusta a cor, fonte e alinhamento da descrição.
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    textAlign: 'center',
    maxWidth: 330,
  },

  // Área do botão:
  botaoArea: {
    // Ajusta a largura máxima do botão e arredonda os cantos.
    width: '100%',
    maxWidth: 280,
    borderRadius: 14,
    overflow: 'hidden',
  },

  // Botão "Começar":
  botao: {
    // Ajusta a altura mínima, o preenchimento e centraliza o conteúdo do botão.
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Texto do botão:
  textoBotao: {
    // Ajusta a cor, fonte, tamanho e alinhamento do texto do botão.
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
    textAlign: 'center',
  },
});