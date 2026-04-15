<template>
  <div>
    <nav style="background-color: #333; padding: 15px; margin-bottom: 20px;">
      <router-link to="/salas" style="color: white; margin-right: 20px; text-decoration: none; font-weight: bold;">
        Salas
      </router-link>
      <router-link to="/especificacoes" style="color: white; text-decoration: none; font-weight: bold;">
        Especificações
      </router-link>
    </nav>

    <main style="padding: 0 20px;">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
/* Estilo básico apenas para indicar qual rota está ativa */
.router-link-active {
  text-decoration: underline !important;
  color: #42b983 !important;
}
</style>
