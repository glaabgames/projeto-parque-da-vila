
import React, { useState, useEffect } from 'react';

import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, useWindowDimensions, SafeAreaView,
  Platform, StatusBar, Alert,
} from 'react-native';

import {
  useFonts,
  Poppins_300Light,
  Poppins_700Bold,
  Poppins_900Black
} from '@expo-google-fonts/poppins';

import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const API_URL = 'http://192.168.0.142:3000';

export default function ReservarScreen({
  onPerfil,
  onAgendar,
  onVoltar,
}) {
  const { width } = useWindowDimensions();

  const telaGrande = width >= 768;
  const celularEstreito = width < 360;

  const tamanhoTitulo = telaGrande ? 32 : celularEstreito ? 25 : 29;
  const tamanhoBoasVindas = telaGrande ? 19 : celularEstreito ? 12 : 14;

  const [fontesCarregadas] = useFonts({
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_900Black,
  });

  const [locais, setLocais] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Busca os espaços esportivos cadastrados no banco.
  useEffect(() => {
    async function buscarEspacos() {
      try {
        const resposta = await fetch(`${API_URL}/api/quadras`);
        const dados = await resposta.json();

        console.log('STATUS DA API:', resposta.status);
        console.log('DADOS DA API:', dados);

        if (!resposta.ok) {
          throw new Error(dados.erro || 'Não foi possível carregar os espaços.');
        }

        // Relaciona cada espaço com sua imagem.
        const imagens = {
          'Quadra de Futsal': require('../assets/parque-quadra-futebol.png'),
          'Quadra de Vôlei': require('../assets/parque-quadra-volei.png'),
          'Quadra de Areia': require('../assets/parque-quadra-volei.png'),
        };

        const espacosFormatados = dados.map((espaco) => ({
          id: espaco.id,
          nome: espaco.nome,
          imagem: imagens[espaco.nome] || require('../assets/campo-futebol.png'),
        }));

        setLocais(espacosFormatados);

      } catch (erro) {
        console.log('Erro ao carregar espaços:', erro);
        Alert.alert(
          'Erro',
          'Não foi possível carregar os espaços esportivos. Verifique se o servidor está ligado.'
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarEspacos();
  }, []);

  function agendarLocal(local) {
    onAgendar({
      id: local.id,
      nome: local.nome,
    });
  }

  if (!fontesCarregadas) {
    return <View style={styles.fundo} />;
  }

  return (
    <SafeAreaView style={styles.fundo}>
      {Platform.OS === 'android' && (
        <View style={{ height: StatusBar.currentHeight || 24 }} />
      )}

      <StatusBar barStyle="light-content" backgroundColor="#326B54" />

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
          >
            <Text style={styles.flechaVoltar}>‹</Text>
          </TouchableOpacity>

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
          styles.containerRolagem,
          { paddingHorizontal: telaGrande ? 28 : 16 },
        ]}
        showsVerticalScrollIndicator
      >
        <View style={[styles.conteudo, { maxWidth: telaGrande ? 760 : 480 }]}>
          <View style={styles.cartaoApresentacao}>
            <Text style={styles.subtituloApresentacao}>
              Aproveite, faça sua reserva.
            </Text>

            <MaskedView
              style={styles.areaTitulo}
              maskElement={
                <Text style={styles.tituloApresentacao}>
                  Escolha seu espaço!
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
              Selecione o espaço esportivo que deseja reservar.
            </Text>
          </View>

          <Text style={styles.tituloSecao}>
            Espaços esportivos disponíveis
          </Text>

          {carregando ? (
            <Text style={styles.textoCarregando}>
              Carregando espaços...
            </Text>
          ) : locais.length === 0 ? (
            <Text style={styles.textoCarregando}>
              Nenhum espaço esportivo encontrado.
            </Text>
          ) : (
            locais.map((local) => (
              <TouchableOpacity
                key={local.id}
                style={styles.cartaoLocal}
                activeOpacity={0.85}
                onPress={() => agendarLocal(local)}
              >
                <Image
                  source={local.imagem}
                  style={styles.imagemLocal}
                  resizeMode="cover"
                />

                <View style={styles.informacoesLocal}>
                  <Text style={styles.nomeLocal}>
                    {local.nome}
                  </Text>

                  <Text style={styles.descricaoLocal}>
                    Reserva com duração de 1 hora.
                  </Text>

                  <Text style={styles.textoSelecionar}>
                    Reservar espaço →
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
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

  grupoEsquerdoTopo: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  botaoVoltar: {
    width: 32,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  flechaVoltar: {
    color: '#FFFFFF',
    fontSize: 38,
    lineHeight: 42,
    fontFamily: 'Poppins_300Light',
    includeFontPadding: false,
    textAlign: 'center',
  },

  boasVindas: {
    flex: 1,
    minWidth: 0,
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

  containerRolagem: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 28,
  },

  conteudo: {
    width: '100%',
    alignSelf: 'center',
  },

  cartaoApresentacao: {
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 18,
    marginBottom: 22,
    padding: 18,
  },

  subtituloApresentacao: {
    color: '#527D68',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 5,
  },

  areaTitulo: {
    width: '100%',
    height: 42,
    justifyContent: 'flex-start',
    marginBottom: 5,
  },

  tituloApresentacao: {
    color: '#000000',
    fontFamily: 'Poppins_900Black',
    fontSize: 25,
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
    lineHeight: 22,
  },

  tituloSecao: {
    width: '100%',
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 12,
  },

  textoCarregando: {
    width: '100%',
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 14,
    padding: 16,
  },

  cartaoLocal: {
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DCE7DE',
  },

  imagemLocal: {
    width: '100%',
    height: 165,
  },

  informacoesLocal: {
    padding: 16,
  },

  nomeLocal: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
    marginBottom: 5,
  },

  descricaoLocal: {
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 13,
    marginBottom: 10,
  },

  textoSelecionar: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
  },
});
