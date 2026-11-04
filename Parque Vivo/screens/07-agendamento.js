// Importa o React e as ferramentas para guardar informações na tela.
import React, { useState } from 'react';

// Importa os componentes visuais do React Native.
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, useWindowDimensions, SafeAreaView,
  Platform, StatusBar, Alert,
} from 'react-native';

// Importa as fontes Poppins utilizadas no design.
import { useFonts, Poppins_300Light, Poppins_700Bold, Poppins_900Black } from '@expo-google-fonts/poppins';

// Importa o gradiente verde.
import { LinearGradient } from 'expo-linear-gradient';

// Permite colorir o título com um gradiente.
import MaskedView from '@react-native-masked-view/masked-view';

// Cria a tela de agendamento.
export default function AgendamentoScreen({
  // Local que será reservado.
  localSelecionado = 'Campo de futebol',
  // Nome de quem está reservando.
  nomeUsuario = 'Usuário', 
  // Função para abrir o perfil.
  onPerfil,
  // Função para voltar à tela anterior.
  onVoltar,              
}) {
  // Descobre a largura da tela para adaptar o visual.
  const { width } = useWindowDimensions();

  // Verifica se está em um computador ou em um celular estreito.
  const telaGrande = width >= 768;
  const celularEstreito = width < 360;

  // Escolhe os tamanhos dos textos conforme a tela.
  const tamanhoTitulo = telaGrande ? 32 : celularEstreito ? 25 : 29;
  const tamanhoBoasVindas = telaGrande ? 19 : celularEstreito ? 12 : 14;

  // Monta o título usando o nome do local escolhido.
  const titulo = `Reserve ${localSelecionado.toLowerCase()}!`;

  // Decide se o título precisa ocupar duas linhas no celular.
  const tituloEmDuasLinhas =
    !telaGrande && titulo.length > (celularEstreito ? 19 : 23);

  // Calcula o espaço necessário para mostrar o título.
  const alturaTitulo = tamanhoTitulo * (tituloEmDuasLinhas ? 2.5 : 1.4);

  // Carrega as três fontes utilizadas na tela.
  const [fontesCarregadas] = useFonts({
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_900Black,
  });

  // Cria uma lista com hoje e os próximos seis dias.
  const dias = Array.from({ length: 7 }, (_, indice) => {
    // Pega a data atual.
    const data = new Date(); 
    // Avança o número de dias.
    data.setDate(data.getDate() + indice); 

    return {
      // Formata o dia da semana e o dia/mês em português.
      diaSemana: data.toLocaleDateString('pt-BR', { weekday: 'long' }),
      diaMes: data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    };
  });

  // Guarda qual dia foi escolhido. Zero significa hoje.
  const [diaSelecionado, setDiaSelecionado] = useState(0);

  // Guarda o horário escolhido ou null quando nenhum foi escolhido.
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);

  // Guarda as reservas feitas enquanto esta tela estiver aberta.
  const [agendamentos, setAgendamentos] = useState([]);

  // Lista dos horários oferecidos para reserva.
  const horarios = [
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00',
  ];

  // Simula alguns horários indisponíveis para cada dia.
  function horarioIndisponivel(indice) {
    // Torna indisponível o horário se a soma do índice do horário e do dia selecionado for igual a 2 módulo 4.
    return (indice + diaSelecionado) % 4 === 2;
  }

  // Calcula o horário final, três horas depois do início.
  function calcularHorarioFinal(horarioInicial) {
    // Divide o horário inicial em hora e minuto.
    const [hora, minuto] = horarioInicial.split(':').map(Number);
    const dataFinal = new Date();
    // Ajusta a hora e o minuto para o horário inicial.
    dataFinal.setHours(hora + 3, minuto, 0, 0);
    // Retorna o horário final formatado como "HH:mm".
    return dataFinal.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  // Mostra avisos tanto no navegador quanto no celular.
  function mostrarMensagem(tituloMensagem, mensagem) {
    if (Platform.OS === 'web') {
      // Aviso no navegador.
      window.alert(mensagem); 
    } else {
      // Aviso no celular.
      Alert.alert(tituloMensagem, mensagem); 
    }
  }

  // Confirma a reserva quando o usuário toca no botão.
  function confirmarReserva() {
    // Impede a confirmação sem um horário escolhido.
    if (!horarioSelecionado) {
      mostrarMensagem('Atenção', 'Selecione um horário disponível antes de confirmar.');
      return; // Para a função aqui.
    }

    // Cria os dados da nova reserva.
    const novaReserva = {
      // Cria um identificar simples.
      id: `${Date.now()}`,
      nome: nomeUsuario,
      local: localSelecionado,
      dia: dias[diaSelecionado].diaMes,
      horarioInicial: horarioSelecionado,
      horarioFinal: calcularHorarioFinal(horarioSelecionado),
    };

    // Adiciona a reserva sem apagar as anteriores.
    setAgendamentos((listaAtual) => [...listaAtual, novaReserva]);

    // Limpa o horário selecionado.
    setHorarioSelecionado(null);

    // Informa que a reserva foi confirmada.
    mostrarMensagem('Reserva confirmada', 'Perfeito, sua reserva foi feita, divirta-se!');
  }

  // Mostra uma tela vazia até as fontes terminarem de carregar.
  if (!fontesCarregadas) return <View style={styles.fundo} />;

  // Separa as reservas que pertencem ao local atual.
  const reservasDoLocal = agendamentos.filter(
    (reserva) => reserva.local === localSelecionado
  );

  // Desenha toda a tela.
  return (
    <SafeAreaView style={styles.fundo}>
      {/* Reserva espaço para a barra de status no Android: */}
      {Platform.OS === 'android' && (
        <View style={{ height: StatusBar.currentHeight || 24 }} />
      )}

      {/* Define a aparência da barra de status do celular: */}
      <StatusBar barStyle="light-content" backgroundColor="#326B54" />

      {/* Barra superior com gradiente verde: */}
      <LinearGradient
      // Aplica o gradiente verde na barra superior.
        colors={['#326B54', '#8AB59D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.barraTopo,
          {
            paddingHorizontal: telaGrande ? 28 : 16,
            minHeight: telaGrande ? 82 : 68,
          },
        ]}
      >
        {/* Agrupa a seta de voltar e a mensagem de boas-vindas: */}
        <View style={styles.grupoEsquerdoTopo}>
          <TouchableOpacity
            onPress={onVoltar}
            activeOpacity={0.7}
            style={styles.botaoVoltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a tela de reservas"
          >
            <Text style={styles.flechaVoltar}>‹</Text>
          </TouchableOpacity>

          {/* Mensagem de boas-vindas: */}
          <Text
          // Ajusta o tamanho do texto de boas-vindas conforme a tela.
            style={[styles.boasVindas, { fontSize: tamanhoBoasVindas }]}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            Boas-vindas ao Parque Vivo!
          </Text>
        </View>

        {/* Botão que abre o perfil do usuário: */}
        <TouchableOpacity
          onPress={onPerfil}
          activeOpacity={0.7}
          style={styles.botaoPerfil}
          accessibilityRole="button"
          accessibilityLabel="Abrir perfil do usuário"
        >
          <Image
            source={require('../assets/parque-perfil.png')}
            style={styles.imagemPerfil}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* Permite rolar a tela quando o conteúdo não cabe: */}
      <ScrollView
      // Ajusta o estilo do ScrollView de acordo com a tela.
        style={styles.areaRolagem}
        contentContainerStyle={[
          styles.containerRolagem,
          { paddingHorizontal: telaGrande ? 28 : 16 },
        ]}
        // Evita que o teclado feche ao tocar fora dos campos de texto.
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
      >
        {/* Limita a largura do conteúdo em telas grandes: */}
        <View style={[styles.conteudo, { maxWidth: telaGrande ? 760 : 480 }]}>
          {/* Cartão de apresentação da reserva: */}
          <View
            style={[
              styles.cartaoApresentacao,
              { padding: telaGrande ? 22 : 16 },
            ]}
          >
            <Text style={styles.subtituloApresentacao}>
              Aproveite, faça sua reserva.
            </Text>

            {/* Aplica o gradiente verde ao título: */}
            <MaskedView
            // Define a área do título com gradiente.
              style={[styles.areaTitulo, { height: alturaTitulo }]}
              maskElement={
                <Text
                  style={[
                    styles.tituloApresentacao,
                    {
                      fontSize: tamanhoTitulo,
                      lineHeight: tamanhoTitulo * 1.25,
                    },
                  ]}
                >
                  {titulo}
                </Text>
              }
            >
              <LinearGradient
                colors={['#326B54', '#8AB59D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradienteTitulo}
              />
            </MaskedView>
              
            <Text style={styles.descricaoApresentacao}>
              Escolha o dia e o horário disponível.
            </Text>
          </View>

          {/* Título da área de escolha do dia: */}
          <Text style={styles.tituloSecao}>Escolha o dia da reserva</Text>

          {/* Cartão que contém os sete dias: */}
          <View style={styles.cartaoCalendario}>
            {dias.map((dia, indice) => {
              // Verifica se este é o dia selecionado.
              const selecionado = diaSelecionado === indice;

              return (
                <TouchableOpacity
                  key={dia.diaMes + indice}
                  onPress={() => {
                    // Escolhe o dia.
                    setDiaSelecionado(indice);
                    // Limpa o horário anterior.
                    setHorarioSelecionado(null);
                  }}
                  activeOpacity={0.8}
                  style={[
                    styles.botaoDia,
                    selecionado && styles.botaoDiaSelecionado,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${dia.diaSemana}, ${dia.diaMes}`}
                >
                  {/* Nome do dia da semana: */}
                  <Text
                    style={[
                      styles.textoDiaSemana,
                      selecionado && styles.textoDiaSelecionado,
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {dia.diaSemana}
                  </Text>

                  {/* Dia e mês: */}
                  <Text
                    style={[
                      styles.textoDiaMes,
                      selecionado && styles.textoDiaSelecionado,
                    ]}
                  >
                    {dia.diaMes}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Título e data dos horários: */}
          <Text style={styles.tituloSecao}>Horários disponíveis</Text>
          <Text style={styles.textoAjuda}>
            {dias[diaSelecionado].diaSemana}, dia {dias[diaSelecionado].diaMes}
          </Text>

          {/* Mostra os oito horários em duas colunas: */}
          <View style={styles.listaHorarios}>
            {horarios.map((horario, indice) => {
              const indisponivel = horarioIndisponivel(indice);
              const selecionado = horarioSelecionado === horario;

              return (
                <TouchableOpacity
                  key={horario}
                  disabled={indisponivel}
                  onPress={() => setHorarioSelecionado(horario)}
                  activeOpacity={0.8}
                  style={[
                    styles.botaoHorario,
                    selecionado && styles.horarioSelecionado,
                    indisponivel && styles.horarioIndisponivel,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{
                    disabled: indisponivel,
                    selected: selecionado,
                  }}
                  accessibilityLabel={
                    indisponivel
                      ? `${horario}, indisponível`
                      : `${horario}, disponível`
                  }
                >
                  {/* Horário de início: */}
                  <Text
                    style={[
                      styles.textoHorario,
                      selecionado && styles.textoHorarioSelecionado,
                      indisponivel && styles.textoHorarioRiscado,
                    ]}
                  >
                    {horario}
                  </Text>

                  {/* Informa se o horário pode ser escolhido: */}
                  <Text
                    style={[
                      styles.statusHorario,
                      indisponivel && styles.statusIndisponivel,
                    ]}
                  >
                    {indisponivel ? 'Indisponível' : 'Disponível'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Explica a duração de cada reserva: */}
          <Text style={styles.avisoDuracao}>
            Cada reserva tem duração de 3 horas.
          </Text>

          {/* Botão para confirmar o agendamento: */}
          <TouchableOpacity
            onPress={confirmarReserva}
            activeOpacity={0.8}
            style={styles.areaBotaoConfirmar}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={['#326B54', '#8AB59D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.botaoConfirmar}
            >
              <Text style={styles.textoBotaoConfirmar}>
                Confirmar reserva
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Lista das reservas feitas para este local: */}
          <Text style={styles.tituloSecao}>Agendamentos neste local:</Text>

          <View style={styles.listaAgendamentos}>
            {/* Mostra uma mensagem quando a lista está vazia: */}
            {reservasDoLocal.length === 0 ? (
              <Text style={styles.textoSemAgendamentos}>
                Ainda não há agendamentos confirmados neste local.
              </Text>
            ) : (
              // Caso existam reservas, mostra cada uma delas.
              reservasDoLocal.map((reserva) => (
                <View key={reserva.id} style={styles.cartaoAgendamento}>
                  <Text style={styles.nomeAgendamento}>{reserva.nome}</Text>
                  <Text style={styles.detalheAgendamento}>
                    {reserva.dia} — {reserva.horarioInicial} às {reserva.horarioFinal}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Reúne os estilos para manter a aparência organizada.:
const styles = StyleSheet.create({
  // Fundo branco de toda a tela.
  fundo: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Barra superior verde:
  barraTopo: {
    // Ajusta a largura, altura e o espaçamento interno da barra superior.
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Agrupa a seta e o texto da barra:
  grupoEsquerdoTopo: {
    // Ajusta a largura, altura e centraliza os itens da barra superior.
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  // Área clicável da seta de voltar:
  botaoVoltar: {
    // Ajusta a largura, altura e centraliza a seta de voltar.
    width: 32,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  // Aparência da seta de voltar:
  flechaVoltar: {
    // Ajusta a cor, tamanho e fonte da seta de voltar.
    color: '#FFFFFF',
    fontSize: 38,
    lineHeight: 42,
    fontFamily: 'Poppins_300Light',
    includeFontPadding: false,
    textAlign: 'center',
  },

  // Texto de boas-vindas.
  boasVindas: {
    // Ajusta a largura, cor, fonte e alinhamento do texto de boas-vindas.
    flex: 1,
    minWidth: 0,
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    includeFontPadding: false,
  },

  // Área clicável do perfil:
  botaoPerfil: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tamanho da imagem de perfil:
  imagemPerfil: {
    width: '100%',
    height: '100%',
  },

  // Área que pode ser rolada:
  areaRolagem: {
    flex: 1,
    width: '100%',
  },

  // Centraliza o conteúdo e define os espaços externos:
  containerRolagem: {
    // Estiliza o container que envolve todo o conteúdo da tela.
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 28,
  },

  // Limita a largura da área principal:
  conteudo: {
    width: '100%',
    alignSelf: 'center',
  },

  // Cartão de apresentação:
  cartaoApresentacao: {
    // Estiliza o cartão de boas-vindas.
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 18,
    marginBottom: 22,
  },

  // Texto acima do título principal:
  subtituloApresentacao: {
    // Ajusta a cor, fonte, tamanho e margem inferior do subtítulo.
    color: '#527D68',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 5,
  },

  // Espaço ocupado pelo título com gradiente:
  areaTitulo: {
    // Estiliza a área do título.
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },

  // Define a fonte usada como máscara do gradiente:
  tituloApresentacao: {
    // Estilo do título principal, incluindo cor, fonte, tamanho e altura da linha.
    color: '#000000',
    fontFamily: 'Poppins_900Black',
    includeFontPadding: false,
  },

  // Faz o gradiente preencher a área do título:
  gradienteTitulo: {
    // Ajusta o gradiente para ocupar toda a largura e altura do título.
    width: '100%',
    height: '100%',
  },

  // Texto explicativo do cartão:
  descricaoApresentacao: {
    // Estiliza o texto explicativo do cartão de apresentação.
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 0,
  },

  // Títulos das seções:
  tituloSecao: {
    // Ajusta a cor, fonte, tamanho e margem inferior dos títulos das seções.
    width: '100%',
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 12,
  },

  // Texto que informa o dia selecionado:
  textoAjuda: {
    // Ajusta a largura, cor, fonte, tamanho e margem inferior do texto que informa o dia selecionado.
    width: '100%',
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 13,
    marginBottom: 12,
  },

  // Fundo do calendário:
  cartaoCalendario: {
    // Estiliza o cartão que contém os sete dias da semana.
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 14,
    padding: 10,
    marginBottom: 24,
    gap: 8,
  },

  // Aparência normal de cada dia:
  botaoDia: {
    // Estiliza cada botão de dia.
    minHeight: 54,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE7DE',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Fundo do dia escolhido:
  botaoDiaSelecionado: {
    backgroundColor: '#326B54',
    borderColor: '#326B54',
  },

  // Nome do dia da semana:
  textoDiaSemana: {
    // Ajusta a largura, cor, fonte, tamanho e transforma o texto em minúsculas.
    flex: 1,
    color: '#52685C',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    textTransform: 'capitalize',
  },

  // Número do dia e do mês:
  textoDiaMes: {
    // Ajusta a cor, fonte, tamanho e margem esquerda do texto que mostra o dia e o mês.
    color: '#52685C',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    marginLeft: 10,
  },

  // Texto branco no dia selecionado:
  textoDiaSelecionado: {
    color: '#FFFFFF',
  },

  // Organiza os horários em duas colunas:
  listaHorarios: {
    // Ajusta a largura, organiza os horários em linha, permite quebra de linha e espaça os itens.
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },

  // Aparência normal de cada horário:
  botaoHorario: {
    // Estiliza cada botão de horário.
    width: '48%',
    minHeight: 66,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F3F6F2',
    borderWidth: 1,
    borderColor: '#DCE7DE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Fundo do horário escolhido:
  horarioSelecionado: {
    // Estiliza o horário selecionado.
    backgroundColor: '#D4DED7',
    borderColor: '#A8B9AD',
  },

  // Aparência de um horário indisponível:
  horarioIndisponivel: {
    // Estiliza os horários indisponíveis.
    backgroundColor: '#EEEEEE',
    borderColor: '#DDDDDD',
    opacity: 0.75,
  },

  // Texto do horário:
  textoHorario: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
  },

  // Texto do horário escolhido:
  textoHorarioSelecionado: {
    // Ajusta a cor e a fonte do horário selecionado.
    color: '#344B3D',
    fontFamily: 'Poppins_700Bold',
  },

  // Texto cinza e riscado para horários indisponíveis:
  textoHorarioRiscado: {
    // Ajusta a cor e adiciona uma linha riscando o texto dos horários indisponíveis.
    color: '#888888',
    textDecorationLine: 'line-through',
  },

  // Texto que informa a disponibilidade:
  statusHorario: {
    // Ajusta a cor, fonte, tamanho e margem superior do texto que informa se o horário está disponível ou não.
    color: '#527D68',
    fontFamily: 'Poppins_300Light',
    fontSize: 11,
    marginTop: 3,
  },

  // Texto cinza dos horários indisponíveis:
  statusIndisponivel: {
    color: '#888888',
  },

  // Aviso sobre a duração da reserva:
  avisoDuracao: {
    // Ajusta o estilo do aviso sobre a duração da reserva.
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 12,
    marginBottom: 20,
  },

  // Área externa do botão de confirmação:
  areaBotaoConfirmar: {
    // Ajusta a largura, arredonda os cantos e adiciona margem inferior.
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 28,
  },

  // Fundo e tamanho do botão de confirmação:
  botaoConfirmar: {
    // Estiliza o botão de confirmação com gradiente.
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // Texto do botão de confirmação:
  textoBotaoConfirmar: {
    // Estiliza o texto do botão de confirmaçõa.
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
  },

  // Espaçamento entre os agendamentos:
  listaAgendamentos: {
    // Ajusta a largura e espaçamento.
    width: '100%',
    gap: 10,
    marginBottom: 12,
  },

  // Mensagem exibida quando não existem reservas:
  textoSemAgendamentos: {
    // Estiliza a mensagem de aviso.
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 13,
    backgroundColor: '#F3F6F2',
    borderRadius: 12,
    padding: 16,
  },

  // Cartão que mostra uma reserva confirmada:
  cartaoAgendamento: {
    // Ajusta a largura, cor de fundo, borda arredondada, preenchimento e borda esquerda do cartão de agendamento.
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#326B54',
  },

  // Estilo do nome da pessoa que fez a reserva:
  nomeAgendamento: {
    // Ajusta a cor, fonte, tamanho e margem inferior do nome da pessoa que fez a reserva.
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    marginBottom: 4,
  },

  // Estilo do dia e horário da reserva:
  detalheAgendamento: {
    // Ajusta a cor, fonte, tamanho e altura da linha do texto que mostra o dia e horário da reserva.
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 13,
    lineHeight: 20,
  },
});