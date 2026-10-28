// Tela de login do aplicativo:
import React, { useState } from 'react';

// Importa os componentes do React Native:
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Platform,
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

// Tela de login:
export default function LoginScreen({ onEntrar, onIrCadastro }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  // Dimensões da tela:
  const { width, height } = useWindowDimensions();
  const telaGrande = width >= 768;

  // Carrega as fontes:
  const [fontesCarregadas] = useFonts({
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_900Black,
  });

  // Mostra o alerta padrão:
  function mostrarAlerta(mensagem) {
    if (Platform.OS === 'web') {
      alert(mensagem);
    } else {
      Alert.alert('Atenção', mensagem);
    }
  }

  // Verifica os dados antes de entrar:
  function fazerLogin() {
    if (!email.trim().toLowerCase().endsWith('@gmail.com')) {
      mostrarAlerta(
        'Digite um e-mail válido para continuar.'
      );
      return;
    }

    // Verifica se a senha tem entre 6 e 20 caracteres:
    if (senha.length < 6 || senha.length > 20) {
      mostrarAlerta(
        'A senha deve conter entre 6 e 20 caracteres.'
      );
      return;
    }

    // Se os dados estiverem corretos, chama a função onEntrar:
    if (onEntrar) {
      onEntrar(email, senha);
    }
  }

  // Se as fontes não estiverem carregadas, retorna uma tela vazia:
  if (!fontesCarregadas) {
    return <View style={styles.container} />;
  }

  // Renderiza a tela de login:
  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          minHeight: height,
          paddingHorizontal: telaGrande ? 28 : 22,
          paddingVertical: 30,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.conteudo,
          { maxWidth: telaGrande ? 430 : 380 },
        ]}
      >
        {/* Título da tela de login com degradê */}
        <MaskedView
          style={{ width: telaGrande ? 330 : 300, height: 50 }}
          maskElement={
            <Text style={styles.titulo}>Login de usuário</Text>
          }
        >
          <LinearGradient
            colors={['#326B54', '#8AB59D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradiente}
          />
        </MaskedView>

        <Text style={styles.subtitulo}>
          Entre na sua conta para continuar.
        </Text>

        {/* Campos de login */}
        <View style={styles.blocoCampos}>
          <Text style={styles.rotulo}>E-mail:</Text>
        
          <TextInput
            style={styles.campo}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#7A887F"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.rotulo}>Senha:</Text>

          <TextInput
            style={styles.campo}
            placeholder="Digite sua senha"
            placeholderTextColor="#7A887F"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            maxLength={20}
          />
        </View>

        {/* Botão "Entrar" */}
        <TouchableOpacity
          onPress={fazerLogin}
          activeOpacity={0.8}
          style={styles.botaoArea}
        >
          <LinearGradient
            colors={['#326B54', '#8AB59D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.botao}
          >
            <Text style={styles.textoBotao}>Entrar</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Link para cadastrar-se */}
        <View style={styles.areaCadastro}>
          <Text style={styles.textoCadastro}>
            Ainda não tem uma conta?
          </Text>
          
          <TouchableOpacity onPress={onIrCadastro} activeOpacity={0.7}>
            <Text style={styles.linkCadastro}>Cadastre-se.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Estilos da tela:
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Conteúdo da tela:
  conteudo: {
    width: '100%',
    alignSelf: 'center',
  },

  // Título da tela de login:
  titulo: {
    fontFamily: 'Poppins_900Black',
    fontSize: 33,
    color: '#000000',
    textAlign: 'left',
    includeFontPadding: false,
  },

  // Gradiente do título:
  gradiente: {
    flex: 1,
  },

  // Subtítulo da tela de login:
  subtitulo: {
    color: '#527D68',
    fontFamily: 'Poppins_300Light',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 28,
    textAlign: 'left',
  },

  // Área dos campos de login:
  blocoCampos: {
    backgroundColor: '#EEF3EF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },

  // Rótulo dos campos de login:
  rotulo: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    marginBottom: 7,
  },

  // Campo de entrada de texto:
  campo: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5E1D9',
    borderRadius: 10,
    paddingHorizontal: 14,
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 14,
    marginBottom: 18,
  },

  // Área do botão "Entrar":
  botaoArea: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },

  // Botão "Entrar":
  botao: {
    minHeight: 52,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Texto do botão "Entrar":
  textoBotao: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
  },

  // Área do link para cadastro:
  areaCadastro: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 24,
  },

  // Texto do link para cadastro:
  textoCadastro: {
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 13,
  },

  // Link "Cadastre-se":
  linkCadastro: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    marginLeft: 5,
  },
});