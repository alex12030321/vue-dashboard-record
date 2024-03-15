<template>
    <nav aria-label="Page navigation example" class="d-flex justify-content-center">
        <ul class="pagination">
            <li class="page-item" :class="{ 'disabled': !pagination.has_pre }">
                <a class="page-link" href="#" aria-label="Previous"
                    @click.prevent="pageClick(pagination.current_page - 1)">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item" v-for="page in pagination.total_pages"
                :class="{ 'active': pagination.current_page === page }">
                <a class="page-link" href="#" @click.prevent="pageClick(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ 'disabled': !pagination.has_next }">
                <a class="page-link" href="#" aria-label="Next"
                    @click.prevent="pageClick(pagination.current_page + 1)">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
</template>
<script>
export default {
    name: 'pagination',
    props: ['pagination'],
    methods: {
        pageClick(page) {
            console.log(page);
            this.$bus.$emit('pageClick', page);
        }
    }
}
</script>