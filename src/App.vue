<template>
  <div id="app">
    <Navbar></Navbar>
    
    <main class="container">
      <router-view/>
    </main>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
  components: {
    Navbar,
  },
  name: "App",
};
</script>

<style>
body {
  background: #f3f7f8;
}
body,
button,
input {
  font-family: Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
main {
  padding: 150px;
  /* Fix top pagination */
  padding-top: 70px;
}
h2 {
  padding: 0;
  margin: 0;
}
</style>