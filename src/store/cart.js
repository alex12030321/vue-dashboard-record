import axios from 'axios';
import { router } from '../main';

export default {
    namespaced: true,
    state: {
        cart: {
            carts: [],
        },
    },
    actions: {
        getCart(context) {
            context.commit('LOADING', true, { root: true });
            const url = `${process.env.VUE_APP_API_PATH}/api/${process.env.VUE_APP_API_CUSTOM}/cart`;
            axios.get(url).then((response) => {
                if (response.data.data.carts) {
                    context.commit('CART', response.data.data);
                }
                context.commit('LOADING', false, { root: true });
                console.log('取得購物車', response.data.data);
            });
        },
        removeCart(context, id) {
            const url = `${process.env.VUE_APP_API_PATH}/api/${process.env.VUE_APP_API_CUSTOM}/cart/${id}`;
            context.commit('LOADING', true, { root: true });
            axios.delete(url).then((response) => {
                context.commit('LOADING', false, { root: true });
                this.dispatch('cartModule/getCart');
                console.log('刪除購物車項目', response);
            });
        },
        addtoCart(context, { id, qty }) {
            const url = `${process.env.VUE_APP_API_PATH}/api/${process.env.VUE_APP_API_CUSTOM}/cart`;
            // context.commit('LOADING', true);
            const item = {
                product_id: id,
                qty,
            };
            context.commit('LOADING', true, { root: true });
            axios.post(url, { data: item }).then((response) => {
                context.commit('LOADING', false, { root: true });
                this.dispatch('cartModule/getCart');
                console.log('加入購物車:', response);
            });
        },
        goCart(context) {
            console.log(context);
            console.log(this._vm);
            if (context.state.cart.carts.length) {
                router.push('/cart');
            } else {
                this._vm.$bus.$emit('message:push', '購物車沒有商品', 'warning');
            }
        }
    },
    mutations: {
        CART(state, payload) {
            state.cart = payload;
        }
    },
    getters: {
        cart(state) {
            return state.cart;
        }
    },
}