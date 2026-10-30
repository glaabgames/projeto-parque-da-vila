
/* Tela de reservas do Parque Vivo. */

import React from 'react';

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

/* Fontes utilizadas no aplicativo. */
import {
  useFonts,
  Poppins_300Light,
  Poppins_700Bold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';

/* Gradientes e título colorido. */
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export default function ReservarScreen({
  onPerfil,
  onAgendar,
  onVoltar,
}) {
  const { width } = useWindowDimensions();

  /* Ajusta os elementos conforme a largura da tela. */
  const telaGrande = width >= 768;
  const celularEstreito = width < 360;

  const tamanhoTitulo = telaGrande
    ? 32
    : celularEstreito
      ? 26
      : 29;

  const tamanhoBoasVindas = telaGrande
    ? 19
    : celularEstreito
      ? 12
      : 14;

  /* Carrega as fontes. */
  const [fontesCarregadas] = useFonts({
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_900Black,
  });

  /* Informações e imagens dos espaços reserváveis. */
  const locais = [
    {
      nome: 'Campo de futebol',
      descricao: 'Espaço ideal para praticar esportes.',
      imagem: require('../assets/parque-quadra-futebol.png'),
    },
    {
      nome: 'Quadra de vôlei',
      descricao: 'Pratique vôlei e divirta-se com os amigos.',
      imagem: require('../assets/parque-quadra-volei.png'),
    },
    {
      nome: 'Quiosque 1',
      descricao: 'Ideal para refeições e encontros ao ar livre.',
      imagem: require('../assets/parque-quiosque.png'),
    },
    {
      nome: 'Quiosque 2',
      descricao: 'Ideal para refeições e encontros ao ar livre.',
      imagem: require('../assets/parque-quiosque.png'),
    },
    {
      nome: 'Quiosque 3',
      descricao: 'Ideal para refeições e encontros ao ar livre.',
      imagem: require('../assets/parque-quiosque.png'),
    },
    {
      nome: 'Quiosque 4',
      descricao: 'Ideal para refeições e encontros ao ar livre.',
      imagem: require('../assets/parque-quiosque.png'),
    },
  ];

  /* Abre a tela de agendamento do local selecionado. */
  function agendarLocal(nomeLocal) {
    if (onAgendar) {
      onAgendar(nomeLocal);
    }
  }

  /* Aguarda o carregamento das fontes. */
  if (!fontesCarregadas) {
    return <View style={styles.fundo} />;
  }

  return (
    <SafeAreaView style={styles.fundo}>
      {/* Espaço da barra de status do Android. */}
      {Platform.OS === 'android' && (
        <View
          style={{
            height: StatusBar.currentHeight || 24,
          }}
        />
      )}

      <StatusBar
        barStyle="light-content"
        backgroundColor="#326B54"
      />

      {/* Barra superior com os elementos alinhados. */}
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
        {/* Botão voltar e boas-vindas agrupados. */}
        <View style={styles.grupoEsquerdoTopo}>
          <TouchableOpacity
            onPress={onVoltar}
            activeOpacity={0.7}
            style={styles.botaoVoltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a tela anterior"
          >
            <Text style={styles.setaVoltar}>‹</Text>
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

        {/* Botão de perfil alinhado à direita. */}
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

      {/* Área de rolagem separada do cabeçalho. */}
      <ScrollView
        style={styles.areaRolagem}
        contentContainerStyle={[
          styles.containerRolagem,
          {
            paddingHorizontal: telaGrande ? 28 : 16,
          },
        ]}
        showsVerticalScrollIndicator
        bounces
        overScrollMode="auto"
        keyboardShouldPersistTaps="handled"
      >
        {/* Conteúdo centralizado e limitado como na Home. */}
        <View
          style={[
            styles.conteudo,
            {
              maxWidth: telaGrande ? 760 : 480,
            },
          ]}
        >
          {/* Cartão de apresentação. */}
          <View
            style={[
              styles.cartaoApresentacao,
              {
                padding: telaGrande ? 22 : 16,
              },
            ]}
          >
            <Text style={styles.subtituloApresentacao}>
              Faça seu agendamento.
            </Text>

            {/* Título com gradiente verde. */}
            <MaskedView
              style={[
                styles.areaTitulo,
                {
                  height: tamanhoTitulo * 1.5,
                },
              ]}
              maskElement={
                <Text
                  style={[
                    styles.tituloApresentacao,
                    { fontSize: tamanhoTitulo },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
                  Reserve já!
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

            <Text style={styles.descricaoApresentacao}>
              Escolha seu espaço e divirta-se.
            </Text>
          </View>

          {/* Título da lista de espaços. */}
          <Text style={styles.tituloSecao}>
            Escolha seu espaço
          </Text>

          {/* Cartões dos espaços em uma única coluna. */}
          <View
            style={[
              styles.listaLocais,
              {
                flexDirection: 'column',
              },
            ]}
          >
            {locais.map((local) => (
              <View
                key={local.nome}
                style={[
                  styles.cartaoLocal,
                  {
                    width: '100%',
                  },
                ]}
              >
                {/* Imagem do espaço. */}
                <Image
                  source={local.imagem}
                  style={styles.imagemLocal}
                  resizeMode="cover"
                  accessibilityLabel={local.nome}
                />

                <Text style={styles.nomeLocal}>
                  {local.nome}:
                </Text>

                <Text style={styles.descricaoLocal}>
                  {local.descricao}
                </Text>

                {/* Botão para abrir o agendamento. */}
                <TouchableOpacity
                  onPress={() => agendarLocal(local.nome)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`Agendar ${local.nome}`}
                  style={styles.areaBotaoAgendar}
                >
                  <LinearGradient
                    colors={['#326B54', '#8AB59D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.botaoAgendar}
                  >
                    <Text style={styles.textoBotao}>
                      Agendar
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Estilos da tela de reservas. */
const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* Barra superior. */
  barraTopo: {
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  /* Mantém a seta e o texto alinhados verticalmente. */
  grupoEsquerdoTopo: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  /* Botão voltar com o mesmo tamanho da tela de agendamento. */
  botaoVoltar: {
    width: 32,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  setaVoltar: {
    color: '#FFFFFF',
    fontSize: 38,
    lineHeight: 42,
    fontFamily: 'Poppins_300Light',
    includeFontPadding: false,
    textAlign: 'center',
  },

  /* Texto de boas-vindas. */
  boasVindas: {
    flex: 1,
    minWidth: 0,
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    includeFontPadding: false,
  },

  /* Botão de perfil. */
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

  /* Área de rolagem. */
  areaRolagem: {
    flex: 1,
    width: '100%',
  },

  containerRolagem: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },

  /* Largura controlada pelo tamanho da tela. */
  conteudo: {
    width: '100%',
    alignSelf: 'center',
  },

  /* Cartão de apresentação. */
  cartaoApresentacao: {
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 18,
    marginBottom: 24,
  },

  subtituloApresentacao: {
    color: '#527D68',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 8,
  },

  /* Área reservada ao título com gradiente. */
  areaTitulo: {
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },

  tituloApresentacao: {
    color: '#000000',
    fontFamily: 'Poppins_900Black',
    includeFontPadding: false,
  },

  gradienteTitulo: {
    width: '100%',
    height: '100%',
  },

  descricaoApresentacao: {
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 2,
  },

  /* Título da lista de espaços. */
  tituloSecao: {
    width: '100%',
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 16,
  },

  /* Organização dos cartões em uma única coluna. */
  listaLocais: {
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },

  /* Cartão de cada espaço. */
  cartaoLocal: {
    alignItems: 'center',
    backgroundColor: '#F3F6F2',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },

  /* Todas as imagens têm a mesma proporção. */
  imagemLocal: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: '#EEF3EF',
    marginBottom: 10,
  },

  nomeLocal: {
    width: '100%',
    color: '#527D68',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    textAlign: 'left',
    marginBottom: 6,
  },

  descricaoLocal: {
    width: '100%',
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'left',
    marginBottom: 12,
  },

  /* Botão ocupa toda a largura do cartão. */
  areaBotaoAgendar: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },

  botaoAgendar: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
  },
});