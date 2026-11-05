// Importa os componentes do React Native:
import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';

// Importa as telas do aplicativo:
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
  // Estado para controlar qual tela está sendo exibida.
  const [tela, setTela] = useState('splash');

  // Guarda os dados necessários para a navegação.
  const [nomeUsuario, setNomeUsuario] = useState('');
  // Estado para armazenar o local selecionado na tela de reservas.
  const [localSelecionado, setLocalSelecionado] = useState('');
  // Renderiza o aplicativo com base na tela atual.
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
        // Função para lidar com o login do usuário. Recebe email e senha.
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
        // Função para lidar com o cadastro do usuário. Recebe nome, email e senha.
          onCadastrar={(nome, email, senha) => {
            setNomeUsuario(nome);
            // Aqui você pode adicionar lógica para salvar os dados do usuário, se necessário.
            console.log('Cadastro solicitado:', nome, email);
            // Após o cadastro, você pode redirecionar para a tela de login ou para a tela inicial.
            setTela('home');
          }}
          onIrLogin={() => setTela('login')}
        />
      )}

      {/* Tela de início: */}
      {tela === 'home' && (
        <HomeScreen
        // Funções para navegar entre as telas do aplicativo.
          onExplorar={() => setTela('mapa')}
          onReservar={() => setTela('reservar')}
          onPerfil={() => setTela('perfil')}
          onAgendamento={() => setTela('agendamento')}
        />
      )}

      {/* Tela do mapa: */}
      {tela === 'mapa' && (
        <MapaScreen
        // Funções para navegar entre as telas do aplicativo.
          onVoltar={() => setTela('home')}
          onReservar={() => setTela('reservar')}
          onPerfil={() => setTela('perfil')}
        />
      )}

      {/* Tela de reservas: */}
      {tela === 'reservar' && (
        <ReservarScreen
        // Funções para navegar entre as telas do aplicativo.
          onVoltar={() => setTela('home')}
          onExplorar={() => setTela('mapa')}
          onPerfil={() => setTela('perfil')}
          onAgendar={(nomeLocal) => {
            // Atualiza o estado com o local selecionado e muda para a tela de agendamento.
            setLocalSelecionado(nomeLocal);
            setTela('agendamento');
          }}
        />
      )}

      {/* Tela de agendamento: */}
      {tela === 'agendamento' && (
        <AgendamentoScreen
        // Funções para navegar entre as telas do aplicativo.
          localSelecionado={localSelecionado}
          nomeUsuario={nomeUsuario}
          onVoltar={() => setTela('reservar')}
          onPerfil={() => setTela('perfil')}
        />
      )}

      {/* Tela de perfil: */}
      {tela === 'perfil' && (
        <PerfilScreen
        // Funções para navegar entre as telas do aplicativo.
          onVoltar={() => setTela('home')}
          onExplorar={() => setTela('mapa')}
          onReservar={() => setTela('reservar')}
        />
      )}
    </View>
  );
}