import axios from 'axios';

export default {
    state: {
        products: [],
        categories: [],
    },
    actions: {
        getProducts(context) {
            const url = `${process.env.VUE_APP_API_PATH}/api/${process.env.VUE_APP_API_CUSTOM}/products/all`;
            context.commit('LOADING', true);
            axios.get(url).then((response) => {
                context.commit('PRODUCTS', response.data.products)
                context.commit('CATEGORIES');
                context.commit('LOADING', false);
            });
        },
    },
    mutations: {
        PRODUCTS(state, payload) {
            state.products = payload;
        },
        CATEGORIES(state) {
            const categories = new Set();
            console.log(state);
            state.products.forEach((item) => {
                categories.add(item.category);
            });
            state.categories = Array.from(categories);
        },
    },
    getters: {
        products(state) {
            return state.products;
        },
        categories(state) {
            return state.categories;
        },
    }
}