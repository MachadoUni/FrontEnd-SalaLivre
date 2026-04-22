<template>
  <div class="max-w-5xl mx-auto space-y-6">
    
    <div class="flex items-center gap-2 mb-6">
      <DoorOpen class="w-6 h-6 text-primary" />
      <h1 class="text-2xl font-bold text-foreground">Gerenciamento de Salas</h1>
    </div>

    <div v-if="erro" class="p-4 mb-4 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg">
      {{ erro }}
    </div>

    <div class="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-border bg-muted/30">
        <h3 class="text-lg font-semibold text-foreground">{{ editando ? 'Editar Sala' : 'Cadastrar Nova Sala' }}</h3>
      </div>
      
      <div class="p-6">
        <form @submit.prevent="salvarSala" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Nome da Sala</label>
              <input 
                v-model="novaSala.nome" 
                type="text" 
                class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: Sala 101 - Bloco A" required 
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Capacidade Máxima</label>
              <input 
                v-model="novaSala.maxAlunos" 
                type="number" min="1"
                class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: 40" required 
              />
            </div>
          </div>

          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground">Especificações Inclusas</label>
            <div class="flex flex-wrap gap-3 p-4 border border-border rounded-lg bg-muted/10">
              <span v-if="especificacoes.length === 0" class="text-sm text-muted-foreground">Nenhuma especificação cadastrada no sistema.</span>
              
              <label v-for="espec in especificacoes" :key="espec.id" class="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  :value="espec.id" 
                  v-model="novaSala.especId"
                  class="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary"
                />
                <span class="text-sm text-foreground">{{ espec.nome }}</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-border">
            <button 
              v-if="editando" 
              type="button" 
              @click="limparFormulario"
              class="px-4 py-2 text-sm font-medium text-foreground bg-transparent border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              :disabled="carregando"
              class="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {{ carregando ? 'Processando...' : (editando ? 'Atualizar Sala' : 'Salvar Sala') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-8">
      <div class="px-6 py-4 border-b border-border bg-muted/30">
        <h3 class="text-lg font-semibold text-foreground">Salas Cadastradas</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-foreground">
          <thead class="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th class="px-6 py-3">Nome</th>
              <th class="px-6 py-3">Capacidade</th>
              <th class="px-6 py-3">Especificações</th>
              <th class="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-if="salas.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-muted-foreground">Nenhuma sala encontrada.</td>
            </tr>
            <tr v-for="sala in salas" :key="sala.id" class="hover:bg-muted/20 transition-colors">
              <td class="px-6 py-4 font-medium">{{ sala.nome }}</td>
              <td class="px-6 py-4">{{ sala.maxAlunos }} alunos</td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="espec in sala.listaEspecificacoes" :key="espec.id"
                    class="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                  >
                    {{ espec.nome }}
                  </span>
                  <span v-if="!sala.listaEspecificacoes || sala.listaEspecificacoes.length === 0" class="text-muted-foreground">Nenhuma</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right space-x-3">
                <button @click="editarSala(sala)" class="font-medium text-primary hover:underline">Editar</button>
                <button @click="excluirSala(sala.id)" class="font-medium text-destructive hover:underline">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { DoorOpen } from 'lucide-vue-next';

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
      axios.get(`${apiURL}`),
      axios.get(`http://localhost:8080/especificacoes`) 
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
  erro.value = '';
  
  const payload = {
    nome: novaSala.value.nome,
    maxAlunos: Number(novaSala.value.maxAlunos),
    especId: Array.isArray(novaSala.value.especId) ? novaSala.value.especId : []
  };

  try {
    carregando.value = true;
    if (editando.value) {
      await axios.put(`${apiURL}/${editando.value.id}`, payload);
    } else {
      await axios.post(`${apiURL}/novo`, payload);
    }
    limparFormulario();
    await carregarDados(); 
  } catch (e) {
    erro.value = e.response?.data?.message || e.response?.data || "Erro ao salvar a sala.";
  } finally {
    carregando.value = false;
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
    // Extrai apenas os IDs da lista de objetos para alimentar o especId do DTO
    especId: sala.listaEspecificacoes.map(especificacao => especificacao.id)
  };
};

const limparFormulario = () => {
  novaSala.value = { nome: '', maxAlunos: null, especId: [] };
  editando.value = null;
  erro.value = '';
};

onMounted(carregarDados);
</script>