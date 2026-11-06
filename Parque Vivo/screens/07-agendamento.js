
import React, { useState, useEffect } from 'react';

import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, useWindowDimensions, SafeAreaView,
  Platform, StatusBar, Alert,
} from 'react-native';

import {
  useFonts,
  Poppins_300Light,
  Poppins_700Bold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';

import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const API_URL = 'http://192.168.0.142:3000';

export default function AgendamentoScreen({
  localSelecionado = 'Campo de futebol',
  espacoId,
  nomeUsuario = 'Usuário',
  token,
  onPerfil,
  onVoltar,
}) {
  const { width } = useWindowDimensions();

  const telaGrande = width >= 768;
  const celularEstreito = width < 360;

  const tamanhoTitulo = telaGrande ? 32 : celularEstreito ? 25 : 29;
  const tamanhoBoasVindas = telaGrande ? 19 : celularEstreito ? 12 : 14;

  const titulo = `Reserve ${localSelecionado.toLowerCase()}!`;

  const tituloEmDuasLinhas =
    !telaGrande && titulo.length > (celularEstreito ? 19 : 23);

  const alturaTitulo = tamanhoTitulo * (tituloEmDuasLinhas ? 2.5 : 1.4);

  const [fontesCarregadas] = useFonts({
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_900Black,
  });

  // Cria os próximos sete dias.
  const dias = Array.from({ length: 7 }, (_, indice) => {
    const data = new Date();
    data.setDate(data.getDate() + indice);

    return {
      dataISO: [
        data.getFullYear(),
        String(data.getMonth() + 1).padStart(2, '0'),
        String(data.getDate()).padStart(2, '0'),
      ].join('-'),

      diaSemana: data.toLocaleDateString('pt-BR', {
        weekday: 'long',
      }),

      diaMes: data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }),
    };
  });

  const [diaSelecionado, setDiaSelecionado] = useState(0);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);

  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [salvandoReserva, setSalvandoReserva] = useState(false);

  const [agendamentos, setAgendamentos] = useState([]);
  const [carregandoAgendamentos, setCarregandoAgendamentos] = useState(false);

  const horarios = [
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00',
  ];

  // Mostra avisos no navegador ou no celular.
  function mostrarMensagem(tituloMensagem, mensagem) {
    if (Platform.OS === 'web') {
      window.alert(mensagem);
    } else {
      Alert.alert(tituloMensagem, mensagem);
    }
  }

  // Formata a data recebida do backend.
  function formatarData(valor) {
    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
      return '--/--/----';
    }

    return data.toLocaleDateString('pt-BR');
  }

  // Formata o horário recebido do backend.
  function formatarHora(valor) {
    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
      return '--:--';
    }

    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  // Busca todos os agendamentos do usuário no banco.
  async function carregarAgendamentos() {
    if (!token) {
      setAgendamentos([]);
      return;
    }

    setCarregandoAgendamentos(true);

    try {
      const resposta = await fetch(
        `${API_URL}/api/agendamentos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || 'Não foi possível carregar seus agendamentos.'
        );
      }

      const listaFormatada = dados.map((item) => ({
        id: item.id,
        nome: nomeUsuario,
        local: item.espaco,
        dia: formatarData(item.inicio),
        horarioInicial: formatarHora(item.inicio),
        horarioFinal: formatarHora(item.fim),
        status: item.status,
      }));

      setAgendamentos(listaFormatada);

    } catch (erro) {
      mostrarMensagem('Erro', erro.message);
    } finally {
      setCarregandoAgendamentos(false);
    }
  }

  // Carrega o histórico quando a tela é aberta.
  useEffect(() => {
    carregarAgendamentos();
  }, [token]);

  // Consulta os horários ocupados no banco de dados.
  useEffect(() => {
    let ativo = true;

    async function carregarDisponibilidade() {
      if (!token || !espacoId) {
        setHorariosOcupados([]);
        setCarregandoHorarios(false);
        return;
      }

      setCarregandoHorarios(true);
      setHorariosOcupados([]);

      try {
        const data = dias[diaSelecionado].dataISO;

        const resposta = await fetch(
          `${API_URL}/api/agendamentos/disponibilidade/${espacoId}?data=${data}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            dados.erro || 'Não foi possível consultar os horários.'
          );
        }

        if (ativo) {
          setHorariosOcupados(
            dados.map((item) => item.horario)
          );
        }
      } catch (erro) {
        if (ativo) {
          mostrarMensagem('Erro', erro.message);
        }
      } finally {
        if (ativo) {
          setCarregandoHorarios(false);
        }
      }
    }

    carregarDisponibilidade();

    return () => {
      ativo = false;
    };
  }, [diaSelecionado, espacoId, token]);

  // Verifica se o horário já está reservado.
  function horarioIndisponivel(horario) {
    return horariosOcupados.includes(horario);
  }

  // Calcula o horário final: uma hora depois.
  function calcularHorarioFinal(horarioInicial) {
    const [hora, minuto] = horarioInicial.split(':').map(Number);

    const dataFinal = new Date();
    dataFinal.setHours(hora + 1, minuto, 0, 0);

    return dataFinal.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  // Confirma a reserva no backend.
  async function confirmarReserva() {
    if (!horarioSelecionado) {
      mostrarMensagem(
        'Atenção',
        'Selecione um horário disponível antes de confirmar.'
      );
      return;
    }

    if (!token || !espacoId) {
      mostrarMensagem(
        'Erro',
        'Não foi possível identificar o usuário ou o espaço.'
      );
      return;
    }

    if (horarioIndisponivel(horarioSelecionado)) {
      mostrarMensagem(
        'Horário indisponível',
        'Esse horário já foi reservado.'
      );
      setHorarioSelecionado(null);
      return;
    }

    setSalvandoReserva(true);

    try {
      const data = dias[diaSelecionado].dataISO;

      const resposta = await fetch(
        `${API_URL}/api/agendamentos`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            espaco_id: espacoId,
            inicio: `${data}T${horarioSelecionado}:00`,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || 'Não foi possível confirmar a reserva.'
        );
      }

      setHorariosOcupados((lista) => [
        ...lista,
        horarioSelecionado,
      ]);

      setHorarioSelecionado(null);

      // Atualiza o histórico diretamente do banco.
      await carregarAgendamentos();

      mostrarMensagem(
        'Reserva confirmada',
        'Perfeito! Sua reserva de 1 hora foi confirmada.'
      );

    } catch (erro) {
      mostrarMensagem('Erro na reserva', erro.message);
      setHorarioSelecionado(null);
    } finally {
      setSalvandoReserva(false);
    }
  }

  if (!fontesCarregadas) {
    return <View style={styles.fundo} />;
  }

  return (
    <SafeAreaView style={styles.fundo}>
      {Platform.OS === 'android' && (
        <View style={{ height: StatusBar.currentHeight || 24 }} />
      )}

      <StatusBar barStyle="light-content" backgroundColor="#326B54" />

      <LinearGradient
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

          <Text
            style={[
              styles.boasVindas,
              { fontSize: tamanhoBoasVindas },
            ]}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            Boas-vindas ao Parque Vivo!
          </Text>
        </View>

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

      <ScrollView
        style={styles.areaRolagem}
        contentContainerStyle={[
          styles.containerRolagem,
          { paddingHorizontal: telaGrande ? 28 : 16 },
        ]}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.conteudo,
            { maxWidth: telaGrande ? 760 : 480 },
          ]}
        >
          <View
            style={[
              styles.cartaoApresentacao,
              { padding: telaGrande ? 22 : 16 },
            ]}
          >
            <Text style={styles.subtituloApresentacao}>
              Aproveite, faça sua reserva.
            </Text>

            <MaskedView
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

          <Text style={styles.tituloSecao}>
            Escolha o dia da reserva
          </Text>

          <View style={styles.cartaoCalendario}>
            {dias.map((dia, indice) => {
              const selecionado = diaSelecionado === indice;

              return (
                <TouchableOpacity
                  key={dia.diaMes + indice}
                  onPress={() => {
                    setDiaSelecionado(indice);
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

          <Text style={styles.tituloSecao}>
            Horários disponíveis
          </Text>

          <Text style={styles.textoAjuda}>
            {dias[diaSelecionado].diaSemana}, dia {dias[diaSelecionado].diaMes}
          </Text>

          <View style={styles.listaHorarios}>
            {horarios.map((horario) => {
              const indisponivel = horarioIndisponivel(horario);
              const selecionado = horarioSelecionado === horario;

              return (
                <TouchableOpacity
                  key={horario}
                  disabled={
                    indisponivel ||
                    carregandoHorarios ||
                    salvandoReserva
                  }
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
                  <Text
                    style={[
                      styles.textoHorario,
                      selecionado && styles.textoHorarioSelecionado,
                      indisponivel && styles.textoHorarioRiscado,
                    ]}
                  >
                    {horario}
                  </Text>

                  <Text
                    style={[
                      styles.statusHorario,
                      indisponivel && styles.statusIndisponivel,
                    ]}
                  >
                    {carregandoHorarios
                      ? 'Consultando...'
                      : indisponivel
                        ? 'Indisponível'
                        : 'Disponível'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.avisoDuracao}>
            Cada reserva tem duração de 1 hora.
          </Text>

          <TouchableOpacity
            onPress={confirmarReserva}
            disabled={salvandoReserva || carregandoHorarios}
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
                {salvandoReserva ? 'Confirmando...' : 'Confirmar reserva'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.tituloSecao}>
            Minhas reservas
          </Text>

          <View style={styles.listaAgendamentos}>
            {carregandoAgendamentos ? (
              <Text style={styles.textoSemAgendamentos}>
                Carregando suas reservas...
              </Text>
            ) : agendamentos.length === 0 ? (
              <Text style={styles.textoSemAgendamentos}>
                Você ainda não possui agendamentos.
              </Text>
            ) : (
              agendamentos.map((reserva) => (
                <View
                  key={reserva.id}
                  style={[
                    styles.cartaoAgendamento,
                    reserva.status !== 'confirmado' &&
                      styles.cartaoCancelado,
                  ]}
                >
                  <Text style={styles.nomeAgendamento}>
                    {reserva.local}
                  </Text>

                  <Text style={styles.detalheAgendamento}>
                    {reserva.dia} — {reserva.horarioInicial} às {reserva.horarioFinal}
                  </Text>

                  <Text
                    style={[
                      styles.statusAgendamento,
                      reserva.status !== 'confirmado' &&
                        styles.textoCancelado,
                    ]}
                  >
                    {reserva.status === 'confirmado'
                      ? 'Confirmado'
                      : 'Cancelado'}
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

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  barraTopo: {
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  grupoEsquerdoTopo: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  botaoVoltar: {
    width: 32,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  flechaVoltar: {
    color: '#FFFFFF',
    fontSize: 38,
    lineHeight: 42,
    fontFamily: 'Poppins_300Light',
    includeFontPadding: false,
    textAlign: 'center',
  },

  boasVindas: {
    flex: 1,
    minWidth: 0,
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    includeFontPadding: false,
  },

  botaoPerfil: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imagemPerfil: {
    width: '100%',
    height: '100%',
  },

  areaRolagem: {
    flex: 1,
    width: '100%',
  },

  containerRolagem: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 28,
  },

  conteudo: {
    width: '100%',
    alignSelf: 'center',
  },

  cartaoApresentacao: {
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 18,
    marginBottom: 22,
  },

  subtituloApresentacao: {
    color: '#527D68',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 5,
  },

  areaTitulo: {
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },

  tituloApresentacao: {
    color: '#000000',
    fontFamily: 'Poppins_900Black',
    includeFontPadding: false,
  },

  gradienteTitulo: {
    width: '100%',
    height: '100%',
  },

  descricaoApresentacao: {
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 0,
  },

  tituloSecao: {
    width: '100%',
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 12,
  },

  textoAjuda: {
    width: '100%',
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 13,
    marginBottom: 12,
  },

  cartaoCalendario: {
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 14,
    padding: 10,
    marginBottom: 24,
    gap: 8,
  },

  botaoDia: {
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

  botaoDiaSelecionado: {
    backgroundColor: '#326B54',
    borderColor: '#326B54',
  },

  textoDiaSemana: {
    flex: 1,
    color: '#52685C',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    textTransform: 'capitalize',
  },

  textoDiaMes: {
    color: '#52685C',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    marginLeft: 10,
  },

  textoDiaSelecionado: {
    color: '#FFFFFF',
  },

  listaHorarios: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },

  botaoHorario: {
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

  horarioSelecionado: {
    backgroundColor: '#D4DED7',
    borderColor: '#A8B9AD',
  },

  horarioIndisponivel: {
    backgroundColor: '#EEEEEE',
    borderColor: '#DDDDDD',
    opacity: 0.75,
  },

  textoHorario: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
  },

  textoHorarioSelecionado: {
    color: '#344B3D',
    fontFamily: 'Poppins_700Bold',
  },

  textoHorarioRiscado: {
    color: '#888888',
    textDecorationLine: 'line-through',
  },

  statusHorario: {
    color: '#527D68',
    fontFamily: 'Poppins_300Light',
    fontSize: 11,
    marginTop: 3,
  },

  statusIndisponivel: {
    color: '#888888',
  },

  avisoDuracao: {
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 12,
    marginBottom: 20,
  },

  areaBotaoConfirmar: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 28,
  },

  botaoConfirmar: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  textoBotaoConfirmar: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
  },

  listaAgendamentos: {
    width: '100%',
    gap: 10,
    marginBottom: 12,
  },

  textoSemAgendamentos: {
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 13,
    backgroundColor: '#F3F6F2',
    borderRadius: 12,
    padding: 16,
  },

  cartaoAgendamento: {
    width: '100%',
    backgroundColor: '#F3F6F2',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#326B54',
  },

  cartaoCancelado: {
    borderLeftColor: '#999999',
    opacity: 0.75,
  },

  nomeAgendamento: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    marginBottom: 4,
  },

  detalheAgendamento: {
    color: '#52685C',
    fontFamily: 'Poppins_300Light',
    fontSize: 13,
    lineHeight: 20,
  },

  statusAgendamento: {
    color: '#326B54',
    fontFamily: 'Poppins_700Bold',
    fontSize: 12,
    marginTop: 6,
  },

  textoCancelado: {
    color: '#888888',
  },
});
