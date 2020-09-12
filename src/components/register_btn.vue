<template>
<div class="app">
  <!-- REGISTER BTN -->
  <vs-button primary gradient  @click="RegisterDialog = true">Зарегистрироваться</vs-button>

  <!-- REGISTER DIALOG -->
  <vs-dialog v-model="RegisterDialog">
    <template #header>
      <h4 class="not-margin">Зарегистрироваться на <b>FullTasks</b></h4>
    </template>

    <div class="con-form">
      <vs-input v-model="Remail" placeholder="Email">
        <template #icon>
          <box-icon name='mail-send'></box-icon>
        </template>
      </vs-input>
      <vs-input type="password" v-model="Rpassword" placeholder="Password">
        <template #icon>
          <box-icon name='lock'></box-icon>
        </template>
      </vs-input>
    </div>

    <template #footer>
      <div class="footer-dialog">
        <vs-button block @click="Register">
          Register
        </vs-button>
      </div>
    </template>
  </vs-dialog>
  <!-- REGISTER DIALOG -->

</div>
</template>

<script>
import {
  auth
} from "@/db.js";
export default {
  data() {
    return {
      RegisterDialog: false,
      Remail: "",
      Rpassword: "",
    }
  },
  methods: {
    // Универсальное уведомление
    openNotification(position = null, color, icon, title, text) {
      this.$vs.notification({
        position,
        icon,
        color,
        title,
        text
      })
    },
    // REGISTER
    Register() {
      auth
        .createUserWithEmailAndPassword(this.Remail, this.Rpassword)
        .catch(function (error) {
          alert(error.message )
        });
      this.RegisterDialog = false;
    },
  }

}
</script>

<style>

    </style>
