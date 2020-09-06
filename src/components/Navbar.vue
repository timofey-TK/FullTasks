<template>
<vs-navbar center-collapsed v-model="active">
  <template #left>
    <h2>FullTasks</h2>
  </template>
  <vs-navbar-item :to="{ name: 'Home' }" :active="active == 'home'" id="home">
    Home
  </vs-navbar-item>
  <vs-navbar-item :to="{ name: 'About'}" :active="active == 'about'" id="about">
    About
  </vs-navbar-item>
  <template #right>
    <!-- Sign out BTN -->
    <vs-button gradient warn v-if="IsLog" @click="signOut">Sign out</vs-button>

    <!-- LOGIN BTN -->
    <vs-button primary gradient v-if="!IsLog" @click="LoginDialog = true">Login</vs-button>

    <!-- REGISTER BTN -->
    <vs-button primary gradient v-if="!IsLog" @click="RegisterDialog = true">Register</vs-button>

    <!-- LOGIN DIALOG -->
    <vs-dialog v-model="LoginDialog">
      <template #header>
        <h4 class="not-margin">Login to <b>FullTasks</b></h4>
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

          <div class="new">New Here? <a href="#">Create New Account</a></div>
        </div>
      </template>
    </vs-dialog>
    <!-- LOGIN DIALOG -->

    <!-- REGISTER DIALOG -->
    <vs-dialog v-model="RegisterDialog">
      <template #header>
        <h4 class="not-margin">Register to <b>FullTasks</b></h4>
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

          <div class="new"><a href="#">Login</a></div>
        </div>
      </template>
    </vs-dialog>
    <!-- REGISTER DIALOG -->
  </template>
</vs-navbar>
</template>

<script>
import 'boxicons'
import {
  auth
} from "@/db.js";

export default {
  data: () => ({
    active: "home",
    LoginDialog: false,
    Lemail: "",
    Lpassword: "",
    RegisterDialog: false,
    Remail: "",
    Rpassword: "",
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
    // LOGIN
    Login() {
      auth
        .signInWithEmailAndPassword(this.Lemail, this.Lpassword)
        .catch(function (error) {
          alert(error.message + ' Try again.')
        });
      this.LoginDialog = false
    },
    // REGISTER
    Register() {
      auth
        .createUserWithEmailAndPassword(this.Remail, this.Rpassword)
        .catch(function (error) {
          alert(error.message + '. Try again.')
        });
      this.RegisterDialog = false;
    },
  },
};
</script>

<style>
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
