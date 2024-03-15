<template>
    <div>
        <loading :active.sync="isLoading" />
        <div class="d-flex justify-content-end">
            <button class="btn btn-danger my-3" @click="goCart">
                <font-awesome-icon :icon="['fas', 'cart-shopping']" /> 
                {{ cart.carts ? cart.carts.length : '' }}
            </button>
        </div>
        <div class="row">
            <div class="col-md-4 mb-4" v-for="item in products" v-if="item.is_enabled">
                <div class="card border-0 shadow-sm">
                    <div style="height: 150px; background-size: cover; background-position: center"
                        :style="{ 'background-image': `url(${item.imageUrl})` }">
                    </div>
                    <div class="card-body">
                        <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
                        <h5 class="card-title">
                            <a href="#" class="text-dark">{{ item.title }}</a>
                        </h5>
                        <p class="card-text">{{ item.content }}</p>
                        <div class="d-flex justify-content-between align-items-baseline">
                            <!-- <div class="h5">2,800 元</div> -->
                            <del class="h6">原價 {{ item.origin_price | currency }} 元</del>
                            <div class="h5">現在只要 {{ item.price | currency }} 元</div>
                        </div>
                    </div>
                    <div class="card-footer d-flex">
                        <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
                            <font-awesome-icon :icon="['fas', 'spinner']" spin v-if="item.id === status.itemLoading" />
                            查看更多
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addCart(item.id)">
                            <font-awesome-icon :icon="['fas', 'spinner']" spin v-if="item.id === status.cartLoading" />
                            加到購物車
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Carts -->
        <!-- <div class="my-5 row justify-content-center">
            <div class="col-md-6">
                <table class="table"">
                    <thead>
                        <th></th>
                        <th>品名</th>
                        <th>數量</th>
                        <th>單價</th>
                    </thead>
                    <tbody>
                        <tr v-for=" item in cart.carts">
                    <td class="align-middle">
                        <button type="button" class="btn btn-outline-danger btn-sm" @click="deleteCart(item.id)">
                            <font-awesome-icon :icon="['fas', 'trash']" />
                        </button>
                    </td>
                    <td class="align-middle">
                        {{ item.product.title }}
                        <div class="text-success" v-if="item.coupon">
                            已套用優惠券
                        </div>
                    </td>
                    <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                    <td class="align-middle text-right">{{ item.final_total | currency }}</td>
                    </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" class="text-right">總計</td>
                            <td class="text-right">{{ cart.total | currency }}</td>
                        </tr>
                        <tr v-if="cart.total !== cart.final_total">
                            <td colspan="3" class="text-right text-success">折扣價</td>
                            <td class="text-right text-success">{{ cart.final_total | currency }}</td>
                        </tr>
                    </tfoot>
                </table>
                <div class="input-group mb-3 input-group-sm">
                    <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon"
                        @keyup.enter="useCoupon">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" @click="useCoupon">
                            套用優惠碼
                        </button>
                    </div>
                </div>
            </div>
        </div> -->
        <!-- 表單 -->
        <!-- <div class="my-5 row justify-content-center">
            <form class="col-md-6">
                <div class="form-group">
                    <label for="useremail">Email</label>
                    <input type="email" class="form-control" name="email" id="useremail" v-model="form.user.email"
                        placeholder="請輸入 Email" v-validate="'required|email'" :class="{ 'is-invalid': errors.has('email') }">
                    <span class="text-danger">{{ errors.first('email') }}</span>
                </div>

                <div class="form-group">
                    <label for="username">收件人姓名</label>
                    <input type="text" class="form-control" name="name" id="username" v-model="form.user.name"
                        placeholder="輸入姓名" v-validate="'required'" :class="{ 'is-invalid': errors.has('name') }">
                    <span class="text-danger" v-if="errors.has('name')">姓名必須輸入</span>
                </div>

                <div class="form-group">
                    <label for="usertel">收件人電話</label>
                    <input type="tel" class="form-control" id="usertel" name="tel" v-model="form.user.tel" placeholder="請輸入電話" v-validate="'required'" :class="{ 'is-invalid': errors.has('tel') }">
                    <span class="text-danger" v-if="errors.has('tel')">電話必須輸入</span>
                </div>

                <div class="form-group">
                    <label for="useraddress">收件人地址</label>
                    <input type="text" class="form-control" name="address" id="useraddress" v-model="form.user.address" v-validate="'required'"
                        placeholder="請輸入地址" :class="{ 'is-invalid': errors.has('address') }">
                    <span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>
                </div>

                <div class="form-group">
                    <label for="comment">留言</label>
                    <textarea name="" id="comment" class="form-control" cols="30" rows="10"
                        v-model="form.message"></textarea>
                </div>
                <div class="text-right">
                    <button class="btn btn-danger" @click.prevent="createOrder">送出訂單</button>
                </div>
            </form>
        </div> -->
        <!-- Modal -->
        <div class="modal fade" id="productItemModal" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img :src="product.imageUrl" alt="" class="img-fluid">
                        <h5 class="my-3">{{ product.title }}</h5>
                        <p class="text-right"> __ </p>
                        <del class="h6">原價 {{ product.origin_price | currency }} 元</del>
                        <div class="h5 float-right">現在只要 {{ product.price | currency }} 元</div>
                        <select class="custom-select my-3" v-model="product.num">
                            <!-- <option value="" disabled>-- 請選購數量</option> -->
                            <option v-for="num in 10" :value="num">選購 {{ num }} {{ product.unit }}</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <h6 class="text-secondary">小計 {{ product.num * product.price | currency }}</h6>
                        <button type="button" class="btn btn-primary"
                            @click="addCart(product.id, product.num)">加到購物車</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import currency from '@/filters/currency';
