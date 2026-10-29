// Tela do mapa do parque:
import React from 'react';

// Importa os componentes do React Native:
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
  Alert,
} from 'react-native';

// Importa as fontes Poppins:
import {
  useFonts,
  Poppins_300Light,
  Poppins_700Bold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';

// Importa o gradiente:
import { LinearGradient } from 'expo-linear-gradient';

// Importa a máscara para o título:
import MaskedView from '@react-native-masked-view/masked-view';

// Tela do mapa:
export default function MapaScreen({ onPerfil }) {
  const { width } = useWindowDimensions();

  // Ajusta os tamanhos conforme a tela:
  const telaGrande = width >= 768;
  const celularEstreito = width < 360;

  const tamanhoTitulo = telaGrande ? 29 : celularEstreito ? 22 : 25;
  const tamanhoBoasVindas = telaGrande ? 19 : celularEstreito ? 12 : 14;
  const tamanhoImagemParque = telaGrande ? 300 : Math.min(width * 0.58, 260);

  // Carrega as fontes:
  const [fontesCarregadas] = useFonts({
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_900Black,
  });
  // Aguarda o carregamento das fontes:
  if (!fontesCarregadas) {
    return <View style={styles.fundo} />;
  }

  // Locais de exemplo do parque:
  const pontosDoParque = [
    {
      titulo: 'Área 1.',
      descricao: 'Lazer: Setor central.',
    },
    {
      titulo: 'Área 2.',
      descricao: 'Lazer: Setor central.',
    },
    {
      titulo: 'Área 3.',
      descricao: 'Esportes: Setor central.',
    },
    {
      titulo: 'Área 4.',
      descricao: 'Esportes: Setor central.',
    },
  ];

  // Mostra um aviso ao favoritar:
  function favoritarLocal() {
    if (Platform.OS === 'web') {
      window.alert('Você favoritou esse local!');
    } else {
      Alert.alert(
        'Atenção:',
        'Você favoritou esse local!'
      );
    }
  }
  // Renderiza a tela do mapa:
  return (
    // SafeAreaView para evitar sobreposição com a barra de status:
    <SafeAreaView style={styles.fundo}>

      {/* Espaço da barra de status do Android: */}
      {Platform.OS === 'android' && (
        <View
          style={{
            height: StatusBar.currentHeight || 24,
          }}
        />
      )}

      {/* Barra superior: mantém o padrão da Home: */}
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
            style={[
              styles.boasVindas,
              { fontSize: tamanhoBoasVindas },
            ]}
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

      {/* Conteúdo da página com rolagem: */}
      <ScrollView
        style={styles.areaRolagem}
        contentContainerStyle={[
          styles.container,
          {
            paddingHorizontal: telaGrande ? 28 : 16,
          },
        ]}
        showsVerticalScrollIndicator={true}
        bounces={true}
        overScrollMode="auto"
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.conteudo,
            {
              maxWidth: telaGrande ? 760 : 480,
            },
          ]}
        >

          {/* Cartão principal com imagem e textos: */}
          <View style={styles.cartaoPrincipal}>

            <Text style={styles.subtituloPagina}>
              Guia do parque.
            </Text>

            {/* Título com gradiente: */}
            <MaskedView
              style={[
                styles.areaTitulo,
                { minHeight: tamanhoTitulo * 1.45 },
              ]}
              maskElement={
                <Text
                  style={[
                    styles.titulo,
                    { fontSize: tamanhoTitulo },
                  ]}
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
                  Explore o parque!
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

            <Text style={styles.descricaoPagina}>
              Conheça cada cantinho do parque.
            </Text>

            <Image
              source={require('../assets/parque-imagem-completa.png')}
              style={[
                styles.imagemParque,
                { height: tamanhoImagemParque },
              ]}
              resizeMode="cover"
              accessibilityLabel="Imagem ilustrativa do parque"
            />
          </View>

          {/* Título da lista de locais: */}
          <Text style={styles.tituloPontos}>
            Pontos do parque:
          </Text>

          {/* Cartões dos quatro locais: */}
          {pontosDoParque.map((ponto, index) => (
            <View
              key={index}
              style={styles.cartaoPonto}
            >
              <Image
                source={require('../assets/parque-quadra-futebol.png')}
                style={styles.imagemPonto}
                resizeMode="cover"
                accessibilityLabel={`Imagem ilustrativa da ${ponto.titulo}`}
              />

              <Text style={styles.tituloPonto}>
                {ponto.titulo}
              </Text>

              <Text style={styles.descricaoPonto}>
                {ponto.descricao}
              </Text>

              {/* Botão Favoritar: */}
              <TouchableOpacity
                onPress={favoritarLocal}
                activeOpacity={0.8}
                accessibilityRole="button"
                style={styles.areaBotaoFavoritar}
              >
                <LinearGradient
                  colors={['#326B54', '#8AB59D']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.botaoFavoritar}
                >
                  <Text style={styles.textoBotao}>
                    Favoritar
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ))}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos da tela:
const styles = StyleSheet.create({

  // Fundo branco:
  fundo: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Barra superior:
  barraTopo: {
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Grupo de boas-vindas:
  grupoBoasVindas: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    marginRight: 12,
  },

  // Texto de boas-vindas:
  boasVindas: {
    width: '100%',
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    includeFontPadding: false,
  },

  // Botão do perfil:
  botaoPerfil: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Imagem do perfil:
  imagemPerfil: {
    width: '100%',
    height: '100%',
  },

  // Área de rolagem:
  areaRolagem: {
    flex: 1,
    width: '100%',
  },

  // Conteúdo da página:
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 48,
  },

  // Conteúdo interno da página:
  conteudo: {
    width: '100%',
    alignSelf: 'center',
  },

  // Cartão principal:
  cartaoPrincipal: {
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },

  // Subtítulo da página:
  subtituloPagina: {
    color: '#527D68',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    marginBottom: 4,
  },

  // Título da página:
  areaTitulo: {
    width: '100%',
    justifyContent: 'center',
  },

  // Título da página:
  titulo: {
    color: '#000000',
    fontFamily: 'Poppins_900Black',
    includeFontPadding: false,
    flexWrap: 'wrap',
  },

  // Gradiente do título:
  gradienteTitulo: {
    flex: 1,
  },

  // Descrição da página:
  descricaoPagina: {
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 5,
    marginBottom: 16,
  },

  // Imagem do parque:
  imagemParque: {
    width: '100%',
    borderRadius: 13,
    backgroundColor: '#EEF3EF',
  },

  // Título dos pontos:
  tituloPontos: {
    width: '100%',
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    marginBottom: 12,
  },

  // Cartão de cada local:
  cartaoPonto: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F3F6F2',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  // Imagem de cada local:
  imagemPonto: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: '#EEF3EF',
    marginBottom: 12,
  },

  // Título de cada local:
  tituloPonto: {
    width: '100%',
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 4,
  },

  // Descrição de cada local:
  descricaoPonto: {
    width: '100%',
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'left',
    marginBottom: 12,
  },

  // Área do botão:
  areaBotaoFavoritar: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },

  // Botão com gradiente:
  botaoFavoritar: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  // Texto do botão:
  textoBotao: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
  },
});