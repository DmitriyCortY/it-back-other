module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    publicPath: '/wp-content/themes/totonis/constructor/back/other/dist/',
    chainWebpack: config => {
        config.plugins.delete('prefetch');
    }
}