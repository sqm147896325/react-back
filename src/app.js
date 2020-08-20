import React from 'react'
import { Button } from 'antd'
// {}内为该模块的一个属性
// 开发完成一般按需打包
// import 'antd/dist/antd.css'
// 导入样式文件，按需打包配置后不需要导入
import { BrowserRouter, Route ,Link ,Switch} from 'react-router-dom'
import Login from './pages/login/login.jsx'
import Admin from './pages/admin/admin.jsx'

export default class extends React.Component {
  render () {
    return (
      <div>
      <BrowserRouter>
      <Switch>
      <Link to="/login">login</Link>&nbsp;
      456
      <Link to="/admin">admin</Link>&nbsp;
      <Route path='/login' component={Login}></Route>
      {/* 注意path的格式一定要是 /路径 这样 */}
      <Route path='/admin' component={Admin}></Route>
      </Switch>
      </BrowserRouter>
      </div>
    )
  }
}
