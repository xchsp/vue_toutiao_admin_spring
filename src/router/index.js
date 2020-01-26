import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import PostList from '@/pages/PostList'
import EditPost from '@/pages/EditPost'


Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'homePage',
      component: Home,
      meta: '首页',
      children: [{
          path: 'postlist',
          name: 'postList',
          component: PostList,
          meta: '文章列表'

        },
        {
          path: 'editpost',
          name: 'editPostPage',
          component: EditPost,
          meta: '发布文章',

        }
      ]
    },
    {
      path: '/login',
      name: 'loginPage',
      component: Login
    }
  ]
})
