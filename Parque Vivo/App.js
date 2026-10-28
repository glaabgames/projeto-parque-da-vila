
import React, { useState } from 'react';
import { StatusBar, View } from 'react-native';

// Importa as telas do aplicativo
import BoasVindas from './screens/00-splash';
import LoginScreen from './screens/01-login';

// Componente principal do aplicativo
export default function App() {
  // Define qual tela será exibida primeiro
  const [tela, setTela] = useState('splash');

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#EAF4E9"
      />

      {/* Tela inicial de apresentação */}
      {tela === 'splash' && (
        <BoasVindas
          onEntrar={() => setTela('login')}
        />
      )}

      {/* Tela de login do usuário */}
      {tela === 'login' && (
        <LoginScreen
          onEntrar={(email, senha) => {
            // Recebe o e-mail e a senha informados
            console.log('E-mail informado:', email);
            console.log('Login solicitado');
          }}
        />
      )}
    </View>
  );
}