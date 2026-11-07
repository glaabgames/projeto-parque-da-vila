
import React, { useState } from 'react';
import { View, StatusBar, Alert } from 'react-native';

const API_URL = 'https://desktop-oduq1rj.tailf60fff.ts.net';

import BoasVindas from './screens/00-splash';
import LoginScreen from './screens/01-login';
import CadastroScreen from './screens/02-cadastro';
import HomeScreen from './screens/03-home';
import MapaScreen from './screens/04-mapa';
import ReservarScreen from './screens/05-reservar';
import PerfilScreen from './screens/06-perfil';
import AgendamentoScreen from './screens/07-agendamento';

export default function App() {
  const [tela, setTela] = useState('splash');

  const [nomeUsuario, setNomeUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [token, setToken] = useState('');
  const [origemAgendamento, setOrigemAgendamento] = useState('reservar');

  // LOGIN
  const realizarLogin = async (email, senha) => {
    try {
      const resposta = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        Alert.alert(
          'Não foi possível entrar',
          dados.erro || dados.mensagem || 'Verifique seu e-mail e sua senha.'
        );
        return;
      }

      setToken(dados.token);

      const usuario = dados.usuario || dados.user || {};

      setNomeUsuario(usuario.nome || '');
      setEmailUsuario(usuario.email || email);

      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      setTela('home');

    } catch (erro) {
      console.log('Erro no login:', erro);
      Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor.');
    }
  };

  // CADASTRO
  const realizarCadastro = async (nome, email, senha) => {
    try {
      const resposta = await fetch(`${API_URL}/api/auth/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        Alert.alert(
          'Não foi possível cadastrar',
          dados.erro || dados.mensagem || 'Verifique os dados informados.'
        );
        return;
      }

      setNomeUsuario(nome);
      setEmailUsuario(email);

      Alert.alert(
        'Cadastro realizado!',
        'Sua conta foi criada. Agora entre com seu e-mail e senha.'
      );

      setTela('login');

    } catch (erro) {
      console.log('Erro no cadastro:', erro);
      Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor.');
    }
  };

  // ABRIR AGENDAMENTOS
  const abrirAgendamentos = (origem, espaco = null) => {
    setOrigemAgendamento(origem);
    setLocalSelecionado(espaco);
    setTela('agendamento');
  };

  // ATUALIZAR DADOS DO PERFIL
  const atualizarPerfil = (usuario) => {
    setNomeUsuario(usuario.nome);
    setEmailUsuario(usuario.email);
  };

  // SAIR DA CONTA
  const sairDaConta = () => {
    setToken('');
    setNomeUsuario('');
    setEmailUsuario('');
    setLocalSelecionado(null);
    setOrigemAgendamento('reservar');
    setTela('login');
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#EAF4E9" />

      {tela === 'splash' && (
        <BoasVindas onEntrar={() => setTela('login')} />
      )}

      {tela === 'login' && (
        <LoginScreen
          onEntrar={realizarLogin}
          onIrCadastro={() => setTela('cadastro')}
        />
      )}

      {tela === 'cadastro' && (
        <CadastroScreen
          onCadastrar={realizarCadastro}
          onIrLogin={() => setTela('login')}
        />
      )}

      {tela === 'home' && (
        <HomeScreen
          onExplorar={() => setTela('mapa')}
          onReservar={() => setTela('reservar')}
          onPerfil={() => setTela('perfil')}
        />
      )}

      {tela === 'mapa' && (
        <MapaScreen
          onVoltar={() => setTela('home')}
          onReservar={() => setTela('reservar')}
          onPerfil={() => setTela('perfil')}
        />
      )}

      {tela === 'reservar' && (
        <ReservarScreen
          onVoltar={() => setTela('home')}
          onExplorar={() => setTela('mapa')}
          onPerfil={() => setTela('perfil')}
          onAgendar={(espaco) => abrirAgendamentos('reservar', espaco)}
        />
      )}

      {tela === 'agendamento' && (
        <AgendamentoScreen
          localSelecionado={localSelecionado?.nome || ''}
          espacoId={localSelecionado?.id}
          nomeUsuario={nomeUsuario}
          token={token}
          onVoltar={() => {
            if (origemAgendamento === 'perfil') {
              setTela('perfil');
            } else {
              setTela('reservar');
            }
          }}
          onPerfil={() => setTela('perfil')}
        />
      )}

      {tela === 'perfil' && (
        <PerfilScreen
          nomeUsuario={nomeUsuario}
          emailUsuario={emailUsuario}
          token={token}
          onPerfilAtualizado={atualizarPerfil}
          onVoltar={() => setTela('home')}
          onAgendamentos={() => abrirAgendamentos('perfil')}
          onSair={sairDaConta}
        />
      )}
    </View>
  );
}
