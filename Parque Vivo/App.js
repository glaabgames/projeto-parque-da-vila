
import React, { useState } from 'react';
import { View, StatusBar, Alert } from 'react-native';

// Endereço da API
const API_URL = 'https://desktop-oduq1rj.tailf60fff.ts.net';

// Importação das telas existentes
import BoasVindas from './screens/00-splash';
import LoginScreen from './screens/01-login';
import CadastroScreen from './screens/02-cadastro';
import HomeScreen from './screens/03-home';
import MapaScreen from './screens/04-mapa';
import ReservarScreen from './screens/05-reservar';
import HistoricoScreen from './screens/06-historico';
import AgendamentoScreen from './screens/07-agendamento';

export default function App() {

  // Controle das telas
  const [tela, setTela] = useState('splash');

  // Dados do usuário
  const [nomeUsuario, setNomeUsuario] = useState('');

  // Dados das reservas
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [reservas, setReservas] = useState([]);

  // Token de autenticação
  const [token, setToken] = useState('');


  // =====================================
  // LOGIN
  // =====================================

  const realizarLogin = async (email, senha) => {
    try {
      const resposta = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        Alert.alert(
          'Não foi possível entrar',
          dados.erro || dados.mensagem ||
          'Verifique seu e-mail e sua senha.'
        );
        return;
      }

      setToken(dados.token);

      const usuario = dados.usuario || dados.user || {};

      setNomeUsuario(usuario.nome || '');

      Alert.alert(
        'Sucesso',
        'Login realizado com sucesso!'
      );

      setTela('home');

    } catch (erro) {
      console.log('Erro no login:', erro);

      Alert.alert(
        'Erro de conexão',
        'Não foi possível conectar ao servidor.'
      );
    }
  };


  // =====================================
  // CADASTRO
  // =====================================

  const realizarCadastro = async (nome, email, senha) => {
    try {
      const resposta = await fetch(`${API_URL}/api/auth/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        Alert.alert(
          'Não foi possível cadastrar',
          dados.erro || dados.mensagem ||
          'Verifique os dados informados.'
        );
        return;
      }

      Alert.alert(
        'Cadastro realizado!',
        'Sua conta foi criada. Agora entre com seu e-mail e senha.'
      );

      setTela('login');

    } catch (erro) {
      console.log('Erro no cadastro:', erro);

      Alert.alert(
        'Erro de conexão',
        'Não foi possível conectar ao servidor.'
      );
    }
  };


  // =====================================
  // ABRIR AGENDAMENTO
  // =====================================

  const abrirAgendamentos = (espaco = null) => {

    // Aceita tanto um objeto quanto um nome de espaço
    const espacoFormatado =
      typeof espaco === 'string'
        ? { nome: espaco }
        : espaco;

    setLocalSelecionado(espacoFormatado);
    setTela('agendamento');
  };


  // =====================================
  // CONFIRMAR RESERVA
  // =====================================

  const confirmarReserva = (novaReserva) => {
    setReservas((listaAtual) => [
      ...listaAtual,
      novaReserva,
    ]);
  };


  // =====================================
  // INTERFACE DO APLICATIVO
  // =====================================

  return (
    <View style={{ flex: 1 }}>

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#EAF4E9"
      />


      {/* TELA DE BOAS-VINDAS */}

      {tela === 'splash' && (
        <BoasVindas
          onEntrar={() => setTela('login')}
        />
      )}


      {/* TELA DE LOGIN */}

      {tela === 'login' && (
        <LoginScreen
          onEntrar={realizarLogin}
          onIrCadastro={() => setTela('cadastro')}
        />
      )}


      {/* TELA DE CADASTRO */}

      {tela === 'cadastro' && (
        <CadastroScreen
          onCadastrar={realizarCadastro}
          onIrLogin={() => setTela('login')}
        />
      )}


      {/* TELA INICIAL */}

      {tela === 'home' && (
        <HomeScreen
          onExplorar={() => setTela('mapa')}
          onReservar={() => setTela('reservar')}
          onHistorico={() => setTela('historico')}
        />
      )}


      {/* TELA DO MAPA */}

      {tela === 'mapa' && (
        <MapaScreen
          onVoltar={() => setTela('home')}
          onReservar={() => setTela('reservar')}
        />
      )}


      {/* TELA DE RESERVAS */}

      {tela === 'reservar' && (
        <ReservarScreen
          onVoltar={() => setTela('home')}
          onExplorar={() => setTela('mapa')}
          onAgendar={(espaco) =>
            abrirAgendamentos(espaco)
          }
        />
      )}


      {/* HISTÓRICO DE RESERVAS */}

      {tela === 'historico' && (
        <HistoricoScreen
          reservas={reservas}
          nomeUsuario={nomeUsuario}
          onVoltar={() => setTela('home')}
        />
      )}


      {/* TELA DE AGENDAMENTO */}

      {tela === 'agendamento' && (
        <AgendamentoScreen
          localSelecionado={localSelecionado?.nome || ''}
          espacoId={localSelecionado?.id}
          nomeUsuario={nomeUsuario}
          token={token}

          onVoltar={() => setTela('reservar')}

          onReservaConfirmada={confirmarReserva}
        />
      )}

    </View>
  );
}