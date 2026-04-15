<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// URL direta para as especificações
const apiURL = "http://localhost:8080/especificacoes"; 

// Estados
const especificacoes = ref([]);
const novaEspecificacao = ref({ nome: '' });

// Feedback
const erro = ref('');
const carregando = ref(false);

// (GET) Listar
const carregarDados = async () => {
  carregando.value = true;
  erro.value = '';
  try {
    const resposta = await axios.get(apiURL);
    especificacoes.value = resposta.data;
  } catch (e) {
    erro.value = "Erro ao carregar os dados do servidor.";
    console.error(e);
  } finally {
    carregando.value = false;
  }
};

// (POST) Criar
const salvarEspecificacao = async () => {
  erro.value = '';

  if (!novaEspecificacao.value.nome || novaEspecificacao.value.nome.trim() === '') {
    erro.value = "O nome da especificação é obrigatório!";
    return;
  }

  try {
    carregando.value = true;
    await axios.post(`${apiURL}/novo`, novaEspecificacao.value);
    // Limpa o input após o sucesso
    novaEspecificacao.value.nome = ''; 
    
    // Atualiza a tabela
    await carregarDados(); 
  } catch (e) {
    erro.value = e.response?.data?.message || e.response?.data || "Erro ao salvar a especificação.";
  } finally {
    carregando.value = false;
  }
};

// (DELETE) Remover
const excluirEspecificacao = async (id) => {
  if (confirm("Tem certeza que deseja excluir esta especificação?")) {
    try {
      carregando.value = true;
      await axios.delete(`${apiURL}/${id}`);
      await carregarDados();
    } catch (e) {
      erro.value = "Erro ao excluir. Pode estar em uso por uma sala.";
      console.error(e);
    } finally {
      carregando.value = false;
    }
  }
};

// Busca inicial
onMounted(carregarDados);
</script>

<template>
  <div class="container">
    <h2>Gerenciamento de Especificações</h2>

    <div v-if="carregando" class="loading">Carregando dados...</div>
    <div v-if="erro" class="error-message" style="color: red; font-weight: bold; margin-bottom: 10px;">
      {{ erro }}
    </div>

    <form @submit.prevent="salvarEspecificacao" class="form-especificacao">
      <div class="form-group" style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Nome da Especificação:</label>
        <div style="display: flex; gap: 10px;">
          <input 
            v-model="novaEspecificacao.nome" 
            type="text" 
            placeholder="Ex: Projetor, Ar Condicionado, Quadro de Vidro" 
            required 
            style="flex: 1; padding: 8px;"
          />
          <button type="submit" :disabled="carregando" style="padding: 8px 15px;">
            Adicionar
          </button>
        </div>
      </div>
    </form>

    <hr style="margin: 20px 0;" />

    <h3>Especificações Cadastradas</h3>
    
    <table border="1" width="100%" style="border-collapse: collapse; text-align: left;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px;">ID</th>
          <th style="padding: 8px;">Nome</th>
          <th style="padding: 8px; width: 100px; text-align: center;">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="especificacoes.length === 0">
          <td colspan="3" style="padding: 15px; text-align: center;">Nenhuma especificação cadastrada.</td>
        </tr>
        <tr v-for="espec in especificacoes" :key="espec.id">
          <td style="padding: 8px;">{{ espec.id }}</td>
          <td style="padding: 8px;">{{ espec.nome }}</td>
          <td style="padding: 8px; text-align: center;">
            <button 
              @click="excluirEspecificacao(espec.id)" 
              :disabled="carregando"
              style="color: red; cursor: pointer;"
            >
              Excluir
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>