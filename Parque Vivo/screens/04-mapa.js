
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
  Alert,
} from 'react-native';

// Fontes utilizadas no aplicativo.
import {
  useFonts,
  Poppins_300Light,
  Poppins_700Bold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';

// Gradientes e título colorido.
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

// Tela do mapa do parque.
export default function MapaScreen({ onPerfil, onVoltar }) {
  const { width } = useWindowDimensions();

  // Guarda os nomes dos locais favoritos.
  const [favoritos, setFavoritos] = useState([]);

  // Ajusta os tamanhos conforme a largura da tela.
  const telaGrande = width >= 768;
  const celularEstreito = width < 360;

  const tamanhoTitulo = telaGrande ? 29 : celularEstreito ? 22 : 25;
  const tamanhoBoasVindas = telaGrande ? 19 : celularEstreito ? 12 : 14;

  // Carrega as fontes.
  const [fontesCarregadas] = useFonts({
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_900Black,
  });

  // Mostra uma tela vazia enquanto as fontes carregam.
  if (!fontesCarregadas) {
    return <View style={styles.fundo} />;
  }

  // Informações e imagens dos locais do parque.
  const pontosDoParque = [
    {
      subtitulo: 'Visite o bosque!',
      descricao:
        'Área de lazer ideal para passeios, caminhadas e contato com a natureza.',
      imagem: require('../assets/parque-bosque.png'),
    },
    {
      subtitulo: 'Visite o lago!',
      descricao:
        'Área de lazer para passeios, contemplação da paisagem e momentos de descanso.',
      imagem: require('../assets/parque-lago.png'),
    },
    {
      subtitulo: 'Visite o parquinho!',
      descricao:
        'Área de lazer com brinquedos infantis, ideal para as crianças brincarem e se divertirem.',
      imagem: require('../assets/parque-playground.png'),
    },
    {
      subtitulo: 'Visite as quadras!',
      descricao:
        'Área esportiva destinada à prática de esportes, exercícios físicos e atividades recreativas.',
      imagem: require('../assets/parque-quadra-futebol.png'),
    },
    {
      subtitulo: 'Visite os quiosques!',
      descricao:
        'Área de lazer para almoços, jantares, refeições ao ar livre e momentos de convivência.',
      imagem: require('../assets/parque-quiosque.png'),
    },
  ];

  // Adiciona ou remove um local dos favoritos.
  function favoritarLocal(nomeLocal) {
    if (favoritos.includes(nomeLocal)) {
      // Remove o local da lista.
      setFavoritos(favoritos.filter((item) => item !== nomeLocal));

      // Mostra a mensagem de remoção.
      if (Platform.OS === 'web') {
        window.alert('Você tirou esse local dos favoritos.');
      } else {
        Alert.alert('Atenção', 'Você tirou esse local dos favoritos.');
      }
    } else {
      // Adiciona o local à lista.
      setFavoritos([...favoritos, nomeLocal]);

      // Mostra a mensagem de confirmação.
      if (Platform.OS === 'web') {
        window.alert('Você favoritou esse local.');
      } else {
        Alert.alert('Atenção', 'Você favoritou esse local.');
      }
    }
  }

  // Monta a tela.
  return (
    <SafeAreaView style={styles.fundo}>
      {/* Espaço da barra superior do celular Android. */}
      {Platform.OS === 'android' && (
        <View style={{ height: StatusBar.currentHeight || 24 }} />
      )}

      {/* Cabeçalho alinhado às telas de reservas e agendamento. */}
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
        {/* Grupo com botão voltar e mensagem de boas-vindas. */}
        <View style={styles.grupoEsquerdoTopo}>
          <TouchableOpacity
            onPress={onVoltar}
            activeOpacity={0.7}
            style={styles.botaoVoltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a tela anterior"
          >
            <Text style={styles.flechaVoltar}>‹</Text>
          </TouchableOpacity>

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

        {/* Botão que abre o perfil. */}
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

      {/* Área que permite rolar a página. */}
      <ScrollView
        style={styles.areaRolagem}
        contentContainerStyle={[
          styles.container,
          { paddingHorizontal: telaGrande ? 28 : 16 },
        ]}
        showsVerticalScrollIndicator
        bounces
        overScrollMode="auto"
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.conteudo,
            { maxWidth: telaGrande ? 760 : 480 },
          ]}
        >
          {/* Cartão com o título e o mapa completo. */}
          <View style={styles.cartaoPrincipal}>
            <Text style={styles.subtituloPagina}>
              Guia do parque.
            </Text>

            {/* Título com gradiente verde. */}
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

            {/* Imagem completa do parque. */}
            <View style={styles.molduraMapa}>
              <Image
                source={require('../assets/parque-imagem-completa.png')}
                style={styles.imagemParque}
                resizeMode="stretch"
                accessibilityLabel="Mapa completo do Parque Vivo"
              />
            </View>
          </View>

          {/* Título da lista de locais. */}
          <Text style={styles.tituloPontos}>
            Pontos do parque:
          </Text>

          {/* Cria um cartão para cada local. */}
          {pontosDoParque.map((ponto) => {
            // Verifica se o local já está nos favoritos.
            const estaFavoritado = favoritos.includes(ponto.subtitulo);

            return (
              <View
                key={ponto.subtitulo}
                style={styles.cartaoPonto}
              >
                {/* Imagem do local. */}
                <Image
                  source={ponto.imagem}
                  style={styles.imagemPonto}
                  resizeMode="cover"
                  accessibilityLabel={ponto.subtitulo}
                />

                {/* Nome de cada local. */}
                <Text style={styles.subtituloPonto}>
                  {ponto.subtitulo}
                </Text>

                {/* Descrição de cada local. */}
                <Text style={styles.descricaoPonto}>
                  {ponto.descricao}
                </Text>

                {/* Botão para favoritar ou desfavoritar. */}
                <TouchableOpacity
                  onPress={() => favoritarLocal(ponto.subtitulo)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={
                    estaFavoritado
                      ? `Desfavoritar ${ponto.subtitulo}`
                      : `Favoritar ${ponto.subtitulo}`
                  }
                  style={styles.areaBotaoFavoritar}
                >
                  <LinearGradient
                    colors={['#326B54', '#8AB59D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.botaoFavoritar}
                  >
                    <Text style={styles.textoBotao}>
                      {estaFavoritado ? 'Desfavoritar' : 'Favoritar'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos visuais da tela.
const styles = StyleSheet.create({
  // Fundo branco.
  fundo: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Cabeçalho verde.
  barraTopo: {
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Grupo com a seta e o texto de boas-vindas.
  grupoEsquerdoTopo: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  // Botão de voltar.
  botaoVoltar: {
    width: 32,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  // Seta de voltar.
  flechaVoltar: {
    color: '#FFFFFF',
    fontSize: 38,
    lineHeight: 42,
    fontFamily: 'Poppins_300Light',
    includeFontPadding: false,
    textAlign: 'center',
  },

  // Texto do cabeçalho.
  boasVindas: {
    flex: 1,
    minWidth: 0,
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    includeFontPadding: false,
  },

  // Botão do perfil.
  botaoPerfil: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Imagem do perfil.
  imagemPerfil: {
    width: '100%',
    height: '100%',
  },

  // Área de rolagem.
  areaRolagem: {
    flex: 1,
    width: '100%',
  },

  // Organização do conteúdo.
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 24,
  },

  // Limita a largura do conteúdo.
  conteudo: {
    width: '100%',
    alignSelf: 'center',
  },

  // Cartão principal do mapa.
  cartaoPrincipal: {
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 18,
    padding: 12,
    marginBottom: 24,
  },

  // Texto "Guia do parque".
  subtituloPagina: {
    color: '#527D68',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    marginBottom: 3,
  },

  // Área do título.
  areaTitulo: {
    width: '100%',
    justifyContent: 'center',
  },

  // Formato do texto do título.
  titulo: {
    color: '#000000',
    fontFamily: 'Poppins_900Black',
    includeFontPadding: false,
    flexWrap: 'wrap',
  },

  // Preenchimento em gradiente do título.
  gradienteTitulo: {
    flex: 1,
  },

  // Descrição abaixo do título.
  descricaoPagina: {
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 3,
    marginBottom: 8,
  },

  // Moldura da imagem do mapa.
  molduraMapa: {
    width: '100%',
    borderRadius: 13,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginTop: 0,
    marginBottom: 0,
  },

  // Tamanho e proporção do mapa.
  imagemParque: {
    width: '100%',
    height: undefined,
    aspectRatio: 1122 / 1402,
  },

  // Título "Pontos do parque".
  tituloPontos: {
    width: '100%',
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    marginTop: 2,
    marginBottom: 16,
  },

  // Cartão de cada local.
  cartaoPonto: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F3F6F2',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },

  // Imagem de cada local.
  imagemPonto: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: '#EEF3EF',
    marginBottom: 10,
  },

  // Nome de cada local.
  subtituloPonto: {
    width: '100%',
    color: '#527D68',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    textAlign: 'left',
    marginTop: 0,
    marginBottom: 6,
  },

  // Descrição de cada local.
  descricaoPonto: {
    width: '100%',
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'left',
    marginBottom: 12,
  },

  // Área do botão.
  areaBotaoFavoritar: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },

  // Formato do botão com gradiente.
  botaoFavoritar: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  // Texto do botão.
  textoBotao: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
  },
});