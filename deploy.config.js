module.exports = {
  projectName: 'vue-music', // 项目名称
  privateKey: '/用户/web-yi/.ssh/id_rsa',
  passphrase: 'yjh.0626',
  dev: {
    // 环境对象
    name: '开发环境', // 环境名称
    script: 'npm run build', // 打包命令
    host: '49.235.247.206', // 服务器地址
    port: 80, // 服务器端口号
    username: 'root', // 服务器登录用户名
    password: 'nE2km-~hV8)9^', // 服务器登录密码
    distPath: 'dist', // 本地打包生成目录
    webDir: '/usr/local/nginx/html', // 服务器部署路径（不可为空或'/'）
    isRemoveRemoteFile: true // 是否删除远程文件（默认true）
  },
  // test: {
  //   // 环境对象
  //   name: '测试环境', // 环境名称
  //   script: 'npm run build:test', // 打包命令
  //   host: '192.168.0.1', // 服务器地址
  //   port: 22, // 服务器端口号
  //   username: 'root', // 服务器登录用户名
  //   password: '123456', // 服务器登录密码
  //   distPath: 'dist', // 本地打包生成目录
  //   webDir: '/usr/local/nginx/html', // 服务器部署路径（不可为空或'/'）
  //   isRemoveRemoteFile: true // 是否删除远程文件（默认true）
  // },
  prod: {
    // 环境对象
    name: '生产环境', // 环境名称
    script: 'npm run build:prod', // 打包命令
    host: '49.235.247.206', // 服务器地址
    port: 80, // 服务器端口号
    username: 'root', // 服务器登录用户名
    password: 'nE2km-~hV8)9^', // 服务器登录密码
    distPath: 'dist', // 本地打包生成目录
    webDir: '/usr/local/nginx/html', // 服务器部署路径（不可为空或'/'）
    isRemoveRemoteFile: true // 是否删除远程文件（默认true）
  }
}
