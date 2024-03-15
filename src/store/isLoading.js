export default {
    state: {
        isLoading: false,
    },
    actions: {
        // payload
        updateLoading(context, status) {
            context.commit('LOADING', status);
        },
    },
    mutations: {
        LOADING(state, status) {
            state.isLoading = status;
        },
    },
    getters: {
        isLoading(state) {
            return state.isLoading;
        },
    },
}