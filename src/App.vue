<template>
  <div class="min-h-screen bg-background text-foreground flex">
    
    <aside class="w-64 bg-card border-r border-border flex flex-col hidden md:flex">
      <div class="h-16 flex items-center gap-3 px-4 border-b border-border">
        <div class="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          SL
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-semibold text-foreground">SalaLivre</span>
          <span class="text-xs text-muted-foreground">Gestão Acadêmica</span>
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <router-link 
          to="/salas" 
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          active-class="bg-primary/10 text-primary font-semibold"
        >
          <DoorOpen class="w-5 h-5" />
          Salas
        </router-link>
        
        <router-link 
          to="/especificacoes" 
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          active-class="bg-primary/10 text-primary font-semibold"
        >
          <Settings2 class="w-5 h-5" />
          Especificações
        </router-link>
      </nav>

      <div class="p-4 border-t border-border">
        <div class="flex items-center gap-3 px-2 py-2">
          <div class="size-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold">
            U
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium text-foreground">Usuário</span>
            <span class="text-xs text-muted-foreground">Admin</span>
          </div>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <div class="flex-1 overflow-y-auto p-6 md:p-8 bg-background">
        <router-view></router-view>
      </div>
    </main>

  </div>
</template>

<script setup>
import { DoorOpen, Settings2 } from 'lucide-vue-next';
</script>
