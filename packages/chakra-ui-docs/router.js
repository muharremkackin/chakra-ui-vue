import Vue from 'vue'
import Router from 'vue-router'
import { removeHyphenFromString, titleCase } from './utils'
Vue.use(Router)

export function createRouter () {
  const components = require.context('@/docs', true, /[\w-]+\.(vue|mdx)$/)
  const keys = components.keys()
  const routes = []

  keys.forEach((fileName) => {
    const componentConfig = components(fileName)
    const [componentName] = fileName
      .split('/')
      .pop()
      .split('.')

    routes.push({
      path: componentName === 'index' ? '/' : `/${componentName}`,
      name: componentName === 'index' ? 'Home' : componentName,
      meta: {
        title: `Chakra UI Vue | ${componentName === 'index' ? 'Chakra UI Design system built with Vue' : titleCase(removeHyphenFromString(componentName))}`,
        metaTags: [
          {
            name: 'description',
            content: 'Simple, Modular and Accessible UI Components for your Vue Applications. Built with Styled System.'

          }
        ]
      },
      component: componentConfig.default
    })
  })

  const router = new Router({
    mode: 'history',
    routes
  })

  // updating page title
  router.beforeEach((to, from, next) => {
    const newMetaTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)

    if (newMetaTitle) document.title = newMetaTitle.meta.title

    next()
  })
  return router
}
