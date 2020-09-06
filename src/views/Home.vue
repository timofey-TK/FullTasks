<template>
<div id="home">

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
  <h1 class="title">Task List: </h1>
  <div class="placeholder" v-if="!UTasks.length">Задачи отсутствуют или вы не вошли в аккаунт</div>
  <div class="wrapper">
    <div class="task-card" v-for="(task, index) in UTasks" :key="index" :class="{completed: task.data.isDone}">

      <div class="color-line"></div>

      <nav class="nav">
        <vs-checkbox success v-model="task.data.isDone" @click="setIsChecked(task.id)">
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

  </div>

</div>
</template>

<script>
import 'boxicons'
import {
  db,
  auth
} from "@/db.js";

export default {
  data() {
    return {
      FormTitle: '',
      FormDescription: '',
      activeCreateMenu: false,
      checkedTask: false,
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
    setIsChecked(id) {
      this.checkedTask = !this.checkedTask
      db.collection("tasks")
        .doc(id)
        .update({
          isDone: this.checkedTask
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
          uid: this.user.uid
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
.createMenu textarea, input {
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
  margin-bottom: 110px;
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
