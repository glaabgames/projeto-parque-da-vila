/* Importação do React e dos recursos de animação */
import React, { useEffect, useRef } from 'react';

/* Importação dos componentes do React Native */
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Animated,
  TouchableOpacity,
} from 'react-native';

/* Importação da fonte Poppins */
import {
  useFonts,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

/* Criação da tela de abertura do aplicativo */
export default function SplashScreen({ onEntrar }) {
  /* Cria o valor inicial da animação da barra */
  const progresso = useRef(new Animated.Value(0)).current;

  /* Carrega a fonte Poppins em peso 700 */
  const [fontesCarregadas] = useFonts({
    Poppins_700Bold,
  });

  /* Inicia a animação da barra ao carregar a tela */
  useEffect(() => {
    Animated.timing(progresso, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start();
  }, [progresso]);

  /* Define a largura da barra durante a animação */
  const larguraBarra = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  /* Aguarda o carregamento da fonte */
  if (!fontesCarregadas) {
    return <View style={styles.container} />;
  }

  /* Estrutura visual da tela de abertura */
  return (
    <View style={styles.container}>
      {/* Oculta a barra de status do celular */}
      <StatusBar hidden />

      {/* Exibe a logomarca do Parque Vivo */}
      <View style={styles.areaLogo}>
        <Image
          source={require('../assets/parque-logomarca.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Logomarca do Parque Vivo"
        />
      </View>

      {/* Exibe o nome do aplicativo */}
      <Text style={styles.titulo}>
        Parque Vivo
      </Text>

      {/* Exibe a frase de apresentação */}
      <Text style={styles.subtitulo}>
        Um parque acessível para todo mundo.
      </Text>

      {/* Barra de carregamento animada */}
      <View style={styles.trilho}>
        <Animated.View
          style={[
            styles.barra,
            { width: larguraBarra },
          ]}
        />
      </View>

      {/* Botão para entrar no aplicativo */}
      <TouchableOpacity
        style={styles.botaoEntrar}
        onPress={onEntrar}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Entrar no aplicativo"
      >
        <Text style={styles.textoBotao}>
          Entrar ➜
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* Definição dos estilos da tela */
const styles = StyleSheet.create({
  /* Estilo geral da tela */
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  /* Área reservada para a logomarca */
  areaLogo: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 27,
  },

  /* Dimensões da logomarca */
  logo: {
    width: 90,
    height: 90,
  },

  /* Nome do aplicativo */
  titulo: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 29,
    textAlign: 'center',
    marginBottom: 3,
  },

  /* Frase de apresentação */
  subtitulo: {
    color: '#326B54',
    fontSize: 14,
    textAlign: 'center',
  },

  /* Fundo da barra de carregamento */
  trilho: {
    width: 72,
    height: 4,
    backgroundColor: '#326B54',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 35,
  },

  /* Parte preenchida da barra */
  barra: {
    height: '100%',
    backgroundColor: '#8AB59D',
    borderRadius: 10,
  },

  /* Aparência do botão Entrar */
  botaoEntrar: {
    marginTop: 35,
    minWidth: 150,
    paddingVertical: 13,
    paddingHorizontal: 28,
    backgroundColor: '#326B54',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Texto do botão */
  textoBotao: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    textAlign: 'center',
  },
});