// Tela de cadastro do aplicativo:
import React, { useState } from 'react';
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
import MaskedView from '@react-native-masked-view/masked-view';

// Tela de cadastro:
export default function CadastroScreen({ onCadastrar, onIrLogin }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Dimensões da tela:
  const { width, height } = useWindowDimensions();
  const telaGrande = width >= 768;

  // Carrega as fontes:
  const [fontesCarregadas] = useFonts({
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_900Black,
  });

  // Exibe alertas na web e no celular:
  function mostrarAlerta(mensagem) {
    if (Platform.OS === 'web') {
      alert(mensagem);
    } else {
      Alert.alert('Atenção', mensagem);
    }
  }

  // Valida os dados do cadastro:
  function fazerCadastro() {
    // Validações do cadastro:
    if (nome.trim().split(/\s+/).length < 2) {
      mostrarAlerta('Informe seu nome completo.');
      return;
    }
    // Valida o e-mail com regex para aceitar apenas e-mails do Gmail:
    if (!/^[^\s@]+@gmail\.com$/i.test(email.trim())) {
      mostrarAlerta('Digite um e-mail válido com final @gmail.com.');
      return;
    }
    // Valida a senha para ter entre 6 e 20 caracteres:
    if (senha.length < 6 || senha.length > 20) {
      mostrarAlerta('A senha deve conter entre 6 e 20 caracteres.');
      return;
    }
    // Valida se a senha e a confirmação de senha são iguais:
    if (senha !== confirmarSenha) {
      mostrarAlerta('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    // Envia os dados para o App.js:
    if (onCadastrar) {
      onCadastrar(nome.trim(), email.trim(), senha);
    }
  }

  // Aguarda o carregamento das fontes:
  if (!fontesCarregadas) {
    return <View style={styles.container} />;
  }
  // Renderiza a tela de cadastro:
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
        {/* Título com gradiente: */}
        <MaskedView
          style={{
            width: telaGrande ? 350 : 320,
            height: 50,
          }}
          maskElement={
            <Text style={styles.titulo}>Cadastro de usuário</Text>
          }
        >
          <LinearGradient
            colors={['#326B54', '#8AB59D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradiente}
          />
        </MaskedView>

        {/* Subtítulo: */}
        <Text style={styles.subtitulo}>
          Cadastre-se para continuar.
        </Text>

        {/* Caixa dos campos: */}
        <View style={styles.blocoCampos}>
          <Text style={styles.rotulo}>Nome completo:</Text>

          <TextInput
            style={styles.campo}
            placeholder="Digite seu nome completo"
            placeholderTextColor="#7A887F"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            autoCorrect={false}
          />

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
            placeholder="Crie uma senha"
            placeholderTextColor="#7A887F"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
            maxLength={20}
          />

          <Text style={styles.rotulo}>Confirmar senha:</Text>

          <TextInput
            style={[styles.campo, styles.ultimoCampo]}
            placeholder="Digite a senha novamente"
            placeholderTextColor="#7A887F"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
            autoCapitalize="none"
            maxLength={20}
          />
        </View>

        {/* Botão Cadastrar: */}
        <TouchableOpacity
          onPress={fazerCadastro}
          activeOpacity={0.8}
          style={styles.botaoArea}
        >
          <LinearGradient
            colors={['#326B54', '#8AB59D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.botao}
          >
            <Text style={styles.textoBotao}>Cadastrar</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Link para voltar ao login: */}
        <View style={styles.areaLogin}>
          <Text style={styles.textoLogin}>
            Já tem uma conta?
          </Text>

          <TouchableOpacity
            onPress={onIrLogin}
            activeOpacity={0.7}
          >
            <Text style={styles.linkLogin}>Entrar.</Text>
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

  // Conteúdos da tela:
  conteudo: {
    width: '100%',
    alignSelf: 'center',
  },

  // Título:
  titulo: {
    fontFamily: 'Poppins_900Black',
    fontSize: 29,
    color: '#000000',
    textAlign: 'left',
    includeFontPadding: false,
  },

  // Gradiente do título:
  gradiente: {
    flex: 1,
  },

  // Subtítulo:
  subtitulo: {
    color: '#527D68',
    fontFamily: 'Poppins_300Light',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 28,
    textAlign: 'left',
  },

  // Caixa dos campos:
  blocoCampos: {
    backgroundColor: '#EEF3EF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },

  // Rótulo dos campos:
  rotulo: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    marginBottom: 7,
  },

  // Campos de entrada:
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

  // Último campo de entrada:
  ultimoCampo: {
    marginBottom: 0,
  },

  // Área do botão:
  botaoArea: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },

  // Botão Cadastrar:
  botao: {
    minHeight: 52,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Texto do botão "Cadastrar":
  textoBotao: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
  },

  // Área do link para a tela de login:
  areaLogin: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 24,
  },

  // Texto do link para a tela de login:
  textoLogin: {
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 13,
  },

  // Link para a tela de login:
  linkLogin: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    marginLeft: 5,
  },
});