import $ from 'jquery';

export default {
    name: 'CustomerOrders',
    data() {
        return {
            
            status: {
                itemLoading: '',
                cartLoading: ''
            },
            products: [],
            product: {},
            pagination: {},
            cart: [],
            total: 0,
            // coupon: '',
            // form: {
            //     user: {
            //         name: '',
            //         email: '',
            //         tel: '',
            //         address: '',
            //     },
            //     message: ''
            // }
        }
    },
    computed: {
        isLoading() {
            return this.$store.state.isLoading;
        }
    },
    methods: {
        getProducts(page = 1) {
            const vm = this;
            vm.$store.dispatch('updateLoading', true);
            const apiPath = process.env.VUE_APP_API_PATH;
            const apiCustom = process.env.VUE_APP_API_CUSTOM;
            // console.log(apiPath, apiCustom);
            vm.$http.get(`${apiPath}/api/${apiCustom}/products?page=${page}`)
                .then((response) => {
                    console.log(response.data);
                    vm.products = response.data.products;
                    vm.pagination = response.data.pagination;
                    vm.$store.dispatch('updateLoading', false);
                });
        },
        getProduct(id) {
            const vm = this;
            vm.status.itemLoading = id;
            vm.total = 0;
            const apiPath = process.env.VUE_APP_API_PATH;
            const apiCustom = process.env.VUE_APP_API_CUSTOM;
            // console.log(apiPath, apiCustom);
            vm.$http.get(`${apiPath}/api/${apiCustom}/product/${id}`)
                .then((response) => {
                    console.log(response.data);
                    vm.product = response.data.product;
                    $('#productItemModal').modal('show');
                    vm.status.itemLoading = '';
                });
        },
        addCart(id, qty = 1) {
            const vm = this;
            vm.status.cartLoading = id;
            vm.total = 0;
            const apiPath = process.env.VUE_APP_API_PATH;
            const apiCustom = process.env.VUE_APP_API_CUSTOM;
            // console.log(apiPath, apiCustom);
            vm.$http.post(`${apiPath}/api/${apiCustom}/cart`, {
                data: {
                    product_id: id,
                    qty,
                }
            })
                .then((response) => {
                    console.log(response.data);
                    $('#productItemModal').modal('hide');
                    vm.status.cartLoading = '';
                    alert(response.data.message);
                    vm.getCarts();
                });
        },
        getCarts() {
            const vm = this;
            vm.total = 0;
            const apiPath = process.env.VUE_APP_API_PATH;
            const apiCustom = process.env.VUE_APP_API_CUSTOM;
            // console.log(apiPath, apiCustom);
            vm.$http.get(`${apiPath}/api/${apiCustom}/cart`)
                .then((response) => {
                    console.log(response.data.data);
                    vm.cart = response.data.data;
                });
        },
        // deleteCart(id) {
        //     const vm = this;
        //     vm.$store.dispatch('updateLoading', true);
        //     const apiPath = process.env.VUE_APP_API_PATH;
        //     const apiCustom = process.env.VUE_APP_API_CUSTOM;
        //     // console.log(apiPath, apiCustom);
        //     vm.$http.delete(`${apiPath}/api/${apiCustom}/cart/${id}`)
        //         .then((response) => {
        //             console.log(response);
        //             // alert(response.data.message);
        //             vm.getCarts();
        //             vm.$store.dispatch('updateLoading', false);
        //         });
        // },
        // useCoupon() {
        //     const vm = this;
        //     vm.$store.dispatch('updateLoading', true);
        //     const apiPath = process.env.VUE_APP_API_PATH;
        //     const apiCustom = process.env.VUE_APP_API_CUSTOM;
        //     // console.log(apiPath, apiCustom);
        //     vm.$http.post(`${apiPath}/api/${apiCustom}/coupon`, {
        //         data: {
        //             code: vm.coupon
        //         }
        //     })
        //         .then((response) => {
        //             console.log(response);
        //             if (response.data.success) {
        //                 vm.getCarts();
        //                 vm.$store.dispatch('updateLoading', false);
        //                 vm.$bus.$emit('message:push', response.data.message, 'success');
        //             } else {
        //                 vm.$bus.$emit('message:push', response.data.message, 'danger');
        //                 vm.$store.dispatch('updateLoading', false);
        //             }
        //             // alert(response.data.message);
        //         });
        // },
        // createOrder() {
        //     const vm = this;
        //     vm.$store.dispatch('updateLoading', true);
        //     const apiPath = process.env.VUE_APP_API_PATH;
        //     const apiCustom = process.env.VUE_APP_API_CUSTOM;
        //     // console.log(apiPath, apiCustom);
        //     const order = vm.form;
        //     this.$validator.validate().then(valid => {
        //         if (valid) {
        //             vm.$http.post(`${apiPath}/api/${apiCustom}/order`, { data: { user: order.user, message: order.message } })
        //                 .then((response) => {
        //                     console.log(response);
        //                     if (response.data.success) {
        //                         // vm.$bus.$emit('message:push', response.data.message, 'success');
        //                         // vm.getCarts();
        //                         // vm.$store.dispatch('updateLoading', false);
        //                         vm.$router.push('customer_checkout/' + response.data.orderId);
        //                     } else {
        //                         console.log(response)
        //                         vm.$bus.$emit('message:push', response.data.message, 'danger');
        //                         // vm.getCarts();
        //                         vm.$store.dispatch('updateLoading', false);
        //                     }
        //                     // alert(response.data.message);
        //                 });
        //         } else {
        //             vm.$bus.$emit('message:push', '表單輸入不完整', 'danger');
        //             vm.$store.dispatch('updateLoading', false);
        //         }
        //     });
        // },
        goCart() {
            console.log(this.cart.carts)
            if(this.cart.carts.length) {
                this.$router.push('cart');
            } else {
                this.$bus.$emit('message:push', '購物車沒有商品', 'warning');
            }
        }
    },
    created() {
        this.getProducts();
        this.getCarts();
    }
}
</script>