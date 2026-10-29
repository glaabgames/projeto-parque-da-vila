// Tela de início do aplicativo:
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
} from 'react-native';

// Importa as fontes do Google Fonts:
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

// Tela inicial do aplicativo:
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
  // Aguarda o carregamento das fontes:
  if (!fontesCarregadas) {
    return <View style={styles.fundo} />;
  }
  // Ajusta o tamanho do título e da imagem do mapa de acordo com a tela:
  const tamanhoTitulo = telaGrande ? 29 : celularEstreito ? 22 : 25;
  const tamanhoBoasVindas = telaGrande ? 19 : celularEstreito ? 12 : 14;
  const tamanhoImagemMapa = telaGrande ? 280 : Math.min(width * 0.48, 220);
  // Renderiza a tela inicial:
  return (
    // SafeAreaView para evitar sobreposição com a barra de status do Android:
    <SafeAreaView style={styles.fundo}>
      {/* Espaço da barra de status do Android: */}
      {Platform.OS === 'android' && (
        <View style={{ height: StatusBar.currentHeight || 24 }} />
      )}

      {/* Cabeçalho: */}
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

      {/* Conteúdo da página: */}
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
          {/* Cartão principal: */}
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

              {/* Título com gradiente: */}
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

              {/* Botão para explorar: */}
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

          {/* Indicadores: */}
          <View style={styles.areaIndicadores}>
            <View style={styles.indicador}>
              <Text style={styles.numeroIndicador}>06</Text>
              <Text style={styles.textoIndicador}>
                espaços para explorar
              </Text>
            </View>

            <View style={styles.indicador}>
              <Text style={styles.numeroIndicador}>03</Text>
              <Text style={styles.textoIndicador}>
                locais reserváveis
              </Text>
            </View>
          </View>

          {/* Atalhos: */}
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

            <TouchableOpacity
              style={styles.atalho}
              onPress={onPerfil}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <View style={styles.areaImagemAtalho}>
                <Image
                  source={require('../assets/parque-perfil-usuario.png')}
                  style={styles.imagemAtalho}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.textoAtalho}>
                Meu perfil.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos da tela inicial:
const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Barra de topo com boas-vindas e botão de perfil:
  barraTopo: {
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Área do grupo de boas-vindas:
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

  // Botão de perfil do usuário:
  botaoPerfil: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Imagem do perfil do usuário:
  imagemPerfil: {
    width: '100%',
    height: '100%',
  },

  // Área de rolagem do conteúdo:
  areaRolagem: {
    flex: 1,
    width: '100%',
  },

  // Container do conteúdo da página:
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 48,
  },

  // Conteúdo da página:
  conteudo: {
    width: '100%',
    alignSelf: 'center',
  },

  // Cartão principal do conteúdo:
  cartaoPrincipal: {
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
  },

  // Imagem do parque no cartão principal:
  imagemParque: {
    width: '100%',
    backgroundColor: '#EEF3EF',
  },

  // Conteúdo do cartão principal:
  conteudoCartao: {
    width: '100%',
  },

  // Subtítulo do cartão principal:
  subtituloCartao: {
    color: '#527D68',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    marginBottom: 6,
  },

  // Título do cartão principal:
  areaTitulo: {
    width: '100%',
    justifyContent: 'center',
  },

  // Título do cartão principal:
  titulo: {
    color: '#000000',
    fontFamily: 'Poppins_900Black',
    includeFontPadding: false,
    flexWrap: 'wrap',
  },

  // Gradiente do título do cartão principal:
  gradienteTitulo: {
    flex: 1,
  },

  // Descrição do cartão principal:
  descricao: {
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 5,
    marginBottom: 18,
  },

  // Área do botão "Explorar":
  botaoArea: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    overflow: 'hidden',
  },

  // Botão "Explorar":
  botao: {
    minWidth: 125,
    minHeight: 48,
    paddingHorizontal: 22,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Texto do botão "Explorar":
  textoBotao: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
  },

  // Área dos indicadores:
  areaIndicadores: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  // Indicador individual:
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

  // Número do indicador:
  numeroIndicador: {
    color: '#326B54',
    fontFamily: 'Poppins_900Black',
    fontSize: 23,
  },

  // Texto do indicador:
  textoIndicador: {
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Título da seção de atalhos:
  tituloAtalhos: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    marginBottom: 12,
  },

  // Área dos atalhos:
  areaAtalhos: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },

  // Atalho individual:
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

  // Área da imagem do atalho:
  areaImagemAtalho: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  // Imagem do atalho:
  imagemAtalho: {
    width: 42,
    height: 42,
  },

  // Texto do atalho:
  textoAtalho: {
    width: '100%',
    color: '#326B54',
    fontFamily: 'Poppins_300Light',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});