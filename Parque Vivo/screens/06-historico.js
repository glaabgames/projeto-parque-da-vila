// Tela de histórico de reservas do Parque Vivo.
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
// Importa as fontes do google fonts:
import {
  useFonts,
  Poppins_300Light,
  Poppins_700Bold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';
// Importa o gradiente linear:
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

// Tela de histórico de reservas.
export default function HistoricoScreen({
  reservas = [],
  nomeUsuario = '',
  onVoltar,
}) {
  const { width } = useWindowDimensions();
  // Ajustes para celular e computador:
  const telaGrande = width >= 768;
  const celularEstreito = width < 360;
  // Ajusta o tamanho do título e da mensagem de boas-vindas com base no tamanho da tela.
  const tamanhoTitulo = telaGrande ? 32 : celularEstreito ? 25 : 29;
  const tamanhoBoasVindas = telaGrande ? 19 : celularEstreito ? 12 : 14;

  // Carrega as fontes utilizadas na tela.
  const [fontesCarregadas] = useFonts({
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_900Black,
  });

  // Imagens dos locais disponíveis para reserva.
  const locais = [
    {
      nome: 'Campo de futebol',
      imagem: require('../assets/parque-quadra-futebol.png'),
    },
    {
      nome: 'Quadra de vôlei',
      imagem: require('../assets/parque-quadra-volei.png'),
    },
    {
      nome: 'Quiosque 1',
      imagem: require('../assets/parque-quiosque.png'),
    },
    {
      nome: 'Quiosque 2',
      imagem: require('../assets/parque-quiosque.png'),
    },
    {
      nome: 'Quiosque 3',
      imagem: require('../assets/parque-quiosque.png'),
    },
    {
      nome: 'Quiosque 4',
      imagem: require('../assets/parque-quiosque.png'),
    },
  ];

  // Encontra a imagem correspondente ao local reservado.
  function encontrarImagem(nomeLocal) {
    const localEncontrado = locais.find(
      (local) => local.nome === nomeLocal
    );
    // Retorna a imagem do local encontrado ou uma imagem padrão caso não seja encontrado.
    return localEncontrado
      ? localEncontrado.imagem
      : require('../assets/parque-quiosque.png');
  }
  // Aguarda o carregamento das fontes antes de renderizar a tela.
  if (!fontesCarregadas) {
    return <View style={styles.fundo} />;
  }

  return (
    <SafeAreaView style={styles.fundo}>
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

      {/* Barra superior com botão voltar e boas-vindas: */}
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
        <View style={styles.grupoEsquerdoTopo}>
          <TouchableOpacity
            onPress={onVoltar}
            activeOpacity={0.7}
            style={styles.botaoVoltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a tela inicial"
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
      </LinearGradient>

      <ScrollView
        style={styles.areaRolagem}
        contentContainerStyle={[
          styles.containerRolagem,
          {
            paddingHorizontal: telaGrande ? 28 : 16,
          },
        ]}
        showsVerticalScrollIndicator
      >
        <View
          style={[
            styles.conteudo,
            {
              maxWidth: telaGrande ? 760 : 480,
            },
          ]}
        >
          {/* Cartão de apresentação do histórico: */}
          <View
            style={[
              styles.cartaoApresentacao,
              {
                padding: telaGrande ? 22 : 16,
              },
            ]}
          >
            <Text style={styles.subtituloApresentacao}>
              Veja seu histórico.
            </Text>

            {/* Título principal com gradiente verde: */}
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
                    {
                      fontSize: tamanhoTitulo,
                    },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
                  Histórico de reservas:
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
              Encontre suas reservas anteriores:
            </Text>
          </View>

          <Text style={styles.tituloSecao}>
            Minhas reservas
          </Text>

          {/* Verifica se existem reservas no histórico: */}
          {reservas.length === 0 ? (
            <View style={styles.cartaoVazio}>
              <Text style={styles.textoSemReservas}>
                Você ainda não possui reservas.
              </Text>

              <Text style={styles.textoAjuda}>
                Quando fizer uma reserva, ela aparecerá aqui.
              </Text>
            </View>
          ) : (
            <View style={styles.listaReservas}>
              {reservas.map((reserva) => (
                <View
                  key={reserva.id}
                  style={styles.cartaoReserva}
                >
                  {/* Imagem do local reservado. */}
                  <Image
                    source={encontrarImagem(reserva.local)}
                    style={styles.imagemLocal}
                    resizeMode="cover"
                    accessibilityLabel={reserva.local}
                  />

                  <View style={styles.informacoesReserva}>
                    <Text style={styles.nomeLocal}>
                      {reserva.local}
                    </Text>

                    <Text style={styles.textoDetalhe}>
                      Reservado por: {reserva.nome || nomeUsuario || 'Usuário'}
                    </Text>

                    <Text style={styles.textoDetalhe}>
                      Data: {reserva.dia}
                    </Text>

                    <Text style={styles.textoDetalhe}>
                      Horário: {reserva.horarioInicial} às {reserva.horarioFinal}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos da tela de histórico.
const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Barra superior com botão voltar e boas-vindas.
  barraTopo: {
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Grupo esquerdo da barra superior, contendo o botão voltar e a mensagem de boas-vindas.
  grupoEsquerdoTopo: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  // Estilo do botão voltar.
  botaoVoltar: {
    width: 32,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  // Estilo da seta do botão voltar.
  setaVoltar: {
    color: '#FFFFFF',
    fontSize: 38,
    lineHeight: 42,
    fontFamily: 'Poppins_300Light',
    includeFontPadding: false,
    textAlign: 'center',
  },

  // Boas-vindas ao usuário:
  boasVindas: {
    flex: 1,
    minWidth: 0,
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    includeFontPadding: false,
  },

  // Container da rolagem do conteúdo da tela.
  areaRolagem: {
    flex: 1,
    width: '100%',
  },

  // Container da rolagem do conteúdo da tela.
  containerRolagem: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },

  // Conteúdo da tela:
  conteudo: {
    width: '100%',
    alignSelf: 'center',
  },

  // Cartão de apresentação do histórico.
  cartaoApresentacao: {
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 18,
    marginBottom: 24,
  },

  // Subtítulo da apresentação do histórico.
  subtituloApresentacao: {
    // Ajusta a cor, fonte, tamanho e margem inferior do subtítulo da apresentação do histórico.
    color: '#527D68',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 8,
  },

  // Área do título principal da apresentação do histórico.
  areaTitulo: {
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },

  // Título principal da apresentação do histórico.
  tituloApresentacao: {
    color: '#000000',
    fontFamily: 'Poppins_900Black',
    includeFontPadding: false,
  },

  // Gradiente do título:
  gradienteTitulo: {
    width: '100%',
    height: '100%',
  },

  // Descrição da apresentação do histórico.
  descricaoApresentacao: {
    // Ajusta a cor, fonte, tamanho e altura da linha da descrição da apresentação do histórico.
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 2,
  },

  // Título da seção de reservas.
  tituloSecao: {
    // Ajusta a cor, fonte, tamanho e margem inferior do título da seção de reservas.
    width: '100%',
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 16,
  },

  // Cartão exibido quando não há reservas no histórico.
  cartaoVazio: {
    // Ajusta a largura, cor de fundo, borda arredondada, preenchimento e alinhamento do cartão vazio.
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 14,
    padding: 18,
  },

  // Texto exibido quando não há reservas no histórico.
  textoSemReservas: {
    // Ajusta a cor, fonte, tamanho e margem inferior do texto que indica que não há reservas.
    color: '#527D68',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    marginBottom: 6,
  },

  // Texto de ajuda quando não há reservas.
  textoAjuda: {
    // Ajusta a cor, fonte, tamanho e altura da linha do texto de ajuda.
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 13,
    lineHeight: 20,
  },

  // Lista de reservas:
  listaReservas: {
    width: '100%',
    gap: 14,
  },

  // Cartão de reserva individual.
  cartaoReserva: {
    // Ajusta a largura, cor de fundo, borda arredondada, preenchimento e borda esquerda do cartão de reserva.
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#326B54',
  },

  // Imagem do local reservado.
  imagemLocal: {
    // Ajusta a largura, altura, borda arredondada e margem inferior da imagem do local reservado.
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: '#EEF3EF',
    marginBottom: 12,
  },

  // Informações da reserva (nome do local, usuário, data e horário).
  informacoesReserva: {
    width: '100%',
  },

  // Nome do local reservado:
  nomeLocal: {
    // Ajusta a cor, fonte, tamanho e margem inferior do nome do local reservado.
    color: '#527D68',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    marginBottom: 6,
  },

  // Detalhes da reserva (nome do usuário, data e horário):
  textoDetalhe: {
    // Ajusta a cor, fonte, tamanho e altura da linha dos detalhes da reserva.
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 13,
    lineHeight: 21,
  },
});