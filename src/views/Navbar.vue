<template>
    <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <router-link to="/" class="navbar-brand col-md-3 col-lg-2 mr-0 px-3">Alex Store</router-link>
        <!-- <a class="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="#">Alex Store</a> -->
        <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-toggle="collapse"
            data-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <!-- <input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search"> -->
        <ul class="navbar-nav px-3">
            <li class="nav-item text-nowrap">
                <a class="nav-link" href="#" @click.prevent="signout">登出</a>
            </li>
        </ul>
    </nav>
</template>
<script>
export default {
    methods: {
        signout() {
            const vm = this;
            const apiPath = process.env.VUE_APP_API_PATH;
            const api = `${apiPath}/logout`;
            this.$http.post(api).then((response) => {
                console.log(response);
                if (response.data.success) {
                    alert(response.data.message);
                    vm.$router.push('/login');
                }
            });
        }
    }
}
</script>