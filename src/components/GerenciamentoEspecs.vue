<template>
  <div class="max-w-4xl mx-auto space-y-6">
    
    <div class="flex items-center gap-2 mb-6">
      <Settings2 class="w-6 h-6 text-primary" />
      <h1 class="text-2xl font-bold text-foreground">Especificações das Salas</h1>
    </div>

    <div v-if="erro" class="p-4 mb-4 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg">
      {{ erro }}
    </div>

    <div class="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div class="p-6 flex flex-col md:flex-row md:items-end gap-4">
        <div class="flex-1 space-y-2">
          <label class="text-sm font-medium text-foreground">Nova Especificação</label>
          <input 
            v-model="novaEspecificacao.nome" 
            type="text" 
            class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ex: Projetor, Ar Condicionado..." 
            @keyup.enter="salvarEspecificacao"
          />
        </div>
        <button 
          @click="salvarEspecificacao"
          :disabled="carregando"
          class="h-10 px-6 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          Adicionar
        </button>
      </div>
    </div>

    <div class="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <table class="w-full text-sm text-left text-foreground">
        <thead class="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
          <tr>
            <th class="px-6 py-3 w-16">ID</th>
            <th class="px-6 py-3">Nome da Especificação</th>
            <th class="px-6 py-3 text-right w-24">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-if="especificacoes.length === 0">
            <td colspan="3" class="px-6 py-8 text-center text-muted-foreground">Nenhuma especificação cadastrada.</td>
          </tr>
          <tr v-for="espec in especificacoes" :key="espec.id" class="hover:bg-muted/20 transition-colors">
            <td class="px-6 py-4 font-medium text-muted-foreground">#{{ espec.id }}</td>
            <td class="px-6 py-4 font-medium">{{ espec.nome }}</td>
            <td class="px-6 py-4 text-right">
              <button 
                @click="excluirEspecificacao(espec.id)" 
                class="font-medium text-destructive hover:underline"
              >
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Settings2 } from 'lucide-vue-next';

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