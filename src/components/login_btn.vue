<template>
<div class="app">
  <!-- LOGIN BTN -->
  <vs-button primary gradient  @click="LoginDialog = true">Войти</vs-button>
  <!-- LOGIN DIALOG -->
  <vs-dialog v-model="LoginDialog">
    <template #header>
      <h4 class="not-margin">Войти в <b>FullTasks</b></h4>
    </template>

    <div class="con-form">
      <vs-input v-model="Lemail" placeholder="Email">
        <template #icon>
          <box-icon name='mail-send'></box-icon>
        </template>
      </vs-input>
      <vs-input type="password" v-model="Lpassword" placeholder="Password">
        <template #icon>
          <box-icon name='lock'></box-icon>
        </template>
      </vs-input>
    </div>

    <template #footer>
      <div class="footer-dialog">
        <vs-button block @click="Login">
          Sign In
        </vs-button>
      </div>
    </template>
  </vs-dialog>
  <!-- LOGIN DIALOG -->
</div>
</template>

<script>
import {
  auth
} from "@/db.js";
export default {
  data() {
    return {
      LoginDialog: false,
      Lemail: "",
      Lpassword: "",
    }
  },
  methods: {
    Login() {
      auth
        .signInWithEmailAndPassword(this.Lemail, this.Lpassword)
        .catch(function (error) {
          alert(error.message + ' Try again.')
        });
      this.LoginDialog = false
    },
  }
}
</script>

<style>

</style>
