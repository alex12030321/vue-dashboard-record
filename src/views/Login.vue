<template>
    <div>
        <form class="form-signin" @submit.prevent="loginHandler">
            <!-- <img class="mb-4" src="../../assets/brand/bootstrap-solid.svg" alt="" width="72" height="72"> -->
            <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
            <label for="inputEmail" class="sr-only">Email address</label>
            <input type="email" v-model="user.username" id="inputEmail" class="form-control" placeholder="Email address"
                required autofocus>
            <label for="inputPassword" class="sr-only">Password</label>
            <input type="password" v-model="user.password" id="inputPassword" class="form-control"
                placeholder="Password" required>
            <div class="checkbox mb-3">
                <label>
                    <input type="checkbox" value="remember-me"> Remember me
                </label>
            </div>
            <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            <p class="mt-5 mb-3 text-muted">&copy; {{ new Date().getFullYear() }}</p>
        </form>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            user: {
                username: '',
                password: '',
            }
        }
    },
    methods: {
        loginHandler() {
            const vm = this;
            const apiPath = process.env.VUE_APP_API_PATH;
            console.log(apiPath);
            const api = `${apiPath}/admin/signin`;
            this.$http.post(api, vm.user).then((response) => {
                console.log(response);
                if(response.data.success) {
                    const token = response.data.token;
                    const expired = response.data.expired;
                    console.log(token, expired);
                    document.cookie = `hexToken=${token}; expires=${new Date(expired)}`
                    vm.$router.push('/admin/products');
                }
            });
        }
    },
}
</script>

<style scoped>
html,
body {
    height: 100%;
}

body {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
}

.form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
}

.form-signin .checkbox {
    font-weight: 400;
}

.form-signin .form-control {
    position: relative;
    box-sizing: border-box;
    height: auto;
    padding: 10px;
    font-size: 16px;
}

.form-signin .form-control:focus {
    z-index: 2;
}

.form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
</style>