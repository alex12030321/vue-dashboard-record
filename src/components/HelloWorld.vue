<template>
  <div class="hello">
    <a href="#" class="btn btn-primary" @click.prevent="logout">登出</a>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    logout() {
      const vm = this;
      const apiPath = process.env.VUE_APP_API_PATH;
      const api = `${apiPath}/logout`;
      this.$http.post(api).then((response) => {
        console.log(response);
        if (response.data.success) {
          vm.$router.push('/login');
        }
      });
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
