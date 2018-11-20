module.exports = {
    template: require('./template.html'),
    replace: true,
    props: ['data', 'select'],
    data: function () {
        return {
            data: data,
        }
    },
    created: function () {

    },
    methods: {
        onClickCard() {
            this.select(this.data);
        }
    }
};