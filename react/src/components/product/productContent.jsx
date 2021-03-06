import React, { Component, useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Input, Select, Card, Table, InputNumber } from 'antd'
import './productContent.css'
import { reqProduces, reqUpdateState } from '../../api/index'

export default class ProductContent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      productlist: [],
      listdata: []
    }
  }

  async componentWillMount () {
    let req = await reqProduces(1, 2 ^ (63 - 1))
    this.setState({
      productlist: req.data.data.list
    })

    let listdata = []
    this.state.productlist.forEach(i => {
      listdata.push({
        operation: i,
        name: i.name,
        describe: i.desc,
        price: i.price,
        stateAndproductId: {
          state: i.status === 0 ? '下架' : '上架',
          productId: i._id
        }
      })
    })

    this.setState({
      listdata: listdata
    })
  }

  componentWillReceiveProps () {
    if (typeof this.props.searchUpdata !== 'undefined') {
      this.setState({
        productlist: this.props.searchUpdata.data.data.list
      })

      let listdata = []
      this.state.productlist.forEach(i => {
        listdata.push({
          operation: i,
          name: i.name,
          describe: i.desc,
          price: i.price,
          stateAndproductId: {
            state: i.status === 0 ? '下架' : '上架',
            productId: i._id
          }
        })
      })

      this.setState({
        listdata: listdata
      })
    }
    console.log(this.props.searchUpdata)
  }

  upList = async () => {
    let req = await reqProduces(1, 2 ^ (63 - 1))
    this.setState({
      productlist: req.data.data.list
    })
    let listdata = []
    this.state.productlist.forEach(i => {
      listdata.push({
        name: i.name,
        describe: i.desc,
        price: i.price,
        stateAndproductId: {
          state: i.status === 0 ? '下架' : '上架',
          productId: i._id
        }
      })
    })

    this.setState({
      listdata: listdata
    })
  }

  changedata = async (click, e) => {
    if (click.target.innerHTML === '上 架') {
      await reqUpdateState({ productId: e.productId, status: 1 })
      this.upList()
    } else {
      await reqUpdateState({ productId: e.productId, status: 0 })
      this.upList()
    }
  }

  render () {
    const originData = this.state.listdata

    const EditableCell = ({
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    }) => {
      const inputNode = inputType === 'number' ? <InputNumber /> : <Input />
      return (
        <td {...restProps}>
          {editing ? (
            <Form.Item
              name={dataIndex}
              style={{
                margin: 0
              }}
              rules={[
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ]}
            >
              {inputNode}
            </Form.Item>
          ) : (
            children
          )}
        </td>
      )
    }

    const EditableTable = () => {
      const [form] = Form.useForm()
      const [data] = useState(originData)
      const [editingKey] = useState('')

      const isEditing = record => record.key === editingKey

      const columns = [
        {
          title: '商品名称',
          dataIndex: 'name',
          width: '20%',
          editable: true
        },
        {
          title: '商品描述',
          dataIndex: 'describe',
          width: '50%',
          editable: true
        },
        {
          title: '价格',
          dataIndex: 'price',
          width: '10%',
          editable: true
        },
        {
          title: '状态',
          dataIndex: 'stateAndproductId',
          Key: 'state',
          width: '10%',
          editable: true,
          render: e => {
            return (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '5px' }}>
                  {e.state === '上架' ? '已上架' : '已下架'}
                  <Button
                    size='small'
                    type={e.state === '上架' ? '' : 'primary'}
                    onClick={click => this.changedata(click, e)}
                    style={{}}
                  >
                    {e.state === '上架' ? '下架' : '上架'}
                  </Button>
                </div>
              </div>
            )
          }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          render: e => {
            return (
              <div>
                <Link
                  onClick={() => {
                    window.nowProduct = e
                  }}
                  to='/product/details'
                >
                  <Button type='link' size='small'>
                    详情
                  </Button>
                </Link>
                <Link
                  to='/product/updata'
                  onClick={() => {
                    window.nowProduct = e
                  }}
                >
                  <Button type='link' size='small'>
                    修改
                  </Button>
                </Link>
              </div>
            )
          }
        }
      ]
      const mergedColumns = columns.map(col => {
        if (!col.editable) {
          return col
        }

        return {
          ...col,
          onCell: record => ({
            record,
            inputType: col.dataIndex === 'age' ? 'number' : 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record)
          })
        }
      })
      return (
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell
              }
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName='editable-row'
            pagination={{
              defaultPageSize: 5,
              showQuickJumper: true
            }}
          />
        </Form>
      )
    }

    return (
      <EditableTable>
        <EditableCell></EditableCell>
      </EditableTable>
    )
  }
}
