<template>
<div id="home">
  <!-- Кнопка добавления задачи -->
  <div class="createMenu " v-if="user">
    <div class="icon-wrapper" @click="activeCreateMenu = !activeCreateMenu">
      <box-icon name='plus' size="md" :class="{activeIcon:activeCreateMenu }"></box-icon>
    </div>
    <div class="create-menu__content" :class="{activeCreateMenu:activeCreateMenu }">

      <input placeholder="Название задачи" v-model="FormTitle">
      <textarea placeholder="Описание" v-model="FormDescription"></textarea>
      <vs-button @click="addTask"> Добавить задачу</vs-button>

    </div>
  </div>

  <div class="tasks-nav">
    <h1 class="title">Список задач: </h1>
  </div>
  <!-- Плейсхолде, если пользователь не вошел -->
  <div v-if="!isLog" class="placeholder">
    <h2>
      Чтобы начать пользоваться приложением войдите в систему:
    </h2>
    <vs-alert shadow class="alert">
    <template #title>
      Можете опробовать без регистрации!
    </template>
    Войдите в систему <br>
    логин: tasks@gmail.com <br>
    пароль: testtest <br>
    Просьба оставлять адекватные задачи))  
    
  </vs-alert>

    <div class="btn-wrapper">

      <LoginBtn />
      <RegisterBtn />
    </div>

  </div>
  <!-- Задачи -->
  <div class="wrapper" v-if="isLog">
    <div class="task-card" v-for="(task, index) in UTasks" :key="index" :class="{completed: task.data.isDone}">

      <div class="color-line"></div>

      <nav class="nav">
        <vs-checkbox line-through success v-model="task.data.isDone" @click="setIsChecked(task.id, task)">
          Не выполненно
        </vs-checkbox>
        <box-icon name='trash-alt' @click="deleteTask(task.id)" type='solid'></box-icon>
      </nav>
      <div class="content">

        <h3>{{task.data.title}}</h3>
        <p style="white-space: pre-line" class="desc">
          {{task.data.description}}
        </p>
      </div>
    </div>
    <div class="task-placeholder" @click="activeCreateMenu = !activeCreateMenu">
      <h3>Добавить задачу</h3>
    </div>
  </div>

</div>
</template>

<script>
import 'boxicons'
import {
  db,
  auth
} from "@/db.js";

import LoginBtn from '@/components/login_btn'
import RegisterBtn from '@/components/register_btn'

export default {
  components: {
    LoginBtn,
    RegisterBtn,
  },
  data() {
    return {
      filterData: '',
      value: '',
      FormTitle: '',
      FormDescription: '',
      activeCreateMenu: false,
      user: null,
      UTasks: [],
      isLog: false,
      error: "",
    };
  },
  mounted() {
    this.isLoggedIn();
  },
  methods: {
    // сделать задачу выполненной
    setIsChecked(id, task) {
      db.collection("tasks")
        .doc(id)
        .update({
          isDone: !task.data.isDone
        });

    },
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

    // добавить задачу в бд 
    addTask() {
      if (this.FormTitle != '') {
        db.collection("tasks").add({
          title: this.FormTitle,
          description: this.FormDescription,
          isDone: false,
          uid: this.user.uid,
          createdAt: Date.now()
        });
        this.FormTitle = "",
          this.FormDescription = ""
      } else {
        this.openNotification(null, "danger", "<box-icon name='bell-ring' type='solid' color='#ffffff' ></box-icon>", "Укажите название задачи", `Вы должны указать все обязательные поля в
        форме добавления задачи`)
      }
    },
    // удалить задачу по id 
    deleteTask(id) {
      db.collection("tasks")
        .doc(id)
        .delete();
      this.openNotification(null, "primary", "<box-icon name='bell-ring' type='solid' color='#ffffff' ></box-icon>", "Задача удалена", `Вы удалили задачу.   Увы, но вернуть ее нельзя`)
    },

    // пулучить все данные из бд по user id 
    getTasks(snapshot) {
      this.UTasks = []
      snapshot.forEach(doc => {
        this.UTasks.unshift({
          id: doc.id,
          data: doc.data()
        })
      });
    },

    // наблюдатель измениний в бд
    watchForChanges() {
      db.collection("tasks").where('uid', '==', this.user.uid).onSnapshot(querySnapshot => {
        this.getTasks(querySnapshot)
      })
    },

    //  CHECK USER LOGGED IN
    isLoggedIn() {
      var self = this;
      auth.onAuthStateChanged(function (user) {
        if (user) {
          self.user = user;
          self.isLog = true;
          self.watchForChanges()
        } else {
          self.UTasks = []
          self.user = null;
          self.isLog = false;
        }
      });
    },
  },
};
</script>

<style>
.alert{
  margin: 0 auto;
  margin-top: 40px;
  max-width: 600px;
  text-align: left;
  color: #000;
}
.vs-select__input {
  max-height: 40px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, var(--vs-shadow-opacity));
  background-color: #fff;
}

.placeholder {

  padding: 40px 10px 40px 10px;
  text-align: center;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, var(--vs-shadow-opacity));
  border-radius: 20px;
}

.task-placeholder {

  opacity: 0.6;
  width: 200px;
  height: 150px;
  cursor: pointer;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, var(--vs-shadow-opacity));
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 10px solid #fff;
  border-radius: 20px;
  transition: all 0.3s ease;

}

.btn-wrapper {
  margin-top: 30px;
  justify-content: center;
  display: flex;
}

.createMenu textarea,
input {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: none;
  list-style: none;
  border: 2px solid transparent;
  background: rgba(var(--vs-gray-2), 1);
  color: rgba(var(--vs-text), 1);
  padding: 7px 13px;
  border-radius: inherit;
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
  padding-left: 10px;
  width: 100%;
  font-size: 14px;
  transition: all 0.1s ease;
  width: 100%;
  height: 200px;
}

.createMenu input {
  max-height: 40px;
  margin-bottom: 20px;
}

.completed {
  background: #add580 !important;
}

.desc {
  border-radius: 3px;
  margin-left: 15px;
  padding-left: 10px;
  border-left: 3px solid #000;
}

.activeIcon {
  transform: rotate(45deg);
}

.title {
  padding: 0;
  margin: 0;
  margin-bottom: 100px;
}



.icon-wrapper {
  cursor: pointer;
  border-radius: 20px 20px 20px 0;
  background-color: #fff;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  transition: all 0.5s ease;
}

.icon-wrapper box-icon {
  transition: all 0.3s ease;
}

.createMenu {
  transition: all 0.5s ease;
  z-index: 20;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, var(--vs-shadow-opacity));
  width: 50px;
  height: 50px;
  position: absolute;
  right: 20px;
  top: 70px;
}

.icon-wrapper:hover {
  transform: scale(1.035);
}

.create-menu__content {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  right: 0;
  overflow: hidden;
  width: 0;
  height: 0;
  border-radius: 20px 20px 20px 0;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, var(--vs-shadow-opacity));
  background-color: #fff;
  transition: all 0.5s ease;
}

.create-menu__content .vs-button {
  margin-top: 30px;
  transition: all 0.5s ease;
}

.activeCreateMenu {
  transition: all 0.5s ease;
  padding: 30px;
  padding-top: 60px;
  width: 300px;
  height: 300px;
}

.content,
.nav {
  z-index: 1;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper {
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.task-card {
  word-wrap: break-word;
  height: fit-content;
  min-width: 100px;
  min-height: 100px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  padding: 20px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, var(--vs-shadow-opacity));
  max-width: 400px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.task-card:hover .color-line {
  width: 100%;
}
</style>
