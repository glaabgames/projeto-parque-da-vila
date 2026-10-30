
import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';

// Importa as telas do aplicativo.
import BoasVindas from './screens/00-splash';
import LoginScreen from './screens/01-login';
import CadastroScreen from './screens/02-cadastro';
import HomeScreen from './screens/03-home';
import MapaScreen from './screens/04-mapa';
import ReservarScreen from './screens/05-reservar';
import PerfilScreen from './screens/06-perfil';
import AgendamentoScreen from './screens/07-agendamento';

// Componente principal do aplicativo.
export default function App() {
  const [tela, setTela] = useState('splash');

  // Guarda os dados necessários para a navegação.
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [localSelecionado, setLocalSelecionado] = useState('');

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#EAF4E9"
      />

      {/* Tela de apresentação */}
      {tela === 'splash' && (
        <BoasVindas
          onEntrar={() => setTela('login')}
        />
      )}

      {/* Tela de login */}
      {tela === 'login' && (
        <LoginScreen
          onEntrar={(email, senha) => {
            console.log('E-mail informado:', email);
            setTela('home');
          }}
          onIrCadastro={() => setTela('cadastro')}
        />
      )}

      {/* Tela de cadastro */}
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

      {/* Tela inicial */}
      {tela === 'home' && (
        <HomeScreen
          onExplorar={() => setTela('mapa')}
          onReservar={() => setTela('reservar')}
          onPerfil={() => setTela('perfil')}
        />
      )}

      {/* Tela do mapa */}
      {tela === 'mapa' && (
        <MapaScreen
          onVoltar={() => setTela('home')}
          onReservar={() => setTela('reservar')}
          onPerfil={() => setTela('perfil')}
        />
      )}

      {/* Tela de reservas */}
      {tela === 'reservar' && (
        <ReservarScreen
          onVoltar={() => setTela('home')}
          onExplorar={() => setTela('mapa')}
          onPerfil={() => setTela('perfil')}
          onAgendar={(nomeLocal) => {
            setLocalSelecionado(nomeLocal);
            setTela('agendamento');
          }}
        />
      )}

      {/* Tela de agendamento */}
      {tela === 'agendamento' && (
        <AgendamentoScreen
          localSelecionado={localSelecionado}
          nomeUsuario={nomeUsuario}
          onVoltar={() => setTela('reservar')}
          onPerfil={() => setTela('perfil')}
        />
      )}

      {/* Tela de perfil */}
      {tela === 'perfil' && (
        <PerfilScreen
          onVoltar={() => setTela('home')}
          onExplorar={() => setTela('mapa')}
          onReservar={() => setTela('reservar')}
        />
      )}
    </View>
  );
}