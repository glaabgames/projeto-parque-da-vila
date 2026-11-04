// Importa o React e as ferramentas para guardar informações na tela.
import React, { useState } from 'react';

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
// Tela de reservas do Parque Vivo:
export default function ReservarScreen({
  onPerfil,
  onAgendar,
  onVoltar,
}) {
  // Dimensões da tela:
  const { width } = useWindowDimensions();

  // Ajusta os tamanhos conforme a largura da tela.
  const telaGrande = width >= 768;
  const celularEstreito = width < 360;

  // Ajusta o tamanho do título conforme a largura da tela.
  const tamanhoTitulo = telaGrande
    ? 32
    : celularEstreito
      ? 26
      : 29;

  // Ajusta o tamanho da mensagem de boas-vindas conforme a largura da tela.
  const tamanhoBoasVindas = telaGrande
    ? 19
    : celularEstreito
      ? 12
      : 14;

  // Carrega as fontes do Google Fonts:
  const [fontesCarregadas] = useFonts({
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_900Black,
  });

  // Lista de locais disponíveis para reserva, com nome, descrição e imagem.
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

  // Função para agendar um local, chamando a função onAgendar passada como prop.
  function agendarLocal(nomeLocal) {
    if (onAgendar) {
      onAgendar(nomeLocal);
    }
  }

  // Aguarda o carregamento das fontes: 
  if (!fontesCarregadas) {
    return <View style={styles.fundo} />;
  }
  // Renderiza a tela de reservas.
  return (
    <SafeAreaView style={styles.fundo}>
      {/* Espaço da barra de status do Android: */}
      {Platform.OS === 'android' && (
        <View
          style={{
            // Ajusta a altura do espaço da barra de status para android.
            height: StatusBar.currentHeight || 24,
          }}
        />
      )}

      <StatusBar
        barStyle="light-content"
        backgroundColor="#326B54"
      />

      {/* Barra superior com os elementos alinhados: */}
      <LinearGradient
      // Ajusta o gradiente da barra superior com cores verde e cinza.
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
        {/* Botão voltar e boas-vindas agrupados: */}
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
            // Ajusta o tamanho da fonte da mensagem de boas-vindas conforme a largura da tela.
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            Boas-vindas ao Parque Vivo!
          </Text>
        </View>

        {/* Botão de perfil alinhado à direita: */}
        <TouchableOpacity
        // Ajusta o comportamento do botão de perfil, chamando a função onPerfil ao ser pressionado.
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

      {/* Área de rolagem separada do cabeçalho: */}
      <ScrollView
      // Ajusta o estilo do ScrollView de acordo com a tela.
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
        {/* Conteúdo centralizado e limitado como na home: */}
        <View
          style={[
            // Ajusta o conteúdo da tela de reservas para ocupar a largura toda.
            styles.conteudo,
            {
              maxWidth: telaGrande ? 760 : 480,
            },
          ]}
        >
          {/* Cartão de apresentação: */}
          <View
          // Ajusta o cartão de apresentação com padding e estilo definido.
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

            {/* Título com gradiente verde: */}
            <MaskedView
              style={[
                styles.areaTitulo,
                {
                  height: tamanhoTitulo * 1.5,
                },
              ]}
              // Elemento máscara para o gradiente:
              maskElement={
                <Text
                  style={[
                    // Ajusta o estilo do título da apresentação, incluindo cor, fonte e tamanho.
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
              // Ajusta o gradiente linear para o título da apresentação.
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

          {/* Título da lista de espaços: */}
          <Text style={styles.tituloSecao}>
            Escolha seu espaço
          </Text>

          {/* Cartões dos espaços em uma única coluna: */}
          <View
            style={[
              styles.listaLocais,
              {
                // Ajusta a direção da lista para coluna, mantendo o espaçamento entre os itens.
                flexDirection: 'column',
              },
            ]}
          >
            {locais.map((local) => (
              <View
              // Ajusta o cartão de cada local com largura total e estilo definido.
                key={local.nome}
                style={[
                  styles.cartaoLocal,
                  {
                    width: '100%',
                  },
                ]}
              >
                {/* Imagem do espaço: */}
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

                {/* Botão para abrir o agendamento: */}
                <TouchableOpacity
                // Ajusta o comportamento do botão "Agendar", chamando a função agendarLocal ao ser pressionado.
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

// Estilos da tela de reservas.
const styles = StyleSheet.create({
  fundo: {
    // Ajusta o fundo da tela para ocupar toda a tela e definir a cor de fundo.
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Barra superior com gradiente verde.
  barraTopo: {
    // Ajusta a largura, altura mínima, alinhamento e padding da barra superior.
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Grupo esquerdo do topo com botão de voltar e boas-vindas.
  grupoEsquerdoTopo: {
    // Mantém a seta e o texto alinhados verticalmente.
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  // Botão de voltar com tamanho ajustável conforme a tela.
  botaoVoltar: {
    // Ajusta o tamanho do botão de voltar para ser consistente com a tela de agendamento.
    width: 32,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  // Texto da seta de voltar com tamanho ajustável conforme a tela.
  setaVoltar: {
    // Ajusta a cor, fonte, tamanho e alinhamento da seta de voltar.
    color: '#FFFFFF',
    fontSize: 38,
    lineHeight: 42,
    fontFamily: 'Poppins_300Light',
    includeFontPadding: false,
    textAlign: 'center',
  },

  // Mensagem de boas-vindas com tamanho ajustável conforme a largura da tela.
  boasVindas: {
    // Ajusta a cor, fonte e alinhamento da mensagem de boas-vindas.
    flex: 1,
    minWidth: 0,
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    includeFontPadding: false,
  },

  // Botão de perfil com o mesmo tamanho da tela de agendamento.
  botaoPerfil: {
    // Ajusta o tamanho do botão de perfil para ser consistente com a tela de agendamento.
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Imagem do perfil do usuário. 
  imagemPerfil: {
    // Ajusta a largura e altura da imagem do perfil para ocupar todo o espaço disponível.
    width: '100%',
    height: '100%',
  },

  // Área de rolagem com conteúdo centralizado e limitado.
  areaRolagem: {
    // Ajusta o conteúdo da rolagem para ocupar todo o espaço disponível e crescer conforme necessário.
    flex: 1,
    width: '100%',
  },

  // Container da rolagem com padding e alinhamento centralizado. 
  containerRolagem: {
    // Ajusta o conteúdo da rolagem para ocupar todo o espaço disponível, crescer conforme necessário e centralizar os itens.
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },

  // Conteúdo centralizado e limitado como na Home. 
  conteudo: {
    width: '100%',
    alignSelf: 'center',
  },

  // Título da seção de espaços reserváveis. 
  cartaoApresentacao: {
    // Ajusta a cor de fundo, borda arredondada e margem inferior do cartão.
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 18,
    marginBottom: 24,
  },

  // Subtítulo da apresentação. 
  subtituloApresentacao: {
    // Ajusta a cor, fonte, tamanho e alinhamento do subtítulo da apresentação.
    color: '#527D68',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 8,
  },

  // Título da apresentação com gradiente. 
  areaTitulo: {
    // Ajusta a altura do título e centraliza o texto.
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },

  // Título da apresentação com gradiente. 
  tituloApresentacao: {
    // Ajusta a cor, fonte, tamanho e alinhamento do título da apresentação.
    color: '#000000',
    fontFamily: 'Poppins_900Black',
    includeFontPadding: false,
  },

  // Gradiente do título. 
  gradienteTitulo: {
    // Ajusta o gradiente para ocupar todo o espaço do título.
    width: '100%',
    height: '100%',
  },

  // Descrição da apresentação. 
  descricaoApresentacao: {
    // Ajusta a cor, fonte, tamanho e altura da linha da descrição.
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 2,
  },

  // Título da seção de espaços reserváveis. 
  tituloSecao: {
    // Ajusta a cor, fonte, tamanho e alinhamento do título da seção.
    width: '100%',
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 16,
  },

  // Lista de espaços com flex-wrap para ajustar os itens. 
  listaLocais: {
    // Ajusta a largura, permite que os itens se ajustem e distribui o espaço entre eles.
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },

  // Cartão de cada local com bordas arredondadas e cor de fundo. 
  cartaoLocal: {
    // Ajusta a largura, alinhamento, cor de fundo, borda arredondada, padding e margem inferior do cartão.
    alignItems: 'center',
    backgroundColor: '#F3F6F2',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },

  // Imagem do local com bordas arredondadas e cor de fundo.
  imagemLocal: {
    // Ajusta a largura, altura, borda arredondada e cor de fundo da imagem do local.
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: '#EEF3EF',
    marginBottom: 10,
  },

  // Nome do local com fonte maior e em negrito para destaque.
  nomeLocal: {
    // Ajusta a largura, cor, fonte, tamanho e alinhamento do nome do local.
    width: '100%',
    color: '#527D68',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    textAlign: 'left',
    marginBottom: 6,
  },

  // Descrição do local com tamanho de fonte menor para melhor leitura.
  descricaoLocal: {
    // Ajusta a largura, cor, fonte, tamanho, altura da linha, alinhamento e margem inferior da descrição do local.
    width: '100%',
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'left',
    marginBottom: 12,
  },

  // Área do botão de agendamento.
  areaBotaoAgendar: {
    // Ajusta a largura do botão, arredonda os cantos e oculta o conteúdo que ultrapassa os limites.
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },

  // Botão de agendamento.
  botaoAgendar: {
    // Ajusta a altura mínima, o alinhamento e o preenchimento do botão.
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  // Texto do botão de agendamento.
  textoBotao: {
    // Ajusta a cor, fonte, tamanho e alinhamento do texto do botão.
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
  },
});