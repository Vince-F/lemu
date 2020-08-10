const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Lemu user guide',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  base: "/",

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#1976d2' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    logo: '/icon.png',
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Guide',
        link: '/guide/',
      },
      {
        text: 'Changelog',
        link: 'https://github.com/Vince-F/lemu/blob/master/CHANGELOG.md'
      },
      {
        text: 'Releases',
        link: 'https://github.com/Vince-F/lemu/releases'
      },
      {
        text: 'Github',
        link: 'https://github.com/Vince-F/lemu'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          children: [
            '',
            'getting-started',
            'write-first-test'
          ]
        },
        {
          title: "General configuration",
          collapsable: false,
          children: [
            'general-configuration'
          ]
        },
        {
          title: "Tests",
          collapsable: false,
          children: [
            'test-view',
            'test-configuration',
            'test-result'
          ]
        },
        {
          title: "Engine scripts",
          collapsable: false,
          children: [
            'engine-scripts'
          ]
        },
        {
          title: 'Report',
          collapsable: false,
          children: [
            'report'
          ]
        },
        {
          title: 'Logs',
          collapsable: false,
          children: [
            'logs'
          ]
        }
      ]
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
