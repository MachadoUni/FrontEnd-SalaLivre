<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const apiURL = "http://localhost:8080/salas";

const salas = ref([]);
const especificacoes = ref([]);
const editando = ref(null);

const erro = ref('');
const carregando = ref(false);

const novaSala = ref({
    nome: '',
    maxAlunos: null,
    especId: []
})

const carregarDados = async () => {
  carregando.value = true;
  try {
    const [resSalas, resEspec] = await Promise.all([
      axios.get(`${apiURL}/salas`),
      axios.get(`${apiURL}/especificacoes`) 
    ]);
    salas.value = resSalas.data;
    especificacoes.value = resEspec.data;
  } catch (e) {
    erro.value = "Erro ao carregar dados do servidor.";
    console.error(e);
  } finally {
    carregando.value = false;
  }
};

const salvarSala = async () => {
  erro.value = ''; // Limpa erros anteriores

  // Validação no front-end espelhando a do back-end
  if (!novaSala.value.nome || novaSala.value.nome.trim() === '') {
    erro.value = "Nome da sala é obrigatório!";
    return;
  }
  if (!novaSala.value.maxAlunos || novaSala.value.maxAlunos <= 0) {
    erro.value = "Número máximo de alunos inválido!";
    return;
  }

  try {
    if (editando.value) {
      // Atualizar (PUT)
      await axios.put(`${apiURL}/${editando.value.id}`, novaSala.value);
    } else {
      // Criar (POST)
      await axios.post(`${apiURL}/novo`, novaSala.value);
    }
    limparFormulario();
    await carregarDados(); // Recarrega a tabela atualizada
  } catch (e) {
    // Captura a Exception lançada pelo seu Spring Boot
    erro.value = e.response?.data?.message || e.response?.data || "Erro ao salvar a sala. Verifique os dados.";
  }
};

const excluirSala = async (id) => {
  if(confirm("Tem certeza que deseja excluir esta sala?")) {
    try {
      await axios.delete(`${apiURL}/${id}`);
      await carregarDados();
    } catch (e) {
      erro.value = "Erro ao excluir a sala.";
    }
  }
};

const editarSala = (sala) => {
  editando.value = sala;
  
  novaSala.value = { 
    nome: sala.nome, 
    maxAlunos: sala.maxAlunos,
    // Extrai apenas os IDs da lista de objetos para alimentar o epecId do DTO
    epecId: sala.listaEspecificacoes.map(especificacao => especificacao.id)
  };
};

const limparFormulario = () => {
  novaSala.value = { nome: '', maxAlunos: null, epecId: [] };
  editando.value = null;
  erro.value = '';
};

onMounted(carregarDados);
</script>

<template>
  <div class="container">
    <h2>Gerenciamento de Salas</h2>

    <div v-if="carregando" class="loading">Carregando dados...</div>
    <div v-if="erro" class="error-message" style="color: red; font-weight: bold;">{{ erro }}</div>

    <form @submit.prevent="salvarSala" class="form-sala">
      
      <div class="form-group">
        <label>Nome da Sala:</label>
        <input v-model="novaSala.nome" type="text" placeholder="Ex: Laboratório 1" required />
      </div>

      <div class="form-group">
        <label>Capacidade Máxima (Alunos):</label>
        <input v-model="novaSala.maxAlunos" type="number" min="1" placeholder="Ex: 40" required />
      </div>

      <div class="form-group">
        <label>Especificações da Sala:</label>
        
        <div class="checkbox-list">
          <span v-if="especificacoes.length === 0">Nenhuma especificação cadastrada.</span>
          
          <label v-for="espec in especificacoes" :key="espec.id" style="display: block; margin-bottom: 5px;">
            <input 
              type="checkbox" 
              :value="espec.id" 
              v-model="novaSala.epecId" 
            />
            {{ espec.nome }} 
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="carregando">
          {{ editando ? 'Atualizar Sala' : 'Salvar Nova Sala' }}
        </button>
        <button v-if="editando" @click="limparFormulario" type="button">Cancelar</button>
      </div>
    </form>

    <hr />

    <h3>Salas Cadastradas</h3>
    <table border="1" width="100%">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Máx. Alunos</th>
          <th>Especificações</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sala in salas" :key="sala.id">
          <td>{{ sala.nome }}</td>
          <td>{{ sala.maxAlunos }}</td>
          <td>
            <span v-if="sala.listaEspecificacoes && sala.listaEspecificacoes.length > 0">
              {{ sala.listaEspecificacoes.map(e => e.nome).join(', ') }}
            </span>
            <span v-else>Nenhuma</span>
          </td>
          <td>
            <button @click="editarSala(sala)" :disabled="carregando">Editar</button>
            <button @click="excluirSala(sala.id)" :disabled="carregando">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>