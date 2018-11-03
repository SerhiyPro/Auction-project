import Vue from 'vue'
import Router from 'vue-router'
import AuctionComponent from '@/components/CreateNewArticleComponent'
import TitlePage from '@/components/TitlePage'
import DisplayAndBetComponent from '@/components/DisplayAndBetComponent'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TitlePage',
      component: TitlePage
    },
    {
      path: '/createNewArticle',
      name: 'CreateNewArticleComponent',
      component: AuctionComponent
    },
    {
      path: '/displayArticle',
      name: 'DisplayAndBetComponent',
      component: DisplayAndBetComponent
    }
  ]
})
