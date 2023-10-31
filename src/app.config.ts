export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/node/index',
    'pages/node/show',
    'pages/node/edit',
    'pages/me/index',
    'pages/me/login',
    'pages/me/setting'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    // custom: true,
    selectedColor: '#000000',
    list: [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": './icon/home.png',
        "selectedIconPath": './icon/home-fill.png'
      },
      {
        "pagePath": "pages/me/index",
        "text": "我的",
        "iconPath": './icon/account.png',
        "selectedIconPath": './icon/account-fill.png'
      },
    ]
  }
})
