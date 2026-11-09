// Importa as bibliotecas necessárias:
import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';

// Importa as telas do aplicativo:
import BoasVindas from './screens/00-splash';
import LoginScreen from './screens/01-login';
import CadastroScreen from './screens/02-cadastro';
import HomeScreen from './screens/03-home';
import MapaScreen from './screens/04-mapa';
import ReservarScreen from './screens/05-reservar';
import HistoricoScreen from './screens/06-historico.js';
import AgendamentoScreen from './screens/07-agendamento';

// Componente principal do aplicativo:
export default function App() {
  // Estado para controlar qual tela está sendo exibida:
  const [tela, setTela] = useState('splash');

  // Guarda o nome do usuário:
  const [nomeUsuario, setNomeUsuario] = useState('');

  // Armazena o local selecionado:
  const [localSelecionado, setLocalSelecionado] = useState('');

  // Armazena todas as reservas realizadas:
  const [reservas, setReservas] = useState([]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#EAF4E9"
      />

      {/* Tela de boas-vindas: */}
      {tela === 'splash' && (
        <BoasVindas
          onEntrar={() => setTela('login')}
        />
      )}

      {/* Tela de login: */}
      {tela === 'login' && (
        <LoginScreen
          onEntrar={(email, senha) => {
            console.log('E-mail informado:', email);
            setTela('home');
          }}
          onIrCadastro={() => setTela('cadastro')}
        />
      )}

      {/* Tela de cadastro: */}
      {tela === 'cadastro' && (
        <CadastroScreen
          onCadastrar={(nome, email, senha) => {
            setNomeUsuario(nome);
            console.log('Cadastro solicitado:', nome, email);
            setTela('home');
          }}
          onIrLogin={() => setTela('login')}
        />
      )}

      {/* Tela inicial: */}
      {tela === 'home' && (
        <HomeScreen
          onExplorar={() => setTela('mapa')}
          onReservar={() => setTela('reservar')}
          onHistorico={() => setTela('historico')}
        />
      )}

      {/* Tela do mapa: */}
      {tela === 'mapa' && (
        <MapaScreen
          onVoltar={() => setTela('home')}
          onReservar={() => setTela('reservar')}
        />
      )}

      {/* Tela de reservas: */}
      {tela === 'reservar' && (
        <ReservarScreen
          onVoltar={() => setTela('home')}
          onExplorar={() => setTela('mapa')}
          onAgendar={(nomeLocal) => {
            setLocalSelecionado(nomeLocal);
            setTela('agendamento');
          }}
        />
      )}

      {/* Tela de histórico de reservas: */}
      {tela === 'historico' && (
        <HistoricoScreen
          reservas={reservas}
          nomeUsuario={nomeUsuario}
          onVoltar={() => setTela('home')}
        />
      )}

      {/* Tela de agendamento: */}
      {tela === 'agendamento' && (
        <AgendamentoScreen
          localSelecionado={localSelecionado}
          nomeUsuario={nomeUsuario}
          onVoltar={() => setTela('reservar')}
          onReservaConfirmada={(novaReserva) => {
            setReservas((listaAtual) => [
              ...listaAtual,
              novaReserva,
            ]);
          }}
        />
      )}
    </View>
  );
}