<template>
<vs-navbar center-collapsed v-model="active">
  <template #left>
    <router-link :to="{ name: 'Home' }" class="logo">FullTasks</router-link>
  </template>
  <vs-navbar-item :to="{ name: 'Home' }" :active="active == 'home'" id="home">
    Главная
  </vs-navbar-item>
  <!-- <vs-navbar-item :to="{ name: 'Page2'}" :active="active == 'page2'" id="page2">
    Страница#2
  </vs-navbar-item>
  <vs-navbar-item :to="{ name: 'Page3'}" :active="active == 'page3'" id="page3">
    Страница#3
  </vs-navbar-item> -->
  <template #right>
    <!-- Sign out BTN -->
    <vs-button gradient warn v-if="IsLog" @click="signOut">Выйти</vs-button>
    <!-- LOGIN BTN -->
    <LoginBtn v-if="!IsLog"></LoginBtn>
    <!-- REGISTER BTN -->
    <RegisterBtn v-if="!IsLog"></RegisterBtn>

  </template>
</vs-navbar>
</template>

<script>
import 'boxicons'
import {
  auth
} from "@/db.js";

import LoginBtn from '@/components/login_btn'
import RegisterBtn from '@/components/register_btn'
export default {
  components: {
    LoginBtn,
    RegisterBtn,
  },
  data: () => ({
    active: "home",
    IsLog: false,
    error: '',
  }),
  mounted() {
    this.isLoggedIn();
  },
  watch: {
    // эта функция запускается при любом изменении вопроса
    $route: function () {
      this.active = this.$route.name.toLowerCase()
    }
  },
  methods: {
    //  CHECK USER LOGGED IN
    isLoggedIn() {
      var self = this;
      auth.onAuthStateChanged(function (user) {
        if (user) {
          self.IsLog = true;
        } else {
          self.IsLog = false;
        }
      });
    },
    // Sign out
    signOut() {
      auth.signOut()
    },
  },
};
</script>

<style>
.logo{
  display: block;
  text-decoration: none;
  font-size: 2em;
  color: #000;
  font-weight: bold;
}
.vs-input-content input {
  max-height: 40px;
}

.not-margin {
  margin: 0px;
  font-weight: normal;
  padding: 10px;
}

.con-form {
  width: 100%;
}

.con-form .flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.con-form .flex a {
  font-size: 0.8rem;
  opacity: 0.7;
}

.con-form .flex a:hover {
  opacity: 1;
}

.con-form .vs-checkbox-label {
  font-size: 0.8rem;
}

.con-form .vs-input-content {
  margin: 10px 0px;
  width: calc(100%);
}

.con-form .vs-input-content .vs-input {
  width: 100%;
}

.footer-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: calc(100%);
}

.footer-dialog .new {
  margin: 0px;
  margin-top: 20px;
  padding: 0px;
  font-size: 0.7rem;
}

.footer-dialog .new a {
  color: rgba(var(--vs-primary), 1) !important;
  margin-left: 6px;
}

.footer-dialog .new a:hover {
  text-decoration: underline;
}

.footer-dialog .vs-button {
  margin: 0px;
}
</style>
