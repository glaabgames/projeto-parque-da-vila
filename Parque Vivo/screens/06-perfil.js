
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  TextInput,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';

import {
  useFonts,
  Poppins_300Light,
  Poppins_700Bold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';

const API_URL = 'http://192.168.0.142:3000';

export default function PerfilScreen({
  nomeUsuario = '',
  emailUsuario = '',
  token = '',
  onVoltar,
  onAgendamentos,
  onPerfilAtualizado,
  onSair,
}) {
  const { width } = useWindowDimensions();
  const telaGrande = width >= 768;

  const [fontesCarregadas] = useFonts({
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_900Black,
  });

  const [nomeAtual, setNomeAtual] = useState(nomeUsuario);
  const [emailAtual, setEmailAtual] = useState(emailUsuario);

  const [nomeEditado, setNomeEditado] = useState(nomeUsuario);
  const [emailEditado, setEmailEditado] = useState(emailUsuario);

  const [editando, setEditando] = useState(false);
  const [alterandoSenha, setAlterandoSenha] = useState(false);

  const [salvando, setSalvando] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    setNomeAtual(nomeUsuario);
    setEmailAtual(emailUsuario);
    setNomeEditado(nomeUsuario);
    setEmailEditado(emailUsuario);
  }, [nomeUsuario, emailUsuario]);

  if (!fontesCarregadas) {
    return <View style={styles.fundo} />;
  }

  const nomeExibido = nomeAtual || 'Usuário do Parque Vivo';
  const emailExibido = emailAtual || 'E-mail não informado';

  const iniciais = nomeExibido
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('');

  function mostrarAlerta(titulo, mensagem) {
    Alert.alert(titulo, mensagem);
  }

  function abrirEdicao() {
    setNomeEditado(nomeAtual);
    setEmailEditado(emailAtual);
    setEditando(!editando);
  }

  function abrirAlteracaoSenha() {
    if (alterandoSenha) {
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    }

    setAlterandoSenha(!alterandoSenha);
  }

  async function salvarPerfil() {
    const nome = nomeEditado.trim();
    const email = emailEditado.trim().toLowerCase();

    if (!nome || !email) {
      mostrarAlerta('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (nome.split(/\s+/).length < 2) {
      mostrarAlerta('Atenção', 'Informe seu nome completo.');
      return;
    }

    if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
      mostrarAlerta('Atenção', 'Utilize um endereço Gmail válido.');
      return;
    }

    if (!token) {
      mostrarAlerta(
        'Erro',
        'Sua sessão não foi identificada. Faça login novamente.'
      );
      return;
    }

    try {
      setSalvando(true);

      const resposta = await fetch(`${API_URL}/api/auth/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          email,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || 'Não foi possível atualizar o perfil.'
        );
      }

      setNomeAtual(dados.usuario.nome);
      setEmailAtual(dados.usuario.email);
      setNomeEditado(dados.usuario.nome);
      setEmailEditado(dados.usuario.email);

      if (onPerfilAtualizado) {
        onPerfilAtualizado(dados.usuario);
      }

      setEditando(false);

      mostrarAlerta(
        'Sucesso',
        'Seus dados foram atualizados com sucesso!'
      );

    } catch (erro) {
      mostrarAlerta('Erro', erro.message);
    } finally {
      setSalvando(false);
    }
  }

  async function salvarSenha() {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      mostrarAlerta('Atenção', 'Preencha todos os campos de senha.');
      return;
    }

    if (novaSenha.length < 6 || novaSenha.length > 20) {
      mostrarAlerta(
        'Atenção',
        'A nova senha deve ter entre 6 e 20 caracteres.'
      );
      return;
    }

    if (novaSenha !== confirmarSenha) {
      mostrarAlerta(
        'Atenção',
        'A confirmação da nova senha não corresponde.'
      );
      return;
    }

    if (senhaAtual === novaSenha) {
      mostrarAlerta(
        'Atenção',
        'A nova senha deve ser diferente da senha atual.'
      );
      return;
    }

    if (!token) {
      mostrarAlerta(
        'Erro',
        'Sua sessão não foi identificada. Faça login novamente.'
      );
      return;
    }

    try {
      setSalvandoSenha(true);

      const resposta = await fetch(`${API_URL}/api/auth/senha`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senhaAtual,
          novaSenha,
          confirmarSenha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || 'Não foi possível alterar sua senha.'
        );
      }

      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      setAlterandoSenha(false);

      mostrarAlerta(
        'Sucesso',
        dados.mensagem || 'Senha alterada com sucesso!'
      );

    } catch (erro) {
      mostrarAlerta('Erro', erro.message);
    } finally {
      setSalvandoSenha(false);
    }
  }

  function confirmarSaida() {
    if (Platform.OS === 'web') {
      const confirmou = window.confirm(
        'Deseja realmente sair da sua conta?'
      );

      if (confirmou && onSair) {
        onSair();
      }

      return;
    }

    Alert.alert(
      'Sair da conta',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: onSair,
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.fundo}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#326B54"
      />

      {/* CABEÇALHO */}
      <View style={styles.cabecalho}>
        <TouchableOpacity
          onPress={onVoltar}
          style={styles.botaoVoltar}
          activeOpacity={0.7}
        >
          <Text style={styles.textoVoltar}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.tituloCabecalho}>
          Meu perfil
        </Text>

        <View style={styles.espacoCabecalho} />

        <View style={styles.areaUsuario}>
          <View style={styles.avatar}>
            <Text style={styles.iniciais}>
              {iniciais || 'U'}
            </Text>
          </View>

          <Text style={styles.nomeUsuario} numberOfLines={2}>
            {nomeExibido}
          </Text>

          <Text style={styles.emailUsuario} numberOfLines={1}>
            {emailExibido}
          </Text>
        </View>
      </View>

      {/* CONTEÚDO */}
      <ScrollView
        contentContainerStyle={[
          styles.conteudo,
          {
            paddingHorizontal: telaGrande ? 28 : 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.containerInterno}>

          <Text style={styles.tituloSecao}>
            Informações da conta
          </Text>

          {/* DADOS DO USUÁRIO */}
          <View style={styles.cartao}>
            <Text style={styles.rotulo}>Nome completo</Text>
            <Text style={styles.valor}>{nomeExibido}</Text>

            <View style={styles.divisor} />

            <Text style={styles.rotulo}>E-mail cadastrado</Text>
            <Text style={styles.valor}>{emailExibido}</Text>
          </View>

          {/* BOTÃO EDITAR */}
          <TouchableOpacity
            style={styles.botaoEditar}
            activeOpacity={0.8}
            onPress={abrirEdicao}
          >
            <View style={styles.gradienteBotao}>
              <Text style={styles.textoBotaoEditar}>
                {editando ? 'Cancelar edição' : '✎  Editar meus dados'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* FORMULÁRIO DE EDIÇÃO */}
          {editando && (
            <View style={styles.formulario}>
              <Text style={styles.tituloSecao}>
                Editar informações
              </Text>

              <Text style={styles.rotuloFormulario}>
                Nome completo
              </Text>

              <TextInput
                style={styles.input}
                value={nomeEditado}
                onChangeText={setNomeEditado}
                placeholder="Digite seu nome completo"
                placeholderTextColor="#8A9B90"
                autoCapitalize="words"
              />

              <Text style={styles.rotuloFormulario}>
                E-mail Gmail
              </Text>

              <TextInput
                style={styles.input}
                value={emailEditado}
                onChangeText={setEmailEditado}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#8A9B90"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={[
                  styles.botaoSalvar,
                  salvando && styles.botaoDesativado,
                ]}
                onPress={salvarPerfil}
                disabled={salvando}
                activeOpacity={0.8}
              >
                {salvando ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.textoBotaoSalvar}>
                    Salvar alterações
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* ALTERAÇÃO DE SENHA */}
          <TouchableOpacity
            style={styles.botaoEditar}
            activeOpacity={0.8}
            onPress={abrirAlteracaoSenha}
          >
            <View style={styles.gradienteBotao}>
              <Text style={styles.textoBotaoEditar}>
                {alterandoSenha ? 'Cancelar alteração' : '🔒  Alterar minha senha'}
              </Text>
            </View>
          </TouchableOpacity>

          {alterandoSenha && (
            <View style={styles.formulario}>
              <Text style={styles.tituloSecao}>
                Alterar senha
              </Text>

              <Text style={styles.rotuloFormulario}>
                Senha atual
              </Text>

              <TextInput
                style={styles.input}
                value={senhaAtual}
                onChangeText={setSenhaAtual}
                placeholder="Digite sua senha atual"
                placeholderTextColor="#8A9B90"
                secureTextEntry
                autoCapitalize="none"
              />

              <Text style={styles.rotuloFormulario}>
                Nova senha
              </Text>

              <TextInput
                style={styles.input}
                value={novaSenha}
                onChangeText={setNovaSenha}
                placeholder="Digite a nova senha"
                placeholderTextColor="#8A9B90"
                secureTextEntry
                autoCapitalize="none"
              />

              <Text style={styles.rotuloFormulario}>
                Confirmar nova senha
              </Text>

              <TextInput
                style={styles.input}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                placeholder="Digite novamente a nova senha"
                placeholderTextColor="#8A9B90"
                secureTextEntry
                autoCapitalize="none"
              />

              <Text style={styles.dicaSenha}>
                A senha deve ter entre 6 e 20 caracteres.
              </Text>

              <TouchableOpacity
                style={[
                  styles.botaoSalvar,
                  salvandoSenha && styles.botaoDesativado,
                ]}
                onPress={salvarSenha}
                disabled={salvandoSenha}
                activeOpacity={0.8}
              >
                {salvandoSenha ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.textoBotaoSalvar}>
                    Salvar nova senha
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* MINHA ÁREA */}
          <Text style={styles.tituloSecao}>
            Minha área
          </Text>

          <TouchableOpacity
            style={styles.opcao}
            onPress={onAgendamentos}
            activeOpacity={0.7}
          >
            <Text style={styles.iconeOpcao}>▦</Text>

            <View style={styles.textosOpcao}>
              <Text style={styles.tituloOpcao}>
                Meus agendamentos
              </Text>

              <Text style={styles.descricaoOpcao}>
                Consulte suas reservas e cancelamentos.
              </Text>
            </View>

            <Text style={styles.seta}>›</Text>
          </TouchableOpacity>

          {/* SAIR */}
          <TouchableOpacity
            style={styles.opcaoSair}
            onPress={confirmarSaida}
            activeOpacity={0.7}
          >
            <Text style={styles.iconeSair}>⇥</Text>

            <Text style={styles.textoSair}>
              Sair da conta
            </Text>
          </TouchableOpacity>

          {/* RODAPÉ */}
          <View style={styles.rodape}>
            <Text style={styles.nomeProjeto}>
              PARQUE VIVO
            </Text>

            <Text style={styles.fraseProjeto}>
              Conectando você à natureza.
            </Text>
          </View>

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

  cabecalho: {
    backgroundColor: '#326B54',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 25,
  },

  botaoVoltar: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },

  textoVoltar: {
    color: '#FFFFFF',
    fontSize: 36,
    lineHeight: 40,
  },

  tituloCabecalho: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 22 : 18,
    alignSelf: 'center',
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },

  espacoCabecalho: {
    height: 8,
  },

  areaUsuario: {
    alignItems: 'center',
    marginTop: 12,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EAF4E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 10,
  },

  iniciais: {
    color: '#326B54',
    fontFamily: 'Poppins_900Black',
    fontSize: 30,
  },

  nomeUsuario: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    textAlign: 'center',
  },

  emailUsuario: {
    color: '#EAF4E9',
    fontFamily: 'Poppins_300Light',
    fontSize: 13,
    marginTop: 3,
  },

  conteudo: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 35,
  },

  containerInterno: {
    width: '100%',
    maxWidth: 600,
  },

  tituloSecao: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
    marginBottom: 12,
    marginTop: 8,
  },

  cartao: {
    backgroundColor: '#F3F6F2',
    borderRadius: 15,
    padding: 18,
  },

  rotulo: {
    color: '#527D68',
    fontFamily: 'Poppins_300Light',
    fontSize: 12,
    marginBottom: 4,
  },

  valor: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
  },

  divisor: {
    height: 1,
    backgroundColor: '#DCE7DE',
    marginVertical: 14,
  },

  botaoEditar: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 15,
    marginBottom: 25,
  },

  gradienteBotao: {
    minHeight: 50,
    backgroundColor: '#326B54',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoBotaoEditar: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
  },

  formulario: {
    backgroundColor: '#F3F6F2',
    borderRadius: 15,
    padding: 18,
    marginBottom: 25,
  },

  rotuloFormulario: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE7DE',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 12,
    color: '#326B54',
    fontFamily: 'Poppins_300Light',
    fontSize: 13,
  },

  dicaSenha: {
    color: '#527D68',
    fontFamily: 'Poppins_300Light',
    fontSize: 11,
    marginTop: 10,
  },

  botaoSalvar: {
    backgroundColor: '#326B54',
    minHeight: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  botaoDesativado: {
    opacity: 0.6,
  },

  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
  },

  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F6F2',
    padding: 16,
    borderRadius: 14,
  },

  iconeOpcao: {
    color: '#326B54',
    fontSize: 27,
    marginRight: 14,
  },

  textosOpcao: {
    flex: 1,
  },

  tituloOpcao: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
  },

  descricaoOpcao: {
    color: '#527D68',
    fontFamily: 'Poppins_300Light',
    fontSize: 11,
    marginTop: 3,
  },

  seta: {
    color: '#527D68',
    fontSize: 28,
  },

  opcaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 12,
  },

  iconeSair: {
    color: '#B34B4B',
    fontSize: 25,
    marginRight: 14,
  },

  textoSair: {
    color: '#B34B4B',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
  },

  rodape: {
    alignItems: 'center',
    marginTop: 30,
  },

  nomeProjeto: {
    color: '#326B54',
    fontFamily: 'Poppins_900Black',
    fontSize: 13,
  },

  fraseProjeto: {
    color: '#527D68',
    fontFamily: 'Poppins_300Light',
    fontSize: 11,
    marginTop: 3,
  },
});

