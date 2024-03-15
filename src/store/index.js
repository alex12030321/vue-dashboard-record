import Vue from 'vue'
import Vuex from 'vuex'


import productsModule from './products'
import cartModule from './cart'
import isLoadingModule from './isLoading'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        productsModule,
        cartModule,
        isLoadingModule,
    },
})