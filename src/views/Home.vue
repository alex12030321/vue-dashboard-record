<template>
    <div>
        <nav class="navbar navbar-light bg-light">
            <router-link class="navbar-brand no-boxshadow" to="/">
                <!-- <i class="fa fa-heart text-info" aria-hidden="true"></i> -->
                <font-awesome-icon :icon="['fas', 'heart']" class="text-info" />
                Alex Store
            </router-link>
            <!-- 購物車內的數量 (Button 內包含 icon, 數量 badge) -->
            <div class="dropdown ml-auto">
                <button class="btn btn-sm btn-cart" data-toggle="dropdown" data-flip="false">
                    <!-- <i class="fa fa-shopping-cart text-dark fa-2x" aria-hidden="true"></i> -->
                    <font-awesome-icon :icon="['fas', 'shopping-cart']" size="2xl" class="text-dark" />
                    <span class="badge badge-pill badge-danger">{{ cart.carts ? cart.carts.length : '' }}</span>
                    <span class="sr-only">unread messages</span>
                </button>
                <div class="dropdown-menu dropdown-menu-right p-3" style="min-width: 300px" data-offset="400">
                    <h6>已選擇商品</h6>
                    <table class="table table-sm">
                        <tbody>
                            <tr v-for="item in cart.carts" :key="item.id" v-if="cart.carts.length">
                                <td class="align-middle text-center">
                                    <a href="#" class="text-muted" @click.prevent="removeCart(item.id)">
                                        <font-awesome-icon :icon="['fas', 'trash']" />
                                    </a>
                                </td>
                                <td class="align-middle">{{ item.product.title }}</td>
                                <td class="align-middle">{{ item.qty }}{{ item.product.unit }}</td>
                                <td class="align-middle text-right">{{ item.total | currency }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button class="btn btn-primary btn-block" @click="goCart">
                        <i class="fa fa-cart-plus" aria-hidden="true"></i> 結帳去
                    </button>
                </div>
            </div>
        </nav>
        <div class="jumbotron jumbotron-fluid jumbotron-bg d-flex align-items-end">
            <div class="container">
                <div class="p-3 bg-lighter">
                    <h1 class="display-3 font-weight-bold">買到剁手手！最後出清</h1>
                    <p class="lead">This is a modified jumbotron that occupies
                        the entire horizontal space of its parent.</p>
                </div>
            </div>
        </div>
        <div class="container main-content mb-3">
            <loading :active.sync="isLoading"></loading>
            <div class="row">
                <div class="col-md-3">
                    <!-- 左側選單 (List group) -->
                    <div class="list-group sticky-top">
                        <a class="list-group-item list-group-item-action" href="#" @click.prevent="searchText = item"
                            :class="{ 'active': item === searchText }" v-for="item in categories" :key="item">
                            <!-- <i class="fa fa-street-view" aria-hidden="true"></i> -->
                            <font-awesome-icon :icon="['fas', 'street-view']" />
                            {{ item }}
                        </a>
                        <a href="#" class="list-group-item list-group-item-action" @click.prevent="searchText = ''"
                            :class="{ 'active': searchText === '' }">
                            全部顯示
                        </a>
                    </div>
                </div>

                <!-- 子頁面 -->
                <div class="col-md-9">
                    <div class="d-flex mb-4">
                        <!-- Search bar -->
                        <form class="form-inline my-3 my-lg-0">
                            <div class="input-group">
                                <input class="form-control" type="text" v-model="searchText" placeholder="Search"
                                    aria-label="Search">
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" @click="searchText = ''">
                                        <!-- <i class="fa fa-times"></i> -->
                                        <font-awesome-icon :icon="['fas', 'times']" />
                                    </button>
                                </div>
                            </div>
                        </form>
                        <button class="btn btn-outline-primary ml-auto" type="button" @click="getProducts">
                            重新取得資料
                        </button>
                    </div>
                    <!-- content -->
                    <div class="tab-pane" id="list-gift">
                        <div class="row align-items-stretch">
                            <!-- 禮品 -->
                            <div class="col-md-4 mb-4" v-for="(item) in filterData" :key="item.id">
                                <div class="card border-0 box-shadow text-center h-100">
                                    <img class="card-img-top" :src="item.imageUrl" alt="Card image cap">
                                    <div class="card-body">
                                        <h4 class="card-title">{{ item.title }}</h4>
                                        <p class="card-text text-left">{{ item.content }}</p>
                                    </div>
                                    <div class="card-footer border-top-0 bg-white">
                                        <button class="btn btn-outline-secondary btn-block btn-sm"
                                            @click="addtoCart(item.id)">
                                            <!-- <i class="fa fa-cart-plus" aria-hidden="true"></i>  -->
                                            <font-awesome-icon :icon="['fas', 'cart-plus']" />
                                            加到購物車
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="bg-light text-muted py-5">
            <div class="container">
                <ul class="list-inline text-center">
                    <li class="list-inline-item">© Copright {{ new Date().getFullYear() }} Alex Store </li>
                    <li class="list-inline-item">
                        <a class="text-info" href="#">
                            <!-- <i class="fa fa-instagram" aria-hidden="true"></i>  -->
                            <font-awesome-icon :icon="['fab', 'instagram']" />
                            Instagrame</a>
                    </li>
                    <li class="list-inline-item">
                        <a class="text-info" href="#">
                            <!-- <i class="fa fa-facebook-square" aria-hidden="true"></i>  -->
                            <font-awesome-icon :icon="['fab', 'facebook-square']" />
                            Facebook</a>
                    </li>
                    <li class="list-inline-item">
                        <a class="text-info" href="#">About</a>
                    </li>
                </ul>
                <p class="text-center">Made with Bootstrap4</p>
            </div>
        </footer>
        <Alert />
    </div>
</template>

<script>
import Alert from './AlertMessage.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Home',
    components: {
        Alert,
    },
    data() {
        return {
            searchText: '',

        };
    },
    computed: {
        filterData() {
            const vm = this;
            if (vm.searchText) {
                return vm.products.filter((item) => {
                    const data = item.title.toLowerCase().includes(vm.searchText.toLowerCase());
                    return data;
                });
            }
            return this.products;
        },
        ...mapGetters(['isLoading', 'products', 'categories', 'cart']),
        ...mapGetters('cartModule', ['cart']),
    },
    methods: {
        addtoCart(id, qty = 1) {
            console.log(this.$store);
            this.$store.dispatch('cartModule/addtoCart', { id, qty });
        },
        removeCart(id) {
            this.$store.dispatch('cartModule/removeCart', id);
        },
        ...mapActions(['getProducts']),
        ...mapActions('cartModule', ['getCart', 'goCart']),
    },
    created() {
        this.getProducts();
        this.getCart();
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "~bootstrap/scss/bootstrap";

.no-boxshadow {
    box-shadow: none;
}

.jumbotron-bg {
    /* banners.png */
    background: url('https://images.unsplash.com/photo-1477901492169-d59e6428fc90?w=1350');
    background-size: cover;
    background-position: center center;
    min-height: 400px;
}

/* 半透明背景 */
.bg-lighter {
    background-color: rgba(255, 255, 255, .45);
}

/* 購物車按鈕 */
.btn-cart {
    background-color: transparent;
    position: relative;
}

/* 購物車按鈕定位 */
.btn-cart .badge {
    position: absolute;
    top: 1px;
    right: 1px;
}

.main-content {
    min-height: calc(100vh - 56px - 176px)
}

.box-shadow {
    box-shadow: 0px 2px 5px rgba(0, 0, 0, .05);
    transition: .3s linear;
}

.box-shadow:hover {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, .08);
}

.dropdown-menu-right {
    right: 0;
    left: auto;
}

.alert-rounded {
    border-radius: 50px;
}
</style